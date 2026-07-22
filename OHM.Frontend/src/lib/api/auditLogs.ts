import { api } from '../apiClient'
import type { AuditLogDto, PaginatedResult } from '@/types/api'

export interface ListAuditLogsParams {
  userId?: string
  resource?: string
  action?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

export const auditLogsApi = {
  list: (params: ListAuditLogsParams = {}) => api.get<PaginatedResult<AuditLogDto>>('/auditlog', { ...params }),
}
