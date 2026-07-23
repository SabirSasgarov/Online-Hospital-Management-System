import { useRef, useState } from 'react'
import { UserRound, ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadImage } from '@/lib/api/upload'
import { ApiError } from '@/lib/apiClient'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  /** "round" (default) for avatar-style photos, "wide" for banner/card images like announcements. */
  shape?: 'round' | 'wide'
}

/** A small preview + "Choose Photo" button that uploads the picked file and reports back the hosted URL. */
export function ImageUpload({ value, onChange, label = 'Profile Photo (optional)', shape = 'round' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not upload image.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const previewClass = shape === 'wide' ? 'h-16 w-28 rounded-lg' : 'h-16 w-16 rounded-full'

  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt="Preview" className={cn(previewClass, 'object-cover border border-gray-200')} />
        ) : (
          <div className={cn(previewClass, 'flex items-center justify-center bg-gray-100 text-gray-400')}>
            {shape === 'wide' ? <ImageIcon className="h-6 w-6" /> : <UserRound className="h-7 w-7" />}
          </div>
        )}
        <div className="space-y-1">
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {uploading ? 'Uploading...' : value ? 'Change Photo' : 'Choose Photo'}
          </Button>
          {value && !uploading && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
              Remove
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
