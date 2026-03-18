// proxy.ts — Next.js Role-Based Access Control Middleware
//
// ⚠️  SECURITY NOTE:
// JWT cryptographic verification is intentionally NOT done here.
// The backend API already verifies the JWT on every protected endpoint.
// This proxy is a routing guard only — it checks cookie presence + role.
//
// Route categories:
//   ROOT_ROUTE        → "/" handled specially (landing or dashboard)
//   PUBLIC_ONLY       → visible to everyone, no auth needed
//   AUTH_ROUTES       → login/reset pages; bounce away if already authed
//   INFO_ROUTES       → terms, privacy, about — visible to everyone always
//   UNIVERSAL_ROUTES  → accessible to ALL authenticated users regardless of role
//   ROLE_ROUTES       → role-specific protected routes (admin only here)

import { NextRequest, NextResponse } from "next/server";

// ============================================
// CONFIGURATION
// ============================================

const ROLES = {
  ADMIN: "admin",
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES];

// ── "/" is handled in its own dedicated step (Step 3) ────────────────────────
// Do NOT add it to any list below.

// ── Auth routes — already-logged-in users should be bounced AWAY ─────────────
// These are pages that only make sense when the user is NOT authenticated.
const AUTH_ROUTES = [
  "/signin",
  "/login", // alias — kept for compatibility
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/verify-email",
  "/reset-password",
  "/reset-success",
  "/success",
];

// ── Informational / legal pages — ALWAYS public, even when authenticated ──────
// These should never redirect to login or dashboard regardless of auth state.
const INFO_ROUTES = ["/terms", "/privacy-policy", "/about-us"];

// ── Other public pages (non-auth, non-info) ───────────────────────────────────
// Accessible without authentication. Authenticated users can still visit them.
const PUBLIC_ONLY_ROUTES = [
  "/success", // e.g. payment/email-verification success screen
];

// ── Protected routes accessible by ALL authenticated roles ───────────────────
// Add shared pages that every logged-in user (regardless of role) can access.
const UNIVERSAL_PROTECTED_ROUTES = [
  "/profile",
  "/settings",
  "/notifications",
  "/change-password",
];

// ── Role-specific protected route prefixes ────────────────────────────────────
// Keys are roles; values are route prefixes that role is allowed to visit.
// Admin gets "/" which means all routes — adjust if you add more roles.
const ROLE_ROUTES: Record<Role, string[]> = {
  [ROLES.ADMIN]: [
    "/dashboard",
    "/analytics",
    "/approvals",
    "/categories",
    "/ai-assistant",
    "/ingredients",
    "/menu-management",
    "/recipe-management",
    "/staff-management",
    "/suppliers",
    "/orders",
    "/reports",
  ],
};

// ── Default landing path per role after login or on access-denied ─────────────
const ROLE_DEFAULT_PATHS: Record<Role, string> = {
  [ROLES.ADMIN]: "/dashboard",
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Exact match OR directory-boundary prefix match.
 * "/dashboard"  →  matches "/dashboard" and "/dashboard/stats"
 *                  but NOT "/dashboard-old"
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

/** Resolve the default redirect path for a given role string */
function getRoleDefaultPath(userRole: string): string {
  return ROLE_DEFAULT_PATHS[userRole as Role] ?? "/dashboard";
}

/** Check whether a role has explicit access to a pathname */
function hasRoleAccess(pathname: string, userRole: string): boolean {
  const allowed = ROLE_ROUTES[userRole as Role];
  if (!allowed) return false;
  return matchesRoute(pathname, allowed);
}

/** Attach standard security headers to any outgoing response */
function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

// ============================================
// MAIN PROXY FUNCTION
// ============================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Bypass: Next.js internals, API routes, static assets & PWA files ─────────
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname === "/~offline" ||
    pathname.includes(".") // any file with an extension (.png, .svg, .woff, etc.)
  ) {
    return NextResponse.next();
  }

  // ============================================
  // STEP 1: Read auth state from cookies
  // ============================================
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value ?? "";
  const isAuthenticated = !!accessToken;
  const isAdmin = isAuthenticated && userRole === ROLES.ADMIN;

  // ============================================
  // STEP 2: INFO routes — always accessible, no redirect ever
  // /terms  /privacy-policy  /about-us
  // ============================================
  if (matchesRoute(pathname, INFO_ROUTES)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 3: Root "/" — dual behavior
  // ============================================
  if (pathname === "/") {
    if (isAdmin) {
      // Authenticated admin → straight to dashboard
      return NextResponse.redirect(
        new URL(getRoleDefaultPath(ROLES.ADMIN), request.url),
      );
    }
    // Unauthenticated (or unknown role) → show public landing page
    // app/page.tsx renders the landing; no redirect needed
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 4: AUTH routes
  // /signin  /forgot-password  /verify-otp  etc.
  // ============================================
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (isAdmin) {
      // Already logged in — no need to see login pages
      return NextResponse.redirect(
        new URL(getRoleDefaultPath(ROLES.ADMIN), request.url),
      );
    }
    // Not authenticated → allow access to auth pages
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 5: Other purely PUBLIC routes (e.g. /success)
  // ============================================
  if (matchesRoute(pathname, PUBLIC_ONLY_ROUTES)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 6: All remaining routes are PROTECTED — deny-by-default
  // ============================================

  // 6a. Not authenticated at all → redirect to sign-in with return path
  if (!isAuthenticated) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6b. Authenticated but role cookie is missing or unrecognized → access denied
  if (!userRole) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("error", "missing_role");
    return NextResponse.redirect(loginUrl);
  }

  // 6c. Universal protected routes — any authenticated role can access
  if (matchesRoute(pathname, UNIVERSAL_PROTECTED_ROUTES)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // 6d. Role-specific access check
  if (hasRoleAccess(pathname, userRole)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // 6e. Authenticated but role does NOT have access to this path
  //     → redirect to that role's default page (safe fallback)
  // console.warn(
  //   `🚫 Access denied: role="${userRole}" tried to access "${pathname}"`,
  // );
  return NextResponse.redirect(
    new URL(getRoleDefaultPath(userRole), request.url),
  );
}

// ============================================
// MIDDLEWARE MATCHER CONFIGURATION
// ============================================

export const config = {
  matcher: [
    /*
     * Intercept ALL paths EXCEPT:
     *  - _next/static      compiled JS/CSS bundles
     *  - _next/image       Next.js image optimization
     *  - favicon.ico, favicon-96x96.png
     *  - PWA files               manifest.json, manifest.webmanifest,
     *                            sw.js, swe-worker-*.js, workbox-*.js,
     *                            web-app-manifest-*.png, apple-touch-icon.png
     *  - Asset folders     /auth/ /icons/ /images/ /media/
     *  - Static extensions svg, png, jpg, jpeg, gif, webp, ico,
     *                      woff, woff2, ttf, eot, otf,
     *                      mp4, mp3, pdf, csv, xml, txt
     */
    "/((?!_next/static|_next/image|favicon\\.ico|manifest\\.json|sw\\.js|web-app-manifest|apple-touch-icon|auth/|icons/|images/|media/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|mp4|mp3|pdf|csv|xml|txt)$).*)",
  ],
};

