"use client"

import { Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function VerificationContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="ICBF Logo" width={80} height={40} />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Check Your Email
          </h1>
          
          <p className="text-gray-600">
            We've sent a verification link to{" "}
            <span className="font-medium text-gray-900">
              {email || "your email address"}
            </span>
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Next Steps:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your email inbox</li>
                  <li>• Click the verification link</li>
                  <li>• Return here to sign in</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{" "}
            <button className="text-blue-600 hover:text-blue-500 font-medium">
              resend verification
            </button>
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Button 
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full"
          >
            <Link href="/signin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full"
          >
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function VerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  )
} 