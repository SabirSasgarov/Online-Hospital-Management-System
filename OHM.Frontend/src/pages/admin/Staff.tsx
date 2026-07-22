import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, UserCog2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from '@/components/ui/image-upload'
import { useStaffUsers, useCreateStaffUser, useSetUserActive } from '@/hooks/useUsers'
import { ApiError } from '@/lib/apiClient'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'Nurse' | 'Admin'
  profileImageUrl?: string
}

const passwordRules = [
  { label: '8+ characters', test: (v: string) => v.length >= 8 },
  { label: 'uppercase', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'lowercase', test: (v: string) => /[a-z]/.test(v) },
  { label: 'digit', test: (v: string) => /[0-9]/.test(v) },
  { label: 'special character', test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
]

export default function AdminStaff() {
  const [showCreate, setShowCreate] = useState(false)
  const [formError, setFormError] = useState('')
  const { data: staff = [], isLoading } = useStaffUsers()
  const createStaff = useCreateStaffUser()
  const setActive = useSetUserActive()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { role: 'Nurse' },
  })
  const role = watch('role')

  const onCreate = async (data: FormData) => {
    setFormError('')
    if (!passwordRules.every((r) => r.test(data.password))) {
      setFormError(`Password must contain ${passwordRules.map((r) => r.label).join(', ')}.`)
      return
    }
    try {
      await createStaff.mutateAsync(data)
      setShowCreate(false)
      reset({ role: 'Nurse' })
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not create account.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Staff Accounts"
        description="Create and manage Nurse and Admin logins"
        action={<Button onClick={() => { setShowCreate(true); setFormError('') }}><Plus className="h-4 w-4" /> New Staff Account</Button>}
      />
      <div className="p-6 space-y-4">
        {isLoading && <p className="text-sm text-gray-400">Loading staff accounts…</p>}
        {!isLoading && staff.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <UserCog2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No staff accounts yet</p>
          </div>
        )}
        {staff.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <UserCog2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {u.roles.map((r) => <Badge key={r} variant="secondary">{r}</Badge>)}
                <Badge variant={u.isActive ? 'success' : 'destructive'}>{u.isActive ? 'Active' : 'Deactivated'}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={setActive.isPending}
                  onClick={() => setActive.mutate({ id: u.id, isActive: !u.isActive })}
                >
                  {u.isActive ? 'Deactivate' : 'Reactivate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Staff Account</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
            <ImageUpload value={watch('profileImageUrl')} onChange={(url) => setValue('profileImageUrl', url)} />
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setValue('role', v as FormData['role'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>First Name</Label>
                <Input {...register('firstName', { required: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>Last Name</Label>
                <Input {...register('lastName', { required: true })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" {...register('email', { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Temporary Password</Label>
              <Input type="password" {...register('password', { required: true })} />
              <p className="text-xs text-gray-400">
                Must be 8+ characters with uppercase, lowercase, a digit, and a special character. It will be emailed to them.
              </p>
              {errors.password && <p className="text-xs text-red-500">Password is required</p>}
            </div>
            {formError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{formError}</div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create Account'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
