import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { doctorsApi, type ListDoctorsParams } from '@/lib/api/doctors'
import { mapDoctorFull, mapDoctorSummary } from '@/lib/adapters'
import type { CreateDoctorRequest, UpdateDoctorAvailabilityRequest, UpdateDoctorRequest } from '@/types/api'

export function useDoctors(params: ListDoctorsParams = {}) {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: async () => {
      const res = await doctorsApi.list(params)
      return { doctors: res.items.map(mapDoctorSummary), total: res.totalCount, page: res.page, pageSize: res.pageSize }
    },
  })
}

export function useDoctor(id: string | undefined) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => mapDoctorFull(await doctorsApi.getById(id!)),
    enabled: !!id,
  })
}

export interface DoctorFormInput {
  firstName: string
  lastName: string
  email: string
  password?: string
  specialization: string
  phone: string
  profileImageUrl?: string
}

export function useCreateDoctor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: DoctorFormInput) => {
      const dto: CreateDoctorRequest = {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        userName: input.email,
        password: input.password || 'Passw0rd!',
        specialization: input.specialization,
        phone: input.phone,
        profileImageUrl: input.profileImageUrl || undefined,
        schedules: [],
      }
      return doctorsApi.create(dto)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctors'] }),
  })
}

export function useUpdateDoctor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDoctorRequest }) => doctorsApi.update(id, dto),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: ['doctors'] })
      qc.invalidateQueries({ queryKey: ['doctor', id] })
    },
  })
}

export function useUpdateDoctorAvailability() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDoctorAvailabilityRequest }) =>
      doctorsApi.updateAvailability(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctors'] }),
  })
}

export function useDeleteDoctor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => doctorsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctors'] }),
  })
}
