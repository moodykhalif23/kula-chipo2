"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { GoogleIcon, FacebookIcon } from "./social-icons"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("📝 Register form submitted:", { name, email, role })

    if (!name || !email || !password || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("📝 Sending registration request...")
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()
      console.log("📝 Registration response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      console.log("✅ Registration successful")
      toast({
        title: "Success",
        description: "Account created successfully! Signing you in...",
      })

      // Auto sign in after registration
      console.log("🔐 Auto-signing in after registration...")
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.ok) {
        console.log("✅ Auto sign-in successful")
        // Redirect based on role
        if (role === "vendor") {
          console.log("🏪 Redirecting vendor to dashboard")
          router.push("/vendor-dashboard")
        } else {
          console.log("🏠 Redirecting customer to home")
          router.push("/")
        }
      } else {
        console.log("⚠️ Auto sign-in failed, redirecting to login")
        router.push("/auth/signin")
      }
    } catch (error) {
      console.error("❌ Registration error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    console.log("🔗 Social registration:", provider)
    setSocialLoading(provider)

    try {
      await signIn(provider, { callbackUrl: "/" })
    } catch (error) {
      console.error("❌ Social login error:", error)
      toast({
        title: "Error",
        description: `Failed to sign up with ${provider}`,
        variant: "destructive",
      })
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create account</CardTitle>
        <CardDescription>Enter your information to create your Kula Chipo account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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

          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer - Order food</SelectItem>
                <SelectItem value="vendor">Vendor - Sell food</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
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
          Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto font-semibold" onClick={() => router.push("/auth/signin")}>
            Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
