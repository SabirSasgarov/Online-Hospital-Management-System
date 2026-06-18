import { useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { mockPatients } from '@/lib/mockData'

const statusVariant: Record<string, string> = { active: 'success', admitted: 'info', discharged: 'secondary' }

export default function NursePatients() {
  const [search, setSearch] = useState('')
  const filtered = mockPatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.conditions.some(c => c.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <PageHeader title="Patients" description="Search and view patient information" />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by name, ID, or condition..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Badge variant="secondary">{filtered.length} results</Badge>
        </div>
        <div className="space-y-3">
          {filtered.map(p => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">DOB / Blood</p>
                      <p className="text-sm text-gray-700">{p.dateOfBirth} · {p.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Conditions</p>
                      <div className="flex flex-wrap gap-1">
                        {p.conditions.length === 0 ? <span className="text-xs text-gray-300">None</span> : p.conditions.map(c => <Badge key={c} variant="warning" className="text-xs">{c}</Badge>)}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {p.allergies.length > 0 && <Badge variant="destructive" className="text-xs">⚠ Allergy</Badge>}
                      <Badge variant={statusVariant[p.status] as 'success' | 'info' | 'secondary'}>{p.status}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
