import { useState } from 'react'
import { FileText, Plus, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useDischargeSummaries, useCreateDischargeSummary } from '@/hooks/useDischargeSummaries'
import { useVisits, useVisit, useDischargeVisit } from '@/hooks/useVisits'
import { ApiError } from '@/lib/apiClient'
import type { DischargeSummary } from '@/types'

interface FormData {
  visitId: string
  dischargeDate: string
  finalDiagnosis: string
  finalTreatment: string
  followUpInstructions: string
  followUpDate: string
}

export default function DoctorDischarge() {
  const { user } = useAuth()
  const [showCreate, setShowCreate] = useState(false)
  const [viewId, setViewId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const { data: summariesData, isLoading } = useDischargeSummaries({ doctorId: user?.profileId, pageSize: 200 })
  const { data: ongoingVisits } = useVisits({ doctorId: user?.profileId, status: 'Ongoing', pageSize: 100 })
  const { data: viewSummary } = summariesData
    ? { data: summariesData.summaries.find(s => s.id === viewId) }
    : { data: undefined }
  const { data: viewVisit } = useVisit(viewSummary?.visitId)

  const dischargeVisit = useDischargeVisit()
  const createSummary = useCreateDischargeSummary()

  const summaries = summariesData?.summaries ?? []
  const visits = ongoingVisits?.visits ?? []

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: { dischargeDate: new Date().toISOString().slice(0, 10) },
  })
  const selectedVisitId = watch('visitId')
  const selectedVisit = visits.find(v => v.id === selectedVisitId)

  const onCreate = async (data: FormData) => {
    setFormError('')
    if (!data.visitId) {
      setFormError('Please select an ongoing visit.')
      return
    }
    try {
      await dischargeVisit.mutateAsync({
        id: data.visitId,
        dto: {
          dischargeDate: new Date(data.dischargeDate).toISOString(),
          finalDiagnosis: data.finalDiagnosis || null,
          finalTreatment: data.finalTreatment || null,
        },
      })
      await createSummary.mutateAsync({
        visitId: data.visitId,
        followUpInstructions: data.followUpInstructions,
        followUpDate: data.followUpDate || null,
      })
      setShowCreate(false)
      reset({ dischargeDate: new Date().toISOString().slice(0, 10) })
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to generate discharge summary.')
    }
  }

  const isSubmitting = dischargeVisit.isPending || createSummary.isPending

  return (
    <div>
      <PageHeader
        title="Discharge Summaries"
        description="Generate patient discharge summaries per visit"
        action={<Button onClick={() => { setShowCreate(true); setFormError('') }}><Plus className="h-4 w-4" /> New Summary</Button>}
      />
      <div className="p-6 space-y-4">
        {isLoading && <p className="text-sm text-gray-400">Loading discharge summaries…</p>}
        {!isLoading && summaries.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No discharge summaries yet</p>
            <Button variant="outline" className="mt-3" onClick={() => setShowCreate(true)}>Create First Summary</Button>
          </div>
        )}
        {summaries.map((s: DischargeSummary) => (
          <Card key={s.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setViewId(s.id)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{s.patientName}</p>
                    <p className="text-xs text-gray-500">Discharged: {s.dischargeDate || '—'}</p>
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
          <DialogHeader><DialogTitle>Discharge a Patient</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Ongoing Visit</Label>
              <Select onValueChange={v => setValue('visitId', v)}>
                <SelectTrigger><SelectValue placeholder="Select a patient's ongoing visit" /></SelectTrigger>
                <SelectContent>
                  {visits.map(v => <SelectItem key={v.id} value={v.id}>{v.patientName} — admitted {v.admissionDate}</SelectItem>)}
                </SelectContent>
              </Select>
              {visits.length === 0 && <p className="text-xs text-gray-400">You have no ongoing visits to discharge.</p>}
            </div>

            {selectedVisit && (
              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 space-y-1">
                <p><span className="text-gray-400">Current diagnosis:</span> {selectedVisit.diagnosis || '—'}</p>
                <p><span className="text-gray-400">Current treatment:</span> {selectedVisit.treatment || '—'}</p>
              </div>
            )}

            <div className="space-y-1.5"><Label>Discharge Date</Label><Input type="date" {...register('dischargeDate', { required: true })} /></div>
            <div className="space-y-1.5"><Label>Final Diagnosis (optional override)</Label><Textarea {...register('finalDiagnosis')} placeholder="Leave blank to keep the visit's existing diagnosis" /></div>
            <div className="space-y-1.5"><Label>Final Treatment (optional override)</Label><Textarea {...register('finalTreatment')} placeholder="Leave blank to keep the visit's existing treatment" /></div>
            <div className="space-y-1.5"><Label>Follow-up Instructions</Label><Textarea {...register('followUpInstructions')} placeholder="Post-discharge instructions..." /></div>
            <div className="space-y-1.5"><Label>Follow-up Date</Label><Input type="date" {...register('followUpDate')} /></div>

            {formError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {formError}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Generating…' : 'Generate Summary'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
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
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[['Admission', viewSummary.admissionDate], ['Discharge', viewSummary.dischargeDate]].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-gray-50 p-2">
                    <p className="text-xs text-gray-400">{k} Date</p>
                    <p className="font-medium text-gray-800">{v || '—'}</p>
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
              {viewVisit && (viewVisit.prescriptions?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">PRESCRIBED MEDICATIONS</p>
                  {(viewVisit.prescriptions ?? []).map((rx) => (
                    <div key={rx.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-800">{rx.medicationNames.join(', ') || '—'}</span>
                      <span className="text-gray-500 capitalize">{rx.status}</span>
                    </div>
                  ))}
                </div>
              )}
              {viewSummary.followUpInstructions && (
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                  <p className="text-xs font-semibold text-amber-700 mb-1">FOLLOW-UP INSTRUCTIONS</p>
                  <p className="text-sm text-amber-800">{viewSummary.followUpInstructions}</p>
                  {viewSummary.followUpDate && <p className="text-xs text-amber-700 mt-1">Follow-up Date: {viewSummary.followUpDate}</p>}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
