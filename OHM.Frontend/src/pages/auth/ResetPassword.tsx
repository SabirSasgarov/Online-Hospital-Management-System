import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Hospital, KeyRound, Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { ApiError } from '@/lib/apiClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FormData {
  email: string
  code: string
  newPassword: string
  confirmPassword: string
}

// Mirrors the ASP.NET Identity password policy — keep in sync with Register.tsx.
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

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [notice, setNotice] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { email: searchParams.get('email') ?? '' },
  })
  const email = watch('email')
  const newPassword = watch('newPassword')

  const onSubmit = async (data: FormData) => {
    setError('')
    setNotice('')
    try {
      const res = await authApi.resetPassword({ email: data.email, code: data.code, newPassword: data.newPassword })
      if (!res.succeeded) {
        setError(res.message ?? 'Invalid or expired code.')
        return
      }
      navigate('/login')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid or expired code.')
    }
  }

  const resend = async () => {
    if (!email) {
      setError('Enter your email above first.')
      return
    }
    setResending(true)
    setError('')
    setNotice('')
    try {
      await authApi.forgotPassword({ email })
      setNotice('If the account exists, a new code has been sent.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend the code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
            <Hospital className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CareFlow</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl">Reset Password</CardTitle>
            </div>
            <p className="text-sm text-gray-500">Enter the code we emailed you and choose a new password</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" {...register('email', { required: 'Email is required' })} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code">Reset Code</Label>
                <Input id="code" placeholder="123456" maxLength={6} {...register('code', { required: 'Code is required' })} />
                {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a new password"
                    className="pr-10"
                    {...register('newPassword', {
                      required: 'New password is required',
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
                {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
                <PasswordChecklist password={newPassword ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === newPassword || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{error}</div>
              )}
              {notice && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700">{notice}</div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>

            <button
              type="button"
              onClick={resend}
              disabled={resending}
              className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:underline"
            >
              {resending ? 'Sending...' : "Didn't get a code? Resend"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
