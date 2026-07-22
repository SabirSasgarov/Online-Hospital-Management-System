import { api } from '../apiClient'
import type { MessageDto, PaginatedResult, SendMessageRequest } from '@/types/api'

export interface ListMessagesParams {
  withUserId?: string
  isRead?: boolean
  page?: number
  pageSize?: number
}

export const messagesApi = {
  list: (params: ListMessagesParams = {}) => api.get<PaginatedResult<MessageDto>>('/message', { ...params }),
  send: (dto: SendMessageRequest) => api.post<{ id: string }>('/message', dto),
  markAsRead: (id: string) => api.patch<void>(`/message/${id}/read`),
  remove: (id: string) => api.delete<void>(`/message/${id}`),
}
