import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Search, Eye, Trash2, AlertCircle } from 'lucide-react'
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender, type ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { usePatients, usePatient, useCreatePatient, useDeletePatient, type PatientFormInput } from '@/hooks/usePatients'
import { ApiError } from '@/lib/apiClient'
import type { Patient } from '@/types'

const statusVariant: Record<string, string> = {
  active: 'success',
  admitted: 'info',
  discharged: 'secondary',
}

interface FormValues {
  fullName: string
  email: string
  password: string
  dateOfBirth: string
  gender: Patient['gender']
  bloodType: string
  phone: string
  address: string
  emergencyContactName: string
  emergencyContactPhone: string
  conditions: string
  allergies: string
}

export default function AdminPatients() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [viewPatientId, setViewPatientId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = usePatients({ pageSize: 200 })
  const { data: viewPatient } = usePatient(viewPatientId ?? undefined)
  const createPatient = useCreatePatient()
  const deletePatient = useDeletePatient()

  const patients = data?.patients ?? []
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>()

  const columns: ColumnDef<Patient>[] = [
    { accessorKey: 'name', header: 'Name', cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span> },
    { accessorKey: 'gender', header: 'Gender', cell: ({ row }) => <span className="capitalize">{row.original.gender}</span> },
    { accessorKey: 'bloodType', header: 'Blood Type', size: 100 },
    { accessorKey: 'phone', header: 'Phone' },
    {
      accessorKey: 'conditions',
      header: 'Conditions',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.conditions.length === 0
            ? <span className="text-gray-400 text-xs">None</span>
            : row.original.conditions.slice(0, 2).map(c => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)
          }
          {row.original.conditions.length > 2 && <Badge variant="outline">+{row.original.conditions.length - 2}</Badge>}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge variant={statusVariant[row.original.status] as 'success' | 'info' | 'secondary'}>{row.original.status}</Badge>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setViewPatientId(row.original.id)}><Eye className="h-4 w-4" /></Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { if (confirm(`Remove ${row.original.name}?`)) deletePatient.mutate(row.original.id) }}
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({ data: patients, columns, getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), state: { globalFilter }, onGlobalFilterChange: setGlobalFilter })

  const onAdd = async (data: FormValues) => {
    setFormError('')
    const [firstName, ...rest] = data.fullName.trim().split(' ')
    const input: PatientFormInput = {
      firstName: firstName || data.fullName,
      lastName: rest.join(' ') || '-',
      email: data.email,
      password: data.password,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodType: data.bloodType,
      phone: data.phone,
      address: data.address,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      conditions: data.conditions ? data.conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
      allergies: data.allergies ? data.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
    }
    try {
      await createPatient.mutateAsync(input)
      setShowAdd(false)
      reset()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to register patient.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Patient Management"
        description="Register and manage patient profiles"
        action={<Button onClick={() => { setShowAdd(true); setFormError('') }}><Plus className="h-4 w-4" /> Add Patient</Button>}
      />
      <div className="p-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name, ID, condition..." className="pl-9" value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} />
              </div>
              <Badge variant="secondary">{patients.length} patients</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-y border-gray-100 bg-gray-50">
                  {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(h => (
                        <th key={h.id} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {flexRender(h.column.columnDef.header, h.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-gray-600">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {!isLoading && table.getRowModel().rows.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-400">No patients found</div>
              )}
              {isLoading && <div className="py-12 text-center text-sm text-gray-400">Loading patients…</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Register New Patient</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input {...register('fullName', { required: true })} placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <Label>Date of Birth</Label>
                <Input type="date" {...register('dateOfBirth', { required: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Select onValueChange={v => setValue('gender', v as Patient['gender'])}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Blood Type</Label>
                <Select onValueChange={v => setValue('bloodType', v)}>
                  <SelectTrigger><SelectValue placeholder="Select blood type" /></SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input {...register('phone', { required: true })} placeholder="+1-555-0000" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" {...register('email', { required: true })} placeholder="patient@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Temporary Password</Label>
                <Input type="password" {...register('password', { required: true })} placeholder="Passw0rd!" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Address</Label>
                <Input {...register('address')} placeholder="123 Main St, City" />
              </div>
              <div className="space-y-1.5">
                <Label>Emergency Contact Name</Label>
                <Input {...register('emergencyContactName')} placeholder="Jane Doe" />
              </div>
              <div className="space-y-1.5">
                <Label>Emergency Contact Phone</Label>
                <Input {...register('emergencyContactPhone')} placeholder="+1-555-0000" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Conditions (comma-separated, optional)</Label>
                <Input {...register('conditions')} placeholder="Hypertension, Diabetes Type 2" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Allergies (comma-separated, optional)</Label>
                <Input {...register('allergies')} placeholder="Penicillin" />
              </div>
            </div>
            {formError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {formError}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" disabled={createPatient.isPending}>{createPatient.isPending ? 'Registering…' : 'Register Patient'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewPatientId} onOpenChange={() => setViewPatientId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Patient Profile</DialogTitle></DialogHeader>
          {viewPatient && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xl font-bold">
                  {viewPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{viewPatient.name}</p>
                  <p className="text-sm text-gray-500">DOB: {viewPatient.dateOfBirth}</p>
                  <Badge variant={statusVariant[viewPatient.status] as 'success' | 'info' | 'secondary'}>{viewPatient.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Gender', viewPatient.gender], ['Blood Type', viewPatient.bloodType],
                  ['Phone', viewPatient.phone], ['Email', viewPatient.email],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p className="font-medium text-gray-800 capitalize">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Address</p>
                <p className="text-sm text-gray-700">{viewPatient.address || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Emergency Contact</p>
                <p className="text-sm text-gray-700">{viewPatient.emergencyContact || '—'}</p>
              </div>
              {viewPatient.conditions.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Medical Conditions</p>
                  <div className="flex flex-wrap gap-1.5">{viewPatient.conditions.map(c => <Badge key={c} variant="warning">{c}</Badge>)}</div>
                </div>
              )}
              {viewPatient.allergies.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Allergies</p>
                  <div className="flex flex-wrap gap-1.5">{viewPatient.allergies.map(a => <Badge key={a} variant="destructive">{a}</Badge>)}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
