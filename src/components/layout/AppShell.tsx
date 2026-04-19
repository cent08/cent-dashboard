'use client'

import { useState, useEffect, ReactNode } from 'react'
import Sidebar from './Sidebar'
import { DataProvider, useData } from '@/lib/DataContext'

interface AppShellProps {
  children: ReactNode
}

function Shell({ children }: AppShellProps) {
  const [isDark, setIsDark] = useState(false)
  const { loading } = useData()

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark)
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isDark={isDark} onToggleTheme={toggleTheme} />
      <main style={{ flex: 1, marginLeft: 240, padding: '32px 40px', maxWidth: 1200 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTopColor: '#6C5CE7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading your dashboard…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : children}
      </main>
    </div>
  )
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <DataProvider>
      <Shell>{children}</Shell>
    </DataProvider>
  )
}
