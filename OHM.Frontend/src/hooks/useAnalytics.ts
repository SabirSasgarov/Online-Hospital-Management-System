import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api/analytics'

export function useAdmissionsAnalytics(from?: string, to?: string) {
  return useQuery({ queryKey: ['analytics', 'admissions', from, to], queryFn: () => analyticsApi.admissions(from, to) })
}

export function useBedOccupancyAnalytics() {
  return useQuery({ queryKey: ['analytics', 'bedOccupancy'], queryFn: () => analyticsApi.bedOccupancy() })
}

export function useAppointmentsAnalytics(from?: string, to?: string) {
  return useQuery({ queryKey: ['analytics', 'appointments', from, to], queryFn: () => analyticsApi.appointments(from, to) })
}

export function usePatientConditionsAnalytics(topN = 10) {
  return useQuery({ queryKey: ['analytics', 'patientConditions', topN], queryFn: () => analyticsApi.patientConditions(topN) })
}
