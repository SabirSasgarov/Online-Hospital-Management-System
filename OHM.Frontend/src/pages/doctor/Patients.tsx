import { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { usePatients, usePatient } from '@/hooks/usePatients'
import { useAppointments } from '@/hooks/useAppointments'

const statusVariant: Record<string, string> = { active: 'success', admitted: 'info', discharged: 'secondary' }

export default function DoctorPatients() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [viewId, setViewId] = useState<string | null>(null)
  const { data: view } = usePatient(viewId ?? undefined)

  const { data: apts } = useAppointments({ doctorId: user?.profileId, pageSize: 200 })
  const { data: allPatients, isLoading } = usePatients({ pageSize: 200 })

  const myPatientIds = new Set((apts?.appointments ?? []).map(a => a.patientId))
  const patients = (allPatients?.patients ?? []).filter(p => myPatientIds.has(p.id) && p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageHeader title="My Patients" description="Patients assigned to your care" />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search patients..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Badge variant="secondary">{patients.length} patients</Badge>
        </div>
        {isLoading && <p className="text-sm text-gray-400 mb-3">Loading patients…</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {patients.map(p => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.dateOfBirth}</p>
                  </div>
                  <Badge variant={statusVariant[p.status] as 'success' | 'info' | 'secondary'}>{p.status}</Badge>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between"><span>Blood Type</span><span className="font-medium text-gray-700">{p.bloodType}</span></div>
                  <div className="flex justify-between"><span>Gender</span><span className="font-medium text-gray-700 capitalize">{p.gender}</span></div>
                </div>
                {p.conditions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.conditions.map(c => <Badge key={c} variant="warning" className="text-xs">{c}</Badge>)}
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs" onClick={() => setViewId(p.id)}>
                  <Eye className="h-3 w-3 mr-1" /> View Full Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Patient Profile</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xl font-bold">
                  {view.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-lg font-semibold">{view.name}</p>
                  <p className="text-sm text-gray-500">{view.dateOfBirth}</p>
                  <Badge variant={statusVariant[view.status] as 'success' | 'info' | 'secondary'}>{view.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[['Gender', view.gender], ['Blood Type', view.bloodType], ['Phone', view.phone], ['Email', view.email]].map(([k, v]) => (
                  <div key={k} className="rounded bg-gray-50 p-2"><p className="text-xs text-gray-400">{k}</p><p className="font-medium capitalize">{v}</p></div>
                ))}
              </div>
              <div><p className="text-xs text-gray-400 mb-1">Address</p><p className="text-sm">{view.address || '—'}</p></div>
              <div><p className="text-xs text-gray-400 mb-1">Emergency Contact</p><p className="text-sm">{view.emergencyContact || '—'}</p></div>
              {view.conditions.length > 0 && (
                <div><p className="text-xs text-gray-400 mb-1">Conditions</p><div className="flex flex-wrap gap-1">{view.conditions.map(c => <Badge key={c} variant="warning">{c}</Badge>)}</div></div>
              )}
              {view.allergies.length > 0 && (
                <div><p className="text-xs text-gray-400 mb-1">Allergies</p><div className="flex flex-wrap gap-1">{view.allergies.map(a => <Badge key={a} variant="destructive">{a}</Badge>)}</div></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
