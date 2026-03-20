// redux/features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { UserRole } from "@/types/users";

// ─── Cookie Helper (no circular dependency) ───────────────────────────────────
const getCookieLocal = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// ─── State Shape ──────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email_address: string;
  full_name: string;
  role: UserRole;
  avatar?: string;
  phone_number?: string;
  location?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
}

// ─── Hydrate from cookies on first load ───────────────────────────────────────
const initialToken = getCookieLocal("accessToken");
const initialRole = getCookieLocal("userRole") as UserRole | null;
const initialUserId = getCookieLocal("userId");
const initialEmail = getCookieLocal("userEmail");
const initialName = getCookieLocal("userName");
const initialAvatar = getCookieLocal("userAvatar");

const initialState: AuthState = {
  user:
    initialToken && initialUserId && initialEmail && initialRole
      ? {
          id: initialUserId,
          email_address: decodeURIComponent(initialEmail),
          full_name: initialName ? decodeURIComponent(initialName) : "",
          role: initialRole,
          avatar: initialAvatar ? decodeURIComponent(initialAvatar) : undefined,
        }
      : null,
  token: initialToken,
  refreshToken: getCookieLocal("refreshToken"),
  tokenExpiresAt: null,
  isAuthenticated: !!initialToken && initialRole === "admin",
};

// ─── Slice ────────────────────────────────────────────────────────────────────
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
        refreshToken: string;
        tokenExpiresAt?: number;
      }>
    ) => {
      const { user, token, refreshToken, tokenExpiresAt } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.tokenExpiresAt = tokenExpiresAt ?? null;
      // Only admins are considered authenticated in this panel
      state.isAuthenticated = user.role === "admin";
    },

    updateTokens: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
        tokenExpiresAt?: number;
      }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.tokenExpiresAt !== undefined) {
        state.tokenExpiresAt = action.payload.tokenExpiresAt;
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateTokens, logout } = authSlice.actions;
export default authSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
