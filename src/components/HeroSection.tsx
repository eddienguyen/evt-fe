/**
 * Hero Section Component
 * 
 * Content-only hero section that layers above the 3D background canvas.
 * Phase 4A: Refactored to remove 3D canvas (now in BackgroundCanvas component).
 * 
 * @module components/HeroSection
 */

import React from 'react'
import { couple, events } from '../config/site'

/**
 * Hero Section - Content Only
 * 
 * Displays the hero content (couple names, event dates) that layers above
 * the global 3D background canvas. No longer manages 3D rendering.
 * 
 * @example
 * ```tsx
 * // In Home.tsx
 * <HeroSection />
 * ```
 */
const HeroSection: React.FC = () => {
  return (
    <section 
      className="relative h-screen w-full flex items-center justify-center z-content"
      aria-label="Hero section"
    >
      {/* Hero Content */}
      <div className="text-center text-accent-white px-4">
        {/* Couple Names - Positioned to align with 3D text */}
        <div className="mb-32">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-4 opacity-0">
            {/* Hidden but present for SEO and accessibility */}
            <span className="sr-only">{couple.displayName}'s Wedding</span>
          </h1>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={couple.heroImage || '/album/NAM_0526.jpeg'}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <p className="text-xl md:text-2xl font-light tracking-wide opacity-90">
            {events.hue.dateDisplay} • {events.hue.locationShort}
          </p>
          <div className="w-16 h-px bg-accent-gold mx-auto"></div>
          <p className="text-sm md:text-base opacity-75">
            {events.hanoi.dateDisplay} • {events.hanoi.locationShort}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
