// pages/auth/callback.js  ← CREATE this file at pages/auth/callback.js
// Handles email confirmation and password reset redirects from Supabase

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase puts the code/token in the URL hash or query params
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )

      if (error) {
        console.error('Auth callback error:', error)
        router.replace('/login?error=auth_failed')
        return
      }

      // Redirect to ada after successful auth
      router.replace('/ada')
    }

    // Only run after router is ready (has the hash)
    if (router.isReady) {
      handleCallback()
    }
  }, [router.isReady])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      flexDirection: 'column',
      gap: '16px',
      color: '#1a5276',
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid #e8edf2',
        borderTop: '3px solid #1a5276',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#888', fontSize: '14px' }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
