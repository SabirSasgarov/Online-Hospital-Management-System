import { useState } from 'react'
import { BedDouble } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  useWards, useAllRoomsWithBeds, useAssignPatientToBed, useReleaseBed, useUpdateBedStatus,
} from '@/hooks/useFacilities'
import { usePatients } from '@/hooks/usePatients'
import { BedStatusCode } from '@/lib/enumCodes'
import { ApiError } from '@/lib/apiClient'
import type { Bed } from '@/types'

export default function NurseWards() {
  const { data: wardsData, isLoading } = useWards({ pageSize: 200 })
  const { data: rooms = [] } = useAllRoomsWithBeds()
  const { data: patientsData } = usePatients({ pageSize: 200 })
  const wards = wardsData?.wards ?? []
  const patients = patientsData?.patients ?? []

  const [selectedBed, setSelectedBed] = useState<Bed | null>(null)
  const [assignPatientId, setAssignPatientId] = useState('')
  const [actionError, setActionError] = useState('')

  const assignBed = useAssignPatientToBed()
  const releaseBed = useReleaseBed()
  const updateStatus = useUpdateBedStatus()

  const closeDialog = () => {
    setSelectedBed(null)
    setAssignPatientId('')
    setActionError('')
  }

  const handleAssign = async () => {
    if (!selectedBed || !assignPatientId) return
    setActionError('')
    try {
      await assignBed.mutateAsync({ bedId: selectedBed.id, patientId: assignPatientId })
      closeDialog()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Could not assign patient to bed.')
    }
  }

  const handleRelease = async () => {
    if (!selectedBed) return
    setActionError('')
    try {
      await releaseBed.mutateAsync(selectedBed.id)
      closeDialog()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Could not release bed.')
    }
  }

  const handleMarkStatus = async (status: keyof typeof BedStatusCode) => {
    if (!selectedBed) return
    setActionError('')
    try {
      await updateStatus.mutateAsync({ bedId: selectedBed.id, dto: { status: BedStatusCode[status] } })
      closeDialog()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Could not update bed status.')
    }
  }

  const isBusy = assignBed.isPending || releaseBed.isPending || updateStatus.isPending

  return (
    <div>
      <PageHeader title="Wards & Beds" description="View bed availability and manage bed assignments" />
      <div className="p-6 space-y-6">
        {isLoading && <p className="text-sm text-gray-400">Loading wards…</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {wards.map(ward => {
            const pct = ward.totalBeds > 0 ? Math.round((ward.occupiedBeds / ward.totalBeds) * 100) : 0
            const available = ward.totalBeds - ward.occupiedBeds
            return (
              <Card key={ward.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{ward.name}</CardTitle>
                    <Badge variant={pct >= 90 ? 'destructive' : pct >= 70 ? 'warning' : 'success'}>{pct}%</Badge>
                  </div>
                  <p className="text-xs text-gray-400">{ward.type} · Floor {ward.floor}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-teal-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{ward.occupiedBeds} occupied</span>
                    <span className={`font-semibold ${available === 0 ? 'text-red-600' : 'text-teal-600'}`}>{available} available</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Detailed Room View</h2>
          <p className="text-xs text-gray-400 mb-3">Click a bed to assign a patient, release it, or change its status.</p>
          <div className="space-y-4">
            {rooms.map(room => (
              <Card key={room.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">Room {room.roomNumber} <span className="capitalize text-gray-400 font-normal">· {room.type}</span></CardTitle>
                      <p className="text-xs text-gray-400">{room.wardName}</p>
                    </div>
                    <Badge variant={room.beds.every(b => b.status === 'occupied') ? 'destructive' : room.beds.some(b => b.status === 'available') ? 'success' : 'warning'}>
                      {room.beds.filter(b => b.status === 'available').length} free
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {room.beds.map(bed => (
                      <button
                        key={bed.id}
                        onClick={() => setSelectedBed(bed)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs text-left transition-shadow hover:shadow-sm ${bed.status === 'available' ? 'border-green-200 bg-green-50' : bed.status === 'occupied' ? 'border-blue-200 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}
                      >
                        <BedDouble className={`h-4 w-4 ${bed.status === 'available' ? 'text-green-500' : bed.status === 'occupied' ? 'text-blue-500' : 'text-gray-300'}`} />
                        <div>
                          <p className="font-semibold text-gray-700">{bed.number}</p>
                          {bed.patientName && <p className="text-gray-500">{bed.patientName}</p>}
                          {!bed.patientName && <p className={bed.status === 'available' ? 'text-green-600' : 'text-gray-400'}>{bed.status}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedBed} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bed {selectedBed?.number}</DialogTitle></DialogHeader>
          {selectedBed && (
            <div className="space-y-4">
              <Badge variant={selectedBed.status === 'available' ? 'success' : selectedBed.status === 'occupied' ? 'info' : 'secondary'} className="capitalize">
                {selectedBed.status}
              </Badge>

              {selectedBed.status === 'occupied' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Currently assigned to <strong>{selectedBed.patientName ?? 'a patient'}</strong>.</p>
                  <Button variant="outline" disabled={isBusy} onClick={handleRelease}>Release Bed</Button>
                </div>
              )}

              {selectedBed.status === 'available' && (
                <div className="space-y-2">
                  <Select value={assignPatientId} onValueChange={setAssignPatientId}>
                    <SelectTrigger><SelectValue placeholder="Select a patient to admit" /></SelectTrigger>
                    <SelectContent>
                      {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button disabled={!assignPatientId || isBusy} onClick={handleAssign}>Assign Patient</Button>
                    <Button variant="outline" disabled={isBusy} onClick={() => handleMarkStatus('Maintenance')}>Mark Maintenance</Button>
                  </div>
                </div>
              )}

              {selectedBed.status === 'maintenance' && (
                <Button disabled={isBusy} onClick={() => handleMarkStatus('Available')}>Mark Available</Button>
              )}

              {actionError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{actionError}</div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
