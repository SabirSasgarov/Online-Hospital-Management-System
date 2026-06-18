import { Calendar, Pill, TestTube, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAuth } from '@/contexts/AuthContext'
import { mockAppointments, mockPrescriptions, mockLabResults, mockMessages } from '@/lib/mockData'

export default function PatientDashboard() {
  const { user } = useAuth()
  const myApts = mockAppointments.filter(a => a.patientId === user?.id)
  const myRx = mockPrescriptions.filter(p => p.patientId === user?.id)
  const myLabs = mockLabResults.filter(l => l.patientId === user?.id)
  const unreadMsgs = mockMessages.filter(m => m.receiverId === user?.id && !m.read)

  const upcoming = myApts.filter(a => a.status === 'scheduled')
  const activeRx = myRx.filter(r => r.status === 'active')
  const abnormal = myLabs.filter(l => l.status !== 'normal')

  const stats = [
    { label: 'Upcoming Appointments', value: upcoming.length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Active Prescriptions', value: activeRx.length, icon: Pill, color: 'bg-teal-500' },
    { label: 'Lab Results', value: myLabs.length, icon: TestTube, color: 'bg-purple-500' },
    { label: 'Unread Messages', value: unreadMsgs.length, icon: MessageSquare, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <PageHeader title={`Hello, ${user?.name}`} description="Your health overview and upcoming activities" />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Upcoming Appointments</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No upcoming appointments</p>
              ) : upcoming.map(apt => (
                <div key={apt.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50">
                    <span className="text-xs font-bold text-blue-600">{new Date(apt.date).toLocaleDateString('en', { month: 'short' })}</span>
                    <span className="text-base font-bold text-blue-900 leading-none">{new Date(apt.date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{apt.doctorName}</p>
                    <p className="text-xs text-gray-500">{apt.time} · {apt.type}</p>
                  </div>
                  <Badge variant="info">{apt.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Active Prescriptions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {activeRx.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No active prescriptions</p>
              ) : activeRx.map(rx => (
                <div key={rx.id} className="rounded-lg border border-teal-100 bg-teal-50 p-3">
                  <p className="font-medium text-teal-900">{rx.doctorName}</p>
                  <p className="text-xs text-teal-700 mb-2">{rx.date}</p>
                  <div className="flex flex-wrap gap-1">
                    {rx.medications.map(m => <span key={m.name} className="rounded-full bg-white border border-teal-200 px-2 py-0.5 text-xs text-teal-800">{m.name} {m.dosage}</span>)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {abnormal.length > 0 && (
            <Card className="lg:col-span-2 border-amber-200">
              <CardHeader><CardTitle className="text-base text-amber-700">⚠ Attention Required — Lab Results</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {abnormal.map(lab => (
                  <div key={lab.id} className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-100 p-3">
                    <div>
                      <p className="font-medium text-amber-900">{lab.testName}</p>
                      <p className="text-xs text-amber-700">{lab.date} · Normal: {lab.normalRange}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-900">{lab.result}</p>
                      <Badge variant={lab.status === 'critical' ? 'destructive' : 'warning'}>{lab.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
