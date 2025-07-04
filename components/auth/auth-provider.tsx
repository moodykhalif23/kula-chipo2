"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
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
  register: (email: string, name: string, password: string, role?: "customer" | "vendor") => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  session?: Session | null
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const { data: sessionData, status } = useSession()
  const isLoading = status === "loading"

  // Map session user to your User type (if present and id is defined)
  const user = sessionData?.user && sessionData.user.id
    ? {
        id: sessionData.user.id as string, // ensure string
        email: sessionData.user.email ?? "",
        name: sessionData.user.name ?? "",
        role: sessionData.user.role as "customer" | "vendor",
      }
    : null

  const login = async (email: string, password: string) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      if (res?.error) {
        throw new Error(res.error)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "Login failed")
      }
      throw new Error("Login failed")
    }
  }

  const register = async (email: string, name: string, password: string, role: "customer" | "vendor" = "customer") => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }
      // Optionally, auto-login after registration
      await login(email, password)
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "Registration failed")
      }
      throw new Error("Registration failed")
    }
  }

  const logout = () => {
    signOut({ redirect: false })
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
