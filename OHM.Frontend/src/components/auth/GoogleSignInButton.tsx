import { useEffect, useRef } from 'react'

// Minimal shape of the Google Identity Services script (loaded via <script> in index.html) —
// not worth pulling in a full type package for two methods.
interface GoogleCredentialResponse {
  credential: string
}
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
          }) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

interface GoogleSignInButtonProps {
  onToken: (idToken: string) => void
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

export function GoogleSignInButton({ onToken }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!CLIENT_ID || !containerRef.current) return

    let cancelled = false
    const tryInit = () => {
      if (cancelled) return
      if (!window.google) {
        // The GSI script loads async — retry briefly until it's ready.
        setTimeout(tryInit, 200)
        return
      }
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => onToken(response.credential),
      })
      if (containerRef.current) {
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
        })
      }
    }
    tryInit()
    return () => {
      cancelled = true
    }
  }, [onToken])

  if (!CLIENT_ID) return null

  return <div ref={containerRef} className="flex justify-center" />
}
