"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { apiSlice } from "@/redux/features/apiSlice";
import { clearAuthCookies } from "@/redux/features/apiSlice";
import { useGetProfileQuery } from "@/redux/services/authApi";
import type { ProfileResponse } from "@/types/auth.types";
import type { UserRole } from "@/types/users";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserInfo {
  id?: string;
  email_address?: string;
  full_name?: string;
  name?: string;    // Alias for full_name
  role?: UserRole;
  avatar?: string;
  image?: string;   // Alias for avatar
  phone_number?: string;
  location?: string;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: ProfileResponse | null;
  hasRole: (role: UserRole) => boolean;
  logout: () => void;
}

// ─── useUser Hook ─────────────────────────────────────────────────────────────
export function useUser(): UserInfo {
  const {
    user,
    token: accessToken,
    isAuthenticated,
  } = useAppSelector((state) => state.auth);

  // Fetch live profile data whenever authenticated
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  const { logout } = useLogout();

  const profile = profileData?.data ?? null;

  const hasRole = (role: UserRole): boolean =>
    (profile?.role ?? user?.role) === role;

  const fullName = profile?.full_name ?? user?.full_name;
  const avatarImage = profile?.avatar ?? user?.avatar;

  return {
    // Merge Redux user with live profile (profile takes precedence)
    id: profile?.id ?? user?.id,
    email_address: profile?.email_address ?? user?.email_address,
    full_name: fullName,
    name: fullName, // Alias for legacy component support
    role: profile?.role ?? user?.role,
    avatar: avatarImage,
    image: avatarImage, // Alias for legacy component support
    phone_number: profile?.phone_number,
    location: profile?.location,
    accessToken,
    isAuthenticated,
    isLoading: isProfileLoading,
    profile,
    hasRole,
    logout,
  };
}

// ─── useLogout Hook ───────────────────────────────────────────────────────────
export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logout = () => {
    // 1. Clear Redux state
    dispatch(logoutAction());

    // 2. Reset all RTK Query caches
    dispatch(apiSlice.util.resetApiState());

    // 3. Clear all auth cookies
    clearAuthCookies();

    // 4. Hard redirect to login – ensures clean state across the app
    window.location.replace("/signin");
  };

  return { logout };
};
