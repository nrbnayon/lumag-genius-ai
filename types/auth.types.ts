import { UserRole } from "./users";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  access_token_valid_till?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  errors?: any;
  error_code?: string;
}

export interface LoginRequest {
  email_address: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  role: UserRole;
}

export interface VerifyEmailRequest {
  email_address: string;
}

export interface VerifyEmailResponse {}

export interface ForgotPasswordRequest {
  email_address: string;
}

export interface ForgotPasswordResponse {}

export interface VerifyResetCodeRequest {}

export interface VerifyResetCodeResponse {}

export interface ResetPasswordRequest {}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {}

export interface ResendOtpRequest {
  email_address: string;
}

export interface ResendOtpResponse {
  email_address: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface ProfileResponse {
  id: string;
  name: string;
  email_address: string;
  role: UserRole;
}
