import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Hospital, Eye, EyeOff, Stethoscope, Heart, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserRole } from '@/types'

interface FormData {
  email: string
  password: string
}

const roles: { value: UserRole; label: string; icon: React.ComponentType<{ className?: string }>; color: string; demo: { email: string; password: string } }[] = [
  { value: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'border-blue-500 bg-blue-50 text-blue-700', demo: { email: 'doctor@hospital.com', password: 'doctor123' } },
  { value: 'nurse', label: 'Nurse', icon: Heart, color: 'border-teal-500 bg-teal-50 text-teal-700', demo: { email: 'nurse@hospital.com', password: 'nurse123' } },
  { value: 'patient', label: 'Patient', icon: User, color: 'border-green-500 bg-green-50 text-green-700', demo: { email: 'patient@hospital.com', password: 'patient123' } },
]

const roleRoutes: Record<UserRole, string> = {
  admin: '/admin',
  doctor: '/doctor',
  nurse: '/nurse',
  patient: '/patient',
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setError('')
    const ok = await login(data.email, data.password, selectedRole)
    if (ok) {
      navigate(roleRoutes[selectedRole])
    } else {
      setError('Invalid email or password for the selected role.')
    }
  }

  const applyDemo = (role: typeof roles[0]) => {
    setSelectedRole(role.value)
    setValue('email', role.demo.email)
    setValue('password', role.demo.password)
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 flex-col items-center justify-center p-12 text-white">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
          <Hospital className="h-12 w-12 text-white" />
        </div>
        <h1 className="mb-2 text-4xl font-bold">Welcome Back</h1>
        <p className="mb-10 text-blue-100">Sign in to access the hospital management system</p>

        <div className="w-full max-w-sm space-y-3">
          {roles.map((role) => (
            <div key={role.value} className="flex items-center gap-4 rounded-xl bg-white/10 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <role.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">{role.label}</p>
                <p className="text-xs text-blue-100">{role.demo.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-gray-50 px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <Hospital className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">OHM System</h1>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Sign In</CardTitle>
              <p className="text-sm text-gray-500">Select your role and enter your credentials</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="mb-2 block">I am a...</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-xs font-medium transition-all ${
                        selectedRole === role.value ? role.color : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <role.icon className="h-5 w-5" />
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" {...register('email', { required: 'Email is required' })} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
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
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Quick demo access — click to fill:</p>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => applyDemo(role)}
                      className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-200"
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

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
