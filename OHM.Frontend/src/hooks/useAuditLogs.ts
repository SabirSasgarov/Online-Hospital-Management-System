import { useQuery } from '@tanstack/react-query'
import { auditLogsApi, type ListAuditLogsParams } from '@/lib/api/auditLogs'
import { mapAuditLog } from '@/lib/adapters'

export function useAuditLogs(params: ListAuditLogsParams = {}) {
  return useQuery({
    queryKey: ['auditLogs', params],
    queryFn: async () => {
      const res = await auditLogsApi.list(params)
      return { logs: res.items.map(mapAuditLog), total: res.totalCount }
    },
  })
}
