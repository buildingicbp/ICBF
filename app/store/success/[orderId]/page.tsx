"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ConditionalNavbar from "@/components/conditional-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, FileText, Key, Copy, Eye, EyeOff } from "lucide-react"

interface Order {
  id: string
  customer_name: string
  customer_email: string
  order_status: string
  created_at: string
  digital_products: {
    title: string
    description: string
    file_name: string
    download_password: string
  }
}

export default function SuccessPage() {
  const params = useParams()
  const orderId = params.orderId as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!order) return
    
    try {
      const response = await fetch(`/api/download/${orderId}`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = order.digital_products.file_name
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setDownloadCount(prev => prev + 1)
      } else {
        const error = await response.json()
        alert(`Download failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Download failed. Please try again.')
    }
  }

  const copyPassword = () => {
    if (order?.digital_products.download_password) {
      navigator.clipboard.writeText(order.digital_products.download_password)
      alert('Password copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <ConditionalNavbar />
        <div className="pt-32 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <ConditionalNavbar />
        <div className="pt-32 text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Button onClick={() => window.location.href = '/store'}>
            Back to Store
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ConditionalNavbar />
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Successful!</h1>
            <p className="text-gray-600">
              Thank you for your purchase, {order.customer_name}. Your digital product is ready for download.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Order #{order.id.slice(0, 8)}</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {order.order_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{order.digital_products.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.digital_products.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Format: PDF</span>
                      <span>Downloads: {downloadCount}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Your Product
              </CardTitle>
              <CardDescription>
                Click the button below to download your PDF. You'll need the password to open it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF ({order.digital_products.file_name})
              </Button>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <Key className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 mb-2">PDF Password</h4>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
                        {showPassword ? order.digital_products.download_password : '••••••••••••••••••'}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyPassword}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-yellow-800 mt-2">
                      Save this password! You'll need it to open the PDF file.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Confirmation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                A confirmation email with your download link and password has been sent to{" "}
                <strong>{order.customer_email}</strong>. Please check your inbox and spam folder.
              </p>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  You can download this file up to 5 times within 30 days
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  Keep your password safe - it cannot be recovered
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  For support, contact us with your order ID: {order.id.slice(0, 8)}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  This purchase comes with a 30-day money-back guarantee
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/store'}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
