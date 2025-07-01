"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)

    // Check if it's a chunk loading error
    const isChunkError = error.message.includes("Loading chunk") || error.message.includes("ChunkLoadError")

    // Send to error tracking service
    if (typeof window !== "undefined") {
      fetch("/api/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          type: "global-error",
          isChunkError,
        }),
      }).catch(console.error)
    }

    // Auto-retry for chunk errors after a delay
    if (isChunkError) {
      const retryTimeout = setTimeout(() => {
        // Clear caches and retry
        if ("caches" in window) {
          caches
            .keys()
            .then((names) => {
              names.forEach((name) => {
                caches.delete(name)
              })
            })
            .finally(() => {
              reset()
            })
        } else {
          reset()
        }
      }, 3000)

      return () => clearTimeout(retryTimeout)
    }
  }, [error, reset])

  const isChunkError = error.message.includes("Loading chunk") || error.message.includes("ChunkLoadError")

  const handleHardRefresh = () => {
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

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {isChunkError ? "Application Loading Issue" : "Application Error"}
              </h1>
              <p className="text-gray-600 mb-4">
                {isChunkError
                  ? "We're having trouble loading the application. This is usually temporary and will resolve automatically."
                  : "A critical error occurred. Please refresh the page or contact support if the problem persists."}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                {isChunkError && (
                  <button
                    onClick={handleHardRefresh}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Hard Refresh
                  </button>
                )}
                <button
                  onClick={() => (window.location.href = "/")}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
