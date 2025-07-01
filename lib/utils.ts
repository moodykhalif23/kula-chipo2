import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date))
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`
  }
  return `${distance.toFixed(1)}mi`
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-$$$$]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

export function calculateDeliveryTime(distance: number, traffic: "low" | "medium" | "high" = "medium"): number {
  const baseTime = 15 // minutes
  const distanceTime = distance * 5 // 5 minutes per mile
  const trafficMultiplier = { low: 1, medium: 1.2, high: 1.5 }[traffic]

  return Math.round((baseTime + distanceTime) * trafficMultiplier)
}

export function calculateDeliveryFee(distance: number, baseFee = 2.99): number {
  if (distance <= 1) return baseFee
  if (distance <= 3) return baseFee + 1
  return baseFee + 2
}
