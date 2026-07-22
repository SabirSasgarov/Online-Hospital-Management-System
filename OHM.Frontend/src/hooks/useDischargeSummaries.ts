import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dischargeSummariesApi, type ListDischargeSummariesParams } from '@/lib/api/dischargeSummaries'
import { mapDischargeSummary } from '@/lib/adapters'
import type { CreateDischargeSummaryRequest } from '@/types/api'

export function useDischargeSummaries(params: ListDischargeSummariesParams = {}) {
  return useQuery({
    queryKey: ['dischargeSummaries', params],
    queryFn: async () => {
      const res = await dischargeSummariesApi.list(params)
      return { summaries: res.items.map(mapDischargeSummary), total: res.totalCount }
    },
  })
}

export function useCreateDischargeSummary() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateDischargeSummaryRequest) => dischargeSummariesApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dischargeSummaries'] }),
  })
}
