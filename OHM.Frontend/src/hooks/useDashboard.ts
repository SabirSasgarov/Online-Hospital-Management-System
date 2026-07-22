import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard'

export function useAdminDashboard() {
  return useQuery({ queryKey: ['dashboard', 'admin'], queryFn: () => dashboardApi.admin() })
}

export function useDoctorDashboard(doctorId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'doctor', doctorId],
    queryFn: () => dashboardApi.doctor(doctorId!),
    enabled: !!doctorId,
  })
}

export function usePatientDashboard(patientId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'patient', patientId],
    queryFn: () => dashboardApi.patient(patientId!),
    enabled: !!patientId,
  })
}
