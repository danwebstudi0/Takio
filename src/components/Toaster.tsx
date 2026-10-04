import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useApp } from '@/store/AppContext'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'takio-fade-up flex items-start gap-3 rounded-xl border bg-card p-4 shadow-lg',
            toast.variant === 'success' && 'border-emerald-500/30',
            toast.variant === 'destructive' && 'border-red-500/30',
          )}
        >
          {toast.variant === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : toast.variant === 'destructive' ? (
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          ) : (
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.description && <p className="text-xs text-muted-foreground mt-0.5">{toast.description}</p>}
          </div>
          <button onClick={() => dismissToast(toast.id)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
