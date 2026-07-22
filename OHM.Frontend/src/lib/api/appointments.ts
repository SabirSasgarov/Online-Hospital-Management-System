import { api } from '../apiClient'
import type {
  AppointmentDto, AppointmentSummaryDto, ApiAppointmentStatus, ApiAppointmentType,
  ChangeAppointmentStatusRequest, CreateAppointmentRequest, PaginatedResult, UpdateAppointmentRequest,
} from '@/types/api'

export interface ListAppointmentsParams {
  patientId?: string
  doctorId?: string
  status?: ApiAppointmentStatus
  type?: ApiAppointmentType
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

export const appointmentsApi = {
  list: (params: ListAppointmentsParams = {}) =>
    api.get<PaginatedResult<AppointmentSummaryDto>>('/appointment', { ...params }),
  getById: (id: string) => api.get<AppointmentDto>(`/appointment/${id}`),
  create: (dto: CreateAppointmentRequest) => api.post<{ id: string }>('/appointment', dto),
  update: (id: string, dto: UpdateAppointmentRequest) => api.put<void>(`/appointment/${id}`, dto),
  changeStatus: (id: string, dto: ChangeAppointmentStatusRequest) =>
    api.patch<void>(`/appointment/${id}/status`, dto),
  remove: (id: string) => api.delete<void>(`/appointment/${id}`),
}
