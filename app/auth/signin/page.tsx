import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Kula Chipo
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kula Chipo</h1>
          <p className="text-gray-600">Welcome back to the best fries platform</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
