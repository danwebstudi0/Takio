import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { CategoryIcon } from '@/components/CategoryIcon'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import { categories } from '@/data/categories'
import { formatBudget } from '@/services/format'
import type { BudgetType, CurrencyCode, DeadlineType, LocationType, RequestDraft } from '@/types'
import { cn } from '@/lib/utils'

const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'PLN', 'JPY', 'CZK', 'UAH']
const budgetTypes: BudgetType[] = ['fixed', 'hourly', 'negotiable', 'free']
const deadlineTypes: DeadlineType[] = ['today', 'week', 'flexible', 'date']
const locationTypes: LocationType[] = ['remote', 'in_person', 'both']

function OptionButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl border bg-card px-4 py-3 text-sm font-medium transition-all',
        selected ? 'border-primary ring-1 ring-primary text-foreground' : 'text-muted-foreground hover:border-primary/40',
      )}
    >
      {children}
    </button>
  )
}

export default function CreateRequest() {
  const { t, locale } = useI18n()
  const { createRequest, pushToast } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [tagsInput, setTagsInput] = useState('')
  const [draft, setDraft] = useState<RequestDraft>({
    title: '', description: '', category: null, tags: [],
    budgetType: 'fixed', currency: 'EUR',
    deadline: 'flexible', locationType: 'remote', language: 'English',
  })

  const set = <K extends keyof RequestDraft>(k: K, v: RequestDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }))

  const stepValid = [
    draft.title.trim().length >= 4,
    draft.description.trim().length >= 10,
    true, // budget
    true, // deadline
    draft.locationType === 'remote' || !!draft.location?.trim(),
    draft.category !== null,
    true, // preview
  ][step]

  const publish = () => {
    const tags = tagsInput.split(',').map((s) => s.trim()).filter(Boolean)
    const req = createRequest({ ...draft, tags })
    pushToast({ title: t('create.published'), description: t('create.publishedDesc'), variant: 'success' })
    navigate(`/requests/${req.id}`)
  }

  const budgetPreview = formatBudget(
    draft.budgetType, draft.budgetMin, draft.budgetMax, draft.currency,
    locale, t('common.perHour'), t('budget.free'), t('budget.negotiable'),
  )

  const stepTitles = [
    t('create.step1'), t('create.step2'), t('create.step3'),
    t('create.step4'), t('create.step5'), t('create.step6'), t('create.preview'),
  ]

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">{t('create.title')}</h1>

      <div className="mt-4 flex gap-1.5">
        {stepTitles.map((_, i) => (
          <div key={i} className={cn('h-1 flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-muted')} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold">{stepTitles[step]}</h2>

          {step === 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">{t('create.step1hint')}</p>
              <Input
                value={draft.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder={t('create.titlePlaceholder')}
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">{t('create.step2hint')}</p>
              <Textarea
                value={draft.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder={t('create.descPlaceholder')}
                rows={6}
                autoFocus
              />
              <div>
                <Label className="text-xs text-muted-foreground">{t('create.tags')}</Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Logo Design, Figma"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {budgetTypes.map((bt) => (
                  <OptionButton key={bt} selected={draft.budgetType === bt} onClick={() => set('budgetType', bt)}>
                    {t(`budget.${bt}`)}
                  </OptionButton>
                ))}
              </div>
              {(draft.budgetType === 'fixed' || draft.budgetType === 'hourly') && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('create.min')}</Label>
                    <Input type="number" min={0} className="mt-1" value={draft.budgetMin ?? ''}
                      onChange={(e) => set('budgetMin', e.target.value ? Number(e.target.value) : undefined)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('create.max')}</Label>
                    <Input type="number" min={0} className="mt-1" value={draft.budgetMax ?? ''}
                      onChange={(e) => set('budgetMax', e.target.value ? Number(e.target.value) : undefined)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('common.budget')}</Label>
                    <Select value={draft.currency} onValueChange={(v) => set('currency', v as CurrencyCode)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {deadlineTypes.map((dt) => (
                  <OptionButton key={dt} selected={draft.deadline === dt} onClick={() => set('deadline', dt)}>
                    {t(`deadline.${dt}`)}
                  </OptionButton>
                ))}
              </div>
              {draft.deadline === 'date' && (
                <Input type="date" value={draft.deadlineDate ?? ''}
                  onChange={(e) => set('deadlineDate', e.target.value)} aria-label={t('create.pickDate')} />
              )}
            </div>
          )}

          {step === 4 && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {locationTypes.map((lt) => (
                  <OptionButton key={lt} selected={draft.locationType === lt} onClick={() => set('locationType', lt)}>
                    {t(`locationType.${lt}`)}
                  </OptionButton>
                ))}
              </div>
              {(draft.locationType === 'in_person' || draft.locationType === 'both') && (
                <Input
                  value={draft.location ?? ''}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder={t('create.locationCity')}
                />
              )}
            </div>
          )}

          {step === 5 && (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {categories.map((c) => (
                <button
                  key={c.id} type="button" onClick={() => set('category', c.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-xs font-medium transition-all',
                    draft.category === c.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/40',
                  )}
                >
                  <CategoryIcon id={c.id} className="h-5 w-5 text-primary" />
                  <span className="text-center">{t(`category.${c.id}`)}</span>
                </button>
              ))}
            </div>
          )}

          {step === 6 && (
            <Card className="mt-4 p-5">
              <Badge variant="secondary" className="gap-1 font-normal">
                <CategoryIcon id={draft.category ?? 'other'} className="h-3.5 w-3.5" />
                {t(`category.${draft.category ?? 'other'}`)}
              </Badge>
              <h3 className="mt-2 font-semibold">{draft.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{draft.description}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span className="font-semibold">{budgetPreview}</span>
                <span className="text-muted-foreground">
                  {draft.deadline === 'date' ? draft.deadlineDate : t(`deadline.${draft.deadline}`)}
                </span>
                <span className="text-muted-foreground">
                  {draft.locationType === 'remote' ? t('locationType.remote') : draft.location ?? t(`locationType.${draft.locationType}`)}
                </span>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))}>
          <ArrowLeft className="mr-1 h-4 w-4" /> {t('action.back')}
        </Button>
        {step < 6 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!stepValid}>
            {t('action.next')} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={publish}>{t('action.publishRequest')}</Button>
        )}
      </div>
    </div>
  )
}
