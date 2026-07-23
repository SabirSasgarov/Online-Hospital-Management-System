import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Hospital, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import type { UserRole } from '@/types'

interface FormData {
  email: string
  password: string
}

const roleRoutes: Record<UserRole, string> = {
  admin: '/admin',
  doctor: '/doctor',
  nurse: '/nurse',
  patient: '/patient',
}

export default function Login() {
  const navigate = useNavigate()
  const { login, googleSignIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setError('')
    setUnconfirmedEmail(null)
    const result = await login(data.email, data.password)
    if (result.ok && result.role) {
      navigate(roleRoutes[result.role])
    } else {
      setError(result.message ?? 'Invalid email or password.')
      if (result.message?.toLowerCase().includes('confirm your email')) {
        setUnconfirmedEmail(data.email)
      }
    }
  }

  const onGoogleToken = async (idToken: string) => {
    setError('')
    const result = await googleSignIn(idToken)
    if (result.ok && result.role) {
      navigate(roleRoutes[result.role])
    } else {
      setError(result.message ?? 'Google sign-in failed.')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 flex-col items-center justify-center p-12 text-white">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
          <Hospital className="h-12 w-12 text-white" />
        </div>
        <h1 className="mb-2 text-4xl font-bold">Welcome Back</h1>
        <p className="mb-10 text-blue-100">Sign in to access the hospital management system</p>

        <div className="grid grid-cols-2 gap-4 text-sm w-full max-w-sm">
          {['Doctor & Nurse Portals', 'Patient Records', 'Appointment Scheduling', 'Secure Messaging'].map((f) => (
            <div key={f} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-blue-100" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-gray-50 px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <Hospital className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CareFlow</h1>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Sign In</CardTitle>
              <p className="text-sm text-gray-500">Enter your credentials to continue</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" autoFocus {...register('email', { required: 'Email is required' })} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      className="pr-10"
                      {...register('password', { required: 'Password is required' })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                    {error}
                    {unconfirmedEmail && (
                      <>
                        {' '}
                        <Link to={`/confirm-email?email=${encodeURIComponent(unconfirmedEmail)}`} className="font-medium underline">
                          Confirm it now
                        </Link>
                      </>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <GoogleSignInButton onToken={onGoogleToken} />

              <p className="text-center text-sm text-gray-500">
                New patient?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                  Create an account
                </Link>
              </p>

              <p className="text-center text-sm text-gray-500">
                Admin?{' '}
                <Link to="/admin-login" className="font-medium text-purple-600 hover:underline">
                  Admin Portal
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
