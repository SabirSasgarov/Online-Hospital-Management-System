import { useState } from 'react'
import { Plus, Pill, X, AlertCircle } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { usePrescriptions, useCreatePrescription } from '@/hooks/usePrescriptions'
import { useVisits } from '@/hooks/useVisits'
import { ApiError } from '@/lib/apiClient'
import type { Prescription } from '@/types'

interface FormData {
  visitId: string
  notes: string
  medications: { name: string; dosage: string; frequency: string; duration: string; instructions: string }[]
}

const statusVariant: Record<string, string> = { active: 'success', completed: 'secondary', cancelled: 'destructive' }

export default function DoctorPrescriptions() {
  const { user } = useAuth()
  const [showAdd, setShowAdd] = useState(false)
  const [view, setView] = useState<Prescription | null>(null)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = usePrescriptions({ doctorId: user?.profileId, pageSize: 200 })
  const { data: visitsData } = useVisits({ doctorId: user?.profileId, status: 'Ongoing', pageSize: 100 })
  const createPrescription = useCreatePrescription()

  const prescriptions = data?.prescriptions ?? []
  const visits = visitsData?.visits ?? []

  const { register, handleSubmit, reset, setValue, control } = useForm<FormData>({
    defaultValues: { medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'medications' })

  const onAdd = async (data: FormData) => {
    setFormError('')
    const visit = visits.find(v => v.id === data.visitId)
    if (!visit || !user?.profileId) {
      setFormError('Please select a visit.')
      return
    }
    try {
      await createPrescription.mutateAsync({
        visitId: visit.id,
        patientId: visit.patientId,
        doctorId: user.profileId,
        notes: data.notes,
        medications: data.medications,
      })
      setShowAdd(false)
      reset()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to issue prescription.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description="Manage prescriptions linked to patient visits"
        action={<Button onClick={() => { setShowAdd(true); setFormError('') }}><Plus className="h-4 w-4" /> New Prescription</Button>}
      />
      <div className="p-6 space-y-4">
        {isLoading && <p className="text-sm text-gray-400">Loading prescriptions…</p>}
        {!isLoading && prescriptions.length === 0 && <p className="py-12 text-center text-sm text-gray-400">No prescriptions yet</p>}
        {prescriptions.map(pr => (
          <Card key={pr.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setView(pr)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                    <Pill className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{pr.patientName}</p>
                    <p className="text-xs text-gray-500">{pr.date} · {pr.medications.length} medication(s)</p>
                  </div>
                </div>
                <Badge variant={statusVariant[pr.status] as 'success' | 'secondary' | 'destructive'}>{pr.status}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {pr.medications.map(m => (
                  <span key={m.name} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">{m.name} {m.dosage}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Prescription</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onAdd)} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Patient Visit</Label>
              <Select onValueChange={v => setValue('visitId', v)}>
                <SelectTrigger><SelectValue placeholder="Select an ongoing visit" /></SelectTrigger>
                <SelectContent>
                  {visits.map(v => <SelectItem key={v.id} value={v.id}>{v.patientName} — {v.diagnosis || 'No diagnosis yet'} ({v.admissionDate})</SelectItem>)}
                </SelectContent>
              </Select>
              {visits.length === 0 && <p className="text-xs text-gray-400">You have no ongoing visits to prescribe against.</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Medications</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', instructions: '' })}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {fields.map((field, idx) => (
                  <div key={field.id} className="rounded-lg border border-gray-200 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-500">Medication {idx + 1}</p>
                      {idx > 0 && <button type="button" onClick={() => remove(idx)}><X className="h-4 w-4 text-red-400" /></button>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input {...register(`medications.${idx}.name`)} placeholder="Drug name" />
                      <Input {...register(`medications.${idx}.dosage`)} placeholder="Dosage (e.g. 10mg)" />
                      <Input {...register(`medications.${idx}.frequency`)} placeholder="Frequency" />
                      <Input {...register(`medications.${idx}.duration`)} placeholder="Duration (e.g. 30 days)" />
                      <Input className="col-span-2" {...register(`medications.${idx}.instructions`)} placeholder="Instructions (optional)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea {...register('notes')} placeholder="Additional notes for the patient..." />
            </div>

            {formError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {formError}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" disabled={createPrescription.isPending}>{createPrescription.isPending ? 'Issuing…' : 'Issue Prescription'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={() => setView(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Prescription Details</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[['Patient', view.patientName], ['Doctor', view.doctorName], ['Date', view.date], ['Status', view.status]].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-gray-50 p-2">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p className="font-medium text-gray-800 capitalize">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Medications</p>
                <div className="space-y-2">
                  {view.medications.map((m, i) => (
                    <div key={i} className="rounded-lg border border-teal-100 bg-teal-50 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-teal-900">{m.name}</span>
                        <span className="text-xs text-teal-700">{m.dosage}</span>
                      </div>
                      <p className="text-xs text-teal-700">{m.frequency} · {m.duration}</p>
                      {m.instructions && <p className="text-xs text-teal-600 mt-1 italic">{m.instructions}</p>}
                    </div>
                  ))}
                </div>
              </div>
              {view.notes && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 rounded-lg bg-gray-50 p-3">{view.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
