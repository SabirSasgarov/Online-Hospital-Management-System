import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { messagesApi, type ListMessagesParams } from '@/lib/api/messages'
import { mapMessage } from '@/lib/adapters'

export function useMessages(params: ListMessagesParams = {}) {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: async () => {
      const res = await messagesApi.list(params)
      return res.items.map(mapMessage)
    },
    // Messaging pages poll so both sides see new messages / read-receipts without a manual refresh.
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
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
