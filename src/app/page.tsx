'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const LuxLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="w-full h-full">
    <polygon points="25,46.65 50,3.35 0,3.35" fill="white" stroke="white" strokeWidth={0.5} />
  </svg>
)

export default function ArtPage() {
  const [showFullRes, setShowFullRes] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null)

  // Auto-hide details after 5 seconds, show on hover
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDetails(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleZoom = (delta: number) => {
    setZoom(prevZoom => Math.min(Math.max(prevZoom + delta, 1), 5))
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!showFullRes) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    handleZoom(delta)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!showFullRes) return
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !showFullRes) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers for mobile
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!showFullRes) return

    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches))
    } else if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!showFullRes) return

    if (e.touches.length === 2 && lastTouchDistance !== null) {
      e.preventDefault()
      const distance = getTouchDistance(e.touches)
      if (distance) {
        const delta = (distance - lastTouchDistance) / 100
        handleZoom(delta)
        setLastTouchDistance(distance)
      }
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault()
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setLastTouchDistance(null)
  }

  const handleCloseFullRes = () => {
    setShowFullRes(false)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <main
      className="fixed inset-0 w-screen h-screen bg-black overflow-hidden"
      onMouseMove={() => !showFullRes && setShowDetails(true)}
      onMouseLeave={() => !showFullRes && setShowDetails(false)}
    >
      {/* Lux logo - top left */}
      <div className={`absolute top-6 left-6 md:top-8 md:left-8 z-50 w-12 h-12 md:w-16 md:h-16 transition-opacity duration-700 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
        <LuxLogo />
      </div>

      {/* Full-screen artwork - cropped to fill viewport */}
      <div
        className="relative w-full h-full cursor-pointer group"
        onClick={() => setShowFullRes(true)}
      >
        <Image
          src="/assets/sans-titre.jpg"
          alt="Sans titre (2003) by Prince Cyrus Pahlavi - Oil on canvas laid down on metal panel"
          fill
          className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
          priority
          quality={100}
        />

        {/* Auction details overlay - animated */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 md:p-12 transition-all duration-1000 ease-in-out ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-3xl md:text-5xl font-light mb-3 tracking-wide">
              Sans titre
            </h1>
            <p className="text-lg md:text-xl font-light text-gray-300 mb-8">
              Prince Cyrus Pahlavi, 2003
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs md:text-sm">
              <div>
                <p className="text-gray-500 mb-1 uppercase tracking-wider text-xs">Medium</p>
                <p className="font-light">Oil on canvas</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1 uppercase tracking-wider text-xs">Size</p>
                <p className="font-light">215 × 142 cm</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1 uppercase tracking-wider text-xs">Collection</p>
                <p className="font-light">Princesse Niloufar Pahlavi</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1 uppercase tracking-wider text-xs">Estimate</p>
                <p className="font-light">€20,000 - €30,000</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800/50">
              <a
                href="https://www.sothebys.com/en/buy/auction/2025/collection-princesse-niloufar-pahlavi-une-maison-par-jacques-grange-pf2537/sans-titre-6"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
              >
                <span>Sotheby's Auction</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Full resolution modal with zoom and pan */}
      {showFullRes && (
        <div
          className="fixed inset-0 z-[100] bg-black overflow-hidden touch-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Close button */}
          <button
            onClick={handleCloseFullRes}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-50 text-white/70 hover:text-white transition-colors duration-300"
            aria-label="Close"
          >
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col gap-2">
            <button
              onClick={() => handleZoom(0.2)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300 flex items-center justify-center backdrop-blur-sm"
              aria-label="Zoom in"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => handleZoom(-0.2)}
              disabled={zoom <= 1}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300 flex items-center justify-center backdrop-blur-sm disabled:opacity-30"
              aria-label="Zoom out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={handleCloseFullRes}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300 flex items-center justify-center backdrop-blur-sm"
              aria-label="Reset"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Zoom indicator */}
          {zoom > 1 && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 text-white/70 text-sm backdrop-blur-sm bg-black/30 px-4 py-2 rounded-full">
              {Math.round(zoom * 100)}%
            </div>
          )}

          {/* Image container */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              <Image
                src="/assets/sans-titre.jpg"
                alt="Sans titre (2003) by Prince Cyrus Pahlavi - Full Resolution"
                width={2154}
                height={1420}
                className="max-w-none"
                quality={100}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
