import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { TestTube } from 'lucide-react'
import { mockLabResults } from '@/lib/mockData'

const statusVariant: Record<string, string> = { normal: 'success', abnormal: 'warning', critical: 'destructive' }

export default function NurseLabResults() {
  return (
    <div>
      <PageHeader title="Lab Results" description="View patient laboratory test results" />
      <div className="p-6 space-y-3">
        {mockLabResults.map(lab => (
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
