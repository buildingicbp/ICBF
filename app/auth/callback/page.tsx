import { Suspense } from 'react'
import AuthCallbackClient from './auth-callback-client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackClient />
    </Suspense>
  )
} 