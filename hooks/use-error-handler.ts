"use client"

import { useState, useCallback } from "react"

interface ErrorState {
  error: Error | null
  isError: boolean
  errorMessage: string
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
    errorMessage: "",
  })

  const handleError = useCallback((error: Error | string) => {
    const errorObj = typeof error === "string" ? new Error(error) : error
    setErrorState({
      error: errorObj,
      isError: true,
      errorMessage: errorObj.message,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error handled:", errorObj)
    }

    // In production, you would send this to your error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(errorObj)
    }
  }, [])

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
      errorMessage: "",
    })
  }, [])

  const retry = useCallback(
    (fn: () => void | Promise<void>) => {
      clearError()
      try {
        const result = fn()
        if (result instanceof Promise) {
          result.catch(handleError)
        }
      } catch (error) {
        handleError(error as Error)
      }
    },
    [clearError, handleError],
  )

  return {
    ...errorState,
    handleError,
    clearError,
    retry,
  }
}
