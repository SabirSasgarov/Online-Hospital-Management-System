import { api } from '../apiClient'
import type {
  ApiLabResultStatus, CreateLabResultRequest, LabResultDto, PaginatedResult, UpdateLabResultRequest,
} from '@/types/api'

export interface ListLabResultsParams {
  visitId?: string
  patientId?: string
  status?: ApiLabResultStatus
  page?: number
  pageSize?: number
}

export const labResultsApi = {
  list: (params: ListLabResultsParams = {}) =>
    api.get<PaginatedResult<LabResultDto>>('/labresult', { ...params }),
  getById: (id: string) => api.get<LabResultDto>(`/labresult/${id}`),
  create: (dto: CreateLabResultRequest) => api.post<{ id: string }>('/labresult', dto),
  update: (id: string, dto: UpdateLabResultRequest) => api.put<void>(`/labresult/${id}`, dto),
  remove: (id: string) => api.delete<void>(`/labresult/${id}`),
}
