import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, UserRole } from '@/types'
import { authApi } from '@/lib/api/auth'
import { doctorsApi } from '@/lib/api/doctors'
import { patientsApi } from '@/lib/api/patients'
import { ApiError } from '@/lib/apiClient'
import { clearTokens, getAccessToken, setTokens } from '@/lib/tokenStorage'
import { decodeJwtPayload, extractPermissions } from '@/lib/jwt'

export interface AuthResult {
  ok: boolean
  message?: string
  role?: UserRole
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  /** True while a previously stored session (if any) is being restored on first load. */
  isInitializing: boolean
  login: (email: string, password: string, expectedRole?: UserRole) => Promise<AuthResult>
  adminLogin: (email: string, password: string) => Promise<AuthResult>
  googleSignIn: (idToken: string) => Promise<AuthResult>
  /** Re-reads /auth/me — used after the user edits their name/email in the Profile page. */
  refreshUser: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const KNOWN_ROLES: UserRole[] = ['admin', 'doctor', 'nurse', 'patient']

function pickRole(apiRoles: string[]): UserRole | undefined {
  const lower = apiRoles.map((r) => r.toLowerCase())
  return KNOWN_ROLES.find((r) => lower.includes(r))
}

/**
 * Doctor/Patient are separate profile records from the AppUser identity — resolve the profile id
 * by email. IMPORTANT: this must never fall back to "the first result" when there's no exact
 * match — a brand-new user with no profile record yet would otherwise be silently handed
 * someone else's profileId and see their appointments/prescriptions/lab results.
 */
async function resolveProfileId(role: UserRole, email: string): Promise<string | undefined> {
  try {
    if (role === 'doctor') {
      const res = await doctorsApi.list({ search: email, pageSize: 5 })
      return res.items.find((d) => d.email.toLowerCase() === email.toLowerCase())?.id
    }
    if (role === 'patient') {
      const res = await patientsApi.list({ search: email, pageSize: 5 })
      return res.items.find((p) => p.email.toLowerCase() === email.toLowerCase())?.id
    }
  } catch {
    // Non-fatal — pages that need profileId will simply see it as undefined.
  }
  return undefined
}

function buildUser(
  role: UserRole,
  userId: string,
  fullName: string,
  email: string,
  profileId: string | undefined,
  accessToken: string
): User {
  const payload = decodeJwtPayload(accessToken)
  return {
    id: userId,
    profileId,
    name: fullName,
    email,
    role,
    permissions: extractPermissions(payload),
  }
}

function friendlyError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message || fallback
  return fallback
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setIsInitializing(false)
      return
    }
    ;(async () => {
      try {
        const me = await authApi.me()
        const role = pickRole(me.roles) ?? 'patient'
        const profileId = role === 'doctor' || role === 'patient' ? await resolveProfileId(role, me.email) : undefined
        setUser(buildUser(role, me.userId, me.fullName, me.email, profileId, getAccessToken()!))
      } catch {
        clearTokens()
        setUser(null)
      } finally {
        setIsInitializing(false)
      }
    })()
  }, [])

  useEffect(() => {
    const onExpired = () => setUser(null)
    window.addEventListener('ohm:session-expired', onExpired)
    return () => window.removeEventListener('ohm:session-expired', onExpired)
  }, [])

  const login = async (email: string, password: string, expectedRole?: UserRole): Promise<AuthResult> => {
    try {
      const res = await authApi.login({ email, password })
      if (!res.succeeded || !res.data) {
        return { ok: false, message: res.errors?.[0] ?? res.message ?? 'Invalid email or password.' }
      }
      const data = res.data
      const role = pickRole(data.roles)
      if (!role) return { ok: false, message: 'This account has no assigned role.' }
      if (expectedRole && role !== expectedRole) {
        return { ok: false, message: `This account is registered as a ${role}, not a ${expectedRole}.` }
      }
      setTokens(data.accessToken, data.refreshToken)
      const profileId = await resolveProfileId(role, data.email)
      setUser(buildUser(role, data.userId, data.fullName, data.email, profileId, data.accessToken))
      return { ok: true, role }
    } catch (err) {
      return { ok: false, message: friendlyError(err, 'Invalid email or password.') }
    }
  }

  const adminLogin = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await authApi.adminLogin({ email, password })
      if (!res.succeeded || !res.data) {
        return { ok: false, message: res.errors?.[0] ?? res.message ?? 'Invalid credentials.' }
      }
      const data = res.data
      setTokens(data.accessToken, data.refreshToken)
      setUser(buildUser('admin', data.userId, data.fullName, data.email, undefined, data.accessToken))
      return { ok: true }
    } catch (err) {
      return { ok: false, message: friendlyError(err, 'Invalid credentials.') }
    }
  }

  const googleSignIn = async (idToken: string): Promise<AuthResult> => {
    try {
      const res = await authApi.googleSignIn({ idToken })
      if (!res.succeeded || !res.data) {
        return { ok: false, message: res.errors?.[0] ?? res.message ?? 'Google sign-in failed.' }
      }
      const data = res.data
      const role = pickRole(data.roles) ?? 'patient'
      setTokens(data.accessToken, data.refreshToken)
      const profileId = await resolveProfileId(role, data.email)
      setUser(buildUser(role, data.userId, data.fullName, data.email, profileId, data.accessToken))
      return { ok: true, role }
    } catch (err) {
      return { ok: false, message: friendlyError(err, 'Google sign-in failed.') }
    }
  }

  const refreshUser = async () => {
    const token = getAccessToken()
    if (!token) return
    try {
      const me = await authApi.me()
      const role = pickRole(me.roles) ?? 'patient'
      const profileId = role === 'doctor' || role === 'patient' ? await resolveProfileId(role, me.email) : undefined
      setUser(buildUser(role, me.userId, me.fullName, me.email, profileId, token))
    } catch {
      // Non-fatal — keep the previous user state if the refresh fails.
    }
  }

  const logout = () => {
    authApi.logout().catch(() => {})
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isInitializing, login, adminLogin, googleSignIn, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
