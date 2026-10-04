import type { User } from '@/types'

// ─── Demo users ─────────────────────────────────────────────────────────────
// Realistic international users. `u_me` is the local demo account.
// Avatars are initials rendered on an HSL gradient seeded by avatarHue.

const now = Date.now()
const day = 86_400_000

export const mockUsers: User[] = [
  {
    id: 'u_me', name: 'Sam Rivera', username: '@samrivera', avatarHue: 245,
    country: 'Spain', city: 'Barcelona', languages: ['English', 'Español'],
    bio: 'Product-minded maker. I ask for design help and offer web development in return.',
    skills: ['React', 'TypeScript', 'UI/UX'], interests: ['design', 'technology', 'video'],
    rating: 4.8, reviewsCount: 12, completedTasks: 14, mode: 'both', online: true,
    verified: true, joinedAt: now - 210 * day,
  },
  {
    id: 'u_amelia', name: 'Amelia Clarke', username: '@ameliac', avatarHue: 15,
    country: 'United Kingdom', city: 'London', languages: ['English'],
    bio: 'Brand designer, 8 years. Logos, identity systems, coffee-fuelled.',
    skills: ['Branding', 'Logo Design', 'Figma', 'Photoshop'], interests: ['design', 'photography'],
    rating: 4.9, reviewsCount: 27, completedTasks: 31, mode: 'want_help', online: true,
    verified: true, joinedAt: now - 400 * day,
  },
  {
    id: 'u_lukas', name: 'Lukas Weber', username: '@lukasw', avatarHue: 160,
    country: 'Germany', city: 'Berlin', languages: ['Deutsch', 'English'],
    bio: 'Full-stack developer. I fix websites and build small tools.',
    skills: ['React', 'Node.js', 'TypeScript', 'Python'], interests: ['technology'],
    rating: 4.7, reviewsCount: 19, completedTasks: 22, mode: 'both', online: false,
    verified: true, joinedAt: now - 320 * day,
  },
  {
    id: 'u_kira', name: 'Kira Novak', username: '@kiranovak', avatarHue: 285,
    country: 'Czech Republic', city: 'Prague', languages: ['Čeština', 'English', 'Русский'],
    bio: 'Video editor for creators. Premiere Pro & After Effects.',
    skills: ['Video Editing', 'Premiere Pro', 'After Effects', 'TikTok'], interests: ['video', 'photography'],
    rating: 5.0, reviewsCount: 9, completedTasks: 10, mode: 'want_help', online: true,
    verified: false, joinedAt: now - 90 * day,
  },
  {
    id: 'u_marek', name: 'Marek Kowalski', username: '@marekk', avatarHue: 200,
    country: 'Poland', city: 'Warsaw', languages: ['Polski', 'English'],
    bio: 'Handyman — furniture assembly, small repairs, moving help.',
    skills: ['Furniture Assembly', 'Repairs', 'Moving'], interests: ['home', 'local'],
    rating: 4.6, reviewsCount: 34, completedTasks: 41, mode: 'want_help', online: true,
    verified: true, joinedAt: now - 500 * day,
  },
  {
    id: 'u_sofia', name: 'Sofia Marino', username: '@sofiam', avatarHue: 330,
    country: 'Spain', city: 'Barcelona', languages: ['Español', 'English', 'Italiano'],
    bio: 'Dog walker and pet sitter. Your dog will love me.',
    skills: ['Dog Walking', 'Pet Sitting'], interests: ['pets'],
    rating: 4.9, reviewsCount: 52, completedTasks: 60, mode: 'want_help', online: false,
    verified: true, joinedAt: now - 600 * day,
  },
  {
    id: 'u_daniel', name: 'Daniel Kim', username: '@danielk', avatarHue: 100,
    country: 'USA', city: 'New York', languages: ['English'],
    bio: 'Growth marketer. Ads setup, analytics, landing pages.',
    skills: ['Marketing', 'Ads Setup', 'SEO', 'Excel'], interests: ['business', 'technology'],
    rating: 4.5, reviewsCount: 16, completedTasks: 18, mode: 'both', online: true,
    verified: false, joinedAt: now - 180 * day,
  },
  {
    id: 'u_yuki', name: 'Yuki Tanaka', username: '@yukit', avatarHue: 0,
    country: 'Japan', city: 'Tokyo', languages: ['日本語', 'English'],
    bio: 'Photographer — events and portraits. Also EN↔JP translation.',
    skills: ['Event Photography', 'Portrait Photography', 'Translation'], interests: ['photography', 'writing'],
    rating: 4.8, reviewsCount: 21, completedTasks: 24, mode: 'want_help', online: false,
    verified: true, joinedAt: now - 260 * day,
  },
  {
    id: 'u_olena', name: 'Olena Shevchenko', username: '@olenas', avatarHue: 50,
    country: 'Ukraine', city: 'Kyiv', languages: ['Українська', 'English'],
    bio: 'Math tutor for school and university. Online or in person.',
    skills: ['Tutoring', 'Math', 'English'], interests: ['education'],
    rating: 5.0, reviewsCount: 14, completedTasks: 15, mode: 'want_help', online: true,
    verified: false, joinedAt: now - 120 * day,
  },
  {
    id: 'u_hugo', name: 'Hugo Laurent', username: '@hugol', avatarHue: 220,
    country: 'France', city: 'Paris', languages: ['Français', 'English'],
    bio: 'Copywriter. Landing pages, newsletters, brand voice.',
    skills: ['Copywriting', 'SEO', 'Proofreading'], interests: ['writing', 'business'],
    rating: 4.7, reviewsCount: 11, completedTasks: 13, mode: 'want_help', online: true,
    verified: true, joinedAt: now - 150 * day,
  },
]

export const currentUserId = 'u_me'
