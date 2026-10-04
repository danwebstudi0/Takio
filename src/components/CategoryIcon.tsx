import {
  Laptop, Palette, PenLine, GraduationCap, Home, Car, PawPrint,
  Camera, Clapperboard, Briefcase, Wrench, Sparkles, type LucideIcon,
} from 'lucide-react'
import type { CategoryId } from '@/types'

const icons: Record<CategoryId, LucideIcon> = {
  technology: Laptop,
  design: Palette,
  writing: PenLine,
  education: GraduationCap,
  home: Home,
  transport: Car,
  pets: PawPrint,
  photography: Camera,
  video: Clapperboard,
  business: Briefcase,
  local: Wrench,
  other: Sparkles,
}

export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const Icon = icons[id] ?? Sparkles
  return <Icon className={className ?? 'h-4 w-4'} />
}
