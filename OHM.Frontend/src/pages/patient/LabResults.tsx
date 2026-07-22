import { useState } from 'react'
import { Search, TestTube } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useLabResults } from '@/hooks/useLabResults'

const statusVariant: Record<string, string> = { normal: 'success', abnormal: 'warning', critical: 'destructive' }

export default function PatientLabResults() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const { data, isLoading } = useLabResults({ patientId: user?.profileId, pageSize: 200 })
  const q = search.trim().toLowerCase()
  const myLabs = (data?.labResults ?? []).filter(lab =>
    !q || lab.testName.toLowerCase().includes(q) || lab.status.toLowerCase().includes(q)
  )

  return (
    <div>
      <PageHeader title="My Lab Results" description="View your laboratory test results" />
      <div className="p-6 space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by test or status..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {isLoading && <p className="text-sm text-gray-400">Loading lab results…</p>}
        {!isLoading && myLabs.length === 0 && <p className="py-12 text-center text-sm text-gray-400">No lab results found</p>}
        {myLabs.map(lab => (
          <Card key={lab.id} className={lab.status === 'critical' ? 'border-red-200' : lab.status === 'abnormal' ? 'border-amber-200' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${lab.status === 'critical' ? 'bg-red-100' : lab.status === 'abnormal' ? 'bg-amber-100' : 'bg-green-100'}`}>
                  <TestTube className={`h-5 w-5 ${lab.status === 'critical' ? 'text-red-600' : lab.status === 'abnormal' ? 'text-amber-600' : 'text-green-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{lab.testName}</p>
                  <p className="text-xs text-gray-400">{lab.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{lab.result}</p>
                  <p className="text-xs text-gray-400">Normal: {lab.normalRange}</p>
                  <Badge variant={statusVariant[lab.status] as 'success' | 'warning' | 'destructive'}>{lab.status}</Badge>
                </div>
              </div>
              {lab.notes && (
                <p className={`mt-2 text-xs rounded-lg p-2 ${lab.status === 'critical' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
                  {lab.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
