import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ShieldCheck, KeyRound, Mail, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile, useUpdateProfile, useRequestEmailChange, useConfirmEmailChange } from '@/hooks/useProfile'
import { authApi } from '@/lib/api/auth'
import { ApiError } from '@/lib/apiClient'

interface BasicInfoForm {
  firstName: string
  lastName: string
  phoneNumber: string
  profileImageUrl: string
}

interface EmailForm {
  newEmail: string
  currentPassword: string
}

interface EmailCodeForm {
  code: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function Profile() {
  const { refreshUser, logout } = useAuth()
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const requestEmailChange = useRequestEmailChange()
  const confirmEmailChange = useConfirmEmailChange()

  const [emailStep, setEmailStep] = useState<'idle' | 'awaiting-code'>('idle')
  const [basicSaved, setBasicSaved] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailNotice, setEmailNotice] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [revoking, setRevoking] = useState(false)
  const [revokeNotice, setRevokeNotice] = useState('')

  const basicForm = useForm<BasicInfoForm>({
    values: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.phoneNumber ?? '',
          profileImageUrl: profile.profileImageUrl ?? '',
        }
      : undefined,
  })
  const profileImageUrl = basicForm.watch('profileImageUrl')

  const emailForm = useForm<EmailForm>()
  const emailCodeForm = useForm<EmailCodeForm>()
  const passwordForm = useForm<PasswordForm>()
  const newPassword = passwordForm.watch('newPassword')

  const onSaveBasicInfo = async (data: BasicInfoForm) => {
    setBasicSaved(false)
    await updateProfile.mutateAsync(data)
    await refreshUser()
    setBasicSaved(true)
    setTimeout(() => setBasicSaved(false), 3000)
  }

  const onRequestEmailChange = async (data: EmailForm) => {
    setEmailError('')
    setEmailNotice('')
    try {
      const res = await requestEmailChange.mutateAsync(data)
      setEmailNotice(res.message ?? 'Confirmation code sent to your new email address.')
      setEmailStep('awaiting-code')
    } catch (err) {
      setEmailError(err instanceof ApiError ? err.message : 'Could not start the email change.')
    }
  }

  const onConfirmEmailChange = async (data: EmailCodeForm) => {
    setEmailError('')
    setEmailNotice('')
    try {
      await confirmEmailChange.mutateAsync(data)
      await refreshUser()
      setEmailStep('idle')
      emailForm.reset()
      emailCodeForm.reset()
      setEmailNotice('Email address updated.')
    } catch (err) {
      setEmailError(err instanceof ApiError ? err.message : 'Invalid or expired code.')
    }
  }

  const onChangePassword = async (data: PasswordForm) => {
    setPasswordError('')
    setPasswordNotice('')
    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    try {
      const res = await authApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      if (!res.succeeded) {
        setPasswordError(res.message ?? 'Could not change password.')
        return
      }
      setPasswordNotice('Password changed successfully.')
      passwordForm.reset()
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : 'Could not change password.')
    }
  }

  const signOutEverywhere = async () => {
    setRevoking(true)
    setRevokeNotice('')
    try {
      await authApi.revokeToken()
      setRevokeNotice('All other sessions have been signed out. You will be signed out here too.')
      setTimeout(() => logout(), 1500)
    } catch (err) {
      setRevokeNotice(err instanceof ApiError ? err.message : 'Could not revoke sessions.')
    } finally {
      setRevoking(false)
    }
  }

  return (
    <div>
      <PageHeader title="Profile Settings" description="Manage your account information and security" />
      <div className="p-6 space-y-6 max-w-2xl">
        {isLoading && <p className="text-sm text-gray-400">Loading profile…</p>}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-gray-500" />
              <CardTitle className="text-base">Basic Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={basicForm.handleSubmit(onSaveBasicInfo)} className="space-y-4">
              <ImageUpload
                value={profileImageUrl}
                onChange={(url) => basicForm.setValue('profileImageUrl', url, { shouldDirty: true })}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input {...basicForm.register('firstName', { required: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input {...basicForm.register('lastName', { required: true })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input placeholder="+1 555 123 4567" {...basicForm.register('phoneNumber')} />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                {basicSaved && <span className="text-sm text-green-600">Saved.</span>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <CardTitle className="text-base">Email Address</CardTitle>
              {profile && (
                <Badge variant={profile.emailConfirmed ? 'success' : 'destructive'} className="ml-auto">
                  {profile.emailConfirmed ? 'Confirmed' : 'Unconfirmed'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">Current: <span className="font-medium text-gray-800">{profile?.email}</span></p>

            {emailStep === 'idle' ? (
              <form onSubmit={emailForm.handleSubmit(onRequestEmailChange)} className="space-y-3">
                <div className="space-y-1.5">
                  <Label>New Email Address</Label>
                  <Input type="email" {...emailForm.register('newEmail', { required: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Confirm it's you" {...emailForm.register('currentPassword', { required: true })} />
                </div>
                <Button type="submit" disabled={requestEmailChange.isPending}>
                  {requestEmailChange.isPending ? 'Sending code...' : 'Send Confirmation Code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={emailCodeForm.handleSubmit(onConfirmEmailChange)} className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Confirmation Code</Label>
                  <Input placeholder="123456" maxLength={6} {...emailCodeForm.register('code', { required: true })} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={confirmEmailChange.isPending}>
                    {confirmEmailChange.isPending ? 'Confirming...' : 'Confirm New Email'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEmailStep('idle')}>Cancel</Button>
                </div>
              </form>
            )}

            {emailError && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{emailError}</div>}
            {emailNotice && <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700">{emailNotice}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-gray-500" />
              <CardTitle className="text-base">Change Password</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-3">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input type="password" {...passwordForm.register('currentPassword', { required: true })} />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" {...passwordForm.register('newPassword', { required: true, minLength: 6 })} />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  {...passwordForm.register('confirmPassword', {
                    required: true,
                    validate: (v) => v === newPassword || 'Passwords do not match',
                  })}
                />
              </div>
              {passwordError && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{passwordError}</div>}
              {passwordNotice && <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{passwordNotice}</div>}
              <Button type="submit">Change Password</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gray-500" />
              <CardTitle className="text-base">Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-500">
              Sign out of every other device or browser where you're currently logged in. You'll stay signed out
              until you log in again here too.
            </p>
            <Button variant="outline" onClick={signOutEverywhere} disabled={revoking}>
              {revoking ? 'Signing out everywhere...' : 'Sign Out of All Other Sessions'}
            </Button>
            {revokeNotice && <p className="text-sm text-gray-600">{revokeNotice}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
