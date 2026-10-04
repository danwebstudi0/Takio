import { Link } from 'react-router'
import { BadgeCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/Avatar'
import type { User } from '@/types'

export function UserCard({ user, subtitle }: { user: User; subtitle?: string }) {
  return (
    <Link to={`/profile/${user.id}`}>
      <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
        <Avatar user={user} size="lg" showOnline />
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate flex items-center gap-1">
            {user.name}
            {user.verified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
          </p>
          <p className="text-xs text-muted-foreground truncate">{subtitle ?? user.skills.slice(0, 3).join(' · ')}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            ★ {user.rating.toFixed(1)} · {user.completedTasks} ✓
          </p>
        </div>
      </Card>
    </Link>
  )
}
