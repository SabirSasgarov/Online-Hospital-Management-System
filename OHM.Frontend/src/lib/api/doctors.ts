import { api } from '../apiClient'
import type {
  CreateDoctorRequest, DoctorDto, DoctorScheduleDto, DoctorSummaryDto, PaginatedResult,
  UpdateDoctorAvailabilityRequest, UpdateDoctorRequest, UpdateDoctorScheduleRequest,
} from '@/types/api'

export interface ListDoctorsParams {
  search?: string
  specialization?: string
  isAvailable?: boolean
  page?: number
  pageSize?: number
}

export const doctorsApi = {
  list: (params: ListDoctorsParams = {}) =>
    api.get<PaginatedResult<DoctorSummaryDto>>('/doctor', { ...params }),
  getById: (id: string) => api.get<DoctorDto>(`/doctor/${id}`),
  getSchedule: (id: string) => api.get<DoctorScheduleDto[]>(`/doctor/${id}/schedule`),
  create: (dto: CreateDoctorRequest) => api.post<{ id: string }>('/doctor', dto),
  update: (id: string, dto: UpdateDoctorRequest) => api.put<void>(`/doctor/${id}`, dto),
  updateSchedule: (id: string, dto: UpdateDoctorScheduleRequest) =>
    api.put<void>(`/doctor/${id}/schedule`, dto),
  updateAvailability: (id: string, dto: UpdateDoctorAvailabilityRequest) =>
    api.patch<void>(`/doctor/${id}/availability`, dto),
  remove: (id: string) => api.delete<void>(`/doctor/${id}`),
}
