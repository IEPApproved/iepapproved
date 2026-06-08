// lib/supabase.js
// Browser client - use in React components (client-side)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Server client - use in getServerSideProps / API routes
// Pass the req/res from Next.js
export function createServerClient(req, res) {
  const { createServerClient: _createServerClient } = require('@supabase/ssr')

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          // Parse cookies from request header
          const cookieHeader = req.headers.cookie || ''
          return cookieHeader.split(';').map(c => {
            const [name, ...rest] = c.trim().split('=')
            return { name, value: rest.join('=') }
          }).filter(c => c.name)
        },
        setAll(cookiesToSet) {
          // Set cookies on response
          const existing = res.getHeader('Set-Cookie') || []
          const existingArr = Array.isArray(existing) ? existing : [existing].filter(Boolean)
          const newCookies = cookiesToSet.map(({ name, value, options = {} }) => {
            let str = `${name}=${value}`
            if (options.path) str += `; Path=${options.path}`
            if (options.maxAge) str += `; Max-Age=${options.maxAge}`
            if (options.httpOnly) str += `; HttpOnly`
            if (options.secure) str += `; Secure`
            if (options.sameSite) str += `; SameSite=${options.sameSite}`
            return str
          })
          res.setHeader('Set-Cookie', [...existingArr, ...newCookies])
        },
      },
    }
  )
}

// Admin client - ONLY use server-side, never expose to browser
// Used in webhook handlers and admin operations
export function createAdminClient() {
  const { createClient: _createClient } = require('@supabase/supabase-js')
  return _createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
