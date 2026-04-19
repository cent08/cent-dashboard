'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/earnings` },
    })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
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

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px' }}>
              Check your email
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
            </p>
            <a
              href="/login"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6C5CE7, #7C6CF7)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Back to Sign In
            </a>
          </div>
        ) : (
          <>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              Create your account
            </h1>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                marginBottom: '32px',
              }}
            >
              Start tracking your AI automation career
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

            <form onSubmit={handleSignUp}>
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
                  placeholder="you@example.com"
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
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--text)',
                    marginBottom: '8px',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                textAlign: 'center',
              }}
            >
              Already have an account?{' '}
              <a
                href="/login"
                style={{
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Sign in
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
