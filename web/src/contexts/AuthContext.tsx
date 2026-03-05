import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUser, AuthContextType } from '../lib/supabase'
import { registerUser, loginUser, testApiConnection } from '../services/authEnhanced'

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

  useEffect(() => {
    // Test API connection first
    const testConnection = async () => {
      try {
        const isConnected = await testApiConnection();
        console.log('🌐 API Connection Test Result:', isConnected);
      } catch (error) {
        console.error('❌ API Connection Test Failed:', error);
      }
    };

    testConnection();

    // Check for stored token on mount
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('vm_token')
        const userEmail = localStorage.getItem('vm_user_email')
        
        if (token && userEmail) {
          // Decode token to get user info (basic check)
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUser({
              id: payload.sub || userEmail,
              email: userEmail,
              user_metadata: {}
            })
            console.log('Session found from localStorage:', userEmail)
          } catch (e) {
            console.error('Error decoding token:', e)
            // Clear invalid token
            localStorage.removeItem('vm_token')
            localStorage.removeItem('vm_user_email')
            setUser(null)
          }
        } else {
          console.log('No session found')
          setUser(null)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      console.log('Signing in user:', email)
      const response = await loginUser({
        username: email,
        password: password
      })

      // Store token and user info
      localStorage.setItem('vm_token', response.access_token)
      localStorage.setItem('vm_user_email', email)
      
      // Update user state
      setUser({
        id: email,
        email: email,
        user_metadata: {}
      })

      console.log('Sign in successful')
      return { error: null }
    } catch (error: any) {
      console.error('Sign in error:', error)
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to sign in. Please check your credentials.'
      return { error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>): Promise<{ error: string | null; requiresConfirmation?: boolean }> => {
    try {
      console.log('Signing up user:', email)
      const response = await registerUser({
        username: email,
        password: password
      })

      // Store token and user info
      localStorage.setItem('vm_token', response.access_token)
      localStorage.setItem('vm_user_email', email)
      
      // Update user state
      setUser({
        id: email,
        email: email,
        user_metadata: metadata || {}
      })

      console.log('Sign up successful with session')
      return { error: null, requiresConfirmation: false }
    } catch (error: any) {
      console.error('Sign up error:', error)
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to register. Please try again.'
      return { error: errorMessage, requiresConfirmation: false }
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      console.log('Signing out user')
      localStorage.removeItem('vm_token')
      localStorage.removeItem('vm_user_email')
      setUser(null)
      console.log('Sign out successful')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    // Password reset not implemented in backend yet
    return { error: 'Password reset is not available yet. Please contact support.' }
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
