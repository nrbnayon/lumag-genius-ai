// redux/services/authApi.ts
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordRequest,
  ResendOtpRequest,
  ResendOtpResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ProfileResponse,
  ChangePasswordRequest,
} from "@/types/auth.types";
import { apiSlice } from "../features/apiSlice";

// Inject endpoints into the API slice
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Signin endpoint
    signin: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (userData) => ({
        url: "/api/auth/signin/",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 2. Verify Email endpoint
    verifyEmail: builder.mutation<
      ApiResponse<VerifyEmailResponse>,
      VerifyEmailRequest
    >({
      query: (data) => ({
        url: "/api/auth/verify-email/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // 3. Forgot Password endpoint
    forgotPassword: builder.mutation<
      ApiResponse<ForgotPasswordResponse>,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/api/auth/forgot-password/",
        method: "POST",
        body: data,
      }),
    }),

    // 4. Verify Reset Code endpoint
    verifyResetCode: builder.mutation<
      ApiResponse<VerifyResetCodeResponse>,
      VerifyResetCodeRequest
    >({
      query: (data) => ({
        url: "/api/auth/verify-reset-code/",
        method: "POST",
        body: data,
      }),
    }),

    // 5. Reset Password endpoint
    resetPassword: builder.mutation<ApiResponse<void>, ResetPasswordRequest>({
      query: (data) => ({
        url: "/api/auth/reset-password/",
        method: "POST",
        body: data,
      }),
    }),

    // 6. Resend OTP endpoint
    resendOtp: builder.mutation<
      ApiResponse<ResendOtpResponse>,
      ResendOtpRequest
    >({
      query: (data) => ({
        url: "/api/auth/resent-otp/",
        method: "POST",
        body: data,
      }),
    }),

    // 7. Login/Signin endpoint
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/signin/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),

    // 8. Refresh Token endpoint
    refreshToken: builder.mutation<
      ApiResponse<RefreshTokenResponse>,
      RefreshTokenRequest
    >({
      query: (data) => ({
        url: "/api/auth/custom-refresh/",
        method: "POST",
        body: data,
      }),
    }),

    // 9. Get Profile endpoint
    getProfile: builder.query<ApiResponse<ProfileResponse>, void>({
      query: () => "/api/auth/getme/",
      providesTags: ["Profile"],
    }),

    // 10. Update Profile endpoint
    updateProfile: builder.mutation<ApiResponse<ProfileResponse>, FormData>({
      query: (formData) => ({
        url: "/api/auth/getme/",
        method: "PUT",
        body: formData,
        // FormData handles content-type automatically
      }),
      invalidatesTags: ["Profile"],
    }),

    // 11. Change Password endpoint
    changePassword: builder.mutation<ApiResponse<any>, ChangePasswordRequest>({
      query: (data) => ({
        url: "/api/auth/change-password/",
        method: "PATCH",
        body: data,
      }),
    }),

    // 12. Logout endpoint (optional - can be handled client-side)
    logout: builder.mutation<void, void>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ["Auth", "Profile"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
