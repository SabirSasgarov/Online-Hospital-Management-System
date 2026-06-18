import { Activity, Heart, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockPatients, mockAppointments, mockPrescriptions, mockLabResults } from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'

export default function PatientMedicalHistory() {
  const { user } = useAuth()
  const me = mockPatients.find(p => p.id === user?.id)
  const myApts = mockAppointments.filter(a => a.patientId === user?.id && a.status === 'completed')
  const myRx = mockPrescriptions.filter(p => p.patientId === user?.id)
  const myLabs = mockLabResults.filter(l => l.patientId === user?.id)

  if (!me) return <div className="p-6 text-gray-400">No profile found.</div>

  return (
    <div>
      <PageHeader title="Medical History" description="Your complete medical record" />
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 text-xl font-bold">
                {me.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <CardTitle className="text-lg">{me.name}</CardTitle>
                <p className="text-sm text-gray-500">{me.id} · DOB: {me.dateOfBirth}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 capitalize">{me.gender}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-medium text-gray-700">Blood: {me.bloodType}</span>
                  <Badge variant={me.status === 'admitted' ? 'info' : 'success'}>{me.status}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2"><Heart className="h-4 w-4 text-red-400" /><p className="text-sm font-medium text-gray-700">Medical Conditions</p></div>
                {me.conditions.length === 0 ? <p className="text-sm text-gray-400">None recorded</p> : (
                  <div className="flex flex-wrap gap-1.5">
                    {me.conditions.map(c => <Badge key={c} variant="warning">{c}</Badge>)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-amber-400" /><p className="text-sm font-medium text-gray-700">Allergies</p></div>
                {me.allergies.length === 0 ? <p className="text-sm text-gray-400">None recorded</p> : (
                  <div className="flex flex-wrap gap-1.5">
                    {me.allergies.map(a => <Badge key={a} variant="destructive">⚠ {a}</Badge>)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-blue-500" /> Visit History</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {myApts.length === 0 ? <p className="text-sm text-gray-400">No past visits</p> : myApts.map(apt => (
                <div key={apt.id} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900">{apt.doctorName}</p>
                    <span className="text-xs text-gray-400">{apt.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 capitalize mt-1">{apt.type}</p>
                  {apt.notes && <p className="text-xs text-gray-400 mt-1 italic">{apt.notes}</p>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Prescription History</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {myRx.length === 0 ? <p className="text-sm text-gray-400">No prescriptions</p> : myRx.map(rx => (
                <div key={rx.id} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-gray-900 text-sm">{rx.doctorName}</p>
                    <Badge variant={rx.status === 'active' ? 'success' : 'secondary'} className="text-xs">{rx.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-400">{rx.date}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {rx.medications.map(m => <span key={m.name} className="text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">{m.name}</span>)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Lab Results</CardTitle></CardHeader>
          <CardContent>
            {myLabs.length === 0 ? <p className="text-sm text-gray-400">No lab results</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-2 font-medium">Test</th>
                    <th className="pb-2 font-medium">Result</th>
                    <th className="pb-2 font-medium">Normal Range</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {myLabs.map(lab => (
                      <tr key={lab.id}>
                        <td className="py-2 font-medium text-gray-800">{lab.testName}</td>
                        <td className="py-2 text-gray-700">{lab.result}</td>
                        <td className="py-2 text-gray-400">{lab.normalRange}</td>
                        <td className="py-2 text-gray-400">{lab.date}</td>
                        <td className="py-2"><Badge variant={lab.status === 'normal' ? 'success' : lab.status === 'critical' ? 'destructive' : 'warning'}>{lab.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
