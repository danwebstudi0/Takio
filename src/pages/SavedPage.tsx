import { Bookmark } from 'lucide-react'
import { RequestCard } from '@/components/RequestCard'
import { EmptyState } from '@/components/EmptyState'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'

export default function SavedPage() {
  const { t } = useI18n()
  const { requests, savedIds } = useApp()
  const saved = requests.filter((r) => savedIds.includes(r.id))

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">{t('saved.title')}</h1>
      <div className="mt-5 space-y-4">
        {saved.length === 0 ? (
          <EmptyState icon={Bookmark} title={t('saved.empty')} hint={t('saved.emptyHint')} />
        ) : (
          saved.map((r) => <RequestCard key={r.id} request={r} />)
        )}
      </div>
    </div>
  )
}
