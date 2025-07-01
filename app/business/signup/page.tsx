"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChefHat, ArrowRight, Star, Users, TrendingUp, Shield, Mail, Lock, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

const benefits = [
  {
    icon: Users,
    title: "Reach More Customers",
    description: "Connect with thousands of french fry enthusiasts in your area",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Increase sales with our powerful marketing and analytics tools",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description: "Collect reviews and showcase your best fries to attract new customers",
  },
  {
    icon: Shield,
    title: "Trusted Platform",
    description: "Join a secure, reliable platform trusted by vendors nationwide",
  },
]

export default function BusinessSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    agreeToTerms: false,
    subscribeToUpdates: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match"
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store user data in localStorage for demo purposes
      localStorage.setItem(
        "businessUser",
        JSON.stringify({
          ...formData,
          id: Date.now(),
          registrationDate: new Date().toISOString(),
        }),
      )

      // Redirect to business listing form
      router.push("/business/listing")
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Kula Chipo</span>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Already have an account?</span>
            <Link href="/business/signin">
              <Button variant="outline" className="bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Kula Chipo for Business</h1>
              <p className="text-xl text-gray-600">
                Connect with french fry lovers and grow your business with our powerful platform
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Success Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Join Successful Vendors</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-500">500+</div>
                  <div className="text-sm text-gray-600">Active Vendors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">50K+</div>
                  <div className="text-sm text-gray-600">Monthly Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">4.8★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Your Business Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Personal Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          className="pl-10"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </div>
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          className="pl-10"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Business Information</h3>

                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Golden Crisp Fries"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                    />
                    {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Security</h3>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        className="pl-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    />
                    <div className="text-sm">
                      <label htmlFor="agreeToTerms" className="cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-orange-500 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-orange-500 hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                  {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="subscribeToUpdates"
                      checked={formData.subscribeToUpdates}
                      onCheckedChange={(checked) => handleInputChange("subscribeToUpdates", checked as boolean)}
                    />
                    <label htmlFor="subscribeToUpdates" className="text-sm cursor-pointer">
                      Send me updates about new features and business tips
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Create Business Account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  By creating an account, you'll be able to list your business and start reaching customers immediately.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
