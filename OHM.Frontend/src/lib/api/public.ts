import { api } from '../apiClient'
import type { PaginatedResult, PublicDoctorDto } from '@/types/api'

/** Unauthenticated endpoints used only by the public marketing home page. */
export const publicApi = {
  doctors: (params: { page?: number; pageSize?: number } = {}) =>
    api.get<PaginatedResult<PublicDoctorDto>>('/doctor/public', { ...params }),
}
