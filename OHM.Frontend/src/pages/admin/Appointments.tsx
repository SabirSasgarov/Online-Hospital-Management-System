import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Search, AlertCircle, BellRing } from 'lucide-react'
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender, type ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppointments, useCreateAppointment, useChangeAppointmentStatus, type AppointmentFormInput } from '@/hooks/useAppointments'
import { usePatients } from '@/hooks/usePatients'
import { useDoctors } from '@/hooks/useDoctors'
import { useRunAppointmentReminders } from '@/hooks/useAppointmentReminders'
import { ApiError } from '@/lib/apiClient'
import type { Appointment } from '@/types'

const statusVariant: Record<string, string> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'destructive',
  'no-show': 'warning',
}

const typeVariant: Record<string, string> = {
  consultation: 'default',
  'follow-up': 'secondary',
  emergency: 'destructive',
  checkup: 'info',
}

interface FormValues {
  patientId: string
  doctorId: string
  date: string
  time: string
  type: Appointment['type']
  notes: string
}

export default function AdminAppointments() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [conflict, setConflict] = useState('')
  const [reminderNotice, setReminderNotice] = useState('')
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>()

  const { data, isLoading } = useAppointments({ pageSize: 200 })
  const { data: patientsData } = usePatients({ pageSize: 200 })
  const { data: doctorsData } = useDoctors({ pageSize: 200 })
  const createAppointment = useCreateAppointment()
  const changeStatus = useChangeAppointmentStatus()
  const runReminders = useRunAppointmentReminders()

  const appointments = data?.appointments ?? []
  const patients = patientsData?.patients ?? []
  const doctors = doctorsData?.doctors ?? []

  const columns: ColumnDef<Appointment>[] = [
    { accessorKey: 'patientName', header: 'Patient', cell: ({ row }) => <span className="font-medium">{row.original.patientName}</span> },
    { accessorKey: 'doctorName', header: 'Doctor' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'time', header: 'Time' },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant={typeVariant[row.original.type] as 'default' | 'secondary' | 'destructive' | 'info'}>{row.original.type}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusVariant[row.original.status] as 'info' | 'success' | 'destructive' | 'warning'}>{row.original.status}</Badge> },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.status === 'scheduled' && (
            <>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => changeStatus.mutate({ id: row.original.id, status: 'completed' })}>Complete</Button>
              <Button size="sm" variant="ghost" className="text-xs h-7 text-red-500" onClick={() => changeStatus.mutate({ id: row.original.id, status: 'cancelled' })}>Cancel</Button>
            </>
          )}
        </div>
      ),
    },
  ]

  const table = useReactTable({ data: appointments, columns, getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), state: { globalFilter }, onGlobalFilterChange: setGlobalFilter })

  const onAdd = async (data: FormValues) => {
    setConflict('')
    const input: AppointmentFormInput = {
      patientId: data.patientId,
      doctorId: data.doctorId,
      date: data.date,
      time: data.time,
      type: data.type ?? 'consultation',
      notes: data.notes,
    }
    try {
      await createAppointment.mutateAsync(input)
      setShowAdd(false)
      reset()
    } catch (err) {
      setConflict(err instanceof ApiError ? err.message : 'Failed to book appointment.')
    }
  }

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
        description="Book and manage appointments with conflict detection"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={sendReminders} disabled={runReminders.isPending}>
              <BellRing className="h-4 w-4" />
              {runReminders.isPending ? 'Sending…' : 'Send Reminders Now'}
            </Button>
            <Button onClick={() => { setShowAdd(true); setConflict('') }}><Plus className="h-4 w-4" /> Book Appointment</Button>
          </div>
        }
      />
      <div className="p-6">
        {reminderNotice && (
          <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700">{reminderNotice}</div>
        )}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search appointments..." className="pl-9" value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-y border-gray-100 bg-gray-50">
                  {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(h => (
                        <th key={h.id} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {flexRender(h.column.columnDef.header, h.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-gray-600">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading && <div className="py-12 text-center text-sm text-gray-400">Loading appointments…</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Book Appointment</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Patient</Label>
              <Select onValueChange={v => setValue('patientId', v)}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Doctor</Label>
              <Select onValueChange={v => setValue('doctorId', v)}>
                <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>{doctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialization}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" {...register('date', { required: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>Time</Label>
                <Input type="time" {...register('time', { required: true })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select onValueChange={v => setValue('type', v as Appointment['type'])}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="checkup">Checkup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Input {...register('notes')} placeholder="Additional notes..." />
            </div>
            {conflict && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                {conflict}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" disabled={createAppointment.isPending}>{createAppointment.isPending ? 'Booking…' : 'Book Appointment'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
