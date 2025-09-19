"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import ConditionalNavbar from "@/components/conditional-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileText, ShieldCheck, Download, ArrowLeft, CreditCard } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms")
})

type CheckoutForm = z.infer<typeof checkoutSchema>

interface Product {
  id: string
  title: string
  description: string
  price: number
  file_name: string
  file_size?: number
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.productId as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  })

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        router.push('/store')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      router.push('/store')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CheckoutForm) => {
    if (!product) return
    
    setProcessing(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        router.push(`/store/success/${order.id}`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to process order'}`)
      }
    } catch (error) {
      console.error('Error processing order:', error)
      alert('An error occurred while processing your order. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
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

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <ConditionalNavbar />
        <div className="pt-32 text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Button onClick={() => router.push('/store')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/store')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your purchase to get instant access</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Format: PDF</span>
                        <span>Size: {formatFileSize(product.file_size)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${product.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${product.price}</span>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">What's Included:</h4>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Instant PDF download
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Password-protected access
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Lifetime access to content
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div className="order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>
                    Enter your details to complete the purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name</Label>
                      <Input
                        id="customerName"
                        {...register("customerName")}
                        placeholder="Enter your full name"
                        className={errors.customerName ? "border-red-500" : ""}
                      />
                      {errors.customerName && (
                        <p className="text-sm text-red-500">{errors.customerName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email Address</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        {...register("customerEmail")}
                        placeholder="Enter your email address"
                        className={errors.customerEmail ? "border-red-500" : ""}
                      />
                      {errors.customerEmail && (
                        <p className="text-sm text-red-500">{errors.customerEmail.message}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Download link and password will be sent to this email
                      </p>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          {...register("agreeToTerms")}
                          className="mt-1"
                        />
                        <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                          I agree to the{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            Complete Purchase - ${product.price}
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center mt-3">
                        No payment gateway required for demo. Click to simulate purchase.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Secure Purchase</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Your information is protected and will only be used to deliver your digital product.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
