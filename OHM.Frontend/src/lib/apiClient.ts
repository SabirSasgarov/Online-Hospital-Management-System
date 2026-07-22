import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokenStorage'
import type { AuthResponseDto, Result } from '@/types/api'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5182/api'

export class ApiError extends Error {
  status: number
  fieldErrors?: string[]
  constructor(message: string, status: number, fieldErrors?: string[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type QueryValue = string | number | boolean | undefined | null
export type QueryParams = Record<string, QueryValue>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: QueryParams
  /** Skip attaching the Authorization header (used for login/refresh calls). */
  skipAuth?: boolean
  /** Internal flag to prevent infinite refresh loops. */
  _isRetry?: boolean
}

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(`${BASE_URL}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

async function extractError(res: Response): Promise<{ message: string; fieldErrors?: string[] }> {
  try {
    const body = await res.json()
    // ASP.NET ProblemDetails shape from GlobalExceptionHandler: { title, status, errors: { field: [msgs] } }
    if (body && typeof body.title === 'string') {
      const fieldErrors = body.errors
        ? (Object.values(body.errors as Record<string, string[]>).flat() as string[])
        : undefined
      return { message: fieldErrors?.[0] ?? body.title, fieldErrors }
    }
    // Custom Result-wrapper shape used by auth/rate-limiting: { succeeded, message, errors }
    if (body && typeof body.succeeded === 'boolean') {
      const fieldErrors = Array.isArray(body.errors) ? (body.errors as string[]) : undefined
      return { message: fieldErrors?.[0] ?? body.message ?? 'Request failed.', fieldErrors }
    }
    return { message: 'Request failed.' }
  } catch {
    return { message: `Request failed (${res.status}).` }
  }
}

let refreshInFlight: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  if (!accessToken || !refreshToken) return null

  if (!refreshInFlight) {
    refreshInFlight = fetch(buildUrl('/auth/refresh-token'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return null
        const body = (await res.json()) as Result<AuthResponseDto>
        if (!body.succeeded || !body.data) return null
        setTokens(body.data.accessToken, body.data.refreshToken)
        return body.data.accessToken
      })
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null
      })
  }
  return refreshInFlight
}

/** Low-level request used by every resource module in `src/lib/api/`. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, skipAuth, _isRetry } = options

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (!skipAuth) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && !skipAuth && !_isRetry) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      return apiRequest<T>(path, { ...options, _isRetry: true })
    }
    clearTokens()
    window.dispatchEvent(new CustomEvent('ohm:session-expired'))
    const { message, fieldErrors } = await extractError(res)
    throw new ApiError(message, res.status, fieldErrors)
  }

  if (!res.ok) {
    const { message, fieldErrors } = await extractError(res)
    throw new ApiError(message, res.status, fieldErrors)
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

export const api = {
  get: <T>(path: string, query?: QueryParams) => apiRequest<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown, query?: QueryParams) =>
    apiRequest<T>(path, { method: 'POST', body, query }),
  put: <T>(path: string, body?: unknown, query?: QueryParams) =>
    apiRequest<T>(path, { method: 'PUT', body, query }),
  patch: <T>(path: string, body?: unknown, query?: QueryParams) =>
    apiRequest<T>(path, { method: 'PATCH', body, query }),
  delete: <T>(path: string, query?: QueryParams) => apiRequest<T>(path, { method: 'DELETE', query }),
  /** For requests that must not attach/refresh the Bearer token (login, register, refresh itself). */
  raw: <T>(path: string, options: RequestOptions) => apiRequest<T>(path, { ...options, skipAuth: true }),
}
