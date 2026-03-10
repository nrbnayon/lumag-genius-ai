// redux/services/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { updateTokens, logout } from '../features/authSlice';
import type { ApiResponse, RefreshTokenResponse } from '@/types/users';

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

// Helper function to delete cookie
const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    // Try to get token from Redux state first, then from cookies
    let token = state.auth.token;
    
    if (!token) {
      token = getCookie('accessToken');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Auto refresh logic with proper error handling
const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check if we got a 401 error
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    let refreshToken = state.auth.refreshToken;
    
    // Try to get refresh token from cookies if not in state
    if (!refreshToken) {
      refreshToken = getCookie('refreshToken');
    }

    if (!refreshToken) {
      // No refresh token available, logout
      api.dispatch(logout());
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      deleteCookie('userRole');
      deleteCookie('userId');
      return result;
    }

    // Try to refresh the token
    const refreshResult = await baseQuery(
      {
        url: '/api/auth/custom-refresh/',
        method: 'POST',
        body: { refresh: refreshToken },
        headers: {
          Authorization: `Bearer ${state.auth.token || getCookie('accessToken')}`,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const responseData = refreshResult.data as ApiResponse<RefreshTokenResponse>;
      
      if (responseData.success && responseData.data) {
        const { access_token } = responseData.data;

        // Update Redux state
        api.dispatch(
          updateTokens({
            token: access_token,
            refreshToken: refreshToken,
          })
        );

        // Update cookies
        setCookie('accessToken', access_token, 7);

        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout
        api.dispatch(logout());
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        deleteCookie('userRole');
        deleteCookie('userId');
      }
    } else {
      // Refresh failed, logout
      api.dispatch(logout());
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      deleteCookie('userRole');
      deleteCookie('userId');
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: () => ({}),
});

// Export helper functions for use in components
export { getCookie, setCookie, deleteCookie };
