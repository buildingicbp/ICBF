"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("member")
  const [isSignIn, setIsSignIn] = useState(false)

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
          <form className="space-y-4">
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
                    />
                  </div>
                </div>
              )}

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
            </div>

            {/* Remember Me and Toggle Form */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
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
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full">
              {isSignIn ? "Sign In" : "Get Started"}
            </Button>

            {/* Continue with Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full bg-transparent"
            >
              Continue with Google Account
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
