import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RatingStars({ rating, className, size = 14 }: { rating: number; className?: string; size?: number }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}
        />
      ))}
    </span>
  )
}
