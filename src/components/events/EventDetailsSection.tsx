/**
 * Event Details Section Component
 * 
 * Main section displaying comprehensive wedding event information
 * for both Hue and Hanoi ceremonies.
 * 
 * @module components/events/EventDetailsSection
 */

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/a11y'
import { cn } from '@/lib/utils/cn'
import { eventsConfig, type EventDetails } from '@/config/events'
import EventCard from './EventCard'
import { ImageLoader } from '../gallery'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

export interface EventDetailsSectionProps {
  /** Additional CSS classes */
  className?: string
  /** Enable animations */
  enableAnimations?: boolean
  eventID?: EventDetails["id"]
}

/**
 * Event Details Section
 * 
 * Displays wedding event information for both ceremonies with
 * responsive grid layout and scroll-triggered animations.
 * 
 * @example
 * ```tsx
 * // In Home.tsx
 * <EventDetailsSection enableAnimations={true} />
 * ```
 */
const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  className,
  enableAnimations = true,
  eventID=""
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!enableAnimations || prefersReducedMotion() || !sectionRef.current) {
      return
    }

    const cards = cardsRef.current.filter(Boolean)

    if (cards.length === 0) {
      return
    }

    // Animate cards on scroll
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      })
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [enableAnimations])

  return (
    <section
      ref={sectionRef}
      className={cn(
        'container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-base-light',
        className
      )}
      aria-labelledby="event-details-heading"
    >
      {/* Section Header */}
      <header className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
        <h2
          id="event-details-heading"
          className="font-display text-4xl md:text-5xl font-bold text-text mb-4"
        >
          Thông tin sự kiện
        </h2>
        <p className="font-body text-lg text-text-secondary">
          Chúng tôi rất hân hạnh được đón tiếp quý khách tại hai buổi lễ đặc biệt
        </p>
      </header>

      {/* Event Cards Grid */}
      <div
        className="flex flex-col gap-8 md:gap-10 lg:grid lg:grid-cols-2 lg:gap-8 max-w-7xl mx-auto"
        data-testid="event-grid"
      >
        {/* Hue Event Card */}
        {(eventID === "" || eventID === "hue") && 
        <div
          id="hue-event-card"
          ref={(el) => {
            cardsRef.current[0] = el
          }}
        >
          <EventCard
            event={eventsConfig.hue}
            enableAnimations={enableAnimations}
          />
        </div>
        }

        {/* Hanoi Event Card */}
        {(eventID === "" || eventID === "hanoi") && 
        <div
          ref={(el) => {
            cardsRef.current[1] = el
          }}
        >
          <EventCard
            event={eventsConfig.hanoi}
            enableAnimations={enableAnimations}
          />
        </div>
        }

        {/* Figure when there's only one event */}
        {
          eventID !== "" && 
          <div className="" aria-hidden="true">

            <img
              src={'/album/NAM_9875_(2) Large.jpeg'}
            />
          </div>
        }

      </div>
    </section>
  )
}

export default EventDetailsSection
