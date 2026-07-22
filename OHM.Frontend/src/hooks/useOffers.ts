import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { offersApi, type ListOffersParams } from '@/lib/api/offers'
import type { CreateOfferRequest, UpdateOfferRequest } from '@/types/api'

/** Public — used by the unauthenticated home page's "What CareFlow Offers" section. */
export function usePublicOffers() {
  return useQuery({
    queryKey: ['publicOffers'],
    queryFn: () => offersApi.listPublic(),
  })
}

/** Admin CMS — includes inactive offers. */
export function useOffers(params: ListOffersParams = {}) {
  return useQuery({
    queryKey: ['offers', params],
    queryFn: () => offersApi.list(params),
  })
}

export function useCreateOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateOfferRequest) => offersApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['offers'] })
      qc.invalidateQueries({ queryKey: ['publicOffers'] })
    },
  })
}

export function useUpdateOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateOfferRequest }) => offersApi.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['offers'] })
      qc.invalidateQueries({ queryKey: ['publicOffers'] })
    },
  })
}

export function useDeleteOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => offersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['offers'] })
      qc.invalidateQueries({ queryKey: ['publicOffers'] })
    },
  })
}
