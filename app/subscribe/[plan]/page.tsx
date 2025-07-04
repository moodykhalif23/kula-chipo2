"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChefHat } from "lucide-react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

const pricingPlans = {
  basic: {
    name: "Basic",
    price: 29,
    originalPrice: 39,
    features: ["Profile listing", "Up to 10 photos", "Basic analytics", "Customer reviews", "Menu management"],
  },
  premium: {
    name: "Premium",
    price: 59,
    originalPrice: 79,
    features: [
      "Everything in Basic",
      "Unlimited photos",
      "Advanced analytics",
      "Priority support",
      "Featured listing",
      "Social media integration",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    originalPrice: 129,
    features: [
      "Everything in Premium",
      "Multiple locations",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "White-label solution",
    ],
  },
}

export default function SubscribePage() {
  const params = useParams()
  const router = useRouter()
  const planKey = (params.plan as string)?.toLowerCase()
  const plan = pricingPlans[planKey as keyof typeof pricingPlans]

  const [paypalSuccess, setPaypalSuccess] = useState<string | null>(null)
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const [mpesaCode, setMpesaCode] = useState("")
  const [mpesaStatus, setMpesaStatus] = useState<string | null>(null)
  const [mpesaLoading, setMpesaLoading] = useState(false)

  // PayPal client ID from env
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  useEffect(() => {
    if (!plan) {
      router.replace("/vendor-dashboard")
    }
  }, [plan, router])

  // M-Pesa handler
  async function handleMpesaSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMpesaLoading(true)
    setMpesaStatus(null)
    try {
      const res = await fetch("/api/mpesa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: mpesaCode, plan: plan.name }),
      })
      const data = await res.json()
      if (res.ok) {
        setMpesaStatus("Payment successful! Your subscription is now active.")
        setMpesaCode("")
      } else {
        setMpesaStatus(data.error || "Payment verification failed.")
      }
    } catch {
      setMpesaStatus("Network error. Please try again.")
    } finally {
      setMpesaLoading(false)
    }
  }

  if (!plan) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header (copied from VendorDashboard) */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Kula Chipo</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/vendors" className="text-gray-700 hover:text-orange-500 font-medium">
              Find Vendors
            </Link>
            <Link href="/experiences" className="text-gray-700 hover:text-orange-500 font-medium">
              Experiences
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/vendor-dashboard">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Subscribe to {plan.name} Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-4xl font-bold">${plan.price}</span>
              {plan.originalPrice && <span className="text-gray-500 line-through ml-2">${plan.originalPrice}</span>}
              <p className="text-sm text-gray-600">per month</p>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-4">
              <h3 className="font-semibold">Choose Payment Method</h3>
              {/* PayPal Integration */}
              <div className="border p-4 rounded-lg flex flex-col items-center w-full">
                <span className="mb-2">Pay with PayPal</span>
                {paypalSuccess && <div className="text-green-600 mb-2">{paypalSuccess}</div>}
                {paypalError && <div className="text-red-600 mb-2">{paypalError}</div>}
                {paypalClientId ? (
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: { currency_code: "USD", value: plan.price.toString() },
                              description: `${plan.name} Plan Subscription`,
                            },
                          ],
                        })
                      }}
                      onApprove={async (data, actions) => {
                        if (!actions.order) return
                        setPaypalSuccess("Payment successful! Your subscription is now active.")
                        setPaypalError(null)
                      }}
                      onError={() => {
                        setPaypalError("Payment failed. Please try again.")
                        setPaypalSuccess(null)
                      }}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <div className="text-red-600">PayPal is not configured.</div>
                )}
              </div>
              {/* M-Pesa Option */}
              <form className="border p-4 rounded-lg flex flex-col items-center w-full" onSubmit={handleMpesaSubmit}>
                <span className="mb-2">Pay with M-Pesa</span>
                <p className="text-sm text-gray-600 mb-2">Send payment to <b>MPESA Paybill: 123456</b> and enter your transaction code below.</p>
                <input
                  type="text"
                  placeholder="M-Pesa Transaction Code"
                  className="border rounded px-3 py-2 w-full mb-2"
                  value={mpesaCode}
                  onChange={e => setMpesaCode(e.target.value)}
                  required
                />
                <Button className="bg-green-600 hover:bg-green-700 w-full" type="submit" disabled={mpesaLoading}>
                  {mpesaLoading ? "Verifying..." : "Submit M-Pesa Payment"}
                </Button>
                {mpesaStatus && <div className={`mt-2 ${mpesaStatus.includes("success") ? "text-green-600" : "text-red-600"}`}>{mpesaStatus}</div>}
              </form>
            </div>
            <Link href="/vendor-dashboard">
              <Button variant="outline" className="w-full mt-4">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      {/* Footer (simple version) */}
      <footer className="border-t bg-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Kula Chipo. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 