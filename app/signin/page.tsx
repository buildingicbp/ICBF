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
  const [isSignIn, setIsSignIn] = useState(true)
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')
  const [userType, setUserType] = useState<'member' | 'trainer'>('member')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    phone: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const { signIn, signUp, signInWithOTP, loading, error } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Real-time password validation
    if (name === 'password') {
      if (value.length > 0 && value.length < 6) {
        setPasswordError('Password must be at least 6 characters long')
        setIsPasswordValid(false)
      } else if (value.length >= 6) {
        setPasswordError('')
        setIsPasswordValid(true)
      } else {
        setPasswordError('')
        setIsPasswordValid(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("🚀 Form submitted!")
    console.log("🎯 Current userType state:", userType)
    console.log("📝 Form data:", formData)
    console.log("🔐 Is sign in:", isSignIn)
    console.log("🎯 Toggle selection confirmed:", userType)
    
    if (!formData.email) {
      toast.error("Please enter your email address")
      return
    }

    if (isSignIn && authMethod === 'password' && !formData.password) {
      toast.error("Please enter your password")
      return
    }

    // Password validation for sign up
    if (!isSignIn && formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
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
          console.log("🔐 Signing in with userType:", userType)
          const { error } = await signIn(formData.email, formData.password, userType as 'member' | 'trainer')
          if (error) {
            // Provide better error messages for common scenarios
            let errorMessage = error.message
            
            if (error.message.includes('Invalid login credentials')) {
              // Check if this might be a Google OAuth account
              errorMessage = 'Invalid email or password. Please check your credentials and try again.'
            } else if (error.message.includes('Email not confirmed')) {
              errorMessage = 'Please check your email and click the verification link before signing in.'
            } else if (error.message.includes('User not found')) {
              errorMessage = 'No account found with this email. Please sign up first.'
            }
            
            toast.error(errorMessage)
          } else {
            toast.success("Successfully signed in!")
            router.push("/dashboard") // Redirect to dashboard
          }
        }
      } else {
        // Sign Up
        console.log("📝 Signing up with userType:", userType)
        const { error } = await signUp(formData.email, formData.password, {
          username: formData.username,
          contact: formData.phone || '', // Make phone optional
          userType: userType as 'member' | 'trainer',
          full_name: formData.fullName // Assuming username is full name for now
        })
        
        if (error) {
          let errorMessage = error.message
          
          if (error.message.includes('User already registered')) {
            errorMessage = 'An account with this email already exists. Please sign in instead.'
          } else if (error.message.includes('Password should be at least 6 characters')) {
            errorMessage = 'Password must be at least 6 characters long.'
          } else if (error.message.includes('Invalid email')) {
            errorMessage = 'Please enter a valid email address.'
          }
          
          toast.error(errorMessage)
        } else {
          toast.success("Account created successfully! Please check your email to verify your account.")
          router.push(`/otp-verification?email=${encodeURIComponent(formData.email)}`)
        }
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  const handleGoogleSignIn = async () => {
    toast.info("Google OAuth coming soon! Please use email sign-in for now.")
    return
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
          <div className="space-y-2">
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                type="button"
                onClick={() => {
                  console.log("🔄 Setting userType to member")
                  setUserType("member")
                }}
                className={`flex-1 py-2 px-6 rounded-full text-sm font-medium transition-colors ${
                  userType === "member" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("🔄 Setting userType to trainer")
                  setUserType("trainer")
                }}
                className={`flex-1 py-2 px-6 rounded-full text-sm font-medium transition-colors ${
                  userType === "trainer" ? "bg-black text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Trainer
              </button>
            </div>
            
            {/* Debug indicator */}
            <div className="text-xs text-center text-gray-500">
              Current selection: <span className="font-bold">{userType}</span>
            </div>
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
                  onChange={handleInputChange}
                  name="email"
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
                      onChange={handleInputChange}
                      name="username"
                      required={!isSignIn}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="+91 • Enter Phone Number"
                      className="w-full rounded-full border-gray-300"
                      value={formData.phone}
                      onChange={handleInputChange}
                      name="phone"
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
                    <input
                      type="password"
                      placeholder="Password"
                      className={`w-full pr-10 rounded-full border-gray-300 ${
                        passwordError ? 'border-red-500 focus:border-red-500' : 
                        isPasswordValid ? 'border-green-500 focus:border-green-500' : ''
                      }`}
                      value={formData.password}
                      onChange={handleInputChange}
                      name="password"
                      required
                    />
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1 ml-4">
                        {passwordError}
                      </p>
                    )}
                    {isPasswordValid && formData.password && (
                      <p className="text-green-500 text-sm mt-1 ml-4">
                        ✓ Password is valid
                      </p>
                    )}
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
                      onChange={handleInputChange}
                      name="password"
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
