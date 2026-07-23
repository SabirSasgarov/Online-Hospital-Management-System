import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Hospital, KeyRound, ArrowLeft } from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { ApiError } from '@/lib/apiClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FormData {
  email: string
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      await authApi.forgotPassword({ email: data.email })
      // Backend always responds with a generic success message regardless of whether the
      // email exists, so we can't leak account existence — just move on to the code step.
      navigate(`/reset-password?email=${encodeURIComponent(data.email)}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send a reset code. Please try again.')
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
              <CardTitle className="text-xl">Forgot Password</CardTitle>
            </div>
            <p className="text-sm text-gray-500">Enter your email and we'll send you a reset code</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" autoFocus {...register('email', { required: 'Email is required' })} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{error}</div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Code'}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Already have a code?{' '}
              <Link to="/reset-password" className="font-medium text-blue-600 hover:underline">
                Reset your password
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
