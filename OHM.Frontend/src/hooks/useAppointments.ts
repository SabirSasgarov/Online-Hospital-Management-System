import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi, type ListAppointmentsParams } from '@/lib/api/appointments'
import { combineDateTime, mapAppointment } from '@/lib/adapters'
import { AppointmentStatusCode, AppointmentTypeCode } from '@/lib/enumCodes'
import type { Appointment } from '@/types'
import type { ChangeAppointmentStatusRequest, CreateAppointmentRequest } from '@/types/api'

export function useAppointments(params: ListAppointmentsParams = {}) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const res = await appointmentsApi.list(params)
      return { appointments: res.items.map(mapAppointment), total: res.totalCount }
    },
  })
}

export interface AppointmentFormInput {
  patientId: string
  doctorId: string
  date: string
  time: string
  type: Appointment['type']
  notes?: string
}

const typeKeyMap: Record<Appointment['type'], keyof typeof AppointmentTypeCode> = {
  consultation: 'Consultation',
  'follow-up': 'FollowUp',
  emergency: 'Emergency',
  checkup: 'Checkup',
}

const statusKeyMap: Record<Appointment['status'], keyof typeof AppointmentStatusCode> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'no-show': 'NoShow',
}

export function useCreateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AppointmentFormInput) => {
      const dto: CreateAppointmentRequest = {
        patientId: input.patientId,
        doctorId: input.doctorId,
        scheduledAt: combineDateTime(input.date, input.time),
        type: AppointmentTypeCode[typeKeyMap[input.type]],
        notes: input.notes || null,
      }
      return appointmentsApi.create(dto)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  })
}

export function useChangeAppointmentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: Appointment['status']; reason?: string }) => {
      const dto: ChangeAppointmentStatusRequest = { status: AppointmentStatusCode[statusKeyMap[status]], reason }
      return appointmentsApi.changeStatus(id, dto)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  })
}

export function useDeleteAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  })
}
