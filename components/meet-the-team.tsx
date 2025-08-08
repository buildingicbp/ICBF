import React from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function MeetTheTeam() {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Meet the Minds Behind
            <br />
            the Mission
          </h2>
          <div className="flex-1 flex justify-end">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg bg-transparent"
            >
              See all
            </Button>
          </div>
        </div>
        <p className="text-slate-600 text-lg">Join As A Member, Train With Us, Or Become A Certified Coach</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Team member 1"
            width={400}
            height={300}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Team member 2"
            width={400}
            height={300}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Team member 3"
            width={400}
            height={300}
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
    </section>
  )
} 