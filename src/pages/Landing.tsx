import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Search, ArrowRight, HandHelping, Handshake, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RequestCard } from '@/components/RequestCard'
import { CategoryIcon } from '@/components/CategoryIcon'
import { RatingStars } from '@/components/RatingStars'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Logo } from '@/components/layout/AppShell'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import { categories } from '@/data/categories'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.4 },
}

export default function Landing() {
  const { t } = useI18n()
  const { requests } = useApp()
  const navigate = useNavigate()
  const popular = requests.filter((r) => r.status === 'open').slice(0, 3)

  const go = (mode: 'help' | 'work') => navigate(mode === 'help' ? '/create' : '/explore')

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <Logo />
          <div className="flex-1" />
          <LanguageSwitcher />
          <ThemeToggle />
          <Button size="sm" className="ml-2" onClick={() => navigate('/onboarding')}>
            {t('action.getStarted')}
          </Button>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-3xl px-4 pt-20 pb-16 text-center sm:pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight sm:text-6xl"
        >
          {t('landing.heroTitle')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-muted-foreground sm:text-xl"
        >
          {t('landing.heroSubtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <button
            onClick={() => navigate('/explore')}
            className="flex w-full items-center gap-3 rounded-2xl border bg-card px-5 py-4 text-left text-muted-foreground shadow-sm transition-shadow hover:shadow-md"
          >
            <Search className="h-5 w-5 shrink-0" />
            <span className="truncate">{t('landing.searchPlaceholder')}</span>
          </button>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2" onClick={() => go('help')}>
              <HandHelping className="h-4 w-4" /> {t('action.iNeedHelp')}
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => go('work')}>
              <Handshake className="h-4 w-4" /> {t('action.iWantToHelp')}
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{t('brand.tagline')}</p>
        </motion.div>
      </section>

      {/* how it works */}
      <section className="border-t bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.h2 {...fadeUp} className="text-center text-2xl font-bold sm:text-3xl">
            {t('landing.howItWorks')}
          </motion.h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {([
              {
                title: t('landing.needHelp'),
                steps: [
                  [t('landing.step1ask'), t('landing.step1askDesc')],
                  [t('landing.step2offers'), t('landing.step2offersDesc')],
                  [t('landing.step3choose'), t('landing.step3chooseDesc')],
                ],
              },
              {
                title: t('landing.wantHelp'),
                steps: [
                  [t('landing.step1explore'), t('landing.step1exploreDesc')],
                  [t('landing.step2offer'), t('landing.step2offerDesc')],
                  [t('landing.step3done'), t('landing.step3doneDesc')],
                ],
              },
            ]).map((col) => (
              <motion.div key={col.title} {...fadeUp}>
                <h3 className="text-lg font-semibold text-primary">{col.title}</h3>
                <ol className="mt-4 space-y-4">
                  {col.steps.map(([title, desc], i) => (
                    <li key={title} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* popular requests */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <motion.div {...fadeUp} className="flex items-center justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">{t('landing.popularRequests')}</h2>
          <Button variant="ghost" className="gap-1" onClick={() => navigate('/explore')}>
            {t('action.viewAll')} <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {popular.map((r) => <RequestCard key={r.id} request={r} compact />)}
        </div>
      </section>

      {/* categories */}
      <section className="border-t bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.h2 {...fadeUp} className="text-2xl font-bold sm:text-3xl">
            {t('landing.popularCategories')}
          </motion.h2>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {categories.map((c) => (
              <motion.button
                key={c.id} {...fadeUp}
                onClick={() => navigate(`/explore?category=${c.id}`)}
                className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-sm transition-shadow hover:shadow-md"
              >
                <CategoryIcon id={c.id} className="h-6 w-6 text-primary" />
                <span className="text-center text-xs font-medium">{t(`category.${c.id}`)}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* why takio */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <motion.h2 {...fadeUp} className="text-2xl font-bold sm:text-3xl">{t('landing.whyTakio')}</motion.h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {([
            { icon: HandHelping, title: t('landing.why1title'), desc: t('landing.why1desc') },
            { icon: Handshake, title: t('landing.why2title'), desc: t('landing.why2desc') },
            { icon: Globe2, title: t('landing.why3title'), desc: t('landing.why3desc') },
          ]).map((f) => (
            <motion.div key={f.title} {...fadeUp}>
              <Card className="h-full p-6">
                <f.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* social proof */}
      <section className="border-t bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.h2 {...fadeUp} className="text-2xl font-bold sm:text-3xl">{t('landing.reviewsTitle')}</motion.h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { name: 'Daniel K.', city: 'New York', text: 'Posted my logo request at lunch, had three offers by dinner. Wild.' },
              { name: 'Sofia M.', city: 'Barcelona', text: 'I walk dogs on weekends and Takio filled my schedule in a week.' },
              { name: 'Lukas W.', city: 'Berlin', text: 'Fixed two websites and assembled a wardrobe. Feels like the internet used to — helpful.' },
            ].map((r) => (
              <motion.div key={r.name} {...fadeUp}>
                <Card className="h-full p-6">
                  <RatingStars rating={5} />
                  <p className="mt-3 text-sm leading-relaxed">“{r.text}”</p>
                  <p className="mt-4 text-sm font-medium">{r.name} <span className="text-muted-foreground font-normal">· {r.city}</span></p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <motion.h2 {...fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('landing.ctaTitle')}
        </motion.h2>
        <motion.p {...fadeUp} className="mt-3 text-muted-foreground">{t('landing.ctaSubtitle')}</motion.p>
        <motion.div {...fadeUp} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={() => go('help')}>{t('action.iNeedHelp')}</Button>
          <Button size="lg" variant="outline" onClick={() => go('work')}>{t('action.iWantToHelp')}</Button>
        </motion.div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-10 text-center">
          <Logo />
          <p className="text-sm text-muted-foreground">{t('landing.footerTagline')}</p>
          <p className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} Takio</p>
        </div>
      </footer>
    </div>
  )
}
