"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight, Filter } from "lucide-react"
import { useState } from "react"

export default function BlogsPage() {
  const [selectedTag, setSelectedTag] = useState<string>("All")

  const blogPosts = [
    {
      id: 1,
      title: "Fitness Blueprint for Complete Beginners!",
      excerpt: "According to most of us, getting Fit means inclusion of one or more of the following. Read their lacunae. Leg Intensive Cardio, Dieting, and Gym workout. Learn the step-by-step process to start your fitness journey properly.",
      author: "ICANBEFITTER",
      date: "April 6, 2019",
      readTime: "10 min read",
      category: "Beginner Guide",
      tags: ["Motivation", "Beginner Guide", "Fitness"],
      image: "/placeholder.jpg",
      slug: "fitness-blueprint-beginners"
    },
    {
      id: 2,
      title: "ICANBEFITTER - It's Time to Love the Person in the Mirror",
      excerpt: "Becoming Fit is a Consequence of our Lifestyle! We see around us unfit people prone to lifestyle diseases, struggling to carry out their day to day activities. Learn how small incremental changes can make you fitter, both physically and mentally.",
      author: "ICANBEFITTER",
      date: "March 2019",
      readTime: "8 min read",
      category: "Motivation",
      tags: ["Motivation", "Lifestyle", "Mental Health"],
      image: "/placeholder.jpg",
      slug: "icanbefitter-home"
    },
    {
      id: 3,
      title: "Nutrition Myths Debunked",
      excerpt: "Separating fact from fiction in the world of nutrition. Learn what really works for fat loss, muscle gain, and overall health.",
      author: "Nutrition Expert",
      date: "March 5, 2024",
      readTime: "10 min read",
      category: "Nutrition",
      tags: ["Nutrition", "Health", "Weight Loss"],
      image: "/placeholder.jpg",
      slug: "nutrition-myths-debunked"
    },
    {
      id: 4,
      title: "Mental Health and Fitness: The Connection",
      excerpt: "How physical exercise impacts your mental well-being and strategies to maintain motivation during challenging times.",
      author: "Wellness Coach",
      date: "February 28, 2024",
      readTime: "6 min read",
      category: "Mental Health",
      tags: ["Mental Health", "Motivation", "Wellness"],
      image: "/placeholder.jpg",
      slug: "mental-health-fitness-connection"
    },
    {
      id: 5,
      title: "Home Workout Essentials",
      excerpt: "Build an effective home gym with minimal equipment. Perfect workouts for when you can't make it to the gym.",
      author: "Home Fitness Specialist",
      date: "February 20, 2024",
      readTime: "7 min read",
      category: "Home Workouts",
      tags: ["Home Workouts", "Fitness", "Equipment"],
      image: "/placeholder.jpg",
      slug: "home-workout-essentials"
    },
    {
      id: 6,
      title: "Recovery Strategies for Athletes",
      excerpt: "Optimize your recovery with proven techniques that enhance performance and prevent injuries.",
      author: "Sports Physiotherapist",
      date: "February 15, 2024",
      readTime: "9 min read",
      category: "Recovery",
      tags: ["Recovery", "Athletes", "Performance"],
      image: "/placeholder.jpg",
      slug: "recovery-strategies-athletes"
    },
    {
      id: 7,
      title: "The Science of Muscle Building",
      excerpt: "Understanding the principles of hypertrophy and how to maximize muscle growth through proper training and nutrition.",
      author: "Strength Coach",
      date: "February 10, 2024",
      readTime: "12 min read",
      category: "Strength Training",
      tags: ["Strength Training", "Muscle Building", "Nutrition"],
      image: "/placeholder.jpg",
      slug: "science-muscle-building"
    },
    {
      id: 8,
      title: "Mindful Eating: Transform Your Relationship with Food",
      excerpt: "Learn how to develop a healthy relationship with food through mindful eating practices and intuitive nutrition.",
      author: "Nutrition Therapist",
      date: "February 5, 2024",
      readTime: "8 min read",
      category: "Nutrition",
      tags: ["Nutrition", "Mindful Eating", "Mental Health"],
      image: "/placeholder.jpg",
      slug: "mindful-eating-transform-food-relationship"
    },
    {
      id: 9,
      title: "Cardio vs Strength: Finding Your Perfect Balance",
      excerpt: "Discover how to balance cardiovascular training with strength work for optimal fitness and health outcomes.",
      author: "Fitness Coach",
      date: "January 30, 2024",
      readTime: "11 min read",
      category: "Fitness",
      tags: ["Fitness", "Cardio", "Strength Training"],
      image: "/placeholder.jpg",
      slug: "cardio-vs-strength-perfect-balance"
    }
  ]

  // Get all unique tags from blog posts
  const allTags = ["All", ...Array.from(new Set(blogPosts.flatMap(post => post.tags)))]

  // Filter blog posts based on selected tag
  const filteredPosts = selectedTag === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.tags.includes(selectedTag))

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center pl-32">
          <Link href="/">
            <Image src="/logo.png" alt="ICBF Logo" width={80} height={40} className="h-8 w-auto" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-black hover:text-slate-700 font-semibold">
            Home
          </Link>
          <a href="#" className="text-black hover:text-slate-700 font-semibold">
            Learn
          </a>
          <a href="#" className="text-black hover:text-slate-700 font-semibold">
            Services
          </a>
          <a href="#" className="text-black hover:text-slate-700 font-semibold">
            Work with Us
          </a>
          <a href="#" className="text-black hover:text-slate-700 font-semibold">
            Store
          </a>
          <a href="#" className="text-black hover:text-slate-700 font-semibold">
            Contact
          </a>
        </nav>

        <div className="flex items-center pr-32">
          <Link href="/signin">
            <Button className="bg-[#1F509A] hover:bg-[#1a4a8a] text-white px-6 py-2 rounded-full">Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1F509A] to-[#2a5bb8] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Fitness & Wellness Blog
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Expert insights, practical tips, and inspiring stories to help you on your fitness journey
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Filter by Topic</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTag === tag
                      ? 'bg-[#1F509A] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-[#1F509A]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredPosts.length} of {blogPosts.length} articles
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#1F509A] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-xs font-medium">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <Link href={`/blogs/${post.slug}`}>
                    <Button 
                      variant="ghost" 
                      className="text-[#1F509A] hover:text-[#1a4a8a] p-0 h-auto font-semibold flex items-center gap-2"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
} 