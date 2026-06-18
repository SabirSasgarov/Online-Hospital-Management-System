import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import type { UserRole } from '@/types'

import Login from '@/pages/auth/Login'
import AdminLogin from '@/pages/auth/AdminLogin'

import AdminDashboard from '@/pages/admin/Dashboard'
import AdminPatients from '@/pages/admin/Patients'
import AdminDoctors from '@/pages/admin/Doctors'
import AdminAppointments from '@/pages/admin/Appointments'
import AdminWards from '@/pages/admin/Wards'
import AdminAnalytics from '@/pages/admin/Analytics'
import AdminAuditLog from '@/pages/admin/AuditLog'

import DoctorDashboard from '@/pages/doctor/Dashboard'
import DoctorPatients from '@/pages/doctor/Patients'
import DoctorAppointments from '@/pages/doctor/Appointments'
import DoctorPrescriptions from '@/pages/doctor/Prescriptions'
import DoctorLabResults from '@/pages/doctor/LabResults'
import DoctorDischarge from '@/pages/doctor/Discharge'
import DoctorMessages from '@/pages/doctor/Messages'

import NurseDashboard from '@/pages/nurse/Dashboard'
import NursePatients from '@/pages/nurse/Patients'
import NurseWards from '@/pages/nurse/Wards'
import NurseAppointments from '@/pages/nurse/Appointments'
import NurseLabResults from '@/pages/nurse/LabResults'

import PatientDashboard from '@/pages/patient/Dashboard'
import PatientAppointments from '@/pages/patient/Appointments'
import PatientMedicalHistory from '@/pages/patient/MedicalHistory'
import PatientPrescriptions from '@/pages/patient/Prescriptions'
import PatientLabResults from '@/pages/patient/LabResults'
import PatientMessages from '@/pages/patient/Messages'

const queryClient = new QueryClient()

const roleHomeRoutes: Record<UserRole, string> = {
  admin: '/admin',
  doctor: '/doctor',
  nurse: '/nurse',
  patient: '/patient',
}

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: UserRole }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== allowedRole) return <Navigate to={roleHomeRoutes[user!.role]} replace />
  return <>{children}</>
}

function RootRedirect() {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={roleHomeRoutes[user!.role]} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AppLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="wards" element={<AdminWards />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="audit" element={<AdminAuditLog />} />
      </Route>

      <Route path="/doctor" element={<ProtectedRoute allowedRole="doctor"><AppLayout /></ProtectedRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="lab-results" element={<DoctorLabResults />} />
        <Route path="discharge" element={<DoctorDischarge />} />
        <Route path="messages" element={<DoctorMessages />} />
      </Route>

      <Route path="/nurse" element={<ProtectedRoute allowedRole="nurse"><AppLayout /></ProtectedRoute>}>
        <Route index element={<NurseDashboard />} />
        <Route path="patients" element={<NursePatients />} />
        <Route path="wards" element={<NurseWards />} />
        <Route path="appointments" element={<NurseAppointments />} />
        <Route path="lab-results" element={<NurseLabResults />} />
      </Route>

      <Route path="/patient" element={<ProtectedRoute allowedRole="patient"><AppLayout /></ProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="medical-history" element={<PatientMedicalHistory />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="lab-results" element={<PatientLabResults />} />
        <Route path="messages" element={<PatientMessages />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
