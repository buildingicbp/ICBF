"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function DebugPage() {
  const { user, loading, error } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [urlInfo, setUrlInfo] = useState<any>(null)

  useEffect(() => {
    const getSessionInfo = async () => {
      const { data, error } = await supabase.auth.getSession()
      setSessionInfo({ data, error })
    }

    const getUrlInfo = () => {
      setUrlInfo({
        href: window.location.href,
        search: window.location.search,
        hash: window.location.hash,
        pathname: window.location.pathname,
      })
    }

    getSessionInfo()
    getUrlInfo()
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Authentication Debug Info</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">useAuth Hook State</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({ user, loading, error }, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Session Info</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">URL Info</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(urlInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({
              NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
              NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***' : 'NOT_SET',
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
} 