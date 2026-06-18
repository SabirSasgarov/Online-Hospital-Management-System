import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@hospital.com': { id: 'admin1', name: 'Admin User', email: 'admin@hospital.com', role: 'admin', password: 'admin123' },
  'doctor@hospital.com': { id: 'D001', name: 'Dr. James Anderson', email: 'doctor@hospital.com', role: 'doctor', password: 'doctor123' },
  'nurse@hospital.com': { id: 'N001', name: 'Nurse Mary Wilson', email: 'nurse@hospital.com', role: 'nurse', password: 'nurse123' },
  'patient@hospital.com': { id: 'P001', name: 'Emily Johnson', email: 'patient@hospital.com', role: 'patient', password: 'patient123' },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('ohm_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    const found = MOCK_USERS[email]
    if (found && found.password === password && found.role === role) {
      const { password: _, ...userData } = found
      setUser(userData)
      localStorage.setItem('ohm_user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ohm_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
