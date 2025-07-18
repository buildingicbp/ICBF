"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("member")
  const [isSignIn, setIsSignIn] = useState(false)
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    contact: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  
  const { signIn, signUp, signInWithOTP, signInWithGoogle, loading, error } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      toast.error("Please enter your email address")
      return
    }

    if (isSignIn && authMethod === 'password' && !formData.password) {
      toast.error("Please enter your password")
      return
    }

    try {
      if (isSignIn) {
        if (authMethod === 'otp') {
          // OTP Sign In
          const { error } = await signInWithOTP(formData.email)
          if (error) {
            toast.error(error.message)
          } else {
            toast.success("OTP sent to your email!")
            router.push(`/otp-verification?email=${encodeURIComponent(formData.email)}`)
          }
        } else {
          // Password Sign In
          const { error } = await signIn(formData.email, formData.password)
          if (error) {
            // Provide better error messages for common scenarios
            let errorMessage = error.message
            
            if (error.message.includes('Invalid login credentials')) {
              // Check if this might be a Google OAuth account
              errorMessage = 'Invalid email or password. If you signed up with Google, please use "Continue with Google Account" instead.'
            } else if (error.message.includes('Email not confirmed')) {
              errorMessage = 'Please check your email and click the verification link before signing in.'
            } else if (error.message.includes('User not found')) {
              errorMessage = 'No account found with this email. Please sign up first or use "Continue with Google Account" if you signed up with Google.'
            }
            
            toast.error(errorMessage)
          } else {
            toast.success("Successfully signed in!")
            router.push("/dashboard") // Redirect to dashboard
          }
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          username: formData.username,
          contact: formData.contact,
          userType: userType as 'member' | 'trainer',
          full_name: formData.username, // Use username as full name initially
        })
        if (error) {
          let errorMessage = error.message
          
          if (error.message.includes('User already registered')) {
            errorMessage = 'An account with this email already exists. Please sign in instead, or use "Continue with Google Account" if you signed up with Google.'
          }
          
          toast.error(errorMessage)
        } else {
          toast.success("Account created successfully! Please check your email to verify your account.")
          // Redirect to a verification page or show verification instructions
          router.push(`/verification?email=${encodeURIComponent(formData.email)}`)
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle(userType as 'member' | 'trainer')
      if (error) {
        toast.error(error.message)
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    }
  }

  // Show error toast when auth error occurs
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Handle URL parameters for auth callback errors
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    
    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_failed':
          toast.error('Authentication failed. Please try again.')
          break
        case 'unexpected_error':
          toast.error('An unexpected error occurred. Please try again.')
          break
        default:
          toast.error('Authentication error. Please try again.')
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/Sign.png"
          alt="Fitness motivation"
          fill
          className={`object-cover transition-opacity duration-500 ease-in-out ${
            userType === "member" ? "opacity-100" : "opacity-0"
          }`}
          priority
        />
        <Image
          src="/Sign2.png"
          alt="Fitness motivation"
          fill
          className={`object-cover transition-opacity duration-500 ease-in-out ${
            userType === "trainer" ? "opacity-100" : "opacity-0"
          }`}
          priority
        />
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-right">
            <Image src="/logo.png" alt="ICBF Logo" width={60} height={30} className="ml-auto" />
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignIn ? "Welcome Back to Your Journey!" : "Join the Journey to Your Best Self!"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isSignIn 
                ? "Sign in to continue tracking your fitness goals and access your personalized training programs."
                : "Sign up to track your fitness goals and access personalized training programs."
              }
            </p>
            {isSignIn && (
              <p className="text-blue-600 text-xs mt-1">
                💡 If you signed up with Google, use "Continue with Google Account" instead
              </p>
            )}
            
            {/* Authentication Method Toggle for Sign In */}
            {isSignIn && (
              <div className="flex bg-gray-100 rounded-full p-1 mt-4">
                <button
                  type="button"
                  onClick={() => setAuthMethod('password')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                    authMethod === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('otp')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                    authMethod === 'otp' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  OTP
                </button>
              </div>
            )}
          </div>

          {/* User Type Selection */}
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setUserType("member")}
              className={`flex-1 py-2 px-6 rounded-full text-sm font-medium transition-colors ${
                userType === "member" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Member
            </button>
            <button
              onClick={() => setUserType("trainer")}
              className={`flex-1 py-2 px-6 rounded-full text-sm font-medium transition-colors ${
                userType === "trainer" ? "bg-black text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Trainer
            </button>
          </div>

          {/* Sign Up Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your E-mail address"
                  className="w-full rounded-full border-gray-300"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              {!isSignIn && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter Username"
                      className="w-full rounded-full border-gray-300"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      required={!isSignIn}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact
                    </label>
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="+91 • Enter Phone Number"
                      className="w-full rounded-full border-gray-300"
                      value={formData.contact}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                      required={!isSignIn}
                    />
                  </div>
                </div>
              )}

              {isSignIn && authMethod === 'password' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      className="w-full pr-10 rounded-full border-gray-300"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              
              {!isSignIn && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      className="w-full pr-10 rounded-full border-gray-300"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Remember Me and Toggle Form */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setIsSignIn(!isSignIn)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {isSignIn ? "Don't have an account?" : "Already have account?"}
              </button>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full"
              disabled={loading}
            >
              {loading ? "Loading..." : (
                isSignIn 
                  ? (authMethod === 'otp' ? "Send OTP" : "Sign In")
                  : "Get Started"
              )}
            </Button>

            {/* Continue with Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full bg-transparent"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? "Loading..." : "Continue with Google Account"}
            </Button>
          </form>

          {/* Legal Text */}
          <div className="text-xs text-gray-500 text-center leading-relaxed">
            By {isSignIn ? "signing in to" : "signing up for"} ICBF you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Services
            </Link>
            . Learn how we process our data in our{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/cookies" className="underline hover:text-gray-700">
              Cookies Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
