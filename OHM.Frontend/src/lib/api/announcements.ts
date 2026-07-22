import { api } from '../apiClient'
import type { AnnouncementDto, CreateAnnouncementRequest, PaginatedResult, UpdateAnnouncementRequest } from '@/types/api'

export interface ListAnnouncementsParams {
  published?: boolean
  search?: string
  page?: number
  pageSize?: number
}

export const announcementsApi = {
  /** Unauthenticated — used by the public home page. */
  listPublic: (params: { page?: number; pageSize?: number } = {}) =>
    api.get<PaginatedResult<AnnouncementDto>>('/announcement/public', { ...params }),
  /** Admin CMS — includes drafts. */
  list: (params: ListAnnouncementsParams = {}) =>
    api.get<PaginatedResult<AnnouncementDto>>('/announcement', { ...params }),
  getById: (id: string) => api.get<AnnouncementDto>(`/announcement/${id}`),
  create: (dto: CreateAnnouncementRequest) => api.post<{ id: string }>('/announcement', dto),
  update: (id: string, dto: UpdateAnnouncementRequest) => api.put<void>(`/announcement/${id}`, dto),
  remove: (id: string) => api.delete<void>(`/announcement/${id}`),
}
