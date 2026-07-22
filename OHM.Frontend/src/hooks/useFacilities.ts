import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bedsApi, roomsApi, wardsApi, type ListBedsParams, type ListWardsParams } from '@/lib/api/facilities'
import { mapBed, mapRoom, mapWardSummary } from '@/lib/adapters'
import type { CreateWardRequest, UpdateWardRequest, UpdateBedStatusRequest } from '@/types/api'

/** Bed occupancy affects ward %, the room/bed grid, and the beds list — refresh all three. */
function invalidateBedRelatedQueries(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['beds'] })
  qc.invalidateQueries({ queryKey: ['roomsWithBeds'] })
  qc.invalidateQueries({ queryKey: ['wards'] })
}

export function useWards(params: ListWardsParams = {}) {
  return useQuery({
    queryKey: ['wards', params],
    queryFn: async () => {
      const res = await wardsApi.list(params)
      return { wards: res.items.map(mapWardSummary), total: res.totalCount }
    },
  })
}

export function useCreateWard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateWardRequest) => wardsApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wards'] }),
  })
}

export function useUpdateWard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateWardRequest }) => wardsApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wards'] }),
  })
}

/** Rooms for a ward, mapped with their beds (used by the "Rooms & Beds" tab). */
export function useRoomsWithBeds(wardId?: string) {
  return useQuery({
    queryKey: ['roomsWithBeds', wardId],
    queryFn: async () => {
      const list = await roomsApi.list({ wardId, pageSize: 100 })
      const full = await Promise.all(list.items.map((r) => roomsApi.getById(r.id)))
      return full.map(mapRoom)
    },
  })
}

export function useAllRoomsWithBeds() {
  return useQuery({
    queryKey: ['roomsWithBeds', 'all'],
    queryFn: async () => {
      const list = await roomsApi.list({ pageSize: 200 })
      const full = await Promise.all(list.items.map((r) => roomsApi.getById(r.id)))
      return full.map(mapRoom)
    },
  })
}

export function useBeds(params: ListBedsParams = {}) {
  return useQuery({
    queryKey: ['beds', params],
    queryFn: async () => {
      const res = await bedsApi.list(params)
      return { beds: res.items.map(mapBed), total: res.totalCount }
    },
  })
}

export function useAssignPatientToBed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bedId, patientId }: { bedId: string; patientId: string }) =>
      bedsApi.assign(bedId, { patientId }),
    onSuccess: () => invalidateBedRelatedQueries(qc),
  })
}

export function useReleaseBed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bedId: string) => bedsApi.release(bedId),
    onSuccess: () => invalidateBedRelatedQueries(qc),
  })
}

export function useUpdateBedStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bedId, dto }: { bedId: string; dto: UpdateBedStatusRequest }) =>
      bedsApi.updateStatus(bedId, dto),
    onSuccess: () => invalidateBedRelatedQueries(qc),
  })
}
