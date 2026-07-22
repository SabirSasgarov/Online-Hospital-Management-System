import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Hospital, MailCheck } from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { ApiError } from '@/lib/apiClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FormData {
  email: string
  code: string
}

export default function ConfirmEmail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [resending, setResending] = useState(false)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { email: searchParams.get('email') ?? '' },
  })
  const email = watch('email')

  const onSubmit = async (data: FormData) => {
    setError('')
    setNotice('')
    try {
      const res = await authApi.confirmEmail({ email: data.email, code: data.code })
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
      const res = await authApi.resendConfirmation({ email })
      setNotice(res.message ?? 'If the account exists, a new code has been sent.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend the code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
            <Hospital className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OHM System</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MailCheck className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl">Confirm Your Email</CardTitle>
            </div>
            <p className="text-sm text-gray-500">Enter the 6-digit code we emailed you</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" {...register('email', { required: 'Email is required' })} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code">Confirmation Code</Label>
                <Input id="code" placeholder="123456" maxLength={6} {...register('code', { required: 'Code is required' })} />
                {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{error}</div>
              )}
              {notice && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700">{notice}</div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Confirm Email'}
              </Button>
            </form>

            <button
              type="button"
              onClick={resend}
              disabled={resending}
              className="w-full text-center text-sm font-medium text-blue-600 hover:underline"
            >
              {resending ? 'Sending...' : "Didn't get a code? Resend"}
            </button>

            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="font-medium text-blue-600 hover:underline">Back to sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
