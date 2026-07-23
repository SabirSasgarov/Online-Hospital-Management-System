import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { messagesApi, type ListMessagesParams } from '@/lib/api/messages'
import { mapMessage } from '@/lib/adapters'
import { ensureChatConnected } from '@/lib/signalrClient'

/** Subscribes the shared SignalR chat hub connection to refresh the messages cache the instant
 *  the backend pushes a "ReceiveMessage" or "MessageRead" event — replaces the old 5s polling. */
function useChatRealtimeInvalidation() {
  const qc = useQueryClient()

  useEffect(() => {
    let cancelled = false
    let activeConn: Awaited<ReturnType<typeof ensureChatConnected>> = null
    const invalidate = () => qc.invalidateQueries({ queryKey: ['messages'] })

    ensureChatConnected().then((conn) => {
      if (cancelled || !conn) return
      activeConn = conn
      conn.on('ReceiveMessage', invalidate)
      conn.on('MessageRead', invalidate)
    })

    return () => {
      cancelled = true
      activeConn?.off('ReceiveMessage', invalidate)
      activeConn?.off('MessageRead', invalidate)
    }
  }, [qc])
}

export function useMessages(params: ListMessagesParams = {}) {
  useChatRealtimeInvalidation()

  return useQuery({
    queryKey: ['messages', params],
    queryFn: async () => {
      const res = await messagesApi.list(params)
      return res.items.map(mapMessage)
    },
    // Real-time push (see useChatRealtimeInvalidation) handles instant updates; this is just a
    // safety net in case a push is missed (reconnect gap, etc).
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { receiverId: string; content: string }) => messagesApi.send(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  })
}

export function useMarkMessageAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => messagesApi.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  })
}

/** Marks every unread message in a thread as read in one call — used when a conversation is opened. */
export function useMarkThreadAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (messageIds: string[]) => {
      await Promise.all(messageIds.map((id) => messagesApi.markAsRead(id)))
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  })
}
