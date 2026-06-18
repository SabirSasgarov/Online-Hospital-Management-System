import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCog, Calendar, BedDouble,
  FileText, Pill, TestTube, MessageSquare, BarChart3,
  ClipboardList, LogOut, Hospital, Activity, X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Patients', href: '/admin/patients', icon: Users },
    { label: 'Doctors', href: '/admin/doctors', icon: UserCog },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Wards & Beds', href: '/admin/wards', icon: BedDouble },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Audit Log', href: '/admin/audit', icon: ClipboardList },
  ],
  doctor: [
    { label: 'Dashboard', href: '/doctor', icon: LayoutDashboard },
    { label: 'My Patients', href: '/doctor/patients', icon: Users },
    { label: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { label: 'Prescriptions', href: '/doctor/prescriptions', icon: Pill },
    { label: 'Lab Results', href: '/doctor/lab-results', icon: TestTube },
    { label: 'Discharge', href: '/doctor/discharge', icon: FileText },
    { label: 'Messages', href: '/doctor/messages', icon: MessageSquare },
  ],
  nurse: [
    { label: 'Dashboard', href: '/nurse', icon: LayoutDashboard },
    { label: 'Patients', href: '/nurse/patients', icon: Users },
    { label: 'Wards', href: '/nurse/wards', icon: BedDouble },
    { label: 'Appointments', href: '/nurse/appointments', icon: Calendar },
    { label: 'Lab Results', href: '/nurse/lab-results', icon: TestTube },
  ],
  patient: [
    { label: 'Dashboard', href: '/patient', icon: LayoutDashboard },
    { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
    { label: 'Medical History', href: '/patient/medical-history', icon: Activity },
    { label: 'Prescriptions', href: '/patient/prescriptions', icon: Pill },
    { label: 'Lab Results', href: '/patient/lab-results', icon: TestTube },
    { label: 'Messages', href: '/patient/messages', icon: MessageSquare },
  ],
}

const roleColors: Record<UserRole, string> = {
  admin: 'bg-purple-600',
  doctor: 'bg-blue-600',
  nurse: 'bg-teal-600',
  patient: 'bg-green-600',
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  nurse: 'Nurse',
  patient: 'Patient',
}

export function Sidebar() {
  const { user, logout } = useAuth()
  const { close } = useSidebar()
  if (!user) return null

  const items = navItems[user.role]
  const color = roleColors[user.role]

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className={cn('flex items-center gap-3 p-6', color)}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
          <Hospital className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">OHM System</p>
          <p className="text-xs text-white/70">{roleLabels[user.role]}</p>
        </div>
        <button
          onClick={close}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white', color)}>
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.href.split('/').length === 2}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? `${color} text-white shadow-sm`
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-100 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
