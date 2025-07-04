import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import bcrypt from "bcryptjs"
import { PrismaClient, User as PrismaUser } from "@prisma/client"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { AuthOptions } from "next-auth"

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        try {
          // Find user in database
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user) {
            return null
          }
          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) {
            return null
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
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
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | PrismaUser }) {
      if (user) {
        token.role = (user as PrismaUser).role
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        if (!session.user) session.user = {} as User
        if (typeof token.sub === "string") {
          session.user.id = token.sub
        }
        session.user.role = token.role as string
      }
      return session
    },
    async signIn(params) {
      const { user, account } = params;
      // For OAuth providers, assign default customer role
      if (account && (account.provider === "google" || account.provider === "facebook")) {
        (user as User & { role: string }).role = "customer";
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
