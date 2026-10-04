import { Link } from 'react-router'
import { BellRing, MessageCircle, Star, UserPlus, CheckCircle2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import { timeAgo } from '@/services/format'
import type { NotificationType } from '@/types'
import { cn } from '@/lib/utils'

const icons: Record<NotificationType, typeof BellRing> = {
  new_application: UserPlus,
  application_accepted: CheckCircle2,
  new_message: MessageCircle,
  task_completed: CheckCircle2,
  new_review: Star,
  status_changed: RefreshCw,
}

export default function NotificationsPage() {
  const { t } = useI18n()
  const { notifications, markAllNotificationsRead } = useApp()

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
        {notifications.some((n) => !n.read) && (
          <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
            {t('action.markAllRead')}
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-2">
        {notifications.length === 0 ? (
          <EmptyState icon={BellRing} title={t('notifications.empty')} />
        ) : (
          notifications.map((n) => {
            const Icon = icons[n.type]
            const body = t(`notif.${n.type}`, {
              actor: n.actorName ?? '',
              title: n.requestTitle ?? '',
              status: '',
            })
            const href = n.conversationId ? `/messages/${n.conversationId}` : n.requestId ? `/requests/${n.requestId}` : '/notifications'
            return (
              <Link
                key={n.id}
                to={href}
                className={cn(
                  'flex items-start gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md',
                  !n.read && 'border-primary/30 bg-accent/40',
                )}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{body}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(n.createdAt, t)}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
