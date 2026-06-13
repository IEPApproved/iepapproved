// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (!error && data) setProfile(data)
    } catch (err) {
      console.error('fetchProfile error (non-fatal):', err)
    }
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  useEffect(() => {
    let active = true

    // Resolve loading as soon as we know the session.
    // The profile is fetched in the background, so a slow or failed
    // profile query can never leave the app stuck on a spinner.
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!active) return
        setUser(session?.user ?? null)
        setLoading(false)
        if (session?.user) fetchProfile(session.user.id)
      })
      .catch((err) => {
        console.error('getSession error (non-fatal):', err)
        if (active) setLoading(false)
      })

    // Safety net: never spin longer than 5 seconds, no matter what.
    const timeout = setTimeout(() => {
      if (active) setLoading(false)
    }, 5000)

    // Listen for auth state changes (login, logout, token refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) return
        setUser(session?.user ?? null)
        setLoading(false)
        if (session?.user) fetchProfile(session.user.id)
        else setProfile(null)
      }
    )

    return () => {
      active = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function useIsUnlimited() {
  const { profile } = useAuth()
  return ['unlimited', 'pro', 'advocate'].includes(profile?.tier)
}
