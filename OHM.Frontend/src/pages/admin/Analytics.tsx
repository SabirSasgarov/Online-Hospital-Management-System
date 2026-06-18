import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analyticsData } from '@/lib/mockData'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']

export default function AdminAnalytics() {
  return (
    <div>
      <PageHeader title="Analytics & Reports" description="Hospital performance metrics and operational insights" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Admissions & Discharges</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analyticsData.admissionsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="admissions" stroke="#3b82f6" fill="#bfdbfe" name="Admissions" />
                  <Area type="monotone" dataKey="discharges" stroke="#10b981" fill="#a7f3d0" name="Discharges" />
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
                <BarChart data={analyticsData.bedOccupancyByWard} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                  <YAxis type="category" dataKey="ward" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="occupancy" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {analyticsData.bedOccupancyByWard.map((entry, idx) => (
                      <Cell key={idx} fill={entry.occupancy >= 80 ? '#ef4444' : entry.occupancy >= 70 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appointments by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie data={analyticsData.appointmentsByType} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                      {analyticsData.appointmentsByType.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {analyticsData.appointmentsByType.map((item, idx) => (
                    <div key={item.type} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                      <span className="text-sm text-gray-600">{item.type}</span>
                      <span className="text-sm font-semibold text-gray-900 ml-auto">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Patients by Condition</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analyticsData.patientsByCondition}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="condition" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Patients" radius={[4, 4, 0, 0]}>
                    {analyticsData.patientsByCondition.map((_, idx) => (
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
