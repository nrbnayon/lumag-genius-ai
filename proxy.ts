// proxy.ts — Next.js v16 Role-Based Access Control Middleware
// In Next.js v16, this file (proxy.ts) exports `proxy` + `config` and acts as the middleware.
//
// ⚠️  SECURITY NOTE:
// JWT cryptographic verification is intentionally NOT done here.
// The backend API already verifies the JWT on every protected endpoint.
// The proxy is a routing guard only — it checks cookie presence + role.
// Attempting to verify the JWT here with a mismatched secret would always
// fail and lock out legitimate users.
import { NextRequest, NextResponse } from "next/server";

// ============================================
// CONFIGURATION
// ============================================

const ROLES = {
  ADMIN: "admin",
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES];

// ── Public routes — accessible without ANY authentication ─────────────────────
// ⚠️  "/" is NOT here — app/page.tsx handles the root redirect (admin → /dashboard).
//     The proxy protects it: unauthenticated users hitting "/" get sent to /signin.
const PUBLIC_ROUTES = [
  "/signin",
  "/login",          // alias for /signin — kept for compatibility
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
  "/reset-success",
  "/success",
];

// ── Auth routes — logged-in admin should be bounced AWAY from these ───────────
// (they are already signed in — no need to see login/forgot-password pages)
const AUTH_ROUTES = [
  "/signin",
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
  "/reset-success",
];

// ── All actual admin pages (under app/(protected)/(admin)/) ───────────────────
// The proxy treats EVERYTHING not in PUBLIC_ROUTES as protected (deny-by-default).
// This list is for documentation / future granular role checks only.
// Since there is only one role (admin), hasRoleAccess() always returns true for them.
// const ADMIN_ROUTES = [
//   "/dashboard", "/analytics", "/settings", "/notifications",
//   "/approvals", "/ai-assistant", "/ingredients", "/menu-management",
//   "/recipe-management", "/staff-management", "/suppliers",
// ];

// ── Default redirect landing per role (after login or access-denied) ──────────
const ROLE_DEFAULT_PATHS: Record<Role, string> = {
  [ROLES.ADMIN]: "/dashboard",
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Exact match OR directory-boundary prefix match.
 * "/dashboard" matches "/dashboard" and "/dashboard/stats"
 * but NOT "/dashboard-old"
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function getRoleDefaultPath(userRole: string): string {
  return ROLE_DEFAULT_PATHS[userRole as Role] ?? "/dashboard";
}

/** Apply standard security response headers to any outgoing response */
function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

// ============================================
// MAIN PROXY FUNCTION (Next.js v16)
// ============================================
//
// Auth strategy:
//   isAuthenticated = accessToken cookie exists (non-empty)
//   isAdmin         = isAuthenticated AND userRole cookie === "admin"
//
// The backend JWT is validated on every API call — we don't re-verify it here
// because we don't have (and should not have) the backend signing secret.

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Bypass: static assets, Next.js internals, API routes, PWA files ─────────
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname === "/~offline" ||
    pathname.includes(".") // files with an extension (.png, .svg, .woff, etc.)
  ) {
    return NextResponse.next();
  }

  // ============================================
  // STEP 1: Classify the route
  // ============================================
  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  const isAuthRoute   = matchesRoute(pathname, AUTH_ROUTES);

  // ============================================
  // STEP 2: Read auth state from cookies
  // ============================================
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole    = request.cookies.get("userRole")?.value ?? "";

  // A user is considered authenticated if they have a non-empty accessToken cookie.
  // Role enforcement (admin-only) is the second guard.
  const isAuthenticated = !!accessToken;

  // Admin-only panel: token must exist AND role cookie must be "admin"
  const isAdmin = isAuthenticated && userRole === ROLES.ADMIN;

  // ============================================
  // STEP 3: Authenticated admin on an auth page → send to dashboard
  // ============================================
  if (isAdmin && isAuthRoute) {
    return NextResponse.redirect(
      new URL(getRoleDefaultPath(ROLES.ADMIN), request.url)
    );
  }

  // ============================================
  // STEP 4: Public route → allow (+ security headers)
  // ============================================
  if (isPublicRoute) {
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 5: Protected route — deny-by-default
  // ============================================

  // 5a. Not authenticated at all → redirect to sign-in with return path
  if (!isAuthenticated) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5b. Authenticated but NOT an admin (wrong role) → access denied
  if (!isAdmin) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("error", "access_denied");
    return NextResponse.redirect(loginUrl);
  }

  // 5c. Authenticated admin → grant access with security headers ✅
  return withSecurityHeaders(NextResponse.next());
}

// ============================================
// MIDDLEWARE MATCHER CONFIGURATION
// ============================================

export const config = {
  matcher: [
    /*
     * Intercept ALL paths EXCEPT:
     *  - _next/static   (compiled JS/CSS bundles)
     *  - _next/image    (Next.js image optimisation)
     *  - favicon.ico
     *  - PWA files      (manifest.json, sw.js, web-app-manifest, apple-touch-icon)
     *  - Public asset folders: /auth/, /icons/, /images/, /media/
     *  - Any path ending in a static file extension
     */
    "/((?!_next/static|_next/image|favicon\\.ico|manifest\\.json|sw\\.js|web-app-manifest|apple-touch-icon|auth/|icons/|images/|media/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|mp4|mp3|pdf|csv|xml|txt)$).*)",
  ],
};
