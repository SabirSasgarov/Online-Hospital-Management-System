import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockAppointments } from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'
import type { Appointment } from '@/types'

const statusVariant: Record<string, string> = { scheduled: 'info', completed: 'success', cancelled: 'destructive', 'no-show': 'warning' }
const typeColor: Record<string, string> = { consultation: 'bg-blue-50 text-blue-700', 'follow-up': 'bg-purple-50 text-purple-700', emergency: 'bg-red-50 text-red-700', checkup: 'bg-green-50 text-green-700' }

export default function DoctorAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments.filter(a => a.doctorId === user?.id))

  const update = (id: string, status: Appointment['status']) => setAppointments(a => a.map(x => x.id === id ? { ...x, status } : x))

  const scheduled = appointments.filter(a => a.status === 'scheduled')
  const completed = appointments.filter(a => a.status === 'completed')
  const cancelled = appointments.filter(a => a.status !== 'scheduled' && a.status !== 'completed')

  const AptCard = ({ apt }: { apt: Appointment }) => (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50">
        <span className="text-xs font-bold text-blue-700">{new Date(apt.date).toLocaleDateString('en', { month: 'short' })}</span>
        <span className="text-lg font-bold text-blue-900 leading-none">{new Date(apt.date).getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">{apt.patientName}</p>
          <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${typeColor[apt.type]}`}>{apt.type}</span>
        </div>
        <p className="text-xs text-gray-500">{apt.time} {apt.notes && `· ${apt.notes}`}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={statusVariant[apt.status] as 'info' | 'success' | 'destructive' | 'warning'}>{apt.status}</Badge>
        {apt.status === 'scheduled' && (
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-7 w-7 text-green-500 hover:text-green-600" onClick={() => update(apt.id, 'completed')}><CheckCircle className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-500" onClick={() => update(apt.id, 'cancelled')}><XCircle className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="My Appointments" description="Your scheduled, completed, and cancelled appointments" />
      <div className="p-6">
        <Tabs defaultValue="scheduled">
          <TabsList className="mb-4">
            <TabsTrigger value="scheduled">Scheduled <span className="ml-1 rounded-full bg-blue-100 text-blue-700 text-xs px-1.5">{scheduled.length}</span></TabsTrigger>
            <TabsTrigger value="completed">Completed <span className="ml-1 rounded-full bg-green-100 text-green-700 text-xs px-1.5">{completed.length}</span></TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduled">
            <div className="space-y-2">
              {scheduled.length === 0 ? <p className="py-8 text-center text-sm text-gray-400">No scheduled appointments</p> : scheduled.map(a => <AptCard key={a.id} apt={a} />)}
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="space-y-2">
              {completed.length === 0 ? <p className="py-8 text-center text-sm text-gray-400">No completed appointments</p> : completed.map(a => <AptCard key={a.id} apt={a} />)}
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div className="space-y-2">
              {cancelled.length === 0 ? <p className="py-8 text-center text-sm text-gray-400">None</p> : cancelled.map(a => <AptCard key={a.id} apt={a} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
