'use client'
import { useState, useCallback, createContext, useContext, ReactNode } from 'react'

interface ToastContextType {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
    setTimeout(() => setVisible(false), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, background: 'var(--green)',
          color: '#fff', padding: '14px 24px', borderRadius: 12, fontSize: 14,
          fontWeight: 600, zIndex: 200, boxShadow: '0 8px 24px rgba(0,214,143,0.3)',
          animation: 'slideUp 0.3s ease'
        }}>
          {message}
        </div>
      )}
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  )
}
