"use client"

import { useState, useEffect } from 'react'

export function useDietPlanPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShownPopup, setHasShownPopup] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = localStorage.getItem('dietPlanPopupShown')
    if (popupShown === 'true') {
      setHasShownPopup(true)
      return
    }

    let scrollTimeout: NodeJS.Timeout
    let timeTimeout: NodeJS.Timeout

    const handleScroll = () => {
      // Clear the time-based timeout if user scrolls
      clearTimeout(timeTimeout)
      
      // Set a timeout to show popup after scrolling stops
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (!hasShownPopup) {
          setShowPopup(true)
          setHasShownPopup(true)
          localStorage.setItem('dietPlanPopupShown', 'true')
        }
      }, 1000) // Show popup 1 second after scrolling stops
    }

    // Show popup after 5 seconds if no scroll
    timeTimeout = setTimeout(() => {
      if (!hasShownPopup) {
        setShowPopup(true)
        setHasShownPopup(true)
        localStorage.setItem('dietPlanPopupShown', 'true')
      }
    }, 5000)

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      clearTimeout(timeTimeout)
    }
  }, [hasShownPopup])

  const closePopup = () => {
    setShowPopup(false)
  }

  return {
    showPopup,
    closePopup
  }
} 