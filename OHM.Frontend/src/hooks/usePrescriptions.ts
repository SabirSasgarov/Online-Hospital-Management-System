import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { prescriptionsApi, type ListPrescriptionsParams } from '@/lib/api/prescriptions'
import { mapPrescription } from '@/lib/adapters'
import type { CreatePrescriptionRequest } from '@/types/api'
import type { Medication } from '@/types'

export function usePrescriptions(params: ListPrescriptionsParams = {}) {
  return useQuery({
    queryKey: ['prescriptions', params],
    queryFn: async () => {
      const res = await prescriptionsApi.list(params)
      return { prescriptions: res.items.map(mapPrescription), total: res.totalCount }
    },
  })
}

export interface PrescriptionFormInput {
  visitId: string
  patientId: string
  doctorId: string
  notes?: string
  medications: Medication[]
}

export function useCreatePrescription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: PrescriptionFormInput) => {
      const dto: CreatePrescriptionRequest = {
        visitId: input.visitId,
        patientId: input.patientId,
        doctorId: input.doctorId,
        notes: input.notes || null,
        medications: input.medications
          .filter((m) => m.name.trim())
          .map((m) => ({ name: m.name, dosage: m.dosage, frequency: m.frequency, duration: m.duration, instructions: m.instructions || null })),
      }
      return prescriptionsApi.create(dto)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prescriptions'] }),
  })
}
