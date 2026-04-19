'use client'

import { useState, useEffect, ReactNode } from 'react'
import Sidebar from './Sidebar'
import { DataProvider } from '@/lib/DataContext'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('light', !next)
      return next
    })
  }

  return (
    <DataProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar isDark={isDark} onToggleTheme={toggleTheme} />
        <main
          style={{
            flex: 1,
            marginLeft: 240,
            padding: '32px 40px',
            maxWidth: 1200,
          }}
        >
          {children}
        </main>
      </div>
    </DataProvider>
  )
}
