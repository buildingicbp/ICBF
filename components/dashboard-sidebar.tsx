"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  User, 
  Activity, 
  Target, 
  Calendar, 
  Settings, 
  LogOut,
  Users,
  MessageSquare,
  TrendingUp,
  Award,
  Dumbbell,
  Heart,
  Clock,
  DollarSign,
  Star,
  Menu,
  X,
  Utensils
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface DashboardSidebarProps {
  userType: 'member' | 'trainer'
  activePage?: string
}

export function DashboardSidebar({ userType, activePage = 'dashboard' }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    // No need for manual redirect - signOut function handles it
  }

  const memberNavItems = [
    { icon: Home, label: 'Overview', href: '/member-dashboard', active: activePage === 'dashboard' },
    { icon: Dumbbell, label: "Today's Plan", href: '/member-dashboard#today', active: false },
    { icon: Utensils, label: 'Meal Plan', href: '/member-dashboard#meal', active: false },
    { icon: Award, label: 'Progress Photos', href: '/member-dashboard#photos', active: false },
    { icon: Clock, label: 'Recent Activity', href: '/member-dashboard#activity', active: false },
    { icon: User, label: 'Profile', href: '/member-dashboard/profile', active: activePage === 'profile' },
    { icon: Settings, label: 'Settings', href: '/member-dashboard/settings', active: activePage === 'settings' },
  ]

  const trainerNavItems = [
    { icon: Home, label: 'Dashboard', href: '/trainer-dashboard', active: activePage === 'dashboard' },
    { icon: Users, label: 'My Clients', href: '/trainer-dashboard/clients', active: activePage === 'clients' },
    { icon: Calendar, label: 'Schedule', href: '/trainer-dashboard/schedule', active: activePage === 'schedule' },
    { icon: MessageSquare, label: 'Messages', href: '/trainer-dashboard/messages', active: activePage === 'messages' },
    { icon: Target, label: 'Workout Plans', href: '/trainer-dashboard/workouts', active: activePage === 'workouts' },
    { icon: TrendingUp, label: 'Client Progress', href: '/trainer-dashboard/progress', active: activePage === 'progress' },
    { icon: DollarSign, label: 'Earnings', href: '/trainer-dashboard/earnings', active: activePage === 'earnings' },
    { icon: Star, label: 'Reviews', href: '/trainer-dashboard/reviews', active: activePage === 'reviews' },
    { icon: User, label: 'Profile', href: '/trainer-dashboard/profile', active: activePage === 'profile' },
    { icon: Settings, label: 'Settings', href: '/trainer-dashboard/settings', active: activePage === 'settings' },
  ]

  const navItems = userType === 'member' ? memberNavItems : trainerNavItems

  return (
    <>
      {/* Mobile Menu Button - moved to top-right to avoid overlapping the logo */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 right-4 z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-64'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link href="/?from=dashboard" aria-label="Go to Landing Page" className="flex items-center space-x-3 cursor-pointer">
              <Image 
                src="/logo.png" 
                alt="ICBF Logo" 
                width={isCollapsed ? 30 : 100} 
                height={30}
                className="transition-all duration-300"
              />
              {!isCollapsed && (
                <span className={`text-sm font-medium text-gray-700 transition-opacity duration-300 ${
                  isCollapsed ? 'opacity-0' : 'opacity-100'
                }`}>
                  {userType === 'member' ? 'Member' : 'Trainer'}
                </span>
              )}
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.user_metadata?.username || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userType}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start h-10 ${
                  isCollapsed ? 'px-2' : 'px-3'
                }`}
                onClick={() => router.push(item.href)}
              >
                <item.icon className={`w-4 h-4 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                {!isCollapsed && (
                  <span className="transition-opacity duration-300">
                    {item.label}
                  </span>
                )}
              </Button>
            ))}
          </nav>


        </div>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
} 