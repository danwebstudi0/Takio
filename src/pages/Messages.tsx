import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Send, Paperclip, Image as ImageIcon } from 'lucide-react'
import { Avatar } from '@/components/Avatar'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import { timeAgo } from '@/services/format'
import { cn } from '@/lib/utils'

export function MessagesList() {
  const { t } = useI18n()
  const { conversations, messages, requests, userById, currentUser, unreadMessages } = useApp()
  const navigate = useNavigate()

  const myConversations = conversations
    .filter((c) => c.participantIds.includes(currentUser.id))
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt)

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">
        {t('chat.title')}
        {unreadMessages > 0 && (
          <span className="ml-2 rounded-full bg-primary px-2 py-0.5 align-middle text-xs font-semibold text-primary-foreground">
            {unreadMessages}
          </span>
        )}
      </h1>
      <div className="mt-5 space-y-2">
        {myConversations.length === 0 ? (
          <EmptyState title={t('chat.empty')} hint={t('chat.emptyHint')} />
        ) : (
          myConversations.map((c) => {
            const otherId = c.participantIds.find((p) => p !== currentUser.id)!
            const other = userById(otherId)
            const request = requests.find((r) => r.id === c.requestId)
            const last = messages.filter((m) => m.conversationId === c.id).sort((a, b) => b.createdAt - a.createdAt)[0]
            const unread = messages.some((m) => m.conversationId === c.id && !m.read && m.senderId !== currentUser.id)
            if (!other) return null
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/messages/${c.id}`)}
                className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-shadow hover:shadow-md"
              >
                <Avatar user={other} size="md" showOnline />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn('truncate text-sm', unread ? 'font-semibold' : 'font-medium')}>{other.name}</p>
                    {last && (
                      <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(last.createdAt, t)}</span>
                    )}
                  </div>
                  {request && <p className="truncate text-xs text-primary">{request.title}</p>}
                  {last && (
                    <p className={cn('truncate text-sm', unread ? 'text-foreground' : 'text-muted-foreground')}>
                      {last.kind === 'file' ? `📎 ${last.attachmentName}` : last.kind === 'image' ? '🖼' : last.text}
                    </p>
                  )}
                </div>
                {unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export function ChatThread() {
  const { id } = useParams()
  const { t } = useI18n()
  const {
    conversations, messages, requests, userById, currentUser,
    sendMessage, markConversationRead,
  } = useApp()
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const conversation = conversations.find((c) => c.id === id)
  const request = conversation ? requests.find((r) => r.id === conversation.requestId) : undefined
  const other = conversation ? userById(conversation.participantIds.find((p) => p !== currentUser.id)!) : undefined
  const thread = messages
    .filter((m) => m.conversationId === id)
    .sort((a, b) => a.createdAt - b.createdAt)

  const conversationId = conversation?.id
  useEffect(() => {
    if (conversationId) markConversationRead(conversationId)
    // run once when opening the thread
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.length])

  if (!conversation || !other) {
    return <div className="mx-auto max-w-2xl pt-20 text-center text-muted-foreground">{t('chat.empty')}</div>
  }

  const send = () => {
    if (!text.trim()) return
    sendMessage(conversation.id, text.trim())
    setText('')
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem-6rem)] max-w-2xl flex-col md:h-[calc(100vh-3.5rem-5rem)]">
      {/* header */}
      <div className="flex items-center gap-3 border-b pb-3">
        <Link to="/messages" className="text-muted-foreground hover:text-foreground md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Link to={`/profile/${other.id}`}>
          <Avatar user={other} size="sm" showOnline />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{other.name}</p>
          <p className="text-xs text-muted-foreground">
            {other.online ? t('chat.online') : t('chat.offline')}
          </p>
        </div>
      </div>

      {/* linked task banner */}
      {request && (
        <Link
          to={`/requests/${request.id}`}
          className="mt-3 flex items-center justify-between gap-3 rounded-xl border bg-accent/50 px-4 py-2.5 text-sm"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{t('chat.task')}: {request.title}</p>
          </div>
          <span className="shrink-0 text-xs font-medium text-primary">{t('action.viewTask')} →</span>
        </Link>
      )}

      {/* messages */}
      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {thread.map((m) => {
          const mine = m.senderId === currentUser.id
          return (
            <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                  mine
                    ? 'rounded-br-md bg-primary text-primary-foreground'
                    : 'rounded-bl-md bg-muted',
                )}
              >
                {m.kind === 'file' ? (
                  <span className="inline-flex items-center gap-2">📎 {m.attachmentName}</span>
                ) : (
                  m.text
                )}
                <p className={cn('mt-1 text-[10px]', mine ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {timeAgo(m.createdAt, t)}{mine && (m.read ? ' ✓✓' : ' ✓')}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* composer */}
      <div className="flex items-center gap-2 border-t pt-3">
        <Button
          variant="ghost" size="icon" aria-label="attachment"
          onClick={() => sendMessage(conversation.id, 'brief.pdf', 'file', 'brief.pdf')}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" size="icon" aria-label="image"
          onClick={() => sendMessage(conversation.id, '', 'image')}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={t('chat.placeholder')}
          className="flex-1"
        />
        <Button size="icon" onClick={send} disabled={!text.trim()} aria-label={t('action.send')}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
