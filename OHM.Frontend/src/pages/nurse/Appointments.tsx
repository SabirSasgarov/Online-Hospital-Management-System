import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { mockAppointments } from '@/lib/mockData'

const statusVariant: Record<string, string> = { scheduled: 'info', completed: 'success', cancelled: 'destructive', 'no-show': 'warning' }

export default function NurseAppointments() {
  const upcoming = mockAppointments.filter(a => a.status === 'scheduled').sort((a, b) => a.date.localeCompare(b.date))
  return (
    <div>
      <PageHeader title="Appointments" description="View all upcoming appointments" />
      <div className="p-6 space-y-3">
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
