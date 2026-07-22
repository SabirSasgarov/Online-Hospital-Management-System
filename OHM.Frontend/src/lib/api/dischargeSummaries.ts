import { api } from '../apiClient'
import type {
  CreateDischargeSummaryRequest, DischargeSummaryDto, PaginatedResult, UpdateDischargeSummaryRequest,
} from '@/types/api'

export interface ListDischargeSummariesParams {
  patientId?: string
  doctorId?: string
  page?: number
  pageSize?: number
}

export const dischargeSummariesApi = {
  list: (params: ListDischargeSummariesParams = {}) =>
    api.get<PaginatedResult<DischargeSummaryDto>>('/dischargesummary', { ...params }),
  getById: (id: string) => api.get<DischargeSummaryDto>(`/dischargesummary/${id}`),
  create: (dto: CreateDischargeSummaryRequest) => api.post<{ id: string }>('/dischargesummary', dto),
  update: (id: string, dto: UpdateDischargeSummaryRequest) => api.put<void>(`/dischargesummary/${id}`, dto),
  remove: (id: string) => api.delete<void>(`/dischargesummary/${id}`),
}
