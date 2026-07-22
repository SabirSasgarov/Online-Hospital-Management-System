import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileApi } from '@/lib/api/profile'
import type { ChangeEmailRequest, ConfirmEmailChangeRequest, UpdateProfileRequest } from '@/types/api'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateProfileRequest) => profileApi.update(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}

export function useRequestEmailChange() {
  return useMutation({
    mutationFn: (dto: ChangeEmailRequest) => profileApi.requestEmailChange(dto),
  })
}

export function useConfirmEmailChange() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: ConfirmEmailChangeRequest) => profileApi.confirmEmailChange(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}
