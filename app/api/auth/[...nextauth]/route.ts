import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

// Mock user database - replace with real database in production
const users = [
  {
    id: "1",
    email: "demo@kulachipo.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm", // password123
    name: "Demo Customer",
    role: "customer",
    image: null,
  },
  {
    id: "2",
    email: "vendor@kulachipo.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm", // password123
    name: "Demo Vendor",
    role: "vendor",
    image: null,
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Authorize attempt:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials")
          return null
        }

        try {
          // Find user in mock database
          const user = users.find((u) => u.email === credentials.email)

          if (!user) {
            console.log("❌ User not found:", credentials.email)
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("❌ Invalid password for:", credentials.email)
            return null
          }

          console.log("✅ Authentication successful:", user.email, user.role)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error("❌ Auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      console.log("🔑 Sign in callback:", user.email, account?.provider)

      // For OAuth providers, assign default customer role
      if (account?.provider === "google" || account?.provider === "facebook") {
        user.role = "customer"
      }

      return true
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
