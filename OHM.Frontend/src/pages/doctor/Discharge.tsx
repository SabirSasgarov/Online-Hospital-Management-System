import { useState } from 'react'
import { FileText, Download, Plus, X } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { mockPatients } from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'
import type { DischargeSummary } from '@/types'

interface FormData {
  patientId: string
  admissionDate: string
  dischargeDate: string
  diagnosis: string
  treatment: string
  followUpInstructions: string
  followUpDate: string
  medications: { name: string; dosage: string; frequency: string; duration: string; instructions: string }[]
}

export default function DoctorDischarge() {
  const { user } = useAuth()
  const [summaries, setSummaries] = useState<DischargeSummary[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [viewSummary, setViewSummary] = useState<DischargeSummary | null>(null)
  const { register, handleSubmit, reset, setValue, control } = useForm<FormData>({
    defaultValues: { medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'medications' })

  const onCreate = (data: FormData) => {
    const patient = mockPatients.find(p => p.id === data.patientId)
    const summary: DischargeSummary = {
      visitId: `V${Date.now()}`,
      patientId: data.patientId,
      patientName: patient?.name ?? '',
      doctorName: user?.name ?? '',
      admissionDate: data.admissionDate,
      dischargeDate: data.dischargeDate,
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      followUpInstructions: data.followUpInstructions,
      followUpDate: data.followUpDate,
      medications: data.medications,
    }
    setSummaries(s => [...s, summary])
    setShowCreate(false)
    reset()
  }

  return (
    <div>
      <PageHeader
        title="Discharge Summaries"
        description="Generate patient discharge summaries per visit"
        action={<Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> New Summary</Button>}
      />
      <div className="p-6 space-y-4">
        {summaries.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No discharge summaries yet</p>
            <Button variant="outline" className="mt-3" onClick={() => setShowCreate(true)}>Create First Summary</Button>
          </div>
        )}
        {summaries.map(s => (
          <Card key={s.visitId} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setViewSummary(s)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{s.patientName}</p>
                    <p className="text-xs text-gray-500">Discharged: {s.dischargeDate}</p>
                  </div>
                </div>
                <Badge variant="success">Discharged</Badge>
              </div>
              <p className="mt-2 text-xs text-gray-600 line-clamp-1">Diagnosis: {s.diagnosis}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Discharge Summary</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Patient</Label>
              <Select onValueChange={v => setValue('patientId', v)}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>{mockPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Admission Date</Label><Input type="date" {...register('admissionDate', { required: true })} /></div>
              <div className="space-y-1.5"><Label>Discharge Date</Label><Input type="date" {...register('dischargeDate', { required: true })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Diagnosis</Label><Textarea {...register('diagnosis', { required: true })} placeholder="Primary diagnosis..." /></div>
            <div className="space-y-1.5"><Label>Treatment Provided</Label><Textarea {...register('treatment', { required: true })} placeholder="Treatment and procedures..." /></div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Discharge Medications</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', instructions: '' })}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
              {fields.map((field, idx) => (
                <div key={field.id} className="mb-2 rounded-lg border border-gray-100 p-3">
                  <div className="flex justify-between mb-1">
                    <p className="text-xs text-gray-400">Medication {idx + 1}</p>
                    {idx > 0 && <button type="button" onClick={() => remove(idx)}><X className="h-3 w-3 text-red-400" /></button>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input {...register(`medications.${idx}.name`)} placeholder="Drug name" />
                    <Input {...register(`medications.${idx}.dosage`)} placeholder="Dosage" />
                    <Input {...register(`medications.${idx}.frequency`)} placeholder="Frequency" />
                    <Input {...register(`medications.${idx}.duration`)} placeholder="Duration" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5"><Label>Follow-up Instructions</Label><Textarea {...register('followUpInstructions')} placeholder="Post-discharge instructions..." /></div>
            <div className="space-y-1.5"><Label>Follow-up Date</Label><Input type="date" {...register('followUpDate')} /></div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit">Generate Summary</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewSummary} onOpenChange={() => setViewSummary(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Discharge Summary</DialogTitle>
          </DialogHeader>
          {viewSummary && (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-blue-900 text-lg">{viewSummary.patientName}</p>
                  <Badge variant="success">Discharged</Badge>
                </div>
                <p className="text-xs text-blue-700">Doctor: {viewSummary.doctorName}</p>
                <p className="text-xs text-blue-700">Visit ID: {viewSummary.visitId}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[['Admission', viewSummary.admissionDate], ['Discharge', viewSummary.dischargeDate]].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-gray-50 p-2">
                    <p className="text-xs text-gray-400">{k} Date</p>
                    <p className="font-medium text-gray-800">{v}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">DIAGNOSIS</p>
                <p className="text-sm text-gray-800">{viewSummary.diagnosis}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">TREATMENT</p>
                <p className="text-sm text-gray-800">{viewSummary.treatment}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">DISCHARGE MEDICATIONS</p>
                {viewSummary.medications.map((m, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-800">{m.name} {m.dosage}</span>
                    <span className="text-gray-500">{m.frequency} · {m.duration}</span>
                  </div>
                ))}
              </div>
              {viewSummary.followUpInstructions && (
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                  <p className="text-xs font-semibold text-amber-700 mb-1">FOLLOW-UP INSTRUCTIONS</p>
                  <p className="text-sm text-amber-800">{viewSummary.followUpInstructions}</p>
                  {viewSummary.followUpDate && <p className="text-xs text-amber-700 mt-1">Follow-up Date: {viewSummary.followUpDate}</p>}
                </div>
              )}
              <Button variant="outline" className="w-full"><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
