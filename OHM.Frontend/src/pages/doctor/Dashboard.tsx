import { Calendar, Users, Pill, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAuth } from '@/contexts/AuthContext'
import { mockAppointments, mockPatients, mockPrescriptions } from '@/lib/mockData'

const statusVariant: Record<string, string> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'destructive',
  'no-show': 'warning',
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const myAppointments = mockAppointments.filter(a => a.doctorId === user?.id)
  const todayApts = myAppointments.filter(a => a.date === '2026-06-18')
  const myPatients = mockPatients.filter(p => myAppointments.some(a => a.patientId === p.id))
  const myPrescriptions = mockPrescriptions.filter(p => p.doctorId === user?.id)

  const stats = [
    { label: "Today's Appointments", value: todayApts.length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'My Patients', value: myPatients.length, icon: Users, color: 'bg-purple-500' },
    { label: 'Active Prescriptions', value: myPrescriptions.filter(p => p.status === 'active').length, icon: Pill, color: 'bg-teal-500' },
    { label: 'Pending Follow-ups', value: myAppointments.filter(a => a.type === 'follow-up' && a.status === 'scheduled').length, icon: Clock, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name}`} description="Your daily schedule and patient overview" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today's Schedule</CardTitle>
              <CardDescription>{new Date('2026-06-18').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayApts.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">No appointments today</p>
              ) : todayApts.map(apt => (
                <div key={apt.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-700">
                    {apt.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{apt.patientName}</p>
                    <p className="text-xs text-gray-500 capitalize">{apt.type}</p>
                  </div>
                  <Badge variant={statusVariant[apt.status] as 'info' | 'success' | 'destructive' | 'warning'}>{apt.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Patients</CardTitle>
              <CardDescription>Patients from upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myPatients.slice(0, 5).map(patient => (
                <div key={patient.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                    <p className="text-xs text-gray-500 truncate">{patient.conditions.join(', ') || 'No conditions recorded'}</p>
                  </div>
                  <Badge variant={patient.status === 'admitted' ? 'info' : 'success'}>{patient.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
