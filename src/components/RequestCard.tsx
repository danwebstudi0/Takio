import { Link, useNavigate } from 'react-router'
import { Heart, MapPin, Clock, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/Avatar'
import { CategoryIcon } from '@/components/CategoryIcon'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import { formatBudget, timeAgo } from '@/services/format'
import type { HelpRequest } from '@/types'
import { cn } from '@/lib/utils'

export function RequestCard({ request, compact = false }: { request: HelpRequest; compact?: boolean }) {
  const { t, locale } = useI18n()
  const { userById, applicationsFor, savedIds, toggleSave } = useApp()
  const navigate = useNavigate()
  const author = userById(request.authorId)
  const saved = savedIds.includes(request.id)
  const responseCount = applicationsFor(request.id).length

  const budget = formatBudget(
    request.budgetType, request.budgetMin, request.budgetMax, request.currency,
    locale, t('common.perHour'), t('budget.free'), t('budget.negotiable'),
  )

  return (
    <Card
      className={cn(
        'takio-fade-up relative p-4 sm:p-5 transition-shadow hover:shadow-md cursor-pointer',
        request.featured && 'ring-1 ring-primary/40',
      )}
      onClick={() => navigate(`/requests/${request.id}`)}
    >
      {request.boosted && (
        <span className="absolute -top-2 left-4 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          <Zap className="h-3 w-3" /> Boost
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1 font-normal">
              <CategoryIcon id={request.category} className="h-3.5 w-3.5" />
              {t(`category.${request.category}`)}
            </Badge>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {t('request.posted', { time: timeAgo(request.createdAt, t) })}
            </span>
          </div>
          <h3 className="mt-2 font-semibold leading-snug line-clamp-2">{request.title}</h3>
          {!compact && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{request.description}</p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleSave(request.id) }}
          aria-label={t('action.save')}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
        >
          <Heart className={cn('h-5 w-5', saved && 'fill-red-500 text-red-500')} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3 text-sm flex-wrap">
        <span className="font-semibold">{budget}</span>
        <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
          <MapPin className="h-3.5 w-3.5" />
          {request.locationType === 'remote'
            ? t('locationType.remote')
            : request.location ?? t(`locationType.${request.locationType}`)}
        </span>
        <span className="text-xs text-muted-foreground">{t(`deadline.${request.deadline}`)}</span>
        {responseCount > 0 && (
          <span className="text-xs text-muted-foreground">
            · {t('request.responses_other', { count: responseCount })}
          </span>
        )}
      </div>

      {!compact && author && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3">
          <Link
            to={`/profile/${author.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 min-w-0"
          >
            <Avatar user={author} size="sm" showOnline />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{author.name}</p>
              <p className="text-xs text-muted-foreground">★ {author.rating.toFixed(1)} · {author.city}</p>
            </div>
          </Link>
          <Button
            size="sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/requests/${request.id}?apply=1`) }}
          >
            {t('action.iCanHelp')}
          </Button>
        </div>
      )}
    </Card>
  )
}
