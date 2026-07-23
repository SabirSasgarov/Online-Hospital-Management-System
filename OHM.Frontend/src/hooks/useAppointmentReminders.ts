import { useMutation } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api/notifications'

/** Manually triggers the same reminder sweep the hourly background job runs automatically. */
export function useRunAppointmentReminders() {
  return useMutation({
    mutationFn: () => notificationsApi.runAppointmentReminders(),
  })
}
