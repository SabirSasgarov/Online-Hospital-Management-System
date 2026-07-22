import { api } from '../apiClient'
import type {
  AuthResponseDto, ChangePasswordRequest, ConfirmEmailRequest, ForgotPasswordRequest,
  GoogleSignInRequest, LoginRequest, RefreshTokenRequest, RegisterRequest,
  ResendConfirmationRequest, ResetPasswordRequest, Result,
} from '@/types/api'

export const authApi = {
  login: (dto: LoginRequest) => api.raw<Result<AuthResponseDto>>('/auth/login', { method: 'POST', body: dto }),
  adminLogin: (dto: LoginRequest) =>
    api.raw<Result<AuthResponseDto>>('/auth/admin-login', { method: 'POST', body: dto }),
  register: (dto: RegisterRequest) => api.raw<Result>('/auth/register', { method: 'POST', body: dto }),
  confirmEmail: (dto: ConfirmEmailRequest) => api.raw<Result>('/auth/confirm-email', { method: 'POST', body: dto }),
  resendConfirmation: (dto: ResendConfirmationRequest) =>
    api.raw<Result>('/auth/resend-confirmation', { method: 'POST', body: dto }),
  googleSignIn: (dto: GoogleSignInRequest) =>
    api.raw<Result<AuthResponseDto>>('/auth/google-signin', { method: 'POST', body: dto }),
  me: () => api.get<{ userId: string; email: string; fullName: string; roles: string[] }>('/auth/me'),
  logout: () => api.post<Result>('/auth/logout'),
  revokeToken: () => api.post<Result>('/auth/revoke-token'),
  forgotPassword: (dto: ForgotPasswordRequest) =>
    api.raw<Result>('/auth/forgot-password', { method: 'POST', body: dto }),
  resetPassword: (dto: ResetPasswordRequest) =>
    api.raw<Result>('/auth/reset-password', { method: 'POST', body: dto }),
  changePassword: (dto: ChangePasswordRequest) => api.post<Result>('/auth/change-password', dto),
  refreshToken: (dto: RefreshTokenRequest) =>
    api.raw<Result<AuthResponseDto>>('/auth/refresh-token', { method: 'POST', body: dto }),
}
