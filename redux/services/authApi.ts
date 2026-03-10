// redux/services/authApi.ts
import { apiSlice } from "../features/apiSlice";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ProfileResponse,
  ChangePasswordRequest,
} from "@/types/auth.types";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── 1. Admin Sign-In ─────────────────────────────────────────────────────
    // POST /api/auth/admin-sign-in
    // Body: { email_address, password }
    // Response: { success, status, message, data: { user, tokens } }
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/admin-sign-in",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),

    // ── 2. Forgot Password ───────────────────────────────────────────────────
    // POST /api/auth/forgot-password
    // Body: { email_address }
    // Response: { message, user_id }
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // ── 3. Verify Reset Code ─────────────────────────────────────────────────
    // POST /api/auth/verify-reset-code
    // Body: { user_id, verification_code }
    // Response: { message, secret_key }
    verifyResetCode: builder.mutation<
      VerifyResetCodeResponse,
      VerifyResetCodeRequest
    >({
      query: (data) => ({
        url: "/api/auth/verify-reset-code",
        method: "POST",
        body: data,
      }),
    }),

    // ── 4. Resend Verification Code ─────────────────────────────────────────
    // POST /api/auth/resend-verification-code
    // Body: { user_id }
    // Response: { message }
    resendVerificationCode: builder.mutation<ResendOtpResponse, ResendOtpRequest>(
      {
        query: (data) => ({
          url: "/api/auth/resend-verification-code",
          method: "POST",
          body: data,
        }),
      }
    ),

    // ── 5. Reset Password ────────────────────────────────────────────────────
    // POST /api/auth/reset-password
    // Body: { user_id, secret_key, new_password, confirm_password }
    // Response: { message }
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>(
      {
        query: (data) => ({
          url: "/api/auth/reset-password",
          method: "POST",
          body: data,
        }),
      }
    ),

    // ── 6. Refresh Token ─────────────────────────────────────────────────────
    // POST /api/auth/refresh
    // Body: { refresh_token }
    // Response: { message, access_token, expires_in, expires_at }
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: "/api/auth/refresh",
        method: "POST",
        body: data,
      }),
    }),

    // ── 7. Get Profile (Get Me) ──────────────────────────────────────────────
    // GET /api/settings/personal-info/me
    // Headers: Authorization: Bearer <access_token>
    // Response: { message, data: { id, full_name, email_address, phone_number, avatar, location, role } }
    getProfile: builder.query<ApiResponse<ProfileResponse>, void>({
      query: () => "/api/settings/personal-info/me",
      providesTags: ["Profile"],
    }),

    // ── 8. Update Profile ────────────────────────────────────────────────────
    updateProfile: builder.mutation<ApiResponse<ProfileResponse>, FormData>({
      query: (formData) => ({
        url: "/api/settings/personal-info/me",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ── 9. Change Password ───────────────────────────────────────────────────
    changePassword: builder.mutation<ApiResponse<any>, ChangePasswordRequest>({
      query: (data) => ({
        url: "/api/auth/change-password",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResendVerificationCodeMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
