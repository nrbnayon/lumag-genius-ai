// redux/features/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { updateTokens, logout } from "../features/authSlice";
import type { RefreshTokenResponse } from "@/types/auth.types";

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};


export const setCookie = (name: string, value: string): void => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`;
};

export const deleteCookie = (name: string): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// ─── Clear All Auth Cookies ───────────────────────────────────────────────────
// Defined BEFORE it is referenced inside baseQueryWithReauth.

export const clearAuthCookies = (): void => {
  [
    "accessToken",
    "refreshToken",
    "userRole",
    "userEmail",
    "userId",
    "userName",
    "rememberMe",
    "reset_userId",
    "reset_secretKey",
    "reset_verified",
  ].forEach(deleteCookie);
};

// ─── Base Query ───────────────────────────────────────────────────────────────

const baseQuery = fetchBaseQuery({
  // The API base URL – endpoints already include /api/...
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.11:6005/",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token ?? getCookie("accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // Don't override Content-Type for FormData (browser sets it with boundary)
    if (!headers.get("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// ─── Auto-Refresh Wrapper ─────────────────────────────────────────────────────

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken ?? getCookie("refreshToken");

    if (!refreshToken) {
      api.dispatch(logout());
      clearAuthCookies();
      return result;
    }

    // Attempt silent token refresh
    // POST /api/auth/refresh  body: { refresh_token }
    const refreshResult = await baseQuery(
      {
        url: "/api/auth/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Response shape: { message, access_token, expires_in, expires_at }
      const responseData = refreshResult.data as RefreshTokenResponse;
      const newAccessToken = responseData.access_token;

      if (newAccessToken) {
        api.dispatch(
          updateTokens({
            token: newAccessToken,
            tokenExpiresAt: responseData.expires_at,
          })
        );

        // const rememberMe = getCookie("rememberMe") === "true";
        setCookie("accessToken", newAccessToken);

        // Retry the original request with the refreshed token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // api.dispatch(logout());
        // clearAuthCookies();
        console.log("Token refresh failed");
      }
    } else {
      // api.dispatch(logout());
      // clearAuthCookies();
      console.log("Token refresh failed");
    }
  }

  return result;
};

// ─── API Slice ────────────────────────────────────────────────────────────────

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Profile", "User", "Categories", "Ingredients", "Recipes", "Menus", "Dashboard", "Analytics", "Approvals", "Staff", "Inventory", "Suppliers", "PendingStaff", "Leave", "HolidayCalendar"],
  endpoints: () => ({}),
});
