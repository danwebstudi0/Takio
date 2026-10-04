import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

export function EmptyState({
  icon: Icon = Inbox, title, hint, children,
}: { icon?: LucideIcon; title: string; hint?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
      <Icon className="h-8 w-8 text-muted-foreground/50" />
      <p className="font-medium text-muted-foreground">{title}</p>
      {hint && <p className="max-w-xs text-sm text-muted-foreground/70">{hint}</p>}
      {children}
    </div>
  )
}
