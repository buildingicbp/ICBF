"use client"

import { usePathname } from 'next/navigation'
import Navbar from './navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Check if current path is a dashboard page
  const isDashboardPage = pathname.includes('/admin-dashboard') || 
                         pathname.includes('/member-dashboard') || 
                         pathname.includes('/trainer-dashboard')
  
  if (isDashboardPage) {
    return null
  }
  
  return (
    <>
      <Navbar />
      <div className="pt-16"></div>
    </>
  )
} 