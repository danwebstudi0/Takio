import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { RequestCard } from '@/components/RequestCard'
import { EmptyState } from '@/components/EmptyState'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import { categories } from '@/data/categories'
import { matchedRequests } from '@/services/matching'
import type { BudgetType, CategoryId, LocationType, RequestFilters } from '@/types'
import { cn } from '@/lib/utils'

export default function Explore() {
  const { t } = useI18n()
  const { requests, currentUser, applications } = useApp()
  const [params] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [forYou, setForYou] = useState(false)
  const [filters, setFilters] = useState<RequestFilters>({
    query: '',
    category: (params.get('category') as CategoryId) ?? 'all',
    budgetType: 'all',
    locationType: 'all',
    sort: 'newest',
  })

  const results = useMemo(() => {
    let list = forYou
      ? matchedRequests(requests, currentUser)
      : requests.filter((r) => r.status === 'open')

    const q = filters.query.trim().toLowerCase()
    if (q) {
      list = list.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
    }
    if (filters.category !== 'all') list = list.filter((r) => r.category === filters.category)
    if (filters.budgetType !== 'all') list = list.filter((r) => r.budgetType === filters.budgetType)
    if (filters.locationType !== 'all') {
      list = list.filter((r) => r.locationType === filters.locationType || r.locationType === 'both')
    }

    const sorted = [...list]
    if (filters.sort === 'newest') sorted.sort((a, b) => b.createdAt - a.createdAt)
    if (filters.sort === 'budget') sorted.sort((a, b) => (b.budgetMax ?? 0) - (a.budgetMax ?? 0))
    if (filters.sort === 'popular') {
      const count = (id: string) => applications.filter((a) => a.requestId === id).length
      sorted.sort((a, b) => count(b.id) - count(a.id))
    }
    // boosted first always
    sorted.sort((a, b) => Number(b.boosted ?? false) - Number(a.boosted ?? false))
    return sorted
  }, [requests, filters, forYou, currentUser, applications])

  const set = <K extends keyof RequestFilters>(k: K, v: RequestFilters[K]) =>
    setFilters((f) => ({ ...f, [k]: v }))

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('explore.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('explore.subtitle')}</p>
        </div>
        <Badge
          variant={forYou ? 'default' : 'outline'}
          className={cn('cursor-pointer', !forYou && 'text-muted-foreground')}
          onClick={() => setForYou(!forYou)}
        >
          {t('explore.forYou')}
        </Badge>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => set('query', e.target.value)}
            placeholder={t('explore.searchPlaceholder')}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} aria-label={t('explore.filters')}>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="takio-fade-up mt-3 grid grid-cols-2 gap-2 rounded-xl border bg-card p-3 sm:grid-cols-4">
          <Select value={filters.category} onValueChange={(v) => set('category', v as CategoryId | 'all')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('explore.allCategories')}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{t(`category.${c.id}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.budgetType} onValueChange={(v) => set('budgetType', v as BudgetType | 'all')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('explore.anyBudget')}</SelectItem>
              <SelectItem value="fixed">{t('budget.fixed')}</SelectItem>
              <SelectItem value="hourly">{t('budget.hourly')}</SelectItem>
              <SelectItem value="negotiable">{t('budget.negotiable')}</SelectItem>
              <SelectItem value="free">{t('budget.free')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.locationType} onValueChange={(v) => set('locationType', v as LocationType | 'all')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('explore.anyLocation')}</SelectItem>
              <SelectItem value="remote">{t('locationType.remote')}</SelectItem>
              <SelectItem value="in_person">{t('locationType.in_person')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.sort} onValueChange={(v) => set('sort', v as RequestFilters['sort'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('explore.sortNewest')}</SelectItem>
              <SelectItem value="popular">{t('explore.sortPopular')}</SelectItem>
              <SelectItem value="budget">{t('explore.sortBudget')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {results.length === 0 ? (
          <EmptyState title={t('explore.empty')} />
        ) : (
          results.map((r) => <RequestCard key={r.id} request={r} />)
        )}
      </div>
    </div>
  )
}
