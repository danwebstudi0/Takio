import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ArrowLeft, Clock, Globe, Heart, MapPin, Trash2, Ban, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Avatar } from '@/components/Avatar'
import { CategoryIcon } from '@/components/CategoryIcon'
import { StatusBadge } from '@/components/StatusBadge'
import { UserCard } from '@/components/UserCard'
import { RequestCard } from '@/components/RequestCard'
import { ApplyModal } from '@/components/ApplyModal'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import { formatBudget, timeAgo, formatMoney } from '@/services/format'
import { matchedHelpers } from '@/services/matching'
import type { RequestStatus } from '@/types'
import { cn } from '@/lib/utils'

const statusFlow: RequestStatus[] = ['open', 'discussion', 'in_progress', 'completed', 'cancelled']

export default function RequestDetail() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { t, locale } = useI18n()
  const {
    requests, userById, currentUser, users, applicationsFor, savedIds,
    toggleSave, setRequestStatus, deleteRequest, pushToast,
  } = useApp()
  const navigate = useNavigate()
  const [applyOpen, setApplyOpen] = useState(false)

  const request = requests.find((r) => r.id === id)

  useEffect(() => {
    if (params.get('apply') === '1') {
      setApplyOpen(true)
      setParams({}, { replace: true })
    }
  }, [params, setParams])

  if (!request) {
    return (
      <div className="mx-auto max-w-2xl text-center pt-20 text-muted-foreground">
        {t('request.deleted')}
      </div>
    )
  }

  const author = userById(request.authorId)
  const isMine = request.authorId === currentUser.id
  const apps = applicationsFor(request.id)
  const saved = savedIds.includes(request.id)
  const alreadyApplied = apps.some((a) => a.userId === currentUser.id)
  const budget = formatBudget(
    request.budgetType, request.budgetMin, request.budgetMax, request.currency,
    locale, t('common.perHour'), t('budget.free'), t('budget.negotiable'),
  )
  const helpers = matchedHelpers(request, users)
  const similar = requests
    .filter((r) => r.id !== request.id && r.category === request.category && r.status === 'open')
    .slice(0, 2)

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t('action.back')}
      </button>

      <Card className="takio-fade-up p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1 font-normal">
              <CategoryIcon id={request.category} className="h-3.5 w-3.5" />
              {t(`category.${request.category}`)}
            </Badge>
            <StatusBadge status={request.status} />
          </div>
          <button
            onClick={() => toggleSave(request.id)}
            aria-label={t('action.save')}
            className="rounded-full p-1.5 text-muted-foreground hover:text-red-500"
          >
            <Heart className={cn('h-5 w-5', saved && 'fill-red-500 text-red-500')} />
          </button>
        </div>

        <h1 className="mt-3 text-2xl font-bold leading-tight">{request.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('request.posted', { time: timeAgo(request.createdAt, t) })} · {t('request.responses_other', { count: apps.length })}
        </p>

        <p className="mt-4 whitespace-pre-wrap leading-relaxed">{request.description}</p>

        {request.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {request.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">{tag}</Badge>
            ))}
          </div>
        )}

        <Separator className="my-5" />

        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">{t('common.budget')}</p>
            <p className="mt-1 font-semibold">{budget}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('common.deadline')}</p>
            <p className="mt-1 font-semibold inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {request.deadline === 'date' ? request.deadlineDate : t(`deadline.${request.deadline}`)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('common.location')}</p>
            <p className="mt-1 font-semibold inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {request.locationType === 'remote' ? t('locationType.remote') : request.location ?? t(`locationType.${request.locationType}`)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('common.language')}</p>
            <p className="mt-1 font-semibold inline-flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> {request.language}
            </p>
          </div>
        </div>

        <Separator className="my-5" />

        {author && (
          <Link to={`/profile/${author.id}`} className="flex items-center gap-3">
            <Avatar user={author} size="md" showOnline />
            <div>
              <p className="font-medium flex items-center gap-1">
                {author.name}
                {author.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
              </p>
              <p className="text-xs text-muted-foreground">
                ★ {author.rating.toFixed(1)} · {author.completedTasks} {t('profile.completedTasks')} · {author.city}, {author.country}
              </p>
            </div>
          </Link>
        )}

        <div className="mt-6 flex gap-3">
          {isMine ? (
            <>
              <Select
                value={request.status}
                onValueChange={(v) => {
                  setRequestStatus(request.id, v as RequestStatus)
                  pushToast({ title: t(`status.${v as RequestStatus}`), variant: 'success' })
                }}
              >
                <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusFlow.map((s) => (
                    <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                aria-label={t('action.delete')}
                onClick={() => {
                  deleteRequest(request.id)
                  pushToast({ title: t('request.deleted') })
                  navigate('/dashboard')
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                className="flex-1"
                disabled={alreadyApplied || request.status !== 'open' && request.status !== 'discussion'}
                onClick={() => setApplyOpen(true)}
              >
                {alreadyApplied ? t('request.offerSent') : t('action.iCanHelp')}
              </Button>
              <Button variant="outline" size="icon" aria-label={t('action.report')}>
                <Ban className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </Card>

      {!isMine && apps.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold">{t('request.responses_other', { count: apps.length })}</h2>
          <div className="mt-3 space-y-2">
            {apps.map((a) => {
              const u = userById(a.userId)
              if (!u) return null
              return (
                <Card key={a.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Link to={`/profile/${u.id}`} className="flex items-center gap-2 min-w-0">
                      <Avatar user={u} size="sm" showOnline />
                      <span className="text-sm font-medium truncate">{u.name}</span>
                    </Link>
                    {a.price != null && (
                      <span className="text-sm font-semibold">{formatMoney(a.price, a.currency, locale)}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{a.message}</p>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {isMine && helpers.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold">{t('request.recommendedHelpers')}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {helpers.map((u) => <UserCard key={u.id} user={u} />)}
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold">{t('request.similar')}</h2>
          <div className="mt-3 space-y-3">
            {similar.map((r) => <RequestCard key={r.id} request={r} compact />)}
          </div>
        </div>
      )}

      <ApplyModal request={request} open={applyOpen} onClose={() => setApplyOpen(false)} />
    </div>
  )
}
