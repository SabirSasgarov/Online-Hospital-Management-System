import { useState } from 'react'
import { Plus, TestTube, AlertCircle, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useLabResults, useCreateLabResult } from '@/hooks/useLabResults'
import { useVisits } from '@/hooks/useVisits'
import { ApiError } from '@/lib/apiClient'
import type { LabResult } from '@/types'

const statusVariant: Record<string, string> = { normal: 'success', abnormal: 'warning', critical: 'destructive' }

interface FormValues {
  visitId: string
  testName: string
  result: string
  normalRange: string
  status: LabResult['status']
  notes: string
}

export default function LabResults() {
  const { user } = useAuth()
  const [showAdd, setShowAdd] = useState(false)
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const { data, isLoading } = useLabResults({ pageSize: 200 })
  const { data: visitsData } = useVisits({ doctorId: user?.profileId, status: 'Ongoing', pageSize: 100 })
  const createLabResult = useCreateLabResult()

  const q = search.trim().toLowerCase()
  const results = (data?.labResults ?? []).filter(lab =>
    !q || lab.testName.toLowerCase().includes(q) || lab.patientName.toLowerCase().includes(q) || lab.status.toLowerCase().includes(q)
  )
  const visits = visitsData?.visits ?? []

  const { register, handleSubmit, reset, setValue } = useForm<FormValues>()

  const onAdd = async (data: FormValues) => {
    setFormError('')
    const visit = visits.find(v => v.id === data.visitId)
    if (!visit || !user?.id) {
      setFormError('Please select a visit.')
      return
    }
    try {
      await createLabResult.mutateAsync({
        visitId: visit.id,
        patientId: visit.patientId,
        orderedById: user.id,
        testName: data.testName,
        result: data.result,
        normalRange: data.normalRange,
        status: data.status ?? 'normal',
        notes: data.notes,
      })
      setShowAdd(false)
      reset()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to add lab result.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Lab Results"
        description="Record and review laboratory test results"
        action={<Button onClick={() => { setShowAdd(true); setFormError('') }}><Plus className="h-4 w-4" /> Add Result</Button>}
      />
      <div className="p-6 space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by test, patient, or status..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {isLoading && <p className="text-sm text-gray-400">Loading lab results…</p>}
        {!isLoading && results.length === 0 && <p className="py-12 text-center text-sm text-gray-400">No lab results yet</p>}
        {results.map(lab => (
          <Card key={lab.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${lab.status === 'critical' ? 'bg-red-100' : lab.status === 'abnormal' ? 'bg-amber-100' : 'bg-green-100'}`}>
                    <TestTube className={`h-5 w-5 ${lab.status === 'critical' ? 'text-red-600' : lab.status === 'abnormal' ? 'text-amber-600' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{lab.testName}</p>
                    <p className="text-xs text-gray-500">{lab.patientName} · {lab.date}</p>
                  </div>
                </div>
                <Badge variant={statusVariant[lab.status] as 'success' | 'warning' | 'destructive'}>{lab.status}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-gray-50 p-2">
                  <p className="text-gray-400">Result</p>
                  <p className="font-semibold text-gray-800">{lab.result}</p>
                </div>
                <div className="rounded bg-gray-50 p-2">
                  <p className="text-gray-400">Normal Range</p>
                  <p className="font-semibold text-gray-800">{lab.normalRange}</p>
                </div>
              </div>
              {lab.notes && <p className="mt-2 text-xs text-gray-500 italic">{lab.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Lab Result</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Patient Visit</Label>
              <Select onValueChange={v => setValue('visitId', v)}>
                <SelectTrigger><SelectValue placeholder="Select an ongoing visit" /></SelectTrigger>
                <SelectContent>
                  {visits.map(v => <SelectItem key={v.id} value={v.id}>{v.patientName} — {v.diagnosis || 'No diagnosis yet'} ({v.admissionDate})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Test Name</Label><Input {...register('testName', { required: true })} placeholder="e.g. HbA1c, CBC" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Result</Label><Input {...register('result', { required: true })} placeholder="7.2%" /></div>
              <div className="space-y-1.5"><Label>Normal Range</Label><Input {...register('normalRange')} placeholder="<5.7%" /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select onValueChange={v => setValue('status', v as LabResult['status'])}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="abnormal">Abnormal</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Notes (optional)</Label><Input {...register('notes')} placeholder="Additional notes..." /></div>
            {formError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {formError}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" disabled={createLabResult.isPending}>{createLabResult.isPending ? 'Adding…' : 'Add Result'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
