// ─── Takio domain types ───────────────────────────────────────────────────
// Shared, reusable TypeScript types for the whole product.
// These map 1:1 to the future database schema (Supabase tables).

export type Locale = 'en' | 'ru' | 'de' | 'es' | 'fr' | 'pt' | 'it' | 'pl' | 'uk'

export type ThemeMode = 'light' | 'dark'

export type CategoryId =
  | 'technology'
  | 'design'
  | 'writing'
  | 'education'
  | 'home'
  | 'transport'
  | 'pets'
  | 'photography'
  | 'video'
  | 'business'
  | 'local'
  | 'other'

export type BudgetType = 'fixed' | 'hourly' | 'negotiable' | 'free'

export type DeadlineType = 'today' | 'week' | 'flexible' | 'date'

export type LocationType = 'remote' | 'in_person' | 'both'

export type RequestStatus = 'open' | 'discussion' | 'in_progress' | 'completed' | 'cancelled'

export type UserMode = 'need_help' | 'want_help' | 'both'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PLN' | 'JPY' | 'CZK' | 'UAH'

export type ApplicationStatus = 'pending' | 'accepted' | 'declined'

export type MessageKind = 'text' | 'image' | 'file'

export type NotificationType =
  | 'new_application'
  | 'application_accepted'
  | 'new_message'
  | 'task_completed'
  | 'new_review'
  | 'status_changed'

export interface User {
  id: string
  name: string
  username: string
  /** Initials-based avatar: gradient seed color */
  avatarHue: number
  country: string
  city: string
  languages: string[]
  bio: string
  skills: string[]
  interests: CategoryId[]
  rating: number
  reviewsCount: number
  completedTasks: number
  mode: UserMode
  online: boolean
  verified: boolean
  joinedAt: number
}

export interface HelpRequest {
  id: string
  authorId: string
  title: string
  description: string
  category: CategoryId
  tags: string[]
  budgetType: BudgetType
  budgetMin?: number
  budgetMax?: number
  currency: CurrencyCode
  deadline: DeadlineType
  deadlineDate?: string
  locationType: LocationType
  location?: string
  language: string
  status: RequestStatus
  createdAt: number
  boosted?: boolean
  featured?: boolean
}

export interface Application {
  id: string
  requestId: string
  userId: string
  message: string
  price?: number
  currency: CurrencyCode
  status: ApplicationStatus
  createdAt: number
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  kind: MessageKind
  text: string
  attachmentName?: string
  createdAt: number
  read: boolean
}

export interface Conversation {
  id: string
  requestId: string
  /** [requestAuthorId, helperId] */
  participantIds: [string, string]
  applicationId?: string
  lastMessageAt: number
}

export interface Review {
  id: string
  authorId: string
  targetId: string
  requestId: string
  rating: number
  text: string
  createdAt: number
}

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  /** display params resolved at render time via i18n */
  actorName?: string
  requestTitle?: string
  requestId?: string
  conversationId?: string
  createdAt: number
  read: boolean
}

export interface RequestDraft {
  title: string
  description: string
  category: CategoryId | null
  tags: string[]
  budgetType: BudgetType
  budgetMin?: number
  budgetMax?: number
  currency: CurrencyCode
  deadline: DeadlineType
  deadlineDate?: string
  locationType: LocationType
  location?: string
  language: string
}

export interface RequestFilters {
  query: string
  category: CategoryId | 'all'
  budgetType: BudgetType | 'all'
  locationType: LocationType | 'all'
  maxBudget?: number
  sort: 'newest' | 'popular' | 'budget'
}

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'destructive'
}
