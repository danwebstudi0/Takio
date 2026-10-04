import { cn } from '@/lib/utils'
import type { User } from '@/types'

// Initials avatar on a deterministic HSL gradient seeded by the user.
interface AvatarProps {
  user: Pick<User, 'name' | 'avatarHue' | 'online'>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showOnline?: boolean
  className?: string
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
}

export function Avatar({ user, size = 'md', showOnline = false, className }: AvatarProps) {
  const initials = user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn('flex items-center justify-center rounded-full font-semibold text-white', sizes[size])}
        style={{
          background: `linear-gradient(135deg, hsl(${user.avatarHue} 70% 55%), hsl(${(user.avatarHue + 40) % 360} 65% 45%))`,
        }}
      >
        {initials}
      </div>
      {showOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-card',
            user.online ? 'bg-emerald-500' : 'bg-muted-foreground/40',
            size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5',
          )}
        />
      )}
    </div>
  )
}
