"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Mail, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

function OTPVerificationContent() {
  const [otp, setOtp] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { verifyOTP, signInWithOTP, loading } = useAuth()

  useEffect(() => {
    if (!email) {
      router.push("/signin")
      return
    }

    // Start countdown for resend button
    setCountdown(30)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    try {
      const { error } = await verifyOTP(email!, otp)
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("OTP verified successfully!")
        router.push("/dashboard")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    }
  }

  const handleResendOTP = async () => {
    if (!email) return
    
    setIsResending(true)
    try {
      const { error } = await signInWithOTP(email)
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("OTP sent successfully!")
        setCountdown(30)
      }
    } catch (err) {
      toast.error("Failed to resend OTP")
    } finally {
      setIsResending(false)
    }
  }

  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '')
    if (numericValue.length <= 6) {
      setOtp(numericValue)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="ICBF Logo" width={80} height={40} />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enter OTP Code
          </h1>
          
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              required
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResendOTP}
            disabled={countdown > 0 || isResending}
            className="text-blue-600 hover:text-blue-500"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              "Resend OTP"
            )}
          </Button>
        </div>

        {/* Back to Sign In */}
        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            asChild
            className="text-gray-600 hover:text-gray-900"
          >
            <Link href="/signin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OTPVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OTPVerificationContent />
    </Suspense>
  )
} 