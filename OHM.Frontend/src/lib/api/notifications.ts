import { api } from '../apiClient'
import type { ApiNotificationType, NotificationDto, PaginatedResult, Result } from '@/types/api'

export interface ListNotificationsParams {
  isRead?: boolean
  type?: ApiNotificationType
  page?: number
  pageSize?: number
}

export const notificationsApi = {
  list: (params: ListNotificationsParams = {}) =>
    api.get<PaginatedResult<NotificationDto>>('/notification', { ...params }),
  markAsRead: (id: string) => api.patch<void>(`/notification/${id}/read`),
  markAllAsRead: () => api.patch<void>('/notification/read-all'),
  remove: (id: string) => api.delete<void>(`/notification/${id}`),
  /** Manually sweeps for appointments ~1 day out and emails reminders now (nurse/admin only). */
  runAppointmentReminders: () => api.post<Result<number>>('/notification/run-appointment-reminders'),
}
