import { api } from '../apiClient'
import type { CreateOfferRequest, OfferDto, PaginatedResult, UpdateOfferRequest } from '@/types/api'

export interface ListOffersParams {
  active?: boolean
  page?: number
  pageSize?: number
}

export const offersApi = {
  /** Unauthenticated — used by the public home page. */
  listPublic: () => api.get<OfferDto[]>('/offer/public'),
  /** Admin CMS — includes inactive offers. */
  list: (params: ListOffersParams = {}) =>
    api.get<PaginatedResult<OfferDto>>('/offer', { ...params }),
  getById: (id: string) => api.get<OfferDto>(`/offer/${id}`),
  create: (dto: CreateOfferRequest) => api.post<{ id: string }>('/offer', dto),
  update: (id: string, dto: UpdateOfferRequest) => api.put<void>(`/offer/${id}`, dto),
  remove: (id: string) => api.delete<void>(`/offer/${id}`),
}
