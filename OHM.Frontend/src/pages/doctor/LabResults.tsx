import { useState } from 'react'
import { Plus, TestTube } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockLabResults, mockPatients } from '@/lib/mockData'
import type { LabResult } from '@/types'

const statusVariant: Record<string, string> = { normal: 'success', abnormal: 'warning', critical: 'destructive' }

export default function LabResults() {
  const [results, setResults] = useState<LabResult[]>(mockLabResults)
  const [showAdd, setShowAdd] = useState(false)
  const { register, handleSubmit, reset, setValue } = useForm<Partial<LabResult>>()

  const onAdd = (data: Partial<LabResult>) => {
    const patient = mockPatients.find(p => p.id === data.patientId)
    const lab: LabResult = {
      id: `L${String(results.length + 1).padStart(3, '0')}`,
      patientId: data.patientId ?? '',
      patientName: patient?.name ?? '',
      visitId: `V${Date.now()}`,
      testName: data.testName ?? '',
      date: new Date().toISOString().split('T')[0],
      result: data.result ?? '',
      normalRange: data.normalRange ?? '',
      status: (data.status as LabResult['status']) ?? 'normal',
      notes: data.notes,
    }
    setResults(r => [...r, lab])
    setShowAdd(false)
    reset()
  }

  return (
    <div>
      <PageHeader
        title="Lab Results"
        description="Record and review laboratory test results"
        action={<Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4" /> Add Result</Button>}
      />
      <div className="p-6 space-y-3">
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
              <Label>Patient</Label>
              <Select onValueChange={v => setValue('patientId', v)}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>{mockPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Test Name</Label><Input {...register('testName', { required: true })} placeholder="e.g. HbA1c, CBC" /></div>
            <div className="grid grid-cols-2 gap-3">
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit">Add Result</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
