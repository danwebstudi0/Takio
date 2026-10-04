import { Moon, Sun, Globe, CreditCard, UserRound } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Avatar } from '@/components/Avatar'
import { useApp } from '@/store/AppContext'
import { useI18n, localeList, localeNames } from '@/i18n'
import { useTheme } from '@/hooks/useTheme'
import type { Locale, ThemeMode } from '@/types'

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const { currentUser } = useApp()

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

      <div className="mt-6 space-y-4">
        <Card className="flex items-center gap-4 p-5">
          <Avatar user={currentUser} size="lg" />
          <div>
            <p className="font-medium flex items-center gap-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              {currentUser.name}
            </p>
            <p className="text-sm text-muted-foreground">{currentUser.username} · {currentUser.city}</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {t('settings.language')}
            </Label>
            <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {localeList.map((l) => (
                  <SelectItem key={l} value={l}>{localeNames[l]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <Label className="flex items-center gap-2 text-sm font-medium">
              {theme === 'dark' ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
              {t('settings.theme')}
            </Label>
            <Select value={theme} onValueChange={(v) => setTheme(v as ThemeMode)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('settings.light')}</SelectItem>
                <SelectItem value="dark">{t('settings.dark')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            {t('settings.payments')}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{t('settings.paymentsSoon')}</p>
        </Card>
      </div>
    </div>
  )
}
