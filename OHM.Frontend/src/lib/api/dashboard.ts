import { api } from '../apiClient'
import type { AdminDashboardDto, DoctorDashboardDto, PatientDashboardDto } from '@/types/api'

export const dashboardApi = {
  admin: () => api.get<AdminDashboardDto>('/dashboard/admin'),
  doctor: (doctorId: string) => api.get<DoctorDashboardDto>(`/dashboard/doctor/${doctorId}`),
  patient: (patientId: string) => api.get<PatientDashboardDto>(`/dashboard/patient/${patientId}`),
}
