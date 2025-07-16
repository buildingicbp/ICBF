import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Zap, Star, MessageCircle } from "lucide-react"


export default function LandingPage() {
  return (
    <div className="bg-white" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm">
        {/* Logo Container */}
        <div className="flex items-center pl-32">
          <Image src="/logo.png" alt="ICBF Logo" width={80} height={40} className="h-8 w-auto" />
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
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

        {/* Login Button Container */}
        <div className="flex items-center pr-32">
          <Link href="/signin">
            <Button className="bg-[#1F509A] hover:bg-[#1a4a8a] text-white px-6 py-2 rounded-full">Login</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1F509A] leading-tight">
                It's Time To Love
                <br />
                The Person In
                <br />
                The Mirror
              </h1>

              <div className="space-y-4">
                <p className="text-xl text-slate-700 leading-relaxed">
                  We Don't Just Give Workouts. We Help You Build
                  <br />
                  Habits, Follow A Structured Path, And Stay
                  <br />
                  Consistent — <span className="text-[#1F509A] font-semibold">For Real Change</span>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#1F509A] hover:bg-[#1a4a8a] text-white px-10 py-4 rounded-full text-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                  <User className="w-6 h-6" />I Want To Get Fit
                </Button>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="border-2 border-[#1F509A] text-[#1F509A] hover:bg-[#1F509A] hover:text-white px-10 py-4 rounded-full text-lg font-semibold flex items-center gap-2 bg-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Zap className="w-6 h-6" />
                    Connect With Trainer
                  </Button>
                  <p className="text-sm text-[#1F509A] text-center">(for personalized plans)</p>
                </div>
              </div>
            </div>

            {/* Trust Indicator */}
            <div className="pt-4">
              <Image
                src="/trust.png"
                alt="Trusted by 30+ fitness coaches"
                width={400}
                height={60}
                className="w-auto h-14"
              />
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="/transformation.png"
                alt="Before and after transformation"
                width={600}
                height={400}
                className="shadow-2xl w-full max-w-2xl"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Meet the Minds Behind the Mission Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Meet the Minds Behind
            <br />
            the Mission
          </h2>
          <p className="text-slate-600 text-lg">Join As A Member, Train With Us, Or Become A Certified Coach</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/Trainer/Trainer1.png"
              alt="Trainer 1"
              width={600}
              height={500}
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/Trainer/Trainer2.png"
              alt="Trainer 2"
              width={600}
              height={500}
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/Trainer/Trainer3.png"
              alt="Trainer 3"
              width={600}
              height={500}
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="min-h-screen bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">👥</span>
              Our Trusted Clients
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-4xl">
                Words Of Praise From Others About Our Presence.
              </h1>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.",
                author: "Alex Santhman",
                role: "Social worker",
                avatar: "/placeholder.svg?height=40&width=40",
                rating: 5,
                timeAgo: "3 months ago",
              },
              {
                id: 2,
                text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.",
                author: "Alex Santhman",
                role: "Social worker",
                avatar: "/placeholder.svg?height=40&width=40",
                rating: 5,
                timeAgo: "3 months ago",
              },
              {
                id: 3,
                text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.",
                author: "Alex Santhman",
                role: "Social worker",
                avatar: "/placeholder.svg?height=40&width=40",
                rating: 5,
                timeAgo: "3 months ago",
              },
            ].map((testimonial) => (
              <div key={testimonial.id} className="bg-blue-50 rounded-2xl p-6 relative">
                {/* Quote Icon */}
                <div className="text-blue-400 text-4xl font-serif mb-4">"</div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-sm leading-relaxed mb-6">{testimonial.text}</p>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{testimonial.author}</h4>
                      <p className="text-gray-600 text-xs">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {/* Star Rating */}
                    <div className="flex gap-1 mb-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{testimonial.timeAgo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 rounded-3xl mx-4">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <span className="mr-2">👥</span>A movement that matters
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Be the part personalised fitness community of India
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed">
                We're not just another fitness platform—we're a community of real people chasing real transformation.
                Whether you're a beginner, a busy professional, or a seasoned athlete, our community is designed to
                support you every step of the way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">
                  ⭐ Be The Part Of Can Be Fit
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full bg-transparent"
                >
                  Explore More →
                </Button>
              </div>
            </div>

            {/* Right Phone Mockup */}
            <div className="flex justify-center">
              <Image
                src="/phone.png"
                alt="Phone mockup"
                width={900}
                height={1350}
                className="w-full max-w-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 pb-4">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Connect with us */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 text-lg">Connect with us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <span>📱</span>
                  <span>+91 38827 28322</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span>✉️</span>
                  <span>support@icbf.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span>📷</span>
                  <span>@icanbefitter</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                </div>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 text-lg">Company</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  About Us
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Community
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Become a coach
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Help & Support
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Contact Us
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 text-lg">Services</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Online Coaching
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Corporate Wellness
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Fitness & Nutrition Courses
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Weight Loss Diet Plan
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Diabetes Lifestyle Management
                </a>
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 text-lg">Tools</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Manus AI
                </a>
                <a href="/bmi-calculator" className="block text-slate-600 hover:text-blue-600">
                  BMI Calculator
                </a>
                <a href="/calories-calculator" className="block text-slate-600 hover:text-blue-600">
                  Calories Calculator
                </a>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 text-lg">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Blog
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Learn
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Pricing
                </a>
                <a href="#" className="block text-slate-600 hover:text-blue-600">
                  Help center
                </a>
              </div>
            </div>
          </div>


        </div>
      </footer>

      {/* Footer Image */}
      <div className="w-full">
        <Image
          src="/footer.png"
          alt="Footer decoration"
          width={1920}
          height={200}
          className="w-full object-cover"
        />
      </div>
    </div>
  )
}
