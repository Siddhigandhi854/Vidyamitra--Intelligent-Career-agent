import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUser, AuthContextType } from '../lib/supabase'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to check and set user from localStorage
  const checkAndSetUser = () => {
    try {
      const token = localStorage.getItem('vm_token')
      const userEmail = localStorage.getItem('vm_user_email')
      
      console.log('🔧 CHECKING AUTH:', { token: !!token, userEmail })
      
      if (token && userEmail) {
        // Check if token is expired
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Date.now() / 1000
          const tokenExpiryTime = payload.exp
          
          console.log('🔧 TOKEN EXPIRY CHECK:', { 
            currentTime, 
            tokenExpiryTime, 
            isExpired: currentTime > tokenExpiryTime 
          })
          
          if (currentTime > tokenExpiryTime) {
            console.log('🔴 TOKEN EXPIRED - Clearing and redirecting')
            localStorage.removeItem('vm_token')
            localStorage.removeItem('vm_user_email')
            localStorage.removeItem('vm_last_role')
            sessionStorage.removeItem('vm_token')
            sessionStorage.removeItem('vm_user_email')
            sessionStorage.removeItem('vm_last_role')
            setUser(null)
            return false
          }
        } catch (e) {
          console.log('🔧 TOKEN VALIDATION ERROR:', e)
          // If token is invalid, clear it
          localStorage.removeItem('vm_token')
          localStorage.removeItem('vm_user_email')
          setUser(null)
          return false
        }
        
        // Set user immediately
        const newUser = {
          id: userEmail,
          email: userEmail,
          user_metadata: {}
        };
        setUser(newUser)
        console.log('✅ USER SET FROM STORAGE:', newUser)
        return true
      } else {
        console.log('❌ NO AUTH FOUND')
        setUser(null)
        return false
      }
    } catch (error) {
      console.error('🔧 AUTH CHECK ERROR:', error)
      setUser(null)
      return false
    }
  }

  useEffect(() => {
    console.log('🔧 AUTH CONTEXT INITIALIZING...')
    
    // Check auth immediately
    checkAndSetUser()
    
    // Set loading to false after checking
    setLoading(false)
    
    console.log('🔧 AUTH CONTEXT INITIALIZED')
  }, [])

  // Add effect to check auth on every render
  useEffect(() => {
    console.log('🔧 CHECKING AUTH PERSISTENCE...')
    checkAndSetUser()
  }, [user]) // Re-check when user state changes

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vm_token' || e.key === 'vm_user_email') {
        console.log('🔧 STORAGE CHANGED:', e.key)
        checkAndSetUser()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      console.log('🔧 SIGNING IN:', email)
      
      // Direct API call
      const response = await fetch('https://vidyamitra-backend-uprd.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      })
      
      console.log('🔧 LOGIN RESPONSE STATUS:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('🔧 LOGIN ERROR:', errorText)
        throw new Error(`Login failed: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('🔧 LOGIN SUCCESS:', data)
      
      // Store in localStorage
      localStorage.setItem('vm_token', data.access_token)
      localStorage.setItem('vm_user_email', email)
      
      // Set user state immediately
      const newUser = {
        id: email,
        email: email,
        user_metadata: {}
      }
      setUser(newUser)
      console.log('🔧 USER STATE UPDATED:', newUser)
      
      return { error: null }
    } catch (error: any) {
      console.error('🔧 SIGN IN ERROR:', error)
      const errorMessage = error?.message || 'Failed to sign in'
      return { error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>): Promise<{ error: string | null; requiresConfirmation?: boolean }> => {
    try {
      console.log('🔧 SIGNING UP:', email)
      
      const response = await fetch('https://vidyamitra-backend-uprd.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Registration failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Store in localStorage
      localStorage.setItem('vm_token', data.access_token)
      localStorage.setItem('vm_user_email', email)
      
      // Set user state immediately
      const newUser = {
        id: email,
        email: email,
        user_metadata: metadata || {}
      }
      setUser(newUser)
      
      return { error: null }
    } catch (error: any) {
      console.error('🔧 SIGN UP ERROR:', error)
      const errorMessage = error?.message || 'Failed to sign up'
      return { error: errorMessage }
    }
  }

  const signOut = () => {
    console.log('🔧 SIGNING OUT')
    localStorage.removeItem('vm_token')
    localStorage.removeItem('vm_user_email')
    localStorage.removeItem('vm_last_role')
    sessionStorage.removeItem('vm_token')
    sessionStorage.removeItem('vm_user_email')
    sessionStorage.removeItem('vm_last_role')
    setUser(null)
  }

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    // Implementation for password reset
    return { error: 'Password reset not implemented' }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
