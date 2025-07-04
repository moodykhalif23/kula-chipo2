"use client"

import React from "react"
import { AlertTriangle, RefreshCw, Home, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  isChunkError?: boolean
  isNetworkError?: boolean
  isImportError?: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0
  private maxRetries = 3

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if it's a chunk loading error
    const isChunkError =
      error.message.includes("Loading chunk") ||
      error.message.includes("ChunkLoadError") ||
      error.message.includes("Loading CSS chunk")

    // Check if it's a network error
    const isNetworkError =
      error.message.includes("fetch") ||
      error.message.includes("NetworkError") ||
      error.message.includes("Failed to fetch")

    // Check if it's an import error
    const isImportError =
      error.message.includes("Unable to fetch") ||
      error.message.includes("imported from") ||
      error.message.includes("esm.v0.dev")

    return {
      hasError: true,
      error,
      isChunkError,
      isNetworkError,
      isImportError,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 Error Boundary caught an error:", error, errorInfo)

    // Store error info for debugging
    this.setState({ errorInfo })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Handle chunk loading errors with automatic retry
    if ((this.state.isChunkError || this.state.isImportError) && this.retryCount < this.maxRetries) {
      this.retryCount++
      console.log(`Attempting to retry loading (${this.retryCount}/${this.maxRetries})`)

      // Wait a bit before retrying
      setTimeout(() => {
        this.resetError()
      }, 1000 * this.retryCount) // Exponential backoff
      return
    }

    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      this.logErrorToService(error, errorInfo)
    }
  }

  logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, you'd send this to your error reporting service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      isChunkError: this.state.isChunkError,
      isNetworkError: this.state.isNetworkError,
      isImportError: this.state.isImportError,
      retryCount: this.retryCount,
    }

    // Example API call to your error logging service
    fetch("/api/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorData),
    }).catch(console.error)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      isChunkError: false,
      isNetworkError: false,
      isImportError: false,
    })
  }

  handleHardRefresh = () => {
    // Clear all caches and reload
    if ("caches" in window) {
      caches
        .keys()
        .then((names) => {
          names.forEach((name) => {
            caches.delete(name)
          })
        })
        .finally(() => {
          window.location.reload()
        })
    } else {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      // Show specific error UI for import/chunk loading errors
      if (this.state.isChunkError || this.state.isImportError) {
        return (
          <ChunkErrorFallback
            resetError={this.resetError}
            onHardRefresh={this.handleHardRefresh}
            retryCount={this.retryCount}
            maxRetries={this.maxRetries}
          />
        )
      }

      // Show specific error UI for network errors
      if (this.state.isNetworkError) {
        return <NetworkErrorFallback resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <Button onClick={this.resetError} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                Go to homepage
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error details (development only)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function ChunkErrorFallback({
  resetError,
  onHardRefresh,
  retryCount,
  maxRetries,
}: {
  resetError: () => void
  onHardRefresh: () => void
  retryCount: number
  maxRetries: number
}) {
  const [isRetrying, setIsRetrying] = React.useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)

    // Clear module cache if possible
    if (typeof window !== "undefined" && "webpackChunkName" in window) {
      // Clear webpack chunk cache
      delete (window as unknown as { __webpack_require__?: { cache?: unknown } }).__webpack_require__?.cache
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    resetError()
    setIsRetrying(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Loading Issue</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We&apos;re having trouble loading some parts of the application. This usually happens due to network issues or
            outdated cached files.
          </p>

          {retryCount > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
              <p>
                Retry attempt: {retryCount} of {maxRetries}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRetry} disabled={isRetrying} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? "animate-spin" : ""}`} />
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>

            <Button variant="outline" onClick={onHardRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>

            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          <details className="text-left bg-gray-100 p-3 rounded text-sm">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">What can I do?</summary>
            <div className="mt-2 space-y-2 text-gray-600">
              <p>• Check your internet connection</p>
              <p>• Clear your browser cache and cookies</p>
              <p>• Try refreshing the page</p>
              <p>• If the problem persists, try again in a few minutes</p>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}

function NetworkErrorFallback({ resetError }: { resetError: () => void }) {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isOnline ? <Wifi className="w-8 h-8 text-red-600" /> : <WifiOff className="w-8 h-8 text-red-600" />}
          </div>
          <CardTitle className="text-xl text-gray-900">
            {isOnline ? "Connection Problem" : "No Internet Connection"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {isOnline
              ? "We&apos;re having trouble connecting to our servers. Please check your connection and try again."
              : "Please check your internet connection and try again."}
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-gray-600">{isOnline ? "Connected" : "Disconnected"}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={resetError} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Specialized error boundaries for different contexts
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={PageErrorFallback}>{children}</ErrorBoundary>
}

export function ComponentErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={ComponentErrorFallback}>{children}</ErrorBoundary>
}

function PageErrorFallback({ resetError }: { resetError: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Error</h2>
        <p className="text-gray-600 mb-4">
          This page encountered an error. Please try refreshing or go back to the previous page.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={resetError} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

function ComponentErrorFallback({ resetError }: { resetError: () => void }) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-4 my-4">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
        <h3 className="text-sm font-medium text-red-800">Component Error</h3>
      </div>
      <p className="text-sm text-red-700 mt-1">This component failed to load. Please try again.</p>
      <Button
        onClick={resetError}
        size="sm"
        variant="outline"
        className="mt-2 border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Retry
      </Button>
    </div>
  )
}

export default ErrorBoundary
