'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const LuxLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="w-full h-full">
    <polygon points="25,46.65 50,3.35 0,3.35" fill="white" stroke="white" strokeWidth={0.5} />
  </svg>
)

const ARTIST_BIO = `Cyrus Pahlavi — a member of the Iranian royal family — was born in 1969 with the title of Prince. His early years were marked by upheaval; at just nine years old, the Iranian revolution forced his family into exile. He was sent to a remote island in the Republic of Seychelles, so isolated that few even knew of its existence. There, surrounded by nature and cut off from his peers, he turned to painting as a way to both capture the beauty of his surroundings and express his inner world. Nature became his greatest muse and most profound teacher.

When circumstances finally allowed him to return to civilization, Cyrus pursued his education in Europe, attending the prestigious Institut le Rosey in Switzerland before studying art at Parsons school of design. His artistic journey led him to explore a wide range of techniques and mediums, continuously pushing creative boundaries. His work has been exhibited internationally, including Marlborough Gallery (Monaco), Miami Art Basel 2023 (the Continuum Opera Gallery), Galerie Saint-Père (Paris), Palace Hotel (Gstaad, Switzerland), the Museum of contemporary art le Pavillon Vendome (Paris), CAN 7 Formentera Gallery (Ibiza), Galerie Pierre Passebon (Paris), Art Dubai Courtyard gallery (2022), the Genesis Odyssey personnel Gallery (Geneva, April 2025), and Villa Padierna palace (Marbella, August 2025). Beyond his contributions to the art world, Cyrus has also made his mark in the film industry as both an actor and producer. One of his most meaningful projects, Rainbows for Beslan, was created to help child survivors of the 2004 Beslan school siege process their grief and find hope. For Cyrus, painting is more than just expression; it is a healing force and a testament to the resilience of the human spirit. "Painting has a healing effect, allowing energy to flow in a circular and positive way. It is a taste of freedom."`

export default function ArtPage() {
  const [showFullRes, setShowFullRes] = useState(false)
  const [showBio, setShowBio] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [showEmailSignup, setShowEmailSignup] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
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

  // Check if artwork is saved in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('artwork-saved')
    setIsSaved(saved === 'true')
  }, [])

  // Handle escape key for modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showEmailSignup) {
          setShowEmailSignup(false)
        } else if (showShare) {
          setShowShare(false)
        } else if (showBio) {
          setShowBio(false)
        } else if (showFullRes) {
          handleCloseFullRes()
        }
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [showBio, showFullRes, showShare, showEmailSignup])

  const toggleSaved = () => {
    const newSaved = !isSaved
    setIsSaved(newSaved)
    localStorage.setItem('artwork-saved', String(newSaved))
  }

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

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!showFullRes) return

    // If we didn't drag (click), close the zoom
    const didDrag = Math.abs(e.clientX - (dragStart.x + pan.x)) > 5 ||
                    Math.abs(e.clientY - (dragStart.y + pan.y)) > 5

    if (!didDrag) {
      handleCloseFullRes()
    }

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

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!showFullRes) return

    // If we didn't drag (tap), close the zoom
    if (e.changedTouches.length === 1 && !lastTouchDistance) {
      const touch = e.changedTouches[0]
      const didDrag = Math.abs(touch.clientX - (dragStart.x + pan.x)) > 5 ||
                      Math.abs(touch.clientY - (dragStart.y + pan.y)) > 5

      if (!didDrag) {
        handleCloseFullRes()
      }
    }

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
      <div className={`absolute top-6 left-6 md:top-8 md:left-8 z-50 w-8 h-8 md:w-10 md:h-10 transition-opacity duration-700 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
        <LuxLogo />
      </div>

      {/* Action buttons - top right */}
      <div className={`absolute top-6 right-6 md:top-8 md:right-8 z-50 flex gap-3 transition-opacity duration-700 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
        {/* Heart/Save button */}
        <button
          onClick={toggleSaved}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 flex items-center justify-center group"
          aria-label={isSaved ? 'Remove from saved' : 'Save artwork'}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 transition-all duration-200" fill={isSaved ? 'white' : 'none'} stroke="white" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Share button */}
        <button
          onClick={() => setShowShare(true)}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
          aria-label="Share artwork"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="white" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>

        {/* Email signup button */}
        <button
          onClick={() => setShowEmailSignup(true)}
          className="hidden md:flex px-4 h-10 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 items-center gap-2 text-white text-sm font-light"
          aria-label="Get notified"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span>Notify Me</span>
        </button>
      </div>

      {/* Full-screen artwork - cropped to fill viewport */}
      <div
        className="relative w-full h-full cursor-zoom-in group animate-fade-from-center"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const clickX = e.clientX - rect.left
          const clickY = e.clientY - rect.top

          // Calculate center offset to zoom into clicked point
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const zoomLevel = 1.5

          // Pan to center the clicked point after zoom
          const panX = (centerX - clickX) * (zoomLevel - 1)
          const panY = (centerY - clickY) * (zoomLevel - 1)

          setShowFullRes(true)
          setZoom(zoomLevel)
          setPan({ x: panX, y: panY })
        }}
      >
        <Image
          src="/assets/sans-titre.jpg"
          alt="Sans titre (2003) by Prince Cyrus Pahlavi - Oil on canvas laid down on metal panel"
          fill
          className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.25]"
          priority
          quality={100}
        />

        {/* Auction details overlay - animated */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 md:p-12 transition-all duration-1000 ease-in-out ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-light mb-2 tracking-tight text-white">
              Sans titre
            </h1>
            <p className="text-base md:text-lg font-normal text-white/60 mb-8">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowBio(true)
                }}
                className="hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Prince Cyrus Pahlavi
              </button>
              , 2003
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-white/40 mb-1 text-xs uppercase tracking-wide">Medium</p>
                <p className="text-white font-light">Oil on canvas</p>
              </div>
              <div>
                <p className="text-white/40 mb-1 text-xs uppercase tracking-wide">Size</p>
                <p className="text-white font-light">215 × 142 cm</p>
              </div>
              <div>
                <p className="text-white/40 mb-1 text-xs uppercase tracking-wide">Collection</p>
                <p className="text-white font-light">Princesse Niloufar Pahlavi</p>
              </div>
              <div>
                <p className="text-white/40 mb-1 text-xs uppercase tracking-wide">Estimate</p>
                <p className="text-white font-light">€100,000+</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <a
                href="https://www.sothebys.com/en/buy/auction/2025/collection-princesse-niloufar-pahlavi-une-maison-par-jacques-grange-pf2537/sans-titre-6"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-sm"
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
          title="Click to close, drag to pan"
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleCloseFullRes()
            }}
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
              onClick={(e) => {
                e.stopPropagation()
                handleZoom(0.2)
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300 flex items-center justify-center backdrop-blur-sm"
              aria-label="Zoom in"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoom(-0.2)
              }}
              disabled={zoom <= 1}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300 flex items-center justify-center backdrop-blur-sm disabled:opacity-30"
              aria-label="Zoom out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCloseFullRes()
              }}
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

      {/* Share Dialog */}
      {showShare && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setShowShare(false)}
        >
          <div
            className="bg-black border border-white/10 rounded-lg max-w-2xl w-full animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-white/10 p-6 md:p-8">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-light text-white mb-1">Share Artwork</h2>
                  <p className="text-sm text-white/40">Share this stunning piece</p>
                </div>
                <button
                  onClick={() => setShowShare(false)}
                  className="text-white/60 hover:text-white transition-colors duration-200 p-2"
                  aria-label="Close share dialog"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Share URL */}
              <div>
                <label className="block text-sm text-white/40 mb-2">Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:border-white/30"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md text-white text-sm transition-colors duration-200"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Embed Code */}
              <div>
                <label className="block text-sm text-white/40 mb-2">Embed Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`<iframe src="${typeof window !== 'undefined' ? window.location.href : ''}" width="100%" height="600" frameborder="0"></iframe>`}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm font-mono focus:outline-none focus:border-white/30"
                  />
                  <button
                    onClick={() => {
                      const embedCode = `<iframe src="${window.location.href}" width="100%" height="600" frameborder="0"></iframe>`
                      navigator.clipboard.writeText(embedCode)
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md text-white text-sm transition-colors duration-200"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div>
                <p className="text-sm text-white/40 mb-3">Share on social media</p>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent('Check out this stunning artwork by Prince Cyrus Pahlavi')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-white text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-white text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 md:p-8">
              <button
                onClick={() => setShowShare(false)}
                className="w-full md:w-auto px-6 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-md transition-colors duration-200 text-sm font-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Signup Modal */}
      {showEmailSignup && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setShowEmailSignup(false)}
        >
          <div
            className="bg-black border border-white/10 rounded-lg max-w-md w-full animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-white/10 p-6 md:p-8">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-light text-white mb-1">Get Notified</h2>
                  <p className="text-sm text-white/40">Be the first to know about new drops</p>
                </div>
                <button
                  onClick={() => setShowEmailSignup(false)}
                  className="text-white/60 hover:text-white transition-colors duration-200 p-2"
                  aria-label="Close email signup"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const email = formData.get('email') as string

                // Store in localStorage for now (TODO: connect to email service)
                const emails = JSON.parse(localStorage.getItem('newsletter-emails') || '[]')
                if (!emails.includes(email)) {
                  emails.push(email)
                  localStorage.setItem('newsletter-emails', JSON.stringify(emails))
                }

                // Show success and close
                alert('Thank you! You will be notified about new drops.')
                setShowEmailSignup(false)
              }}
              className="p-6 md:p-8 space-y-6"
            >
              <div>
                <label htmlFor="email" className="block text-sm text-white/40 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors duration-200"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-white focus:ring-white/30"
                />
                <label htmlFor="consent" className="text-xs text-white/60">
                  I agree to receive emails about new artwork drops and auction notifications. You can unsubscribe at any time.
                </label>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-white transition-colors duration-200 font-light"
              >
                Notify Me
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Biography Modal */}
      {showBio && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setShowBio(false)}
        >
          <div
            className="bg-black border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-white/10 p-6 md:p-8 z-10">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-4 md:gap-6">
                  {/* Portrait */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                    <Image
                      src="/assets/cyrus-pahlavi.webp"
                      alt="Prince Cyrus Pahlavi"
                      fill
                      className="object-cover"
                      quality={95}
                    />
                  </div>
                  {/* Text */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-light text-white mb-1">Prince Cyrus Pahlavi</h2>
                    <p className="text-sm text-white/40">Artist Biography</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBio(false)}
                  className="text-white/60 hover:text-white transition-colors duration-200 p-2 flex-shrink-0"
                  aria-label="Close biography"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-4">
              {ARTIST_BIO.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-white/70 leading-relaxed text-sm md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Footer with close button */}
            <div className="sticky bottom-0 bg-black/95 backdrop-blur-sm border-t border-white/10 p-6 md:p-8">
              <button
                onClick={() => setShowBio(false)}
                className="w-full md:w-auto px-6 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-md transition-colors duration-200 text-sm font-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
