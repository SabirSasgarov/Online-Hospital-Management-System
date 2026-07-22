import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { patientsApi, type ListPatientsParams } from '@/lib/api/patients'
import { mapPatientFull, mapPatientSummary, joinCsv } from '@/lib/adapters'
import { GenderCode } from '@/lib/enumCodes'
import type { Patient } from '@/types'
import type { CreatePatientRequest, UpdatePatientRequest, UpdateMedicalHistoryRequest } from '@/types/api'

export function usePatients(params: ListPatientsParams = {}) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: async () => {
      const res = await patientsApi.list(params)
      return { patients: res.items.map(mapPatientSummary), total: res.totalCount, page: res.page, pageSize: res.pageSize }
    },
  })
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => mapPatientFull(await patientsApi.getById(id!)),
    enabled: !!id,
  })
}

export function usePatientMedicalHistory(id: string | undefined) {
  return useQuery({
    queryKey: ['patientMedicalHistory', id],
    queryFn: () => patientsApi.getMedicalHistory(id!),
    enabled: !!id,
  })
}

/** Form-friendly shape used by the "Register Patient" dialog. */
export interface PatientFormInput {
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string
  gender: Patient['gender']
  bloodType: string
  phone: string
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  conditions?: string[]
  allergies?: string[]
}

export function useCreatePatient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: PatientFormInput) => {
      const dto: CreatePatientRequest = {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        userName: input.email,
        password: input.password || 'Passw0rd!',
        dateOfBirth: input.dateOfBirth,
        gender: GenderCode[(input.gender.charAt(0).toUpperCase() + input.gender.slice(1)) as 'Male' | 'Female' | 'Other'],
        bloodType: input.bloodType,
        phone: input.phone,
        address: input.address ?? '',
        emergencyContactName: input.emergencyContactName ?? '',
        emergencyContactPhone: input.emergencyContactPhone ?? '',
        conditions: joinCsv(input.conditions ?? []),
        allergies: joinCsv(input.allergies ?? []),
      }
      return patientsApi.create(dto)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  })
}

export function useUpdatePatient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePatientRequest }) => patientsApi.update(id, dto),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['patients'] })
      qc.invalidateQueries({ queryKey: ['patient', id] })
    },
  })
}

export function useUpdateMedicalHistory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMedicalHistoryRequest }) =>
      patientsApi.updateMedicalHistory(id, dto),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['patients'] })
      qc.invalidateQueries({ queryKey: ['patient', id] })
      qc.invalidateQueries({ queryKey: ['patientMedicalHistory', id] })
    },
  })
}

export function useDeletePatient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => patientsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  })
}
