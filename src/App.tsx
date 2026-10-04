import { Routes, Route, Navigate } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Toaster } from '@/components/Toaster'
import { useApp } from '@/store/AppContext'
import Landing from '@/pages/Landing'
import Onboarding from '@/pages/Onboarding'
import Explore from '@/pages/Explore'
import RequestDetail from '@/pages/RequestDetail'
import CreateRequest from '@/pages/CreateRequest'
import Dashboard from '@/pages/Dashboard'
import { MessagesList, ChatThread } from '@/pages/Messages'
import NotificationsPage from '@/pages/NotificationsPage'
import SavedPage from '@/pages/SavedPage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import { AdminRoutes } from '@/pages/Admin'

export default function App() {
  const { hasOnboarded } = useApp()

  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/"
          element={hasOnboarded ? <AppShell><Dashboard /></AppShell> : <Landing />}
        />
        <Route path="/explore" element={<AppShell><Explore /></AppShell>} />
        <Route path="/requests/:id" element={<AppShell><RequestDetail /></AppShell>} />
        <Route path="/create" element={<AppShell><CreateRequest /></AppShell>} />
        <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
        <Route path="/messages" element={<AppShell><MessagesList /></AppShell>} />
        <Route path="/messages/:id" element={<AppShell><ChatThread /></AppShell>} />
        <Route path="/notifications" element={<AppShell><NotificationsPage /></AppShell>} />
        <Route path="/saved" element={<AppShell><SavedPage /></AppShell>} />
        <Route path="/profile/:id" element={<AppShell><ProfilePage /></AppShell>} />
        <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
        <Route path="/admin/*" element={<AppShell><AdminRoutes /></AppShell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}
