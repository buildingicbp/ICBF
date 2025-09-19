"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowRight, Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  
  // Force re-render when path changes to ensure auth state is in sync
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await signOut()
    // Optional: navigate to home after logout
    // window.location.href = "/"
  }

  // Compute dashboard href based on user role/email
  const dashboardHref = (() => {
    const email = user?.email?.toLowerCase()
    const type = (user?.user_metadata?.userType as 'member' | 'trainer' | undefined) || 'member'
    if (email === 'icanbefitter@gmail.com') return '/admin-dashboard'
    if (type === 'trainer') return '/trainer-dashboard'
    return '/member-dashboard'
  })()

  // Resolve a friendly display name (first name preferred)
  const displayName = (() => {
    const full = (user?.user_metadata?.full_name as string | undefined) || ""
    const username = (user?.user_metadata?.username as string | undefined) || ""
    const email = user?.email || ""
    const firstFromFull = full.trim().split(" ")[0]
    if (firstFromFull) return firstFromFull
    if (username) return username
    if (email) return email.split("@")[0]
    return "there"
  })()
  
  // Check if user is a trainer
  const isTrainer = (user?.user_metadata?.userType as string)?.toLowerCase() === 'trainer' || 
                  user?.email?.toLowerCase().includes('trainer') ||
                  user?.email?.toLowerCase().includes('admin')

  // Close menu on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        {/* Logo Container */}
        <div className="flex items-center pl-2 sm:pl-4 lg:pl-16">
          <Link href="/">
            <Image src="/logo.png" alt="ICBF Logo" width={50} height={25} className="h-3 sm:h-4 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
        </div>

        {/* Center Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/blogs" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
            Learn
          </Link>
          <Link href="/services" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
            Services
          </Link>
          <Link href="/work-with-us" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
            Work with Us
          </Link>
          <Link href="/store" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
            Store
          </Link>
          <a href="#" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
            Contact
          </a>
          <Link href="/ai-diet-planner" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
            Try AI Diet Planner
          </Link>
        </nav>

        {/* Action Buttons Container - Desktop */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 pr-2 sm:pr-4 lg:pr-16">
          <a href="https://calendly.com/icanbefitter/30min" target="_blank" rel="noopener noreferrer">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Book a Free Consultation</span>
              <span className="sm:hidden">Consultation</span>
            </Button>
          </a>
          {user ? (
            <div className="relative" ref={menuRef}>
              {/* Name Button */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-[#1F509A] text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {`Hey ${displayName}`}
              </button>
              {/* Click Menu */}
              {menuOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-2">
                  <Link href={dashboardHref} onClick={() => setMenuOpen(false)}>
                    <Button className="w-full justify-start gap-2" size="sm">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setMenuOpen(false); handleLogout() }}
                    className="w-full justify-start gap-2 mt-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signin">
              <Button
                variant="outline"
                className="border-gray-300 text-[#1F509A] hover:bg-gray-50 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <span className="hidden sm:inline">Signup As</span>
                <span className="sm:hidden">Signup</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image src="/logo.png" alt="ICBF Logo" width={50} height={25} className="h-5 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-8">
              <div className="space-y-6">
                <a href="#" className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  Learn
                </a>
                <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  Services
                </Link>
                <Link href="/work-with-us" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  Work with Us
                </Link>
                <Link href="/store" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  Store
                </Link>
                <a href="#" className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  Contact
                </a>
                <Link href="/ai-diet-planner" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  Try AI Diet Planner
                </Link>
              </div>
            </nav>

            {/* Mobile Action Buttons */}
            <div className="p-4 space-y-4 border-t border-gray-200">
              <a href="https://calendly.com/icanbefitter/30min" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Book a Free Consultation
                </Button>
              </a>
              {user ? (
                <>
                  <Link href="/member-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3 rounded-full font-medium flex items-center justify-center gap-2">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full border-gray-300 text-red-600 hover:bg-gray-50 py-3 rounded-full font-medium flex items-center justify-center gap-2"
                  >
                    Logout
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-gray-300 text-[#1F509A] hover:bg-gray-50 py-3 rounded-full font-medium flex items-center justify-center gap-2">
                    Signup As
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}