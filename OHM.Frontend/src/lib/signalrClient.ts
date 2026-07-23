import * as signalR from '@microsoft/signalr'
import { getAccessToken } from '@/lib/tokenStorage'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5182/api'
// The hub is mapped at the host root ("/hubs/chat"), not under "/api" like the REST endpoints.
const HUB_URL = `${API_BASE_URL.replace(/\/api\/?$/, '')}/hubs/chat`

let connection: signalR.HubConnection | null = null

function getConnection(): signalR.HubConnection {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => getAccessToken() ?? '' })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()
  }
  return connection
}

/** Starts the shared chat hub connection if not already connected/connecting. Safe to call repeatedly. */
export async function ensureChatConnected(): Promise<signalR.HubConnection | null> {
  if (!getAccessToken()) return null // not logged in yet — nothing to connect to

  const conn = getConnection()
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    try {
      await conn.start()
    } catch {
      // withAutomaticReconnect handles retries once actually connected; a failed initial start
      // (e.g. token not ready yet) just means the next ensureChatConnected() call tries again.
      return null
    }
  }
  return conn
}

/** Tears down the shared connection — call on logout so the next login gets a fresh connection/token. */
export function stopChatConnection() {
  connection?.stop()
  connection = null
}
