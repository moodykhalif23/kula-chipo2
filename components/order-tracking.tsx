"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, Truck, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface OrderTrackingProps {
  orderId: string
  vendorName: string
  estimatedTime: number
  driverName?: string
  driverPhone?: string
}

const orderSteps = [
  { id: 1, title: "Order Confirmed", description: "Your order has been received" },
  { id: 2, title: "Preparing", description: "Chef is preparing your delicious fries" },
  { id: 3, title: "Ready for Pickup", description: "Your order is ready" },
  { id: 4, title: "Out for Delivery", description: "Driver is on the way" },
  { id: 5, title: "Delivered", description: "Enjoy your meal!" },
]

export default function OrderTracking({
  orderId,
  vendorName,
  estimatedTime,
  driverName,
  driverPhone,
}: OrderTrackingProps) {
  const [currentStep, setCurrentStep] = useState(2)
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Simulate order progress
    const progressTimer = setTimeout(() => {
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1)
      }
    }, 5000)

    return () => clearTimeout(progressTimer)
  }, [currentStep])

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed"
    if (stepId === currentStep) return "current"
    return "pending"
  }

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (orderSteps.length - 1)) * 100
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Order #{orderId}</CardTitle>
            <p className="text-gray-600">{vendorName}</p>
          </div>
          <Badge className="bg-orange-500">{timeRemaining > 0 ? `${timeRemaining} min` : "Arriving soon"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Order Progress</span>
            <span className="text-sm text-gray-500">{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Order Steps */}
        <div className="space-y-4">
          {orderSteps.map((step) => {
            const status = getStepStatus(step.id)
            return (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {status === "completed" ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : status === "current" ? (
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${status === "current" ? "text-orange-500" : status === "completed" ? "text-green-600" : "text-gray-400"}`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {status === "current" && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-500">In progress</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Driver Info */}
        {currentStep >= 4 && driverName && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{driverName}</h4>
                    <p className="text-sm text-gray-600">Your delivery driver</p>
                  </div>
                </div>
                {driverPhone && (
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delivery Address */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <h4 className="font-medium">Delivery Address</h4>
            <p className="text-sm text-gray-600">
              123 Main Street, Apt 4B
              <br />
              New York, NY 10001
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
