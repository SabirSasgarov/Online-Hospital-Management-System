import { useState } from 'react'
import { Search, BellRing } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAppointments } from '@/hooks/useAppointments'
import { useRunAppointmentReminders } from '@/hooks/useAppointmentReminders'
import { ApiError } from '@/lib/apiClient'

const statusVariant: Record<string, string> = { scheduled: 'info', completed: 'success', cancelled: 'destructive', 'no-show': 'warning' }

export default function NurseAppointments() {
  const [search, setSearch] = useState('')
  const [reminderNotice, setReminderNotice] = useState('')
  const { data, isLoading } = useAppointments({ status: 'Scheduled', pageSize: 200 })
  const runReminders = useRunAppointmentReminders()
  const q = search.trim().toLowerCase()
  const upcoming = (data?.appointments ?? [])
    .filter(a => !q || a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q) || a.type.toLowerCase().includes(q))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))

  const sendReminders = async () => {
    setReminderNotice('')
    try {
      const res = await runReminders.mutateAsync()
      setReminderNotice(res.message ?? 'Reminders sent.')
    } catch (err) {
      setReminderNotice(err instanceof ApiError ? err.message : 'Could not send reminders.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="View all upcoming appointments"
        action={
          <Button variant="outline" onClick={sendReminders} disabled={runReminders.isPending}>
            <BellRing className="h-4 w-4" />
            {runReminders.isPending ? 'Sending…' : 'Send Reminders Now'}
          </Button>
        }
      />
      <div className="p-6 space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by patient, doctor, or type..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {reminderNotice && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700">{reminderNotice}</div>
        )}
        {isLoading && <p className="text-sm text-gray-400">Loading appointments…</p>}
        {!isLoading && upcoming.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No upcoming appointments</p>}
        {upcoming.map(apt => (
          <Card key={apt.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-amber-50">
                <span className="text-xs font-bold text-amber-600">{new Date(apt.date).toLocaleDateString('en', { month: 'short' })}</span>
                <span className="text-lg font-bold text-amber-900 leading-none">{new Date(apt.date).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{apt.patientName}</p>
                <p className="text-xs text-gray-500">{apt.doctorName} · {apt.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize text-xs">{apt.type}</Badge>
                <Badge variant={statusVariant[apt.status] as 'info' | 'success' | 'destructive' | 'warning'}>{apt.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
