import { Link } from 'react-router'
import { MessageCircle, ClipboardList, CheckCircle2, PlusCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RequestCard } from '@/components/RequestCard'
import { EmptyState } from '@/components/EmptyState'
import { Avatar } from '@/components/Avatar'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'

export default function Dashboard() {
  const { t } = useI18n()
  const { currentUser, requests, applications, unreadMessages } = useApp()

  const myRequests = requests.filter((r) => r.authorId === currentUser.id)
  const activeRequests = myRequests.filter((r) => r.status !== 'completed' && r.status !== 'cancelled')
  // tasks where the user is helping (has an accepted/pending application on someone else's request)
  const myApplications = applications.filter((a) => a.userId === currentUser.id)
  const myTasks = requests.filter((r) => myApplications.some((a) => a.requestId === r.id))
  const completedCount = currentUser.completedTasks

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-4">
        <Avatar user={currentUser} size="lg" showOnline />
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-sm text-muted-foreground">{currentUser.name}</p>
        </div>
      </div>

      {/* activity stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: ClipboardList, value: activeRequests.length, label: t('dashboard.activeRequests') },
          { icon: CheckCircle2, value: completedCount, label: t('dashboard.completedTasks') },
          { icon: MessageCircle, value: unreadMessages, label: t('dashboard.unreadMessages') },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <s.icon className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="requests" className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="requests" className="flex-1">{t('dashboard.myRequests')}</TabsTrigger>
          <TabsTrigger value="tasks" className="flex-1">{t('dashboard.myTasks')}</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="mt-4 space-y-4">
          <Link to="/create">
            <Button variant="outline" className="w-full gap-2 border-dashed">
              <PlusCircle className="h-4 w-4" /> {t('action.postRequest')}
            </Button>
          </Link>
          {myRequests.length === 0 ? (
            <EmptyState title={t('dashboard.noRequests')} />
          ) : (
            myRequests.map((r) => <RequestCard key={r.id} request={r} />)
          )}
        </TabsContent>
        <TabsContent value="tasks" className="mt-4 space-y-4">
          {myTasks.length === 0 ? (
            <EmptyState title={t('dashboard.noTasks')} />
          ) : (
            myTasks.map((r) => <RequestCard key={r.id} request={r} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
