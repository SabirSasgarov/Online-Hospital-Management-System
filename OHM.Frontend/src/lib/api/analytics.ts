import { api } from '../apiClient'
import type {
  AdmissionsAnalyticsDto, AppointmentsAnalyticsDto, BedOccupancyAnalyticsDto, PatientConditionsAnalyticsDto,
} from '@/types/api'

export const analyticsApi = {
  admissions: (from?: string, to?: string) =>
    api.get<AdmissionsAnalyticsDto>('/analytics/admissions', { from, to }),
  bedOccupancy: () => api.get<BedOccupancyAnalyticsDto>('/analytics/bed-occupancy'),
  appointments: (from?: string, to?: string) =>
    api.get<AppointmentsAnalyticsDto>('/analytics/appointments', { from, to }),
  patientConditions: (topN = 10) =>
    api.get<PatientConditionsAnalyticsDto>('/analytics/patient-conditions', { topN }),
}
