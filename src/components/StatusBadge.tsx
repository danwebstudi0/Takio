import { cn } from '@/lib/utils'
import type { RequestStatus } from '@/types'
import { useI18n } from '@/i18n'

const styles: Record<RequestStatus, string> = {
  open: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  discussion: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  in_progress: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  const { t } = useI18n()
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', styles[status], className)}>
      {t(`status.${status}`)}
    </span>
  )
}
