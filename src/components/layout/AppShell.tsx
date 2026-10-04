import { NavLink, Link, useNavigate } from 'react-router'
import { Home, Compass, PlusCircle, MessageCircle, User as UserIcon, Bell, LayoutDashboard, Bookmark, Settings } from 'lucide-react'
import { Avatar } from '@/components/Avatar'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('text-xl font-bold tracking-tight', className)}>
      takio<span className="text-primary">.</span>
    </Link>
  )
}

export function TopBar() {
  const { t } = useI18n()
  const { currentUser, unreadNotifications, unreadMessages } = useApp()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Logo />
        <div className="flex-1" />
        <LanguageSwitcher />
        <ThemeToggle />
        <button
          onClick={() => navigate('/notifications')}
          className="relative rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t('nav.notifications')}
        >
          <Bell className="h-4.5 w-4.5 h-[18px] w-[18px]" />
          {unreadNotifications > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadNotifications}
            </span>
          )}
        </button>
        <button onClick={() => navigate('/messages')} className="relative rounded-full p-2 text-muted-foreground hover:text-foreground md:hidden" aria-label={t('nav.messages')}>
          <MessageCircle className="h-[18px] w-[18px]" />
          {unreadMessages > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadMessages}
            </span>
          )}
        </button>
        <Link to={`/profile/${currentUser.id}`} className="hidden md:block">
          <Avatar user={currentUser} size="sm" />
        </Link>
      </div>
    </header>
  )
}

const desktopNav = [
  { to: '/', icon: Home, key: 'nav.home' },
  { to: '/explore', icon: Compass, key: 'nav.explore' },
  { to: '/dashboard', icon: LayoutDashboard, key: 'nav.dashboard' },
  { to: '/messages', icon: MessageCircle, key: 'nav.messages' },
  { to: '/saved', icon: Bookmark, key: 'nav.saved' },
  { to: '/settings', icon: Settings, key: 'nav.settings' },
] as const

export function SideBar() {
  const { t } = useI18n()
  const { unreadMessages } = useApp()
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r py-6 md:block">
      <nav className="flex flex-col gap-1 px-3">
        {desktopNav.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{t(key as any)}</span>
            {key === 'nav.messages' && unreadMessages > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {unreadMessages}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export function MobileNav() {
  const { t } = useI18n()
  const { currentUser, unreadMessages } = useApp()
  const item = (isActive: boolean) =>
    cn('flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]', isActive ? 'text-primary' : 'text-muted-foreground')

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-end justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        <NavLink to="/" end className={({ isActive }) => item(isActive)}>
          <Home className="h-5 w-5" />
          {t('nav.home')}
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => item(isActive)}>
          <Compass className="h-5 w-5" />
          {t('nav.explore')}
        </NavLink>
        <NavLink to="/create" className="flex flex-col items-center px-2">
          <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <PlusCircle className="h-6 w-6" />
          </span>
          <span className="py-1 text-[10px] text-muted-foreground">{t('nav.create')}</span>
        </NavLink>
        <NavLink to="/messages" className={({ isActive }) => item(isActive)}>
          <span className="relative">
            <MessageCircle className="h-5 w-5" />
            {unreadMessages > 0 && (
              <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </span>
          {t('nav.messages')}
        </NavLink>
        <NavLink to={`/profile/${currentUser.id}`} className={({ isActive }) => item(isActive)}>
          <UserIcon className="h-5 w-5" />
          {t('nav.profile')}
        </NavLink>
      </div>
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto flex max-w-6xl">
        <SideBar />
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 md:pb-10">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
