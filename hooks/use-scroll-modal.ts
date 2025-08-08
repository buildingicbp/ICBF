"use client"

import { useState, useEffect } from 'react'

export function useScrollModal() {
  const [showModal, setShowModal] = useState(false)
  const [hasShownModal, setHasShownModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Don't show modal if it's already been shown
      if (hasShownModal) return

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      
      // Calculate when user has scrolled through approximately 4 sections
      // Each section is roughly 100vh, so after 4 sections = 4 * windowHeight
      const triggerPosition = windowHeight * 4

      if (scrollPosition >= triggerPosition) {
        setShowModal(true)
        setHasShownModal(true)
        
        // Store in localStorage to prevent showing again in this session
        localStorage.setItem('dietPlanModalShown', 'true')
      }
    }

    // Check if modal was already shown in this session
    const modalShown = localStorage.getItem('dietPlanModalShown')
    if (modalShown === 'true') {
      setHasShownModal(true)
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasShownModal])

  const closeModal = () => {
    setShowModal(false)
  }

  return {
    showModal,
    closeModal
  }
} 