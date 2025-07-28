import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import ConditionalChatbot from '@/components/conditional-chatbot'
import { Toaster } from 'sonner'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ICBF',
  description: 'ICBF - Your Fitness Journey Starts Here',
  generator: 'ICBF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {children}
        <ConditionalChatbot />
        <Toaster />
      </body>
    </html>
  )
}
