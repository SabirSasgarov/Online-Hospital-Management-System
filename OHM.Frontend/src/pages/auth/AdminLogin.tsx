import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Hospital, ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FormData {
  email: string
  password: string
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const { adminLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setError('')
    const result = await adminLogin(data.email, data.password)
    if (result.ok) {
      navigate('/admin')
    } else {
      setError(result.message ?? 'Invalid credentials.')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 flex-col items-center justify-center p-12 text-white">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
          <Hospital className="h-12 w-12 text-white" />
        </div>
        <h1 className="mb-4 text-4xl font-bold">CareFlow</h1>
        <p className="mb-8 text-center text-lg text-purple-100">Online Hospital Management System</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {['Patient Management', 'Doctor Scheduling', 'Ward & Bed Control', 'Analytics & Reports', 'Audit Logging', 'Role-Based Access'].map(f => (
            <div key={f} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-purple-200" />
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600">
              <Hospital className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CareFlow</h1>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Admin Portal</CardTitle>
                  <CardDescription>Restricted access for administrators</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@hms.com"
                    {...register('email', { required: 'Email is required' })}
                  />
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

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign In as Admin'}
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-gray-500">
                Not an admin?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                  Staff / Patient Login
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
