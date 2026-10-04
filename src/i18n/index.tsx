// ─── i18n system ──────────────────────────────────────────────────────────
// Locale dictionaries live in ./locales. Add a new language by creating
// a new dictionary file and registering it in `dictionaries` below.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Locale } from '@/types'
import { en, type TranslationKey } from './locales/en'
import { ru } from './locales/ru'
import { de } from './locales/de'
import { es } from './locales/es'
import { fr } from './locales/fr'
import { pt } from './locales/pt'
import { it } from './locales/it'
import { pl } from './locales/pl'
import { uk } from './locales/uk'

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en, ru, de, es, fr, pt, it, pl, uk,
}

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  it: 'Italiano',
  pl: 'Polski',
  uk: 'Українська',
}

export const localeList: Locale[] = ['en', 'ru', 'de', 'es', 'fr', 'pt', 'it', 'pl', 'uk']

const STORAGE_KEY = 'takio_locale'

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function detectInitialLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (saved && localeList.includes(saved)) return saved
  const nav = navigator.language.slice(0, 2).toLowerCase() as Locale
  return localeList.includes(nav) ? nav : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale)

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    t: (key, params) => {
      let str = dictionaries[locale][key] ?? en[key] ?? key
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replaceAll(`{${k}}`, String(v))
        }
      }
      return str
    },
  }), [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
