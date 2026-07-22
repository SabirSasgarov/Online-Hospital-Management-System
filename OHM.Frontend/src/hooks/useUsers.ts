import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersApi, type ListUsersParams } from '@/lib/api/users'
import type { CreateStaffUserRequest } from '@/types/api'

export function useStaffUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.list(params),
  })
}

export function useCreateStaffUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateStaffUserRequest) => usersApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useSetUserActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => usersApi.setActive(id, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
