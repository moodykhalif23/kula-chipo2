"use client"

import { useState } from "react"
import { Check, Star, Zap, Crown, Rocket, Gift, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PricingPlan {
  name: string
  price: number
  originalPrice: number
  features: string[]
}

interface PricingManagerProps {
  isBusinessUser: boolean
  hasActivePlan: boolean
  currentPlan?: string
}

export const pricingPlans: Record<string, PricingPlan> = {
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

export default function PricingManager({ isBusinessUser, hasActivePlan, currentPlan = "basic" }: PricingManagerProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showTrialModal, setShowTrialModal] = useState(false)

  const getPlanIcon = (planKey: string) => {
    switch (planKey) {
      case "basic":
        return <Star className="w-6 h-6" />
      case "premium":
        return <Zap className="w-6 h-6" />
      case "enterprise":
        return <Crown className="w-6 h-6" />
      default:
        return <Star className="w-6 h-6" />
    }
  }

  const getPlanColor = (planKey: string) => {
    switch (planKey) {
      case "basic":
        return "text-blue-500"
      case "premium":
        return "text-orange-500"
      case "enterprise":
        return "text-purple-500"
      default:
        return "text-blue-500"
    }
  }

  const getCardStyle = (planKey: string) => {
    if (planKey === "premium") {
      return "border-orange-500 shadow-lg scale-105"
    }
    return "border-gray-200"
  }

  const handleStartTrial = (planKey: string) => {
    setSelectedPlan(planKey)
    setShowTrialModal(true)
  }

  return (
    <div className="space-y-8">
      {/* Business User Free Trial Banner */}
      {isBusinessUser && !hasActivePlan && (
        <Alert className="border-green-500 bg-green-50">
          <Gift className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Special Business Offer!</strong> Get your first month completely free on any plan. No credit
                card required to start your trial.
              </div>
              <Badge className="bg-green-500 text-white ml-4">
                <Clock className="w-3 h-3 mr-1" />
                Limited Time
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Current Plan Status */}
      {hasActivePlan && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg text-white">{getPlanIcon(currentPlan)}</div>
                <div>
                  <h3 className="font-semibold text-green-800">Current Plan: {pricingPlans[currentPlan]?.name}</h3>
                  <p className="text-green-600">Active until January 15, 2025</p>
                </div>
              </div>
              <Button variant="outline" className="border-green-500 text-green-700 bg-transparent">
                Manage Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get more customers, better visibility, and powerful tools to grow your french fry business
        </p>
        {isBusinessUser && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
            <Rocket className="w-4 h-4 text-orange-600" />
            <span className="text-orange-800 font-medium">Business Account - Special Pricing Applied</span>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(pricingPlans).map(([planKey, plan]) => (
          <Card key={planKey} className={`relative ${getCardStyle(planKey)}`}>
            {planKey === "premium" && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white px-4 py-1">Most Popular</Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className={`inline-flex p-3 rounded-lg ${getPlanColor(planKey)} bg-gray-50 mx-auto mb-4`}>
                {getPlanIcon(planKey)}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {isBusinessUser && <span className="text-2xl text-gray-400 line-through">${plan.originalPrice}</span>}
                  <span className="text-4xl font-bold">${isBusinessUser ? plan.price : plan.originalPrice}</span>
                  <span className="text-gray-600">/month</span>
                </div>

                {isBusinessUser && (
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Save ${plan.originalPrice - plan.price}/month
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                {isBusinessUser && !hasActivePlan ? (
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleStartTrial(planKey)}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Start Free Trial
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      planKey === "premium" ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-900 hover:bg-gray-800"
                    }`}
                    disabled={hasActivePlan && currentPlan === planKey}
                  >
                    {hasActivePlan && currentPlan === planKey ? "Current Plan" : "Choose Plan"}
                  </Button>
                )}

                {planKey === "premium" && (
                  <p className="text-center text-sm text-gray-600">14-day money-back guarantee</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Why Upgrade Your Plan?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Reach More Customers</h3>
              <p className="text-gray-600 text-sm">
                Premium listings get 3x more views and appear higher in search results
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 text-sm">
                Track customer behavior, peak hours, and optimize your business strategy
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Priority Support</h3>
              <p className="text-gray-600 text-sm">Get dedicated support and help growing your business faster</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Free Trial Modal */}
      <Dialog open={showTrialModal} onOpenChange={setShowTrialModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Start Your Free Trial</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{selectedPlan && pricingPlans[selectedPlan]?.name} Plan</h3>
              <p className="text-gray-600">Get full access to all features for 30 days, completely free!</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Plan Value:</span>
                <span className="font-semibold">
                  ${selectedPlan && pricingPlans[selectedPlan]?.originalPrice}/month
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trial Period:</span>
                <span className="font-semibold">30 days</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>You Pay Today:</span>
                <span className="font-bold">$0.00</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-green-500 hover:bg-green-600">Start Free Trial</Button>
              <p className="text-center text-xs text-gray-500">No credit card required. Cancel anytime during trial.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
