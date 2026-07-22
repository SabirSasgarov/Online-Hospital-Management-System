import { Users, UserCog, Calendar, BedDouble, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAdminDashboard } from '@/hooks/useDashboard'
import { useDoctors } from '@/hooks/useDoctors'
import { useAdmissionsAnalytics, useBedOccupancyAnalytics } from '@/hooks/useAnalytics'
import { apiAppointmentStatusToUi, toDateInput, toTimeInput } from '@/lib/adapters'

const appointmentStatusColor: Record<string, string> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'destructive',
  'no-show': 'warning',
}

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useAdminDashboard()
  const { data: availableDoctors } = useDoctors({ isAvailable: true, pageSize: 1 })
  const { data: admissions } = useAdmissionsAnalytics()
  const { data: occupancy } = useBedOccupancyAnalytics()

  if (isLoading || !dashboard) {
    return (
      <div>
        <PageHeader title="Admin Dashboard" description="Overview of hospital operations" />
        <div className="p-6 text-sm text-gray-400">Loading dashboard…</div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Patients', value: dashboard.totalPatients, icon: Users, color: 'bg-blue-500', sub: `${dashboard.ongoingVisits} currently admitted` },
    { label: 'Active Doctors', value: availableDoctors?.total ?? 0, icon: UserCog, color: 'bg-purple-500', sub: `${dashboard.totalDoctors} total` },
    { label: "Today's Appointments", value: dashboard.totalAppointmentsToday, icon: Calendar, color: 'bg-amber-500', sub: `${dashboard.appointmentsThisWeek} this week` },
    { label: 'Bed Occupancy', value: dashboard.totalBeds > 0 ? `${Math.round((dashboard.occupiedBeds / dashboard.totalBeds) * 100)}%` : '0%', icon: BedDouble, color: 'bg-teal-500', sub: `${dashboard.occupiedBeds}/${dashboard.totalBeds} beds` },
  ]

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Overview of hospital operations" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-400">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-blue-500" /> Admissions — Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={admissions?.admissionsByDay ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#bfdbfe" name="Admissions" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4 text-teal-500" /> Ward Occupancy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(occupancy?.byWard ?? []).map((ward) => {
                const pct = Math.round(ward.occupancyRate)
                return (
                  <div key={ward.wardName}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 truncate max-w-[120px]">{ward.wardName}</span>
                      <span className="font-medium text-gray-800">{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 80 ? 'bg-red-400' : pct >= 60 ? 'bg-amber-400' : 'bg-teal-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Appointments</CardTitle>
              <CardDescription>Latest scheduled and completed appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.recentAppointments.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No recent appointments</p>}
              {dashboard.recentAppointments.map((apt) => {
                const status = apiAppointmentStatusToUi[apt.status] ?? 'scheduled'
                return (
                  <div key={apt.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{apt.patientName}</p>
                      <p className="text-xs text-gray-500">{apt.doctorName} · {toDateInput(apt.scheduledAt)} {toTimeInput(apt.scheduledAt)}</p>
                    </div>
                    <Badge variant={appointmentStatusColor[status] as 'info' | 'success' | 'destructive' | 'warning'}>
                      {status}
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operational Snapshot</CardTitle>
              <CardDescription>Live counts across the facility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Ongoing Visits', value: dashboard.ongoingVisits, color: 'bg-blue-500' },
                { label: 'Pending Lab Results', value: dashboard.pendingLabResults, color: 'bg-amber-500' },
                { label: 'Available Beds', value: dashboard.availableBeds, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <div className="flex-1 flex justify-between">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{dashboard.totalPatients}</p>
                <p className="text-xs text-gray-500">Total Registered Patients</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
