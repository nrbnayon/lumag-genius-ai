"use client";

import { useAppSelector } from "@/redux/hooks";
import {  ProfileResponse } from "@/types/auth.types";
import { useGetProfileQuery } from "@/redux/services/authApi";
import { UserRole } from "@/types/users";

export interface UserInfo {
.......
  ...
  isVerified?: boolean | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: ProfileResponse | null;
}

export function useUser() {
  const {
    user,
    token: accessToken,
    isAuthenticated,
  } = useAppSelector((state) => state.auth);

  // Fetch profile if authenticated
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(
    undefined,
    {
      skip: !isAuthenticated,
    },
  );

  const userProfile = profileData?.data || null;

  const hasRole = (role: UserRole) => user?.role === role;

  return {

    accessToken,
    isAuthenticated,
    isLoading: isProfileLoading,
    hasRole,
  };
}


import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { apiSlice } from "@/redux/features/apiSlice";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logout = () => {
    // 1. Dispatch logout action to clear Redux state
    dispatch(logoutAction());

    // 2. Clear RTK Query cache
    dispatch(apiSlice.util.resetApiState());

    // 3. Clear cookies
    const authCookies = [
      "accessToken",
      "refreshToken",
      "userRole",
      "userEmail",
      "userId",
    ];

    authCookies.forEach((cookieName) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
    });

    // 4. Redirect to login
    // Using window.location.href for a hard redirect to ensure all states are clean
    // or router.replace if we want to stay in SPA mode but force navigation
    router.replace("/login");
    
    // Optional: hard reload if issues persist
    // window.location.href = "/login";
  };

  return { logout };
};
