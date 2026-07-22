import { useState } from 'react'
import { Plus, Search, Star, Clock, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { useDoctors, useCreateDoctor, type DoctorFormInput } from '@/hooks/useDoctors'
import { ApiError } from '@/lib/apiClient'
import type { Doctor } from '@/types'

const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Surgery', 'Radiology', 'Oncology', 'Dermatology', 'Psychiatry', 'Internal Medicine']

interface FormValues {
  name: string
  specialization: string
  email: string
  password: string
  phone: string
}

export default function AdminDoctors() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null)
  const [formError, setFormError] = useState('')
  const { data, isLoading } = useDoctors({ pageSize: 200 })
  const createDoctor = useCreateDoctor()
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>()

  const doctors = data?.doctors ?? []
  const filtered = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase()))

  const onAdd = async (data: FormValues) => {
    setFormError('')
    const input: DoctorFormInput = {
      firstName: data.name.trim(),
      lastName: '-',
      email: data.email,
      password: data.password,
      specialization: data.specialization,
      phone: data.phone,
    }
    try {
      await createDoctor.mutateAsync(input)
      setShowAdd(false)
      reset()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to add doctor.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Doctor Management"
        description="Manage doctor profiles, schedules, and availability"
        action={<Button onClick={() => { setShowAdd(true); setFormError('') }}><Plus className="h-4 w-4" /> Add Doctor</Button>}
      />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by name or specialization..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Badge variant="secondary">{filtered.length} doctors</Badge>
        </div>

        {isLoading && <p className="text-sm text-gray-400">Loading doctors…</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedDoc(doc)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                      {doc.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.specialization}</p>
                    </div>
                  </div>
                  <Badge variant={doc.available ? 'success' : 'secondary'}>{doc.available ? 'Available' : 'Unavailable'}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{doc.rating}</span>
                  <span className="text-xs text-gray-400 ml-1">Rating</span>
                </div>
                <p className="text-xs text-gray-500">{doc.email}</p>
                <p className="text-xs text-gray-500">{doc.phone}</p>
                {doc.schedule.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {doc.schedule.map(s => (
                      <span key={s.day} className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                        <Clock className="h-3 w-3" /> {s.day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Doctor</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name (without Dr.)</Label>
              <Input {...register('name', { required: true })} placeholder="James Anderson" />
            </div>
            <div className="space-y-1.5">
              <Label>Specialization</Label>
              <Select onValueChange={v => setValue('specialization', v)}>
                <SelectTrigger><SelectValue placeholder="Select specialization" /></SelectTrigger>
                <SelectContent>{specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" {...register('email', { required: true })} placeholder="doctor@hospital.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Temporary Password</Label>
              <Input type="password" {...register('password', { required: true })} placeholder="Passw0rd!" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...register('phone')} placeholder="+1-555-0000" />
            </div>
            {formError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {formError}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" disabled={createDoctor.isPending}>{createDoctor.isPending ? 'Adding…' : 'Add Doctor'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Doctor Profile</DialogTitle></DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xl font-bold">
                  {selectedDoc.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{selectedDoc.name}</p>
                  <p className="text-sm text-gray-500">{selectedDoc.specialization}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{selectedDoc.rating}</span>
                    <Badge variant={selectedDoc.available ? 'success' : 'secondary'} className="ml-2">{selectedDoc.available ? 'Available' : 'Unavailable'}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-400">Email</p><p className="font-medium text-gray-800">{selectedDoc.email}</p></div>
                <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-400">Phone</p><p className="font-medium text-gray-800">{selectedDoc.phone}</p></div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Weekly Schedule</p>
                <div className="space-y-2">
                  {selectedDoc.schedule.length === 0 && <p className="text-xs text-gray-400">No schedule set</p>}
                  {selectedDoc.schedule.map(s => (
                    <div key={s.day} className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm">
                      <span className="font-medium text-blue-900">{s.day}</span>
                      <span className="text-blue-700">{s.startTime && s.endTime ? `${s.startTime} – ${s.endTime}` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
