"use client"

import { usePathname } from 'next/navigation'
import Chatbot from './chatbot'

export default function ConditionalChatbot() {
  const pathname = usePathname()
  
  // Only show chatbot on the main page (homepage)
  const shouldShowChatbot = pathname === '/'
  
  if (!shouldShowChatbot) {
    return null
  }
  
  return <Chatbot />
} 