import type { CategoryId } from '@/types'

// ─── Categories ─────────────────────────────────────────────────────────────
// Data-driven: add a new category here and every screen picks it up
// without touching components.

export interface CategoryDef {
  id: CategoryId
  icon: string // lucide icon name is resolved in the CategoryIcon component
}

export const categories: CategoryDef[] = [
  { id: 'technology', icon: 'laptop' },
  { id: 'design', icon: 'palette' },
  { id: 'writing', icon: 'pen-line' },
  { id: 'education', icon: 'graduation-cap' },
  { id: 'home', icon: 'home' },
  { id: 'transport', icon: 'car' },
  { id: 'pets', icon: 'paw-print' },
  { id: 'photography', icon: 'camera' },
  { id: 'video', icon: 'clapperboard' },
  { id: 'business', icon: 'briefcase' },
  { id: 'local', icon: 'wrench' },
  { id: 'other', icon: 'sparkles' },
]

export const skillSuggestions: string[] = [
  'Figma', 'Photoshop', 'Branding', 'Logo Design', 'UI/UX',
  'React', 'TypeScript', 'Node.js', 'Python', 'Excel',
  'Copywriting', 'Translation', 'Proofreading', 'SEO',
  'Tutoring', 'Math', 'English', 'Piano',
  'Cleaning', 'Furniture Assembly', 'Moving', 'Repairs',
  'Driving', 'Delivery', 'Dog Walking', 'Pet Sitting',
  'Portrait Photography', 'Event Photography', 'Video Editing',
  'Premiere Pro', 'After Effects', 'TikTok', 'Marketing',
  'Ads Setup', 'Consulting', 'Accounting', 'Legal Advice',
]

export const languageSuggestions: string[] = [
  'English', 'Русский', 'Deutsch', 'Español', 'Français',
  'Português', 'Italiano', 'Polski', 'Українська', '日本語', '中文', 'Čeština',
]
