// redux/features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { UserRole } from "@/types/users";

// Helper to get cookie locally without importing from apiSlice to avoid circular dependency
const getCookieLocal = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

interface AuthState {
  user: {
    user_id: string;
    email_address: string;
    role: UserRole;
    full_name?: string;
    profile_image?: string;
  } | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
}

// Initialize from cookies if available
const initialToken = getCookieLocal("accessToken");
const initialRole = getCookieLocal("userRole") as UserRole | null;
const initialUserId = getCookieLocal("userId");
const initialEmail = getCookieLocal("userEmail");

const initialState: AuthState = {
  user:
    initialUserId && initialEmail && initialRole
      ? {
          user_id: initialUserId,
          email_address: decodeURIComponent(initialEmail),
          role: initialRole,
        }
      : null,
  token: initialToken,
  refreshToken: getCookieLocal("refreshToken"),
  tokenExpiresAt: null,
  isAuthenticated: !!initialToken,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: {
          user_id: string;
          email_address: string;
          role: UserRole;
          full_name?: string;
          profile_image?: string;
        };
        token: string;
        refreshToken: string;
        tokenExpiresAt?: number;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tokenExpiresAt = action.payload.tokenExpiresAt || null;
      state.isAuthenticated = true;
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
        tokenExpiresAt?: number;
      }>,
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.tokenExpiresAt) {
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

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
