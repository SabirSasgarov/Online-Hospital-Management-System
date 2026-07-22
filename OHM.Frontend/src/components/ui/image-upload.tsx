import { useRef, useState } from 'react'
import { UserRound, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadImage } from '@/lib/api/upload'
import { ApiError } from '@/lib/apiClient'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
}

/** A small circular preview + "Choose Photo" button that uploads the picked file and reports back the hosted URL. */
export function ImageUpload({ value, onChange, label = 'Profile Photo (optional)' }: ImageUploadProps) {
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

  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt="Preview" className="h-16 w-16 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <UserRound className="h-7 w-7" />
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
