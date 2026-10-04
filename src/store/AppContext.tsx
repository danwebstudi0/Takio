// ─── Application state ──────────────────────────────────────────────────────
// Single store for the MVP. The action surface mirrors the future API:
// swap these implementations for Supabase calls and the UI stays untouched.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type {
  Application, AppNotification, ChatMessage, Conversation, HelpRequest,
  RequestDraft, RequestStatus, Review, Toast, User, UserMode,
} from '@/types'
import { mockUsers, currentUserId } from '@/data/mockUsers'
import { mockRequests, mockApplications, mockConversations, mockMessages, mockReviews, mockNotifications } from '@/data/mockData'

let idCounter = 1000
const uid = (p: string) => `${p}_${idCounter++}`

interface OnboardingPayload {
  mode: UserMode
  interests: User['interests']
  skills: string[]
  languages: string[]
}

interface AppState {
  currentUser: User
  users: User[]
  requests: HelpRequest[]
  applications: Application[]
  conversations: Conversation[]
  messages: ChatMessage[]
  reviews: Review[]
  notifications: AppNotification[]
  savedIds: string[]
  hasOnboarded: boolean
  toasts: Toast[]

  completeOnboarding: (payload: OnboardingPayload) => void
  createRequest: (draft: RequestDraft) => HelpRequest
  deleteRequest: (id: string) => void
  setRequestStatus: (id: string, status: RequestStatus) => void
  applyToRequest: (requestId: string, message: string, price?: number) => { application: Application; conversation: Conversation }
  toggleSave: (requestId: string) => void
  sendMessage: (conversationId: string, text: string, kind?: ChatMessage['kind'], attachmentName?: string) => void
  markConversationRead: (conversationId: string) => void
  markAllNotificationsRead: () => void
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  updateProfile: (patch: Partial<User>) => void
  pushToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  signOut: () => void

  // derived
  userById: (id: string) => User | undefined
  applicationsFor: (requestId: string) => Application[]
  unreadNotifications: number
  unreadMessages: number
}

const AppContext = createContext<AppState | null>(null)

const ONBOARD_KEY = 'takio_onboarded'
const SAVED_KEY = 'takio_saved'

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [requests, setRequests] = useState<HelpRequest[]>(mockRequests)
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications)
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]') } catch { return [] }
  })
  const [hasOnboarded, setHasOnboarded] = useState(() => localStorage.getItem(ONBOARD_KEY) === '1')
  const [toasts, setToasts] = useState<Toast[]>([])

  const currentUser = users.find((u) => u.id === currentUserId)!

  const pushToast = (toast: Omit<Toast, 'id'>) => {
    const id = uid('t')
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const completeOnboarding = (payload: OnboardingPayload) => {
    setUsers((prev) => prev.map((u) => (u.id === currentUserId ? { ...u, ...payload } : u)))
    setHasOnboarded(true)
    localStorage.setItem(ONBOARD_KEY, '1')
  }

  const createRequest = (draft: RequestDraft): HelpRequest => {
    const req: HelpRequest = {
      ...draft,
      id: uid('r'),
      authorId: currentUserId,
      category: draft.category ?? 'other',
      status: 'open',
      createdAt: Date.now(),
    }
    setRequests((prev) => [req, ...prev])
    return req
  }

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
    setApplications((prev) => prev.filter((a) => a.requestId !== id))
  }

  const notify = (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications((prev) => [{ ...n, id: uid('n'), createdAt: Date.now(), read: false }, ...prev])
  }

  const setRequestStatus = (id: string, status: RequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    const req = requests.find((r) => r.id === id)
    if (req && req.authorId !== currentUserId) {
      notify({ userId: currentUserId, type: status === 'completed' ? 'task_completed' : 'status_changed', requestTitle: req.title, requestId: id })
    }
  }

  const applyToRequest = (requestId: string, message: string, price?: number) => {
    const req = requests.find((r) => r.id === requestId)!
    const application: Application = {
      id: uid('a'), requestId, userId: currentUserId, message,
      price, currency: req.currency, status: 'pending', createdAt: Date.now(),
    }
    setApplications((prev) => [...prev, application])
    const conversation: Conversation = {
      id: uid('c'), requestId, participantIds: [req.authorId, currentUserId],
      applicationId: application.id, lastMessageAt: Date.now(),
    }
    setConversations((prev) => [conversation, ...prev])
    const msg: ChatMessage = {
      id: uid('m'), conversationId: conversation.id, senderId: currentUserId,
      kind: 'text', text: message, createdAt: Date.now(), read: true,
    }
    setMessages((prev) => [...prev, msg])
    if (req.status === 'open') {
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'discussion' } : r)))
    }
    return { application, conversation }
  }

  const toggleSave = (requestId: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(requestId) ? prev.filter((x) => x !== requestId) : [...prev, requestId]
      localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      return next
    })
  }

  const sendMessage = (conversationId: string, text: string, kind: ChatMessage['kind'] = 'text', attachmentName?: string) => {
    const msg: ChatMessage = {
      id: uid('m'), conversationId, senderId: currentUserId,
      kind, text, attachmentName, createdAt: Date.now(), read: true,
    }
    setMessages((prev) => [...prev, msg])
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, lastMessageAt: Date.now() } : c)),
    )
  }

  const markConversationRead = (conversationId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.conversationId === conversationId && m.senderId !== currentUserId ? { ...m, read: true } : m)),
    )
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const addReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    setReviews((prev) => [...prev, { ...review, id: uid('rv'), createdAt: Date.now() }])
    notify({ userId: currentUserId, type: 'new_review', actorName: currentUser.name })
  }

  const updateProfile = (patch: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === currentUserId ? { ...u, ...patch } : u)))
  }

  const signOut = () => {
    setHasOnboarded(false)
    localStorage.removeItem(ONBOARD_KEY)
  }

  const value = useMemo<AppState>(() => {
    const myNotifications = notifications.filter((n) => n.userId === currentUserId)
    return {
      currentUser, users, requests, applications, conversations, messages, reviews,
      notifications: myNotifications, savedIds, hasOnboarded, toasts,
      completeOnboarding, createRequest, deleteRequest, setRequestStatus,
      applyToRequest, toggleSave, sendMessage, markConversationRead,
      markAllNotificationsRead, addReview, updateProfile, pushToast, dismissToast, signOut,
      userById: (id) => users.find((u) => u.id === id),
      applicationsFor: (requestId) => applications.filter((a) => a.requestId === requestId),
      unreadNotifications: myNotifications.filter((n) => !n.read).length,
      unreadMessages: messages.filter((m) => {
        if (m.read || m.senderId === currentUserId) return false
        const conv = conversations.find((c) => c.id === m.conversationId)
        return !!conv && conv.participantIds.includes(currentUserId)
      }).length,
    }
  }, [users, requests, applications, conversations, messages, reviews, notifications, savedIds, hasOnboarded, toasts])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
