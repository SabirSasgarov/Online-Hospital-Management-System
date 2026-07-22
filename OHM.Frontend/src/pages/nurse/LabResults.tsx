import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, TestTube } from 'lucide-react'
import { useLabResults } from '@/hooks/useLabResults'

const statusVariant: Record<string, string> = { normal: 'success', abnormal: 'warning', critical: 'destructive' }

export default function NurseLabResults() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useLabResults({ pageSize: 200 })
  const q = search.trim().toLowerCase()
  const results = (data?.labResults ?? []).filter(lab =>
    !q || lab.testName.toLowerCase().includes(q) || lab.patientName.toLowerCase().includes(q) || lab.status.toLowerCase().includes(q)
  )

  return (
    <div>
      <PageHeader title="Lab Results" description="View patient laboratory test results" />
      <div className="p-6 space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by test, patient, or status..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {isLoading && <p className="text-sm text-gray-400">Loading lab results…</p>}
        {!isLoading && results.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No lab results found</p>}
        {results.map(lab => (
          <Card key={lab.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${lab.status === 'critical' ? 'bg-red-100' : lab.status === 'abnormal' ? 'bg-amber-100' : 'bg-green-100'}`}>
                <TestTube className={`h-5 w-5 ${lab.status === 'critical' ? 'text-red-600' : lab.status === 'abnormal' ? 'text-amber-600' : 'text-green-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{lab.testName}</p>
                <p className="text-xs text-gray-500">{lab.patientName} · {lab.date}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-gray-800">{lab.result}</p>
                <p className="text-xs text-gray-400">Normal: {lab.normalRange}</p>
              </div>
              <Badge variant={statusVariant[lab.status] as 'success' | 'warning' | 'destructive'}>{lab.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
