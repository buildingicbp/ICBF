"use client"

import { useState, useEffect } from "react"
import ConditionalNavbar from "@/components/conditional-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, ShoppingCart, Star, Clock, Users } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  price: number
  file_name: string
  file_size?: number
  is_active: boolean
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = (productId: string) => {
    window.location.href = `/store/checkout/${productId}`
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ConditionalNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            ICBF Digital Store
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Premium digital resources to accelerate your fitness and business journey
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
              <p className="text-gray-600">Check back soon for new digital products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{product.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 line-clamp-3">
                          {product.description}
                        </CardDescription>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Product Features */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>Instant Download</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Lifetime Access</span>
                        </div>
                      </div>
                      
                      {/* File Info */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Format: PDF</span>
                        <span className="text-gray-600">Size: {formatFileSize(product.file_size)}</span>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">(4.9/5)</span>
                        <span className="text-sm text-gray-500">• 127 reviews</span>
                      </div>
                      
                      {/* Benefits */}
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          Professional Guide
                        </Badge>
                        <Badge variant="secondary" className="text-xs ml-2">
                          Expert Insights
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-4 border-t">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            ${product.price}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">USD</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>1,200+ sold</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handlePurchase(product.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now - Instant Access
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center mt-2">
                        30-day money-back guarantee
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Our Digital Products?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Access</h3>
              <p className="text-gray-600">Download immediately after purchase. No waiting, no shipping delays.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Quality</h3>
              <p className="text-gray-600">Created by industry professionals with years of experience.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifetime Access</h3>
              <p className="text-gray-600">Once purchased, access your content forever. No subscriptions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">ICANBEFITTER</h3>
            <p className="text-gray-400 mb-8">
              Your journey to fitness starts here
            </p>
            <p className="text-gray-400 text-sm mt-8">
              © 2024 ICANBEFITTER. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
