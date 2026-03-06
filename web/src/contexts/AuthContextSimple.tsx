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
  const host = window.location.hostname
  const isLocal = host === 'localhost' || host === '127.0.0.1'
  const backendUrl = isLocal ? 'http://127.0.0.1:8000' : 'https://vidyamitra-backend-uprd.onrender.com'

  // Simple auth check - no complex validation
  useEffect(() => {
    console.log('🔧 SIMPLE AUTH CHECK')
    
    const token = localStorage.getItem('vm_token')
    const userEmail = localStorage.getItem('vm_user_email')
    
    console.log('🔧 TOKEN:', !!token)
    console.log('🔧 EMAIL:', userEmail)
    
    if (token && userEmail) {
      // Just set user - no complex validation
      const newUser = {
        id: userEmail,
        email: userEmail,
        user_metadata: {}
      }
      setUser(newUser)
      console.log('✅ USER SET:', newUser)
    } else {
      setUser(null)
      console.log('❌ NO USER')
    }
    
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔧 SIGNING IN:', email)
      const response = await fetch(`${backendUrl}/auth/login`, {
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
        console.error('❌ LOGIN FAILED:', errorText)
        return { error: errorText }
      }
      
      const data = await response.json()
      console.log('✅ LOGIN SUCCESS:', data)
      
      // Store token and user
      localStorage.setItem('vm_token', data.access_token)
      localStorage.setItem('vm_user_email', email)
      
      // Set user immediately
      const newUser = {
        id: email,
        email: email,
        user_metadata: {}
      }
      setUser(newUser)
      
      return { error: null }
    } catch (error: any) {
      console.error('❌ LOGIN ERROR:', error)
      return { error: error.message || 'Login failed' }
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      console.log('🔧 SIGNING UP:', email)
      const response = await fetch(`${backendUrl}/auth/register`, {
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
        console.error('❌ REGISTER FAILED:', errorText)
        return { error: errorText }
      }
      
      const data = await response.json()
      console.log('✅ REGISTER SUCCESS:', data)
      
      // Store token and user
      localStorage.setItem('vm_token', data.access_token)
      localStorage.setItem('vm_user_email', email)
      
      // Set user immediately
      const newUser = {
        id: email,
        email: email,
        user_metadata: metadata || {}
      }
      setUser(newUser)
      
      return { error: null }
    } catch (error: any) {
      console.error('❌ REGISTER ERROR:', error)
      return { error: error.message || 'Registration failed' }
    }
  }

  const signOut = async (): Promise<void> => {
    console.log('🔧 SIGNING OUT')
    localStorage.removeItem('vm_token')
    localStorage.removeItem('vm_user_email')
    setUser(null)
  }

  const resetPassword = async (email: string) => {
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
