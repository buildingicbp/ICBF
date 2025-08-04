"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowRight, Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
           <a href="#" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
             Services
           </a>
           <a href="#" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
             Work with Us
           </a>
           <a href="#" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
             Store
           </a>
           <a href="#" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
             Contact
           </a>
           <Link href="/ai-diet-planner" className="text-black hover:text-slate-700 font-semibold transition-colors text-sm">
             Try AI Diet Planner
           </Link>
         </nav>

                 {/* Action Buttons Container - Desktop */}
         <div className="hidden md:flex items-center gap-2 lg:gap-3 pr-2 sm:pr-4 lg:pr-16">
           <Button className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
             <MessageCircle className="w-3 h-3" />
             <span className="hidden sm:inline">Book a Free Consultation</span>
             <span className="sm:hidden">Consultation</span>
           </Button>
           <Link href="/signin">
             <Button variant="outline" className="border-gray-300 text-[#1F509A] hover:bg-gray-50 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
               <span className="hidden sm:inline">Signup As</span>
               <span className="sm:hidden">Signup</span>
               <ArrowRight className="w-3 h-3" />
             </Button>
           </Link>
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
                  <a href="#" className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    Services
                  </a>
                  <a href="#" className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    Work with Us
                  </a>
                  <a href="#" className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    Store
                  </a>
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
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Book a Free Consultation
              </Button>
              <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-gray-300 text-[#1F509A] hover:bg-gray-50 py-3 rounded-full font-medium flex items-center justify-center gap-2">
                  Signup As
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 