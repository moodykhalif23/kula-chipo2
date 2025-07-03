"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { GoogleIcon, FacebookIcon } from "./social-icons"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🔐 Login form submitted:", email)

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("🔐 Attempting sign in...")
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("🔐 Sign in result:", result)

      if (result?.error) {
        console.log("❌ Sign in error:", result.error)
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
      } else if (result?.ok) {
        console.log("✅ Sign in successful")

        // Get session to determine redirect
        const session = await getSession()
        console.log("👤 Session after login:", session)

        toast({
          title: "Success",
          description: "Signed in successfully!",
        })

        // Redirect based on role
        if (session && session.user && typeof (session.user as { role?: string }).role === "string") {
          const userWithRole = session.user as { role: string }
          if (userWithRole.role === "vendor") {
            console.log("🏪 Redirecting vendor to dashboard")
            router.push("/vendor-dashboard")
          } else {
            console.log("🏠 Redirecting customer to home")
            router.push("/")
          }
        } else {
          // Fallback if role is missing
          router.push("/")
        }
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    console.log("🔗 Social login:", provider)
    setSocialLoading(provider)

    try {
      await signIn(provider, { callbackUrl: "/" })
    } catch (error) {
      console.error("❌ Social login error:", error)
      toast({
        title: "Error",
        description: `Failed to sign in with ${provider}`,
        variant: "destructive",
      })
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => handleSocialLogin("google")} disabled={socialLoading === "google"}>
            {socialLoading === "google" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSocialLogin("facebook")}
            disabled={socialLoading === "facebook"}
          >
            {socialLoading === "facebook" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FacebookIcon className="mr-2 h-4 w-4" />
            )}
            Facebook
          </Button>
        </div>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Button variant="link" className="p-0 h-auto font-semibold" onClick={() => router.push("/auth/signup")}>
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
