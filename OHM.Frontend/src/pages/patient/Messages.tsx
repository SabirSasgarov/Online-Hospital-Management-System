import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useMessages, useSendMessage, useMarkThreadAsRead } from '@/hooks/useMessages'
import { useDoctors } from '@/hooks/useDoctors'
import { cn } from '@/lib/utils'

export default function PatientMessages() {
  const { user } = useAuth()
  const [selected, setSelected] = useState<string | null>(null)
  const [newMsg, setNewMsg] = useState('')

  const { data: messages = [] } = useMessages()
  const { data: doctorsData } = useDoctors({ pageSize: 200 })
  const sendMessage = useSendMessage()
  const markThreadAsRead = useMarkThreadAsRead()

  const allDoctorsRaw = doctorsData?.doctors ?? []

  const myConvos = Array.from(
    new Set(messages.filter(m => m.senderId === user?.id || m.receiverId === user?.id).map(m => m.senderId === user?.id ? m.receiverId : m.senderId))
  ).map(did => {
    const thread = messages.filter(m => (m.senderId === did && m.receiverId === user?.id) || (m.senderId === user?.id && m.receiverId === did))
    const last = thread[thread.length - 1]
    const unread = thread.filter(m => m.receiverId === user?.id && !m.read).length
    return { personId: did, personName: last.senderId === did ? last.senderName : last.receiverName, lastMessage: last.content, unread }
  })

  const allDoctors = allDoctorsRaw.filter(d => d.userId && !myConvos.some(c => c.personId === d.userId))
  // Oldest first so the conversation reads top-to-bottom, newest message at the bottom (standard chat UX).
  const thread = messages
    .filter(m => (m.senderId === selected && m.receiverId === user?.id) || (m.senderId === user?.id && m.receiverId === selected))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const threadEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: 'end' })
  }, [selected, thread.length])

  const openConversation = (personId: string) => {
    setSelected(personId)
    const unreadIds = messages
      .filter(m => m.senderId === personId && m.receiverId === user?.id && !m.read)
      .map(m => m.id)
    if (unreadIds.length > 0) markThreadAsRead.mutate(unreadIds)
  }

  const send = () => {
    if (!newMsg.trim() || !selected) return
    sendMessage.mutate({ receiverId: selected, content: newMsg })
    setNewMsg('')
  }

  return (
    <div>
      <PageHeader title="Messages" description="Communicate with your doctors" />
      <div className="flex h-[calc(100vh-120px)]">
        <div className="w-72 border-r border-gray-200 bg-white overflow-y-auto">
          {myConvos.map(c => (
            <button key={c.personId} onClick={() => openConversation(c.personId)} className={cn('w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors', selected === c.personId && 'bg-green-50')}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-semibold shrink-0">
                  {c.personName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.personName}</p>
                    {c.unread > 0 && <Badge className="text-xs h-5 min-w-5">{c.unread}</Badge>}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
          {allDoctors.length > 0 && (
            <div className="p-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-400 mb-2">Your Doctors</p>
              {allDoctors.map(d => (
                <button key={d.id} onClick={() => openConversation(d.userId!)} className={cn('w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center gap-2', selected === d.userId && 'bg-green-50')}>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {d.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate text-gray-800">{d.name}</p>
                    <p className="text-xs text-gray-400">{d.specialization}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col bg-gray-50">
          {selected ? (
            <>
              <div className="border-b border-gray-200 bg-white px-4 py-3">
                <p className="font-medium text-gray-900">
                  {myConvos.find(c => c.personId === selected)?.personName ?? allDoctorsRaw.find(d => d.userId === selected)?.name}
                </p>
                <p className="text-xs text-gray-400">Doctor</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {thread.length === 0 && <p className="text-center text-xs text-gray-400 mt-8">No messages yet. Start the conversation!</p>}
                {thread.map(msg => (
                  <div key={msg.id} className={cn('flex', msg.senderId === user?.id ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[70%] rounded-2xl px-4 py-2 text-sm', msg.senderId === user?.id ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm')}>
                      <p>{msg.content}</p>
                      <p className={cn('text-xs mt-1', msg.senderId === user?.id ? 'text-green-200' : 'text-gray-400')}>
                        {new Date(msg.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={threadEndRef} />
              </div>
              <div className="border-t border-gray-200 bg-white p-3 flex gap-2">
                <Input placeholder="Type a message..." value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="flex-1" />
                <Button onClick={send} disabled={!newMsg.trim()} className="bg-green-600 hover:bg-green-700"><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center"><p className="text-gray-400 text-sm">Select a doctor to message</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
