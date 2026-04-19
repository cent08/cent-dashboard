'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('centrobles@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/earnings')
      router.refresh()
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--card)',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo Diamond */}
        <div
          style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 30px',
            background: 'linear-gradient(135deg, #6C5CE7, #4DA8FF)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          ◆
        </div>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          Welcome back, Cent
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          Sign in to your AI Automation Dashboard
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(255, 82, 82, 0.1)',
              border: '1px solid rgba(255, 82, 82, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#ff5252',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <a
              href="#"
              style={{
                fontSize: '13px',
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: loading
                ? 'rgba(108, 92, 231, 0.5)'
                : 'linear-gradient(135deg, #6C5CE7, #7C6CF7)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '24px',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            style={{
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
