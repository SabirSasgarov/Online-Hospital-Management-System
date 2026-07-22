import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { labResultsApi, type ListLabResultsParams } from '@/lib/api/labResults'
import { mapLabResult } from '@/lib/adapters'
import { LabResultStatusCode } from '@/lib/enumCodes'
import type { LabResult } from '@/types'
import type { CreateLabResultRequest } from '@/types/api'

export function useLabResults(params: ListLabResultsParams = {}) {
  return useQuery({
    queryKey: ['labResults', params],
    queryFn: async () => {
      const res = await labResultsApi.list(params)
      return { labResults: res.items.map(mapLabResult), total: res.totalCount }
    },
  })
}

export interface LabResultFormInput {
  visitId: string
  patientId: string
  orderedById: string
  testName: string
  result: string
  normalRange: string
  status: LabResult['status']
  notes?: string
}

const statusKeyMap: Record<LabResult['status'], keyof typeof LabResultStatusCode> = {
  normal: 'Normal',
  abnormal: 'Abnormal',
  critical: 'Critical',
}

export function useCreateLabResult() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: LabResultFormInput) => {
      const dto: CreateLabResultRequest = {
        visitId: input.visitId,
        patientId: input.patientId,
        orderedById: input.orderedById,
        testName: input.testName,
        testedAt: new Date().toISOString(),
        result: input.result,
        normalRange: input.normalRange,
        status: LabResultStatusCode[statusKeyMap[input.status]],
        notes: input.notes || null,
      }
      return labResultsApi.create(dto)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labResults'] }),
  })
}
