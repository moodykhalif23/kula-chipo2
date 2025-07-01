"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-gray-100 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium text-gray-700">Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap text-red-600">{error.message}</pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
