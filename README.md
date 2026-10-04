# Takio

**Need something? Ask. Can do something? Help.**

Takio is a two-sided marketplace MVP: some users post what they need, others find those
requests and offer their help. It covers freelance, one-off tasks, local services,
consulting and everyday help — in 9 languages, mobile-first, with dark mode.

![Status](https://img.shields.io/badge/status-MVP-blue)

---

## Features

- **Landing page** — hero, how-it-works (both sides), popular requests, categories, social proof, CTA
- **Explore** — live feed of requests with search, filters (category, budget type, location, sort) and a "Matches your skills" mode
- **Create request** — 6-step wizard (title → description → budget → deadline → location → category) with live preview
- **Apply flow** — "I can help" modal → offer with optional price → instant chat thread + notification
- **Chat** — conversation list with unread badges, thread with linked-task banner, attachments, read receipts, online status
- **Matching** — rule-based scoring by category / tags / skills / language (isolated in `src/services/matching.ts`, ready to be replaced by AI matching)
- **Profiles** — rating, completed tasks, reviews, skills, languages, activity
- **Dashboard** — activity stats, my requests, my tasks
- **Notifications center**, **Saved items** (persisted), **Settings** (language, theme)
- **Task statuses** — Open → In discussion → In progress → Completed / Cancelled
- **i18n** — English, Русский, Deutsch, Español, Français, Português, Italiano, Polski, Українська (auto-detects browser language)
- **Dark mode** — persisted, respects system preference
- **Admin area** — separate `/admin/*` route tree, ready for moderation/users/reports/payments modules

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18 + TypeScript + Vite |
| Styling  | Tailwind CSS + shadcn/ui |
| Icons    | Lucide |
| Motion   | Framer Motion |
| Routing  | React Router 7 |
| State    | React Context (mock data + local state) |
| Backend  | Supabase-ready (see `.env.example`) — swap the service layer to go live |

## Project structure

```
src/
├── types/            # Shared domain types (mirror the future DB schema)
├── i18n/
│   ├── locales/      # One dictionary per language — add a file to add a language
│   └── index.tsx     # I18nProvider + useI18n hook
├── data/             # Mock data (users, requests, categories) — isolated, easy to swap
├── services/         # Business logic: matching, currency/time formatting
├── store/            # AppContext — global state & actions (mirrors future API surface)
├── hooks/            # useTheme etc.
├── components/
│   ├── ui/           # shadcn/ui primitives
│   ├── layout/       # AppShell, TopBar, SideBar, MobileNav
│   └── …             # RequestCard, UserCard, ApplyModal, Toaster, …
└── pages/            # Landing, Onboarding, Explore, RequestDetail, CreateRequest,
                      # Dashboard, Messages, Notifications, Saved, Profile, Settings, Admin
```

Data flow: `UI → feature logic (pages/components) → store actions → services → data`.
To connect a real backend, replace the action implementations in `src/store/AppContext.tsx`
and the reads in `src/data/` — the UI stays untouched.

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Environment variables

```bash
cp .env.example .env
```

All variables are optional for the MVP (it runs on mock data). They become relevant
when connecting Supabase (auth, database, realtime chat) and Stripe (payments).

## Connecting Supabase (future)

1. Create a project at supabase.com
2. Tables: `users`, `requests`, `applications`, `conversations`, `messages`,
   `reviews`, `notifications`, `saved_items`, `transactions`
3. Put `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into `.env`
4. Replace store actions with Supabase queries; enable Realtime on `messages`

## Deployment

Any static host works (Vercel, Netlify, Cloudflare Pages):

```bash
npm run build
# deploy the dist/ folder
```

Add SPA rewrites (`/* → /index.html`) if you enable absolute asset paths.

## Roadmap

- [ ] Real auth (email + Google) via Supabase
- [ ] Realtime chat
- [ ] Stripe: commission, Boost, Featured, Pro subscription
- [ ] Escrow, refunds, transaction history
- [ ] AI matching & recommendations
- [ ] Push notifications
- [ ] Admin panel modules (moderation, reports, payments)
- [ ] Mobile app (React Native, shared types/services)
