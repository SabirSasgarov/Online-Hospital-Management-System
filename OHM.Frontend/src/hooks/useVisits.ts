import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { visitsApi, type ListVisitsParams } from '@/lib/api/visits'
import { mapVisit } from '@/lib/adapters'
import type { CreateVisitRequest, DischargeVisitRequest } from '@/types/api'

export function useVisits(params: ListVisitsParams = {}) {
  return useQuery({
    queryKey: ['visits', params],
    queryFn: async () => {
      const res = await visitsApi.list(params)
      return { visits: res.items.map(mapVisit), total: res.totalCount }
    },
  })
}

export function useVisit(id: string | undefined) {
  return useQuery({
    queryKey: ['visit', id],
    queryFn: async () => mapVisit(await visitsApi.getById(id!)),
    enabled: !!id,
  })
}

/** Admits a patient — creates the Visit record (and occupies the bed, if one is given). */
export function useAdmitVisit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateVisitRequest) => visitsApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visits'] })
      qc.invalidateQueries({ queryKey: ['patients'] })
      qc.invalidateQueries({ queryKey: ['beds'] })
      qc.invalidateQueries({ queryKey: ['roomsWithBeds'] })
      qc.invalidateQueries({ queryKey: ['wards'] })
    },
  })
}

export function useDischargeVisit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: DischargeVisitRequest }) => visitsApi.discharge(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visits'] })
      qc.invalidateQueries({ queryKey: ['patients'] })
      qc.invalidateQueries({ queryKey: ['beds'] })
    },
  })
}
