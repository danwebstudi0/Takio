import type { CurrencyCode, Locale } from '@/types'

// ─── Currency formatting ────────────────────────────────────────────────────

const localeMap: Record<Locale, string> = {
  en: 'en-US', ru: 'ru-RU', de: 'de-DE', es: 'es-ES', fr: 'fr-FR',
  pt: 'pt-PT', it: 'it-IT', pl: 'pl-PL', uk: 'uk-UA',
}

export function formatMoney(amount: number, currency: CurrencyCode, locale: Locale = 'en'): string {
  const zeroDecimal = currency === 'JPY'
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: zeroDecimal ? 0 : 0,
  }).format(amount)
}

export function formatBudget(
  budgetType: string,
  min: number | undefined,
  max: number | undefined,
  currency: CurrencyCode,
  locale: Locale,
  perHourLabel: string,
  freeLabel: string,
  negotiableLabel: string,
): string {
  if (budgetType === 'free') return freeLabel
  if (budgetType === 'negotiable') return negotiableLabel
  if (min != null && max != null && min !== max) {
    return `${formatMoney(min, currency, locale)}–${formatMoney(max, currency, locale)}${budgetType === 'hourly' ? perHourLabel : ''}`
  }
  const v = min ?? max
  if (v != null) return `${formatMoney(v, currency, locale)}${budgetType === 'hourly' ? perHourLabel : ''}`
  return negotiableLabel
}

// ─── Relative time ──────────────────────────────────────────────────────────

export function timeAgo(ts: number, t: (k: any, p?: Record<string, string | number>) => string): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return t('time.justNow')
  if (minutes < 60) return t('time.minAgo', { count: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('time.hoursAgo', { count: hours })
  return t('time.daysAgo', { count: Math.floor(hours / 24) })
}
