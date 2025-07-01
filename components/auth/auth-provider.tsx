"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

interface User {
  id: string
  email: string
  name: string
  role: "customer" | "vendor"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role?: "customer" | "vendor") => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  session?: Session | null
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("kula-chipo-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("kula-chipo-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - in real app, this would come from your API
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: "customer",
      }

      setUser(mockUser)
      localStorage.setItem("kula-chipo-user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: "customer" | "vendor" = "customer") => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - in real app, this would come from your API
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
      }

      setUser(mockUser)
      localStorage.setItem("kula-chipo-user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("kula-chipo-user")
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
