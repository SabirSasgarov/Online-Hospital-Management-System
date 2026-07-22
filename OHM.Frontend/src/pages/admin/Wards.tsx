import { useState } from 'react'
import { BedDouble, Plus, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useForm } from 'react-hook-form'
import { useWards, useCreateWard } from '@/hooks/useFacilities'
import { useAllRoomsWithBeds } from '@/hooks/useFacilities'
import { ApiError } from '@/lib/apiClient'

interface FormValues {
  name: string
  type: string
  floor: string
}

export default function AdminWards() {
  const [showAdd, setShowAdd] = useState(false)
  const [formError, setFormError] = useState('')
  const { data: wardsData, isLoading } = useWards({ pageSize: 200 })
  const { data: rooms = [] } = useAllRoomsWithBeds()
  const createWard = useCreateWard()
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>()

  const wards = wardsData?.wards ?? []

  const onAdd = async (data: FormValues) => {
    setFormError('')
    try {
      await createWard.mutateAsync({ name: data.name, type: data.type, floor: Number(data.floor) || 1 })
      setShowAdd(false)
      reset()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to create ward.')
    }
  }

  const totalBeds = wards.reduce((a, w) => a + w.totalBeds, 0)
  const occupiedBeds = wards.reduce((a, w) => a + w.occupiedBeds, 0)

  return (
    <div>
      <PageHeader
        title="Wards & Bed Management"
        description="Monitor and manage hospital wards, rooms, and bed availability"
        action={<Button onClick={() => { setShowAdd(true); setFormError('') }}><Plus className="h-4 w-4" /> Add Ward</Button>}
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Beds', value: totalBeds, color: 'bg-blue-500' },
            { label: 'Occupied', value: occupiedBeds, color: 'bg-amber-500' },
            { label: 'Available', value: totalBeds - occupiedBeds, color: 'bg-green-500' },
          ].map(item => (
            <Card key={item.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg ${item.color} flex items-center justify-center`}>
                  <BedDouble className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-sm text-gray-500">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading && <p className="text-sm text-gray-400">Loading wards…</p>}

        <Tabs defaultValue="wards">
          <TabsList>
            <TabsTrigger value="wards">Wards</TabsTrigger>
            <TabsTrigger value="rooms">Rooms & Beds</TabsTrigger>
          </TabsList>

          <TabsContent value="wards">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {wards.map(ward => {
                const pct = ward.totalBeds > 0 ? Math.round((ward.occupiedBeds / ward.totalBeds) * 100) : 0
                return (
                  <Card key={ward.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{ward.name}</CardTitle>
                      </div>
                      <p className="text-xs text-gray-500">{ward.type} · Floor {ward.floor}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Occupancy</span>
                        <span className="font-semibold">{ward.occupiedBeds}/{ward.totalBeds}</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-teal-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant={pct >= 90 ? 'destructive' : pct >= 70 ? 'warning' : 'success'}>
                          {pct}% occupied
                        </Badge>
                        <span className="text-xs text-gray-400">{ward.totalBeds - ward.occupiedBeds} available</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="rooms">
            <div className="space-y-4">
              {rooms.map(room => (
                <Card key={room.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Room {room.roomNumber}</CardTitle>
                        <p className="text-xs text-gray-500">{room.wardName} · {room.type}</p>
                      </div>
                      <Badge variant={room.beds.every(b => b.status === 'available') ? 'success' : room.beds.some(b => b.status === 'available') ? 'warning' : 'destructive'}>
                        {room.beds.filter(b => b.status === 'available').length} available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {room.beds.map(bed => (
                        <div
                          key={bed.id}
                          className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 min-w-[100px] text-center ${
                            bed.status === 'available' ? 'border-green-200 bg-green-50' :
                            bed.status === 'occupied' ? 'border-blue-200 bg-blue-50' :
                            'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <BedDouble className={`h-5 w-5 ${bed.status === 'available' ? 'text-green-500' : bed.status === 'occupied' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <p className="text-xs font-semibold text-gray-800">Bed {bed.number}</p>
                          {bed.patientName && <p className="text-xs text-gray-500 truncate max-w-[90px]">{bed.patientName}</p>}
                          <Badge variant={bed.status === 'available' ? 'success' : bed.status === 'occupied' ? 'info' : 'secondary'} className="text-xs">
                            {bed.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Ward</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
            <div className="space-y-1.5"><Label>Ward Name</Label><Input {...register('name', { required: true })} placeholder="Cardiology Ward" /></div>
            <div className="space-y-1.5">
              <Label>Ward Type</Label>
              <Select onValueChange={v => setValue('type', v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {['General', 'Cardiology', 'Neurology', 'Pediatrics', 'ICU', 'Orthopedics', 'Oncology'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Floor</Label><Input type="number" min="1" {...register('floor', { required: true })} /></div>
            </div>
            <p className="text-xs text-gray-400">Rooms and beds are added separately once the ward exists.</p>
            {formError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {formError}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" disabled={createWard.isPending}>{createWard.isPending ? 'Adding…' : 'Add Ward'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
