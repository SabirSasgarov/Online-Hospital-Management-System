import { api } from '../apiClient'
import type {
  ApiVisitStatus, CreateVisitRequest, DischargeVisitRequest, PaginatedResult, UpdateVisitRequest, VisitDto,
} from '@/types/api'

export interface ListVisitsParams {
  patientId?: string
  doctorId?: string
  status?: ApiVisitStatus
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

export const visitsApi = {
  list: (params: ListVisitsParams = {}) => api.get<PaginatedResult<VisitDto>>('/visit', { ...params }),
  getById: (id: string) => api.get<VisitDto>(`/visit/${id}`),
  create: (dto: CreateVisitRequest) => api.post<{ id: string }>('/visit', dto),
  update: (id: string, dto: UpdateVisitRequest) => api.put<void>(`/visit/${id}`, dto),
  discharge: (id: string, dto: DischargeVisitRequest) => api.post<void>(`/visit/${id}/discharge`, dto),
  remove: (id: string) => api.delete<void>(`/visit/${id}`),
}
