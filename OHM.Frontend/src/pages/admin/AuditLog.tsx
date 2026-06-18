import { useState } from 'react'
import { Search } from 'lucide-react'
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender, type ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { mockAuditLogs } from '@/lib/mockData'
import type { AuditLog } from '@/types'

const actionVariant: Record<string, string> = {
  CREATE: 'success',
  UPDATE: 'info',
  DELETE: 'destructive',
  READ: 'secondary',
}

const roleVariant: Record<string, string> = {
  admin: 'default',
  doctor: 'info',
  nurse: 'success',
  patient: 'secondary',
}

export default function AdminAuditLog() {
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<AuditLog>[] = [
    { accessorKey: 'timestamp', header: 'Time', cell: ({ row }) => <span className="text-xs text-gray-500">{new Date(row.original.timestamp).toLocaleString()}</span> },
    { accessorKey: 'userName', header: 'User', cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.userName}</span> },
    { accessorKey: 'userRole', header: 'Role', cell: ({ row }) => <Badge variant={roleVariant[row.original.userRole] as 'default' | 'info' | 'success' | 'secondary'}>{row.original.userRole}</Badge> },
    { accessorKey: 'action', header: 'Action', cell: ({ row }) => <Badge variant={actionVariant[row.original.action] as 'success' | 'info' | 'destructive' | 'secondary'}>{row.original.action}</Badge> },
    { accessorKey: 'resource', header: 'Resource', cell: ({ row }) => <span className="text-gray-700">{row.original.resource}</span> },
    { accessorKey: 'resourceId', header: 'Resource ID', cell: ({ row }) => <span className="font-mono text-xs text-gray-500">{row.original.resourceId}</span> },
    { accessorKey: 'ipAddress', header: 'IP Address', cell: ({ row }) => <span className="font-mono text-xs text-gray-400">{row.original.ipAddress}</span> },
  ]

  const table = useReactTable({ data: mockAuditLogs, columns, getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), state: { globalFilter }, onGlobalFilterChange: setGlobalFilter })

  return (
    <div>
      <PageHeader title="Audit Log" description="Track all system activities for compliance and security" />
      <div className="p-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Filter by user, action, resource..." className="pl-9" value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} />
              </div>
              <Badge variant="secondary">{mockAuditLogs.length} entries</Badge>
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
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
