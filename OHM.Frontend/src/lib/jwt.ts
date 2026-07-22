/** Minimal JWT payload decoder — no signature verification (that's the server's job). */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

/** Pulls the "permission" claim(s) out of a decoded JWT payload — may be a single string or an array. */
export function extractPermissions(payload: Record<string, unknown> | null): string[] {
  if (!payload) return []
  const raw = payload.permission
  if (!raw) return []
  return Array.isArray(raw) ? (raw as string[]) : [raw as string]
}
