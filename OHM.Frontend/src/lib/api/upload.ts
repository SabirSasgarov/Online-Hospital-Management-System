import { getAccessToken } from '@/lib/tokenStorage'
import { ApiError } from '@/lib/apiClient'
import type { Result } from '@/types/api'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5182/api'

/** Uploads an image file (profile photo, etc.) and returns the hosted URL. */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const token = getAccessToken()
  const res = await fetch(`${BASE_URL}/upload/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })

  if (!res.ok) {
    let message = `Upload failed (${res.status}).`
    try {
      const body = await res.json()
      message = body?.message ?? body?.title ?? message
    } catch {
      // ignore
    }
    throw new ApiError(message, res.status)
  }

  const body = (await res.json()) as Result<string>
  if (!body.succeeded || !body.data) throw new ApiError(body.message ?? 'Upload failed.', res.status)
  return body.data
}
