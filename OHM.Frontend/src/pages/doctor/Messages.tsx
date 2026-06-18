import { useState } from 'react'
import { Send } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { mockMessages } from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'
import type { Message } from '@/types'
import { cn } from '@/lib/utils'

export default function DoctorMessages() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selected, setSelected] = useState<string | null>(null)
  const [newMsg, setNewMsg] = useState('')

  const conversations = Array.from(
    new Set(messages.filter(m => m.senderId === user?.id || m.receiverId === user?.id).map(m => m.senderId === user?.id ? m.receiverId : m.senderId))
  ).map(pid => {
    const conv = messages.filter(m => (m.senderId === pid && m.receiverId === user?.id) || (m.senderId === user?.id && m.receiverId === pid))
    const last = conv[conv.length - 1]
    const unread = conv.filter(m => m.receiverId === user?.id && !m.read).length
    return { personId: pid, personName: last.senderId === pid ? last.senderName : last.receiverName, lastMessage: last.content, timestamp: last.timestamp, unread }
  })

  const thread = messages.filter(m => (m.senderId === selected && m.receiverId === user?.id) || (m.senderId === user?.id && m.receiverId === selected))

  const send = () => {
    if (!newMsg.trim() || !selected) return
    const conv = conversations.find(c => c.personId === selected)
    const msg: Message = {
      id: `M${Date.now()}`,
      senderId: user?.id ?? '',
      senderName: user?.name ?? '',
      receiverId: selected,
      receiverName: conv?.personName ?? '',
      content: newMsg,
      timestamp: new Date().toISOString(),
      read: false,
    }
    setMessages(m => [...m, msg])
    setNewMsg('')
  }

  return (
    <div>
      <PageHeader title="Messages" description="Communicate with your patients" />
      <div className="flex h-[calc(100vh-120px)]">
        <div className="w-72 border-r border-gray-200 bg-white overflow-y-auto">
          {conversations.map(c => (
            <button
              key={c.personId}
              onClick={() => setSelected(c.personId)}
              className={cn('w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors', selected === c.personId && 'bg-blue-50')}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold shrink-0">
                  {c.personName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{c.personName}</p>
                    {c.unread > 0 && <Badge className="text-xs h-5 min-w-5 flex items-center justify-center">{c.unread}</Badge>}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
          {conversations.length === 0 && <p className="p-4 text-xs text-gray-400">No conversations yet</p>}
        </div>

        <div className="flex-1 flex flex-col bg-gray-50">
          {selected ? (
            <>
              <div className="border-b border-gray-200 bg-white px-4 py-3">
                <p className="font-medium text-gray-900">{conversations.find(c => c.personId === selected)?.personName}</p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {thread.map(msg => (
                  <div key={msg.id} className={cn('flex', msg.senderId === user?.id ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[70%] rounded-2xl px-4 py-2 text-sm', msg.senderId === user?.id ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm')}>
                      <p>{msg.content}</p>
                      <p className={cn('text-xs mt-1', msg.senderId === user?.id ? 'text-blue-200' : 'text-gray-400')}>
                        {new Date(msg.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 bg-white p-3 flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  className="flex-1"
                />
                <Button onClick={send} disabled={!newMsg.trim()}><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
