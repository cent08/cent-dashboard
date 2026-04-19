'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Mail, DollarSign, BookOpen, Heart, Briefcase, Sun, Moon, LogOut } from 'lucide-react'

interface SidebarProps {
  isDark: boolean
  onToggleTheme: () => void
}

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Mail, label: 'AI Newsletter', href: '/newsletter' },
  { icon: DollarSign, label: 'Earnings', href: '/earnings' },
  { icon: BookOpen, label: 'Training', href: '/training' },
  { icon: Heart, label: 'Health', href: '/health' },
  { icon: Briefcase, label: 'Job Openings', href: '/jobs' },
]

export default function Sidebar({ isDark, onToggleTheme }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 240,
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: `1px solid var(--sidebar-border)`,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        boxSizing: 'border-box',
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: `1px solid var(--sidebar-border)`,
        }}
      >
        <div
          style={{
            fontSize: '28px',
            marginBottom: '8px',
            color: 'var(--accent)',
          }}
        >
          ◆
        </div>
        <div
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--text)',
            marginBottom: '4px',
          }}
        >
          Cent's Hub
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: '500',
          }}
        >
          AI Automation
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <Icon
                size={20}
                style={{
                  strokeWidth: 2,
                }}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingTop: '16px',
          borderTop: `1px solid var(--sidebar-border)`,
        }}
      >
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-glow)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-hover)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          {isDark ? (
            <>
              <Sun size={18} />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={18} />
              <span>Dark</span>
            </>
          )}
        </button>

        {/* Sign Out */}
        <button
          onClick={() => {
            // Sign out logic here
            console.log('Sign out')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--red)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--red-bg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
