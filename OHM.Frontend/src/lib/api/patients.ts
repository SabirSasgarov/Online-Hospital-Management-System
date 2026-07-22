import { api } from '../apiClient'
import type {
  CreatePatientRequest, PaginatedResult, PatientDto, PatientMedicalHistoryDto,
  PatientSummaryDto, UpdateMedicalHistoryRequest, UpdatePatientRequest,
} from '@/types/api'

export interface ListPatientsParams {
  search?: string
  condition?: string
  page?: number
  pageSize?: number
}

export const patientsApi = {
  list: (params: ListPatientsParams = {}) =>
    api.get<PaginatedResult<PatientSummaryDto>>('/patient', { ...params }),
  getById: (id: string) => api.get<PatientDto>(`/patient/${id}`),
  getMedicalHistory: (id: string) => api.get<PatientMedicalHistoryDto>(`/patient/${id}/medical-history`),
  create: (dto: CreatePatientRequest) => api.post<{ id: string }>('/patient', dto),
  update: (id: string, dto: UpdatePatientRequest) => api.put<void>(`/patient/${id}`, dto),
  updateMedicalHistory: (id: string, dto: UpdateMedicalHistoryRequest) =>
    api.put<void>(`/patient/${id}/medical-history`, dto),
  remove: (id: string) => api.delete<void>(`/patient/${id}`),
}
