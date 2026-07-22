import { Pill } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { usePrescriptions } from '@/hooks/usePrescriptions'

export default function PatientPrescriptions() {
  const { user } = useAuth()
  const { data, isLoading } = usePrescriptions({ patientId: user?.profileId, pageSize: 200 })
  const myRx = data?.prescriptions ?? []

  return (
    <div>
      <PageHeader title="My Prescriptions" description="View all your prescriptions and medications" />
      <div className="p-6 space-y-4">
        {isLoading && <p className="text-sm text-gray-400">Loading prescriptions…</p>}
        {!isLoading && myRx.length === 0 && <p className="py-12 text-center text-sm text-gray-400">No prescriptions found</p>}
        {myRx.map(rx => (
          <Card key={rx.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                    <Pill className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{rx.doctorName}</p>
                    <p className="text-xs text-gray-400">{rx.date}</p>
                  </div>
                </div>
                <Badge variant={rx.status === 'active' ? 'success' : 'secondary'}>{rx.status}</Badge>
              </div>
              <div className="space-y-2">
                {rx.medications.map((m, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{m.name}</p>
                      <span className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-2 py-0.5">{m.dosage}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>Frequency: <span className="font-medium text-gray-700">{m.frequency}</span></span>
                      <span>Duration: <span className="font-medium text-gray-700">{m.duration}</span></span>
                    </div>
                    {m.instructions && <p className="text-xs text-gray-400 mt-1 italic">{m.instructions}</p>}
                  </div>
                ))}
              </div>
              {rx.notes && (
                <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
                  <p className="font-medium mb-0.5">Notes from doctor</p>
                  <p>{rx.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
