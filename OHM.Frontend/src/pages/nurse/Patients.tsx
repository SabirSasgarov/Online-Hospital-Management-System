import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Search, BedDouble } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePatients } from '@/hooks/usePatients'
import { useDoctors } from '@/hooks/useDoctors'
import { useBeds } from '@/hooks/useFacilities'
import { useAdmitVisit } from '@/hooks/useVisits'
import { ApiError } from '@/lib/apiClient'
import type { Patient } from '@/types'

const statusVariant: Record<string, string> = { active: 'success', admitted: 'info', discharged: 'secondary' }

interface AdmitFormData {
  doctorId: string
  bedId: string
  admissionDate: string
  diagnosis: string
  treatment: string
}

export default function NursePatients() {
  const [search, setSearch] = useState('')
  const [admitPatient, setAdmitPatient] = useState<Patient | null>(null)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = usePatients({ pageSize: 200 })
  const { data: doctorsData } = useDoctors({ pageSize: 200 })
  const { data: bedsData } = useBeds({ status: 'Available', pageSize: 200 })
  const admitVisit = useAdmitVisit()

  const allPatients = data?.patients ?? []
  const doctors = doctorsData?.doctors ?? []
  const availableBeds = bedsData?.beds ?? []

  const q = search.trim().toLowerCase()
  const patients = q
    ? allPatients.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.conditions.some(c => c.toLowerCase().includes(q))
      )
    : allPatients

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<AdmitFormData>({
    defaultValues: { admissionDate: new Date().toISOString().slice(0, 10) },
  })
  const doctorId = watch('doctorId')
  const bedId = watch('bedId')

  const openAdmit = (patient: Patient) => {
    setAdmitPatient(patient)
    setFormError('')
    reset({ admissionDate: new Date().toISOString().slice(0, 10), doctorId: '', bedId: '', diagnosis: '', treatment: '' })
  }

  const onAdmit = async (formData: AdmitFormData) => {
    if (!admitPatient) return
    setFormError('')
    if (!formData.doctorId) {
      setFormError('Please select an attending doctor.')
      return
    }
    try {
      await admitVisit.mutateAsync({
        patientId: admitPatient.id,
        doctorId: formData.doctorId,
        bedId: formData.bedId || null,
        admissionDate: new Date(formData.admissionDate).toISOString(),
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
      })
      setAdmitPatient(null)
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not admit patient.')
    }
  }

  return (
    <div>
      <PageHeader title="Patients" description="Search patient information and admit patients to a bed" />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by name, ID, or condition..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Badge variant="secondary">{patients.length} results</Badge>
        </div>
        {isLoading && <p className="text-sm text-gray-400 mb-3">Searching…</p>}
        <div className="space-y-3">
          {patients.map(p => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">DOB / Blood</p>
                      <p className="text-sm text-gray-700">{p.dateOfBirth} · {p.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Conditions</p>
                      <div className="flex flex-wrap gap-1">
                        {p.conditions.length === 0 ? <span className="text-xs text-gray-300">None</span> : p.conditions.map(c => <Badge key={c} variant="warning" className="text-xs">{c}</Badge>)}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Badge variant={statusVariant[p.status] as 'success' | 'info' | 'secondary'}>{p.status}</Badge>
                      {p.status !== 'admitted' && (
                        <Button size="sm" variant="outline" onClick={() => openAdmit(p)}>
                          <BedDouble className="h-3.5 w-3.5" /> Admit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && patients.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No patients found</p>}
        </div>
      </div>

      <Dialog open={!!admitPatient} onOpenChange={(open) => !open && setAdmitPatient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Admit {admitPatient?.name}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onAdmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Attending Doctor</Label>
              <Select value={doctorId} onValueChange={(v) => setValue('doctorId', v)}>
                <SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger>
                <SelectContent>
                  {doctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialization}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Bed (optional)</Label>
              <Select value={bedId} onValueChange={(v) => setValue('bedId', v)}>
                <SelectTrigger><SelectValue placeholder="Assign a bed now, or leave unassigned" /></SelectTrigger>
                <SelectContent>
                  {availableBeds.map(b => <SelectItem key={b.id} value={b.id}>Bed {b.number}</SelectItem>)}
                </SelectContent>
              </Select>
              {availableBeds.length === 0 && <p className="text-xs text-gray-400">No beds currently available.</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Admission Date</Label>
              <Input type="date" {...register('admissionDate', { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Diagnosis</Label>
              <Textarea placeholder="Reason for admission" {...register('diagnosis', { required: 'Diagnosis is required' })} />
              {errors.diagnosis && <p className="text-xs text-red-500">{errors.diagnosis.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Initial Treatment Plan</Label>
              <Textarea placeholder="Treatment / care plan" {...register('treatment', { required: 'Treatment plan is required' })} />
              {errors.treatment && <p className="text-xs text-red-500">{errors.treatment.message}</p>}
            </div>

            {formError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{formError}</div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAdmitPatient(null)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || admitVisit.isPending}>
                {admitVisit.isPending ? 'Admitting…' : 'Admit Patient'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
