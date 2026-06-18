import { Users, BedDouble, Calendar, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAuth } from '@/contexts/AuthContext'
import { mockPatients, mockWards, mockAppointments } from '@/lib/mockData'

export default function NurseDashboard() {
  const { user } = useAuth()
  const admitted = mockPatients.filter(p => p.status === 'admitted')

  const stats = [
    { label: 'Admitted Patients', value: admitted.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Available Beds', value: mockWards.reduce((a, w) => a + (w.totalBeds - w.occupiedBeds), 0), icon: BedDouble, color: 'bg-teal-500' },
    { label: "Today's Appointments", value: mockAppointments.filter(a => a.date === '2026-06-18').length, icon: Calendar, color: 'bg-amber-500' },
    { label: 'Critical Alerts', value: 2, icon: Activity, color: 'bg-red-500' },
  ]

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name}`} description="Ward overview and patient status" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}>
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Admitted Patients</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {admitted.map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.id} · {p.conditions.join(', ') || 'No conditions'}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.allergies.length > 0 && <Badge variant="destructive" className="text-xs">⚠ Allergy</Badge>}
                  <Badge variant="info">Admitted</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Ward Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {mockWards.map(ward => {
                const pct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100)
                return (
                  <div key={ward.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{ward.name}</span>
                      <span className="font-medium">{ward.occupiedBeds}/{ward.totalBeds}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className={`h-full rounded-full ${pct >= 80 ? 'bg-red-400' : pct >= 60 ? 'bg-amber-400' : 'bg-teal-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Upcoming Appointments</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {mockAppointments.filter(a => a.status === 'scheduled').slice(0, 4).map(apt => (
                <div key={apt.id} className="flex items-center gap-3 rounded-lg border border-gray-50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-xs font-semibold text-amber-700">{apt.time}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{apt.patientName}</p>
                    <p className="text-xs text-gray-500">{apt.doctorName}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
