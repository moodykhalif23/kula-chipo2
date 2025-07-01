"use client"

import React from "react"
import { AlertTriangle, WifiOff, RefreshCw, Search, ShoppingCart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorStateProps {
  type: "network" | "loading" | "empty" | "auth" | "payment" | "location" | "generic"
  title?: string
  message?: string
  onRetry?: () => void
  onAction?: () => void
  actionLabel?: string
}

export function ErrorState({ type, title, message, onRetry, onAction, actionLabel }: ErrorStateProps) {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: <WifiOff className="w-12 h-12 text-red-500" />,
          defaultTitle: "Connection Problem",
          defaultMessage: "Please check your internet connection and try again.",
          showRetry: true,
        }
      case "loading":
        return {
          icon: <RefreshCw className="w-12 h-12 text-orange-500" />,
          defaultTitle: "Loading Failed",
          defaultMessage: "We couldn't load this content. Please try again.",
          showRetry: true,
        }
      case "empty":
        return {
          icon: <Search className="w-12 h-12 text-gray-400" />,
          defaultTitle: "No Results Found",
          defaultMessage: "We couldn't find what you're looking for. Try adjusting your search.",
          showRetry: false,
        }
      case "auth":
        return {
          icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
          defaultTitle: "Authentication Required",
          defaultMessage: "Please sign in to access this feature.",
          showRetry: false,
        }
      case "payment":
        return {
          icon: <ShoppingCart className="w-12 h-12 text-red-500" />,
          defaultTitle: "Payment Failed",
          defaultMessage: "There was an issue processing your payment. Please try again.",
          showRetry: true,
        }
      case "location":
        return {
          icon: <MapPin className="w-12 h-12 text-blue-500" />,
          defaultTitle: "Location Access Required",
          defaultMessage: "Please enable location access to find vendors near you.",
          showRetry: false,
        }
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
          defaultTitle: "Something went wrong",
          defaultMessage: "An unexpected error occurred. Please try again.",
          showRetry: true,
        }
    }
  }

  const config = getErrorConfig()

  return (
    <div className="flex items-center justify-center min-h-[300px] p-4">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-6">
          <div className="mb-4">{config.icon}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title || config.defaultTitle}</h3>
          <p className="text-gray-600 mb-4">{message || config.defaultMessage}</p>
          <div className="flex gap-2 justify-center">
            {config.showRetry && onRetry && (
              <Button onClick={onRetry} className="bg-orange-500 hover:bg-orange-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {onAction && (
              <Button onClick={onAction} variant={config.showRetry ? "outline" : "default"}>
                {actionLabel || "Take Action"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Specialized error components
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <ErrorState
      type="network"
      title={isOnline ? "Connection Problem" : "No Internet Connection"}
      message={
        isOnline
          ? "We're having trouble connecting to our servers."
          : "Please check your internet connection and try again."
      }
      onRetry={onRetry}
    />
  )
}

export function LoadingError({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  return <ErrorState type="loading" message={message} onRetry={onRetry} />
}

export function EmptyState({ title, message, onAction, actionLabel }: Omit<ErrorStateProps, "type">) {
  return <ErrorState type="empty" title={title} message={message} onAction={onAction} actionLabel={actionLabel} />
}

export function AuthError({ onAction }: { onAction?: () => void }) {
  return <ErrorState type="auth" onAction={onAction} actionLabel="Sign In" />
}

export function PaymentError({ onRetry }: { onRetry?: () => void }) {
  return <ErrorState type="payment" onRetry={onRetry} />
}

export function LocationError({ onAction }: { onAction?: () => void }) {
  return <ErrorState type="location" onAction={onAction} actionLabel="Enable Location" />
}
