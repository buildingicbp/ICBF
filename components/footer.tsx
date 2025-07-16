import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 mt-16">
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
              <a href="#" className="block text-slate-600 hover:text-blue-600">
                BMI Calculator
              </a>
              <a href="#" className="block text-slate-600 hover:text-blue-600">
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

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-6 text-slate-600 text-sm">
            <a href="#" className="hover:text-blue-600">
              Terms & Condition
            </a>
            <a href="#" className="hover:text-blue-600">
              Privacy Policy
            </a>
          </div>
          <div className="text-slate-600 text-sm mt-4 md:mt-0">© 2025. All rights reserved</div>
        </div>
      </div>
    </footer>
  )
} 