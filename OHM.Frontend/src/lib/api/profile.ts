import { api } from '../apiClient'
import type {
  ChangeEmailRequest, ConfirmEmailChangeRequest, ProfileDto, Result, UpdateProfileRequest,
} from '@/types/api'

export const profileApi = {
  get: () => api.get<ProfileDto>('/profile'),
  update: (dto: UpdateProfileRequest) => api.put<Result>('/profile', dto),
  requestEmailChange: (dto: ChangeEmailRequest) => api.post<Result>('/profile/change-email', dto),
  confirmEmailChange: (dto: ConfirmEmailChangeRequest) =>
    api.post<Result>('/profile/confirm-email-change', dto),
}
