'use client'
import { ReactNode, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  width?: number
}

export default function Modal({ isOpen, onClose, title, subtitle, children, width = 480 }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div style={{
        background: 'var(--card)', border: '1px solid var(--card-border)',
        borderRadius: 20, padding: 32, width, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>{subtitle}</div>}
        {children}
      </div>
    </div>
  )
}
