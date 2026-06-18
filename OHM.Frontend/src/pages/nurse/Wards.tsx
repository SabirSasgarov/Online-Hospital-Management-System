import { BedDouble } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockWards, mockRooms } from '@/lib/mockData'

export default function NurseWards() {
  return (
    <div>
      <PageHeader title="Wards & Beds" description="View bed availability across all wards" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockWards.map(ward => {
            const pct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100)
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
                  <div className="flex gap-1 flex-wrap pt-1">
                    {Array.from({ length: ward.totalBeds }).map((_, i) => (
                      <div key={i} className={`h-3 w-3 rounded-sm ${i < ward.occupiedBeds ? 'bg-blue-400' : 'bg-gray-200'}`} title={i < ward.occupiedBeds ? 'Occupied' : 'Available'} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Detailed Room View</h2>
          <div className="space-y-4">
            {mockRooms.map(room => (
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
                      <div key={bed.id} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${bed.status === 'available' ? 'border-green-200 bg-green-50' : bed.status === 'occupied' ? 'border-blue-200 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
                        <BedDouble className={`h-4 w-4 ${bed.status === 'available' ? 'text-green-500' : bed.status === 'occupied' ? 'text-blue-500' : 'text-gray-300'}`} />
                        <div>
                          <p className="font-semibold text-gray-700">{bed.number}</p>
                          {bed.patientName && <p className="text-gray-500">{bed.patientName}</p>}
                          {!bed.patientName && <p className={bed.status === 'available' ? 'text-green-600' : 'text-gray-400'}>{bed.status}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
