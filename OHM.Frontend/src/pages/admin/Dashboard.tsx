import { Users, UserCog, Calendar, BedDouble, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { mockPatients, mockDoctors, mockAppointments, mockWards } from '@/lib/mockData'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { analyticsData } from '@/lib/mockData'

const stats = [
  { label: 'Total Patients', value: mockPatients.length, icon: Users, color: 'bg-blue-500', sub: `${mockPatients.filter(p => p.status === 'admitted').length} admitted` },
  { label: 'Active Doctors', value: mockDoctors.filter(d => d.available).length, icon: UserCog, color: 'bg-purple-500', sub: `${mockDoctors.length} total` },
  { label: "Today's Appointments", value: mockAppointments.filter(a => a.date === '2026-06-18').length, icon: Calendar, color: 'bg-amber-500', sub: `${mockAppointments.filter(a => a.status === 'scheduled').length} upcoming` },
  { label: 'Bed Occupancy', value: `${Math.round(mockWards.reduce((a, w) => a + w.occupiedBeds, 0) / mockWards.reduce((a, w) => a + w.totalBeds, 0) * 100)}%`, icon: BedDouble, color: 'bg-teal-500', sub: `${mockWards.reduce((a, w) => a + w.occupiedBeds, 0)}/${mockWards.reduce((a, w) => a + w.totalBeds, 0)} beds` },
]

const appointmentStatusColor: Record<string, string> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'destructive',
  'no-show': 'warning',
}

export default function AdminDashboard() {
  const recentAppointments = mockAppointments.slice(0, 5)

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
              <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-blue-500" /> Monthly Admissions vs Discharges</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={analyticsData.admissionsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="admissions" stackId="1" stroke="#3b82f6" fill="#bfdbfe" name="Admissions" />
                  <Area type="monotone" dataKey="discharges" stackId="2" stroke="#10b981" fill="#a7f3d0" name="Discharges" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4 text-teal-500" /> Ward Occupancy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockWards.map((ward) => {
                const pct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100)
                return (
                  <div key={ward.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 truncate max-w-[120px]">{ward.name}</span>
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
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{apt.patientName}</p>
                    <p className="text-xs text-gray-500">{apt.doctorName} · {apt.date} {apt.time}</p>
                  </div>
                  <Badge variant={appointmentStatusColor[apt.status] as 'info' | 'success' | 'destructive' | 'warning'}>
                    {apt.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Patient Status</CardTitle>
              <CardDescription>Current patient distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Active (Outpatient)', value: mockPatients.filter(p => p.status === 'active').length, color: 'bg-green-500' },
                { label: 'Admitted (Inpatient)', value: mockPatients.filter(p => p.status === 'admitted').length, color: 'bg-blue-500' },
                { label: 'Discharged', value: mockPatients.filter(p => p.status === 'discharged').length, color: 'bg-gray-400' },
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
                <p className="text-2xl font-bold text-gray-900">{mockPatients.length}</p>
                <p className="text-xs text-gray-500">Total Registered Patients</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
