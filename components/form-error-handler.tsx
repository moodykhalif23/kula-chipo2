"use client"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FormErrorProps {
  error: string | null
  onDismiss?: () => void
  className?: string
}

export function FormError({ error, onDismiss, className = "" }: FormErrorProps) {
  if (!error) return null

  return (
    <div className={`flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md ${className}`}>
      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
      <span className="text-sm text-red-700 flex-1">{error}</span>
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="text-red-600 hover:bg-red-100 p-1 h-auto"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

interface FormSuccessProps {
  message: string | null
  onDismiss?: () => void
  className?: string
}

export function FormSuccess({ message, onDismiss, className = "" }: FormSuccessProps) {
  if (!message) return null

  return (
    <div className={`flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md ${className}`}>
      <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
      <span className="text-sm text-green-700 flex-1">{message}</span>
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="text-green-600 hover:bg-green-100 p-1 h-auto"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

interface FieldErrorProps {
  error: string | null
  className?: string
}

export function FieldError({ error, className = "" }: FieldErrorProps) {
  if (!error) return null

  return (
    <div className={`flex items-center gap-1 mt-1 ${className}`}>
      <AlertTriangle className="w-3 h-3 text-red-600" />
      <span className="text-xs text-red-600">{error}</span>
    </div>
  )
}
