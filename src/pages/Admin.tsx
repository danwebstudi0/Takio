import { Routes, Route, Navigate } from 'react-router'
import { ShieldCheck, Users, FileWarning, CreditCard } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useI18n } from '@/i18n'

// ─── Admin area ─────────────────────────────────────────────────────────────
// Separate route tree (/admin/*) so admin logic never mixes with user flows.
// Modules below are placeholders wired to the future moderation/payments APIs.

function AdminHome() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <ShieldCheck className="h-6 w-6 text-primary" /> {t('admin.title')}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{t('admin.soon')}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Users, label: '/admin/users' },
          { icon: FileWarning, label: '/admin/reports' },
          { icon: CreditCard, label: '/admin/payments' },
        ].map((m) => (
          <Card key={m.label} className="p-5 text-center">
            <m.icon className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 font-mono text-xs text-muted-foreground">{m.label}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
