import { useState } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockAppointments, mockDoctors } from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'
import type { Appointment } from '@/types'

const statusVariant: Record<string, string> = { scheduled: 'info', completed: 'success', cancelled: 'destructive', 'no-show': 'warning' }

export default function PatientAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments.filter(a => a.patientId === user?.id))
  const [showBook, setShowBook] = useState(false)
  const [conflict, setConflict] = useState('')
  const { register, handleSubmit, reset, setValue } = useForm<Partial<Appointment>>()

  const onBook = (data: Partial<Appointment>) => {
    const conflictExists = mockAppointments.some(a =>
      a.doctorId === data.doctorId && a.date === data.date && a.time === data.time && a.status === 'scheduled'
    )
    if (conflictExists) {
      const doctor = mockDoctors.find(d => d.id === data.doctorId)
      setConflict(`${doctor?.name} is not available at this time. Please choose another slot.`)
      return
    }
    const doctor = mockDoctors.find(d => d.id === data.doctorId)
    const apt: Appointment = {
      id: `A${Date.now()}`,
      patientId: user?.id ?? '',
      patientName: user?.name ?? '',
      doctorId: data.doctorId ?? '',
      doctorName: doctor?.name ?? '',
      date: data.date ?? '',
      time: data.time ?? '',
      type: (data.type as Appointment['type']) ?? 'consultation',
      status: 'scheduled',
    }
    setAppointments(a => [...a, apt])
    setShowBook(false)
    setConflict('')
    reset()
  }

  const upcoming = appointments.filter(a => a.status === 'scheduled')
  const past = appointments.filter(a => a.status !== 'scheduled')

  const AptCard = ({ apt }: { apt: Appointment }) => (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-green-50">
          <span className="text-xs font-bold text-green-600">{new Date(apt.date).toLocaleDateString('en', { month: 'short' })}</span>
          <span className="text-lg font-bold text-green-900 leading-none">{new Date(apt.date).getDate()}</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{apt.doctorName}</p>
          <p className="text-xs text-gray-500">{apt.time} · {apt.type}</p>
          {apt.notes && <p className="text-xs text-gray-400 mt-0.5">{apt.notes}</p>}
        </div>
        <Badge variant={statusVariant[apt.status] as 'info' | 'success' | 'destructive' | 'warning'}>{apt.status}</Badge>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <PageHeader
        title="My Appointments"
        description="View and book appointments"
        action={<Button onClick={() => { setShowBook(true); setConflict('') }}><Plus className="h-4 w-4" /> Book Appointment</Button>}
      />
      <div className="p-6">
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-3">
            {upcoming.length === 0 ? <p className="py-8 text-center text-sm text-gray-400">No upcoming appointments</p> : upcoming.map(a => <AptCard key={a.id} apt={a} />)}
          </TabsContent>
          <TabsContent value="past" className="space-y-3">
            {past.map(a => <AptCard key={a.id} apt={a} />)}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showBook} onOpenChange={setShowBook}>
        <DialogContent>
          <DialogHeader><DialogTitle>Book Appointment</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onBook)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Doctor</Label>
              <Select onValueChange={v => setValue('doctorId', v)}>
                <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>{mockDoctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialization}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" {...register('date', { required: true })} /></div>
              <div className="space-y-1.5"><Label>Time</Label><Input type="time" {...register('time', { required: true })} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Appointment Type</Label>
              <Select onValueChange={v => setValue('type', v as Appointment['type'])}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="checkup">Checkup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {conflict && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {conflict}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowBook(false)}>Cancel</Button>
              <Button type="submit">Book</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
