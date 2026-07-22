import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/hooks/use-toast'
import { ApiError } from '@/lib/apiClient'
import type { UserRole } from '@/types'

function describeError(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

import PublicHome from '@/pages/public/Home'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ConfirmEmail from '@/pages/auth/ConfirmEmail'
import AdminLogin from '@/pages/auth/AdminLogin'
import Profile from '@/pages/shared/Profile'

import AdminDashboard from '@/pages/admin/Dashboard'
import AdminPatients from '@/pages/admin/Patients'
import AdminDoctors from '@/pages/admin/Doctors'
import AdminAppointments from '@/pages/admin/Appointments'
import AdminWards from '@/pages/admin/Wards'
import AdminAnalytics from '@/pages/admin/Analytics'
import AdminAuditLog from '@/pages/admin/AuditLog'
import AdminStaff from '@/pages/admin/Staff'
import AdminAnnouncements from '@/pages/admin/Announcements'
import AdminOffers from '@/pages/admin/Offers'

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

const queryClient = new QueryClient({
  // Any mutation that doesn't handle its own error (most already do inline for forms)
  // still surfaces a toast so failures are never silent.
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (mutation.options.onError) return // page already handles it inline
      toast({ title: 'Action failed', description: describeError(error), variant: 'destructive' })
    },
  }),
})

const roleHomeRoutes: Record<UserRole, string> = {
  admin: '/admin',
  doctor: '/doctor',
  nurse: '/nurse',
  patient: '/patient',
}

function FullScreenLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
    </div>
  )
}

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: UserRole }) {
  const { user, isAuthenticated, isInitializing } = useAuth()
  if (isInitializing) return <FullScreenLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== allowedRole) return <Navigate to={roleHomeRoutes[user!.role]} replace />
  return <>{children}</>
}

/** Signed-in visitors get bounced to their dashboard; everyone else sees the public marketing page. */
function RootRoute() {
  const { user, isAuthenticated, isInitializing } = useAuth()
  if (isInitializing) return <FullScreenLoader />
  if (isAuthenticated) return <Navigate to={roleHomeRoutes[user!.role]} replace />
  return <PublicHome />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AppLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="wards" element={<AdminWards />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="audit" element={<AdminAuditLog />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/doctor" element={<ProtectedRoute allowedRole="doctor"><AppLayout /></ProtectedRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="lab-results" element={<DoctorLabResults />} />
        <Route path="discharge" element={<DoctorDischarge />} />
        <Route path="messages" element={<DoctorMessages />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/nurse" element={<ProtectedRoute allowedRole="nurse"><AppLayout /></ProtectedRoute>}>
        <Route index element={<NurseDashboard />} />
        <Route path="patients" element={<NursePatients />} />
        <Route path="wards" element={<NurseWards />} />
        <Route path="appointments" element={<NurseAppointments />} />
        <Route path="lab-results" element={<NurseLabResults />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/patient" element={<ProtectedRoute allowedRole="patient"><AppLayout /></ProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="medical-history" element={<PatientMedicalHistory />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="lab-results" element={<PatientLabResults />} />
        <Route path="messages" element={<PatientMessages />} />
        <Route path="profile" element={<Profile />} />
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
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
