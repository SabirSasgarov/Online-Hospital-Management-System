import { api } from '../apiClient'
import type {
  ApiPrescriptionStatus, ChangePrescriptionStatusRequest, CreatePrescriptionRequest,
  PaginatedResult, PrescriptionDto, UpdatePrescriptionRequest,
} from '@/types/api'

export interface ListPrescriptionsParams {
  visitId?: string
  patientId?: string
  doctorId?: string
  status?: ApiPrescriptionStatus
  page?: number
  pageSize?: number
}

export const prescriptionsApi = {
  list: (params: ListPrescriptionsParams = {}) =>
    api.get<PaginatedResult<PrescriptionDto>>('/prescription', { ...params }),
  getById: (id: string) => api.get<PrescriptionDto>(`/prescription/${id}`),
  create: (dto: CreatePrescriptionRequest) => api.post<{ id: string }>('/prescription', dto),
  update: (id: string, dto: UpdatePrescriptionRequest) => api.put<void>(`/prescription/${id}`, dto),
  changeStatus: (id: string, dto: ChangePrescriptionStatusRequest) =>
    api.patch<void>(`/prescription/${id}/status`, dto),
  remove: (id: string) => api.delete<void>(`/prescription/${id}`),
}
