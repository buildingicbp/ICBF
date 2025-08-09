"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface PricingSignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PricingSignupModal({ isOpen, onClose }: PricingSignupModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">See detailed pricing</DialogTitle>
          <DialogDescription>
            Please sign up to view full plan pricing and inclusions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-full">Not now</Button>
          <Link href="/signin">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">Sign up</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
