import type { HelpRequest, Application, Conversation, ChatMessage, Review, AppNotification } from '@/types'

// ─── Demo content ───────────────────────────────────────────────────────────
// Mock data is isolated in this folder. Swapping to a real backend means
// replacing the service layer (src/services) — nothing else changes.

const now = Date.now()
const min = 60_000
const hour = 3_600_000
const day = 86_400_000

export const mockRequests: HelpRequest[] = [
  {
    id: 'r_logo', authorId: 'u_daniel', title: 'Need a logo for my coffee shop',
    description: 'I need a simple modern logo for a small specialty coffee shop in Brooklyn. Warm tones, minimal, works on a cup and a storefront sign. Vector deliverables please.',
    category: 'design', tags: ['Logo Design', 'Branding'],
    budgetType: 'fixed', budgetMin: 80, budgetMax: 120, currency: 'USD',
    deadline: 'week', locationType: 'remote', language: 'English',
    status: 'open', createdAt: now - 12 * min, featured: true,
  },
  {
    id: 'r_fixsite', authorId: 'u_hugo', title: 'Fix my WordPress site — it loads too slowly',
    description: 'My portfolio site takes 8+ seconds to load. Images are optimized already. Need someone to find what is slowing it down and fix it.',
    category: 'technology', tags: ['React', 'Node.js', 'SEO'],
    budgetType: 'fixed', budgetMin: 100, budgetMax: 150, currency: 'EUR',
    deadline: 'flexible', locationType: 'remote', language: 'English',
    status: 'open', createdAt: now - 45 * min, boosted: true,
  },
  {
    id: 'r_dog', authorId: 'u_lukas', title: 'Walk my dog twice this week',
    description: 'Friendly 3-year-old golden retriever needs walks on Tuesday and Thursday around 6pm, 40 minutes each. Mitte area.',
    category: 'pets', tags: ['Dog Walking'],
    budgetType: 'fixed', budgetMin: 30, budgetMax: 40, currency: 'EUR',
    deadline: 'week', locationType: 'in_person', location: 'Berlin, Mitte', language: 'Deutsch',
    status: 'open', createdAt: now - 2 * hour,
  },
  {
    id: 'r_video', authorId: 'u_sofia', title: 'Edit a 60s promo video for my pet sitting page',
    description: 'I have raw phone footage of happy dogs. Need a punchy 60-second edit with subtitles and music for Instagram Reels.',
    category: 'video', tags: ['Video Editing', 'Premiere Pro', 'TikTok'],
    budgetType: 'fixed', budgetMin: 50, budgetMax: 90, currency: 'EUR',
    deadline: 'week', locationType: 'remote', language: 'English',
    status: 'open', createdAt: now - 5 * hour,
  },
  {
    id: 'r_tutor', authorId: 'u_amelia', title: 'Looking for a math tutor for my son (GCSE)',
    description: 'My son is preparing for GCSE maths. Two online sessions a week, evenings. Patient tutor needed.',
    category: 'education', tags: ['Tutoring', 'Math'],
    budgetType: 'hourly', budgetMin: 20, budgetMax: 30, currency: 'GBP',
    deadline: 'flexible', locationType: 'remote', language: 'English',
    status: 'open', createdAt: now - 8 * hour,
  },
  {
    id: 'r_ikea', authorId: 'u_yuki', title: 'Assemble IKEA wardrobe + mount two shelves',
    description: 'PAX wardrobe (150cm) and two LACK shelves. All tools welcome — I have none. Weekend preferred.',
    category: 'home', tags: ['Furniture Assembly', 'Repairs'],
    budgetType: 'fixed', budgetMin: 4000, budgetMax: 6000, currency: 'JPY',
    deadline: 'week', locationType: 'in_person', location: 'Tokyo, Setagaya', language: '日本語',
    status: 'open', createdAt: now - 1 * day,
  },
  {
    id: 'r_translate', authorId: 'u_kira', title: 'Translate landing page EN → JA (800 words)',
    description: 'Marketing landing page for a SaaS tool. Need natural, native-level Japanese, not machine translation. Glossary provided.',
    category: 'writing', tags: ['Translation', 'Copywriting'],
    budgetType: 'fixed', budgetMin: 60, budgetMax: 60, currency: 'EUR',
    deadline: 'week', locationType: 'remote', language: 'English',
    status: 'discussion', createdAt: now - 1 * day - 3 * hour,
  },
  {
    id: 'r_photos', authorId: 'u_marek', title: 'Photographer for a small birthday event (30 people)',
    description: 'Need a photographer for 3 hours on Saturday evening in Warsaw. Candid style, no heavy editing needed, just color correction.',
    category: 'photography', tags: ['Event Photography'],
    budgetType: 'fixed', budgetMin: 600, budgetMax: 900, currency: 'PLN',
    deadline: 'date', deadlineDate: new Date(now + 6 * day).toISOString().slice(0, 10),
    locationType: 'in_person', location: 'Warsaw, Śródmieście', language: 'Polski',
    status: 'open', createdAt: now - 2 * day,
  },
  {
    id: 'r_ads', authorId: 'u_olena', title: 'Set up Instagram ads for my tutoring profile',
    description: 'I want to reach parents in Kyiv and online. Small test budget first. Need someone to set up targeting and creatives.',
    category: 'business', tags: ['Ads Setup', 'Marketing'],
    budgetType: 'negotiable', currency: 'UAH',
    deadline: 'flexible', locationType: 'remote', language: 'Українська',
    status: 'open', createdAt: now - 2 * day - 5 * hour,
  },
  {
    id: 'r_excel', authorId: 'u_daniel', title: 'Help me automate an Excel report',
    description: 'Monthly sales report takes me 3 hours of copy-paste. Need formulas or a macro to automate it. One-time task.',
    category: 'technology', tags: ['Excel', 'Python'],
    budgetType: 'free', currency: 'USD',
    deadline: 'today', locationType: 'remote', language: 'English',
    status: 'open', createdAt: now - 30 * min,
  },
  {
    id: 'r_moving', authorId: 'u_hugo', title: 'Help moving a sofa across town',
    description: 'One two-seater sofa from Le Marais to Montmartre, this Saturday morning. Van required — I will help carry.',
    category: 'transport', tags: ['Moving', 'Delivery'],
    budgetType: 'fixed', budgetMin: 50, budgetMax: 80, currency: 'EUR',
    deadline: 'date', deadlineDate: new Date(now + 4 * day).toISOString().slice(0, 10),
    locationType: 'in_person', location: 'Paris', language: 'Français',
    status: 'open', createdAt: now - 3 * day,
  },
  {
    id: 'r_clean', authorId: 'u_yuki', title: 'Deep clean a 1-bedroom apartment',
    description: 'Moving out next week. Need a full deep clean: kitchen, bathroom, windows. Supplies provided.',
    category: 'local', tags: ['Cleaning'],
    budgetType: 'fixed', budgetMin: 8000, budgetMax: 12000, currency: 'JPY',
    deadline: 'week', locationType: 'in_person', location: 'Tokyo, Shibuya', language: '日本語',
    status: 'completed', createdAt: now - 6 * day,
  },
]

export const mockApplications: Application[] = [
  { id: 'a1', requestId: 'r_logo', userId: 'u_amelia', message: 'I design coffee & hospitality brands — portfolio attached. First concepts within 48h.', price: 110, currency: 'USD', status: 'pending', createdAt: now - 8 * min },
  { id: 'a2', requestId: 'r_logo', userId: 'u_kira', message: 'I can do a bold minimal mark plus motion version for your socials.', price: 120, currency: 'USD', status: 'pending', createdAt: now - 4 * min },
  { id: 'a3', requestId: 'r_fixsite', userId: 'u_lukas', message: 'Likely render-blocking scripts or an old plugin stack. I can audit and fix in a day.', price: 130, currency: 'EUR', status: 'pending', createdAt: now - 30 * min },
  { id: 'a4', requestId: 'r_dog', userId: 'u_sofia', message: 'I walk dogs in Mitte every evening — golden retrievers are my favorite!', price: 35, currency: 'EUR', status: 'pending', createdAt: now - 1 * hour },
  { id: 'a5', requestId: 'r_video', userId: 'u_kira', message: 'Vertical Reels edits are my daily work. Music + dynamic subtitles included.', price: 75, currency: 'EUR', status: 'pending', createdAt: now - 3 * hour },
  { id: 'a6', requestId: 'r_tutor', userId: 'u_olena', message: 'I tutor GCSE-level maths online, evenings work perfectly.', price: 25, currency: 'GBP', status: 'pending', createdAt: now - 6 * hour },
  { id: 'a7', requestId: 'r_translate', userId: 'u_yuki', message: 'Native Japanese, 5 years of SaaS localization. Happy to do a test paragraph.', currency: 'EUR', status: 'accepted', createdAt: now - 20 * hour },
]

// Conversation between the demo user (u_me) and Amelia about the logo task.
export const mockConversations: Conversation[] = [
  { id: 'c1', requestId: 'r_logo', participantIds: ['u_me', 'u_amelia'], applicationId: 'a1', lastMessageAt: now - 3 * min },
  { id: 'c2', requestId: 'r_translate', participantIds: ['u_me', 'u_yuki'], applicationId: 'a7', lastMessageAt: now - 5 * hour },
]

export const mockMessages: ChatMessage[] = [
  { id: 'm1', conversationId: 'c1', senderId: 'u_amelia', kind: 'text', text: 'Hi! Saw your logo request — love coffee shop branding ☕', createdAt: now - 40 * min, read: true },
  { id: 'm2', conversationId: 'c1', senderId: 'u_me', kind: 'text', text: 'Hey Amelia! Your portfolio looks great. Can you share a couple of café projects?', createdAt: now - 35 * min, read: true },
  { id: 'm3', conversationId: 'c1', senderId: 'u_amelia', kind: 'text', text: 'Sure — sending two case studies now.', createdAt: now - 10 * min, read: true },
  { id: 'm4', conversationId: 'c1', senderId: 'u_amelia', kind: 'file', text: 'coffee-branding-cases.pdf', attachmentName: 'coffee-branding-cases.pdf', createdAt: now - 9 * min, read: true },
  { id: 'm5', conversationId: 'c1', senderId: 'u_amelia', kind: 'text', text: 'I can have first concepts ready by Thursday if that works?', createdAt: now - 3 * min, read: false },
  { id: 'm6', conversationId: 'c2', senderId: 'u_yuki', kind: 'text', text: 'Hello! I sent a test translation paragraph — did it arrive?', createdAt: now - 6 * hour, read: true },
  { id: 'm7', conversationId: 'c2', senderId: 'u_me', kind: 'text', text: 'Yes! Reads very naturally. Let’s proceed with the full page.', createdAt: now - 5 * hour, read: true },
]

export const mockReviews: Review[] = [
  { id: 'rv1', authorId: 'u_daniel', targetId: 'u_amelia', requestId: 'r_logo', rating: 5, text: 'Amelia delivered three amazing concepts ahead of schedule. Communication was perfect.', createdAt: now - 20 * day },
  { id: 'rv2', authorId: 'u_hugo', targetId: 'u_lukas', requestId: 'r_fixsite', rating: 5, text: 'Site went from 8s to 1.2s. Lukas explained everything clearly.', createdAt: now - 15 * day },
  { id: 'rv3', authorId: 'u_lukas', targetId: 'u_sofia', requestId: 'r_dog', rating: 5, text: 'Baxter adores Sofia. Always on time, sends photo updates.', createdAt: now - 10 * day },
  { id: 'rv4', authorId: 'u_me', targetId: 'u_yuki', requestId: 'r_translate', rating: 5, text: 'Native-level translation, delivered early. Will work together again.', createdAt: now - 4 * day },
  { id: 'rv5', authorId: 'u_amelia', targetId: 'u_me', requestId: 'r_logo', rating: 5, text: 'Clear brief, quick feedback, instant payment. Dream client.', createdAt: now - 4 * day },
]

export const mockNotifications: AppNotification[] = [
  { id: 'n1', userId: 'u_me', type: 'new_application', actorName: 'Amelia Clarke', requestTitle: 'Need a logo for my coffee shop', requestId: 'r_logo', createdAt: now - 8 * min, read: false },
  { id: 'n2', userId: 'u_me', type: 'new_message', actorName: 'Amelia Clarke', conversationId: 'c1', createdAt: now - 3 * min, read: false },
  { id: 'n3', userId: 'u_me', type: 'new_application', actorName: 'Kira Novak', requestTitle: 'Need a logo for my coffee shop', requestId: 'r_logo', createdAt: now - 4 * min, read: false },
  { id: 'n4', userId: 'u_me', type: 'application_accepted', actorName: 'Yuki Tanaka', requestTitle: 'Translate landing page EN → JA', requestId: 'r_translate', createdAt: now - 20 * hour, read: true },
  { id: 'n5', userId: 'u_me', type: 'new_review', actorName: 'Amelia Clarke', createdAt: now - 4 * day, read: true },
]
