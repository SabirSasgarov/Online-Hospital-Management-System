import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Hospital, Eye, EyeOff, Check, X } from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { ApiError } from '@/lib/apiClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

// Mirrors the ASP.NET Identity password policy configured in HMS.Persistence/DependencyInjection.cs —
// keep these in sync if that policy ever changes.
const passwordRules: { label: string; test: (v: string) => boolean }[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter (a-z)', test: (v) => /[a-z]/.test(v) },
  { label: 'One digit (0-9)', test: (v) => /[0-9]/.test(v) },
  { label: 'One special character (e.g. !.,?#$%)', test: (v) => /[^a-zA-Z0-9]/.test(v) },
]

function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="space-y-1 rounded-lg bg-gray-50 p-3">
      {passwordRules.map((rule) => {
        const passed = rule.test(password)
        return (
          <li key={rule.label} className={cn('flex items-center gap-2 text-xs', passed ? 'text-green-600' : 'text-gray-400')}>
            {passed ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
            {rule.label}
          </li>
        )
      })}
    </ul>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>()
  const password = watch('password')

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userName: data.email,
        password: data.password,
      })
      // Email confirmation is required before the account can log in.
      navigate(`/confirm-email?email=${encodeURIComponent(data.email)}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-700 via-green-600 to-teal-600 flex-col items-center justify-center p-12 text-white">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
          <Hospital className="h-12 w-12 text-white" />
        </div>
        <h1 className="mb-2 text-4xl font-bold">Join OHM</h1>
        <p className="mb-2 text-green-100 text-center max-w-sm">
          Create a patient account to book appointments, message your doctors, and track your medical history.
        </p>
      </div>

      <div className="flex w-full items-center justify-center bg-gray-50 px-6 lg:w-1/2 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600">
              <Hospital className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">OHM System</h1>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Create Account</CardTitle>
              <p className="text-sm text-gray-500">Register as a patient</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Jane" {...register('firstName', { required: 'Required' })} />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" {...register('lastName', { required: 'Required' })} />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>

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
                      placeholder="Create a password"
                      className="pr-10"
                      {...register('password', {
                        required: 'Password is required',
                        validate: (v) => passwordRules.every((rule) => rule.test(v)) || 'Password does not meet all requirements below',
                      })}
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
                  <PasswordChecklist password={password ?? ''} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (v) => v === password || 'Passwords do not match',
                    })}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
