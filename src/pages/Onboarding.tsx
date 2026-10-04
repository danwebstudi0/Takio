import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { HandHelping, Handshake, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryIcon } from '@/components/CategoryIcon'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import { categories, skillSuggestions, languageSuggestions } from '@/data/categories'
import type { CategoryId, UserMode } from '@/types'
import { cn } from '@/lib/utils'

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 text-sm transition-all',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'bg-card text-foreground hover:border-primary/50',
      )}
    >
      {children}
    </button>
  )
}

export default function Onboarding() {
  const { t } = useI18n()
  const { currentUser, completeOnboarding, pushToast } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<UserMode | null>(null)
  const [interests, setInterests] = useState<CategoryId[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>(currentUser.languages)

  const showSkills = mode === 'want_help' || mode === 'both'
  const steps = showSkills ? 4 : 3

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  const finish = () => {
    completeOnboarding({ mode: mode ?? 'both', interests, skills, languages })
    pushToast({ title: t('onboarding.welcome', { name: currentUser.name.split(' ')[0] }), variant: 'success' })
    navigate(mode === 'need_help' ? '/create' : '/explore')
  }

  const canContinue = step === 0 ? mode !== null : true

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-10">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex flex-1 gap-1.5">
            {Array.from({ length: steps }).map((_, i) => (
              <div key={i} className={cn('h-1 flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-muted')} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="mt-10 flex-1"
          >
            {step === 0 && (
              <>
                <h1 className="text-2xl font-bold sm:text-3xl">{t('onboarding.title')}</h1>
                <div className="mt-8 space-y-3">
                  {([
                    { id: 'need_help', icon: HandHelping, label: t('action.iNeedHelp') },
                    { id: 'want_help', icon: Handshake, label: t('action.iWantToHelp') },
                    { id: 'both', icon: undefined, label: t('action.both') },
                  ] as const).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setMode(opt.id)}
                      className={cn(
                        'flex w-full items-center gap-4 rounded-2xl border bg-card p-5 text-left transition-all',
                        mode === opt.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/40',
                      )}
                    >
                      {opt.icon && <opt.icon className="h-5 w-5 text-primary" />}
                      <span className="font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="text-2xl font-bold sm:text-3xl">{t('onboarding.interests')}</h1>
                <div className="mt-8 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Chip key={c.id} selected={interests.includes(c.id)} onClick={() => toggle(interests, c.id, setInterests)}>
                      <span className="inline-flex items-center gap-1.5">
                        <CategoryIcon id={c.id} className="h-4 w-4" />
                        {t(`category.${c.id}`)}
                      </span>
                    </Chip>
                  ))}
                </div>
              </>
            )}

            {((showSkills && step === 2)) && (
              <>
                <h1 className="text-2xl font-bold sm:text-3xl">{t('onboarding.skills')}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{t('onboarding.skillsHint')}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {skillSuggestions.map((s) => (
                    <Chip key={s} selected={skills.includes(s)} onClick={() => toggle(skills, s, setSkills)}>
                      {s}
                    </Chip>
                  ))}
                </div>
              </>
            )}

            {((showSkills && step === 3) || (!showSkills && step === 2)) && (
              <>
                <h1 className="text-2xl font-bold sm:text-3xl">{t('onboarding.languages')}</h1>
                <div className="mt-8 flex flex-wrap gap-2">
                  {languageSuggestions.map((l) => (
                    <Chip key={l} selected={languages.includes(l)} onClick={() => toggle(languages, l, setLanguages)}>
                      {l}
                    </Chip>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={finish}>
            {t('action.skip')}
          </button>
          {step < steps - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canContinue}>
              {t('action.continue')}
            </Button>
          ) : (
            <Button onClick={finish}>{t('action.finish')}</Button>
          )}
        </div>
      </div>
    </div>
  )
}
