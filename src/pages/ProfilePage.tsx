import { useNavigate, useParams } from 'react-router'
import { BadgeCheck, MapPin, Globe, CalendarDays } from 'lucide-react'
import { Avatar } from '@/components/Avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RatingStars } from '@/components/RatingStars'
import { RequestCard } from '@/components/RequestCard'
import { EmptyState } from '@/components/EmptyState'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'

export default function ProfilePage() {
  const { id } = useParams()
  const { t } = useI18n()
  const { userById, currentUser, requests, reviews, users, signOut } = useApp()
  const navigate = useNavigate()

  const user = userById(id ?? currentUser.id)
  if (!user) return null

  const isMe = user.id === currentUser.id
  const userReviews = reviews.filter((r) => r.targetId === user.id)
  const activeRequests = requests.filter((r) => r.authorId === user.id && r.status === 'open')

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="takio-fade-up p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-5">
          <Avatar user={user} size="xl" showOnline />
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center justify-center gap-1.5 text-2xl font-bold sm:justify-start">
              {user.name}
              {user.verified && <BadgeCheck className="h-5 w-5 text-primary" aria-label={t('profile.verified')} />}
            </h1>
            <p className="text-sm text-muted-foreground">{user.username}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:justify-start">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{user.city}, {user.country}</span>
              <span className="inline-flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{user.languages.join(', ')}</span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {t('profile.memberSince', { date: new Date(user.joinedAt).toLocaleDateString() })}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
              <RatingStars rating={user.rating} />
              <span className="text-sm font-medium">{user.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                · {user.completedTasks} {t('profile.completedTasks')}
              </span>
            </div>
            <Badge variant="secondary" className="mt-3">{t(`profile.mode.${user.mode}`)}</Badge>
          </div>
          <div className="flex gap-2">
            {isMe ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                {t('action.editProfile')}
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/messages')}>{t('action.message')}</Button>
            )}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="about" className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="about" className="flex-1">{t('profile.about')}</TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">{t('profile.reviews')}</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">{t('profile.activity')}</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-4 space-y-6">
          <div>
            <h2 className="font-semibold">{t('profile.about')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
          </div>
          <div>
            <h2 className="font-semibold">{t('profile.skills')}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
          <div>
            <h2 className="font-semibold">{t('profile.languages')}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.languages.map((l) => <Badge key={l} variant="outline">{l}</Badge>)}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4 space-y-3">
          {userReviews.length === 0 ? (
            <EmptyState title={t('profile.noReviews')} />
          ) : (
            userReviews.map((r) => {
              const author = users.find((u) => u.id === r.authorId)
              return (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {author && <Avatar user={author} size="sm" />}
                      <span className="text-sm font-medium">{author?.name}</span>
                    </div>
                    <RatingStars rating={r.rating} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-4 space-y-4">
          <h2 className="font-semibold">{t('profile.activeRequests')}</h2>
          {activeRequests.length === 0 ? (
            <EmptyState title={t('dashboard.noRequests')} />
          ) : (
            activeRequests.map((r) => <RequestCard key={r.id} request={r} compact />)
          )}
        </TabsContent>
      </Tabs>

      {isMe && (
        <div className="mt-8 text-center">
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => { signOut(); navigate('/') }}>
            {t('action.signOut')}
          </Button>
        </div>
      )}
    </div>
  )
}
