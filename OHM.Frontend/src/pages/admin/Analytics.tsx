import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useAdmissionsAnalytics, useAppointmentsAnalytics, useBedOccupancyAnalytics, usePatientConditionsAnalytics } from '@/hooks/useAnalytics'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']

export default function AdminAnalytics() {
  const { data: admissions, isLoading: loadingAdmissions } = useAdmissionsAnalytics()
  const { data: occupancy, isLoading: loadingOccupancy } = useBedOccupancyAnalytics()
  const { data: appointments, isLoading: loadingAppointments } = useAppointmentsAnalytics()
  const { data: conditions, isLoading: loadingConditions } = usePatientConditionsAnalytics(6)
  const isLoading = loadingAdmissions || loadingOccupancy || loadingAppointments || loadingConditions

  const appointmentsByStatus = appointments
    ? [
        { status: 'Scheduled', count: appointments.scheduled },
        { status: 'Completed', count: appointments.completed },
        { status: 'Cancelled', count: appointments.cancelled },
        { status: 'No-show', count: appointments.noShow },
      ]
    : []

  return (
    <div>
      <PageHeader title="Analytics & Reports" description="Hospital performance metrics and operational insights" />
      <div className="p-6 space-y-6">
        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><CardContent className="p-4"><div className="h-6 w-16 bg-gray-100 rounded animate-pulse mb-2" /><div className="h-3 w-24 bg-gray-100 rounded animate-pulse" /></CardContent></Card>
            ))}
          </div>
        )}
        {admissions && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Admissions (30d)', value: admissions.totalAdmissions },
              { label: 'Total Discharges (30d)', value: admissions.totalDischarges },
              { label: 'Currently Admitted', value: admissions.currentlyAdmitted },
              { label: 'Avg. Length of Stay', value: `${admissions.averageLengthOfStayDays.toFixed(1)}d` },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admissions — Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={admissions?.admissionsByDay ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#bfdbfe" name="Admissions" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bed Occupancy by Ward (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={occupancy?.byWard ?? []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                  <YAxis type="category" dataKey="wardName" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip formatter={(v) => `${Math.round(Number(v ?? 0))}%`} />
                  <Bar dataKey="occupancyRate" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {(occupancy?.byWard ?? []).map((entry, idx) => (
                      <Cell key={idx} fill={entry.occupancyRate >= 80 ? '#ef4444' : entry.occupancyRate >= 70 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appointments by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie data={appointmentsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                      {appointmentsByStatus.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {appointmentsByStatus.map((item, idx) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                      <span className="text-sm text-gray-600">{item.status}</span>
                      <span className="text-sm font-semibold text-gray-900 ml-auto">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Patient Diagnoses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={conditions?.topDiagnoses ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Patients" radius={[4, 4, 0, 0]}>
                    {(conditions?.topDiagnoses ?? []).map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
