// app/services/database/use-auth.tsx
import { User } from "@supabase/supabase-js"
import { supabase } from "app/services/database/supabase"
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { logger } from "app/services/logger"

const log = logger.extend("use-auth")

type TAuthContext = {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signedIn: boolean
  loading: boolean
  error: string
  user: User | null
}

// We initialize the context with null to ensure that it is not used outside of the provider
const AuthContext = createContext<TAuthContext | null>(null)

/**
 * AuthProvider manages the authentication state and provides the necessary methods to sign in,
 * sign up and sign out.
 */
export const AuthProvider = ({ children }: PropsWithChildren<any>) => {
  const [signedIn, setSignedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<User | null>(null)

  // Sign in with provided email and password
  const signIn = useCallback(
    async (email: string, password: string) => {
      log.info(`Signing in as ${email}`)
      setLoading(true)
      setError("")
      try {
        const {
          data: { session, user },
          error,
        } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          log.error("Error signing in: ", error.message)
          setSignedIn(false)
          setError(error.message)
          setUser(null)
        } else if (session && user) {
          log.debug(`Signed in successfully as: ${user.email} -- updating state`)
          setSignedIn(true)
          setUser(user)
        }
      } catch (error: any) {
        log.error("Error signing in: ", error)
        setError(error?.message ?? "Unknown error")
      } finally {
        setLoading(false)
        log.info("Signing in complete.")
      }
    },
    [setSignedIn, setLoading, setError, setUser, supabase],
  )

  // Create a new account with provided email and password
  const signUp = useCallback(
    async (email: string, password: string) => {
      log.info(`Signing up as ${email}`)
      setLoading(true)
      setError("")
      setUser(null)
      try {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          log.error("Error signing up: ", error.message)
          setSignedIn(false)
          setError(error.message)
        } else if (data.session && data.user) {
          log.debug(`Received session: ${data.user.email} -- updating state`)
          await supabase.auth.setSession(data.session)
          setSignedIn(true)
          setUser(data.user)
        }
      } catch (error: any) {
        log.error("Error signing up: ", error)
        setUser(null)
        setSignedIn(false)
        setError(error?.message ?? "Unknown error")
      } finally {
        log.info("Signing up complete.")
        setLoading(false)
      }
    },
    [setSignedIn, setLoading, setError, setUser, supabase],
  )

  // Sign out the current user
  const signOut = useCallback(async () => {
    log.debug("Signing out of supabase...")
    setLoading(true)
    try {
      await supabase.auth.signOut()
      log.debug("Signed out.")
      setError("")
      setSignedIn(false)
      setUser(null)
      log.debug("Signed out of supabase.")
    } catch (error: any) {
      log.error("Error signing out: ", error)
      setError(`Error signing out:  ${error?.message ?? "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }, [setSignedIn, setLoading, setError, setUser, supabase])

  // Always memoize context values as they can cause unnecessary re-renders if they aren't stable!
  const value = useMemo(
    () => ({
      signIn,
      signOut,
      signUp,
      signedIn,
      loading,
      error,
      user,
    }),
    [signIn, signOut, signUp, signedIn, loading, error, user],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  // It's a good idea to throw an error if the context is null, as it means the hook is being used outside of the provider
  if (context === null) {
    throw new Error("useAuthContext must be used within a AuthProvider")
  }
  return context
}
