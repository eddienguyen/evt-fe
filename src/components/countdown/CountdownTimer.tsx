/**
 * Countdown Timer Component
 * 
 * Main countdown section displaying days, hours, minutes, and seconds
 * until the wedding event with GSAP scroll animations.
 * 
 * @module components/countdown/CountdownTimer
 */

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils/cn'
import { announceToScreenReader, prefersReducedMotion } from '@/lib/a11y'
import { formatVietnameseDate } from '@/lib/utils/date'
import { useCountdown, useCountdownAnnouncement } from '@/hooks/useCountdown'
import CountdownCard from './CountdownCard'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

export interface CountdownTimerProps {
  /** Target event date (ISO format) */
  targetDate: string
  /** Event display name */
  eventName: string
  /** Event location */
  eventLocation: string
  /** Enable animations (default: true) */
  enableAnimations?: boolean
  /** Custom CSS classes */
  className?: string
}

/**
 * Countdown Timer Component
 * 
 * Displays a real-time countdown to the wedding event with smooth animations
 * and accessibility support.
 * 
 * @example
 * ```tsx
 * import { eventsConfig } from '@/config/events'
 * 
 * <CountdownTimer
 *   targetDate={eventsConfig.hue.date}
 *   eventName="Đám cưới Ngọc & Quân"
 *   eventLocation="Huế"
 *   enableAnimations={true}
 * />
 * ```
 */
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  eventName,
  eventLocation,
  enableAnimations = true,
  className
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const reducedMotion = prefersReducedMotion()

  // Countdown hook
  const countdown = useCountdown({
    targetDate,
    onExpire: () => {
      announceToScreenReader('Ngày cưới đã đến!', 'assertive')
    }
  })

  // Screen reader announcements
  const { shouldAnnounce } = useCountdownAnnouncement(countdown, true)

  useEffect(() => {
    if (shouldAnnounce && !countdown.isExpired) {
      announceToScreenReader(countdown.announcementText, 'polite')
    }
  }, [shouldAnnounce, countdown.announcementText, countdown.isExpired])

  // GSAP scroll animations
  useEffect(() => {
    if (!enableAnimations || reducedMotion || !sectionRef.current) {
      return
    }

    const ctx = gsap.context(() => {
      // Section fade-in
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })

      // Stagger cards animation
      gsap.from(cardsRef.current.filter(Boolean), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [enableAnimations, reducedMotion])

  // Expired state
  if (countdown.isExpired) {
    return (
      <section
        ref={sectionRef}
        className={cn(
          'container mx-auto px-4 py-12 md:py-16 bg-base',
          className
        )}
        aria-labelledby="countdown-heading"
        aria-live="polite"
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2
            id="countdown-heading"
            className="font-heading text-3xl md:text-4xl font-bold text-accent-gold mb-4"
          >
            Ngày cưới ở {eventLocation} đã đến! 🎉
          </h2>
          <p className="font-sans text-base md:text-lg text-text-secondary">
            Cảm ơn bạn đã tham dự đám cưới của chúng tôi
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        'container mx-auto px-4 py-12 md:py-16 bg-base',
        className
      )}
      aria-labelledby="countdown-heading"
      aria-live="polite"
    >
      <div className="text-center max-w-4xl mx-auto">
        {/* Section Heading */}
        <h2
          id="countdown-heading"
          className="font-heading text-3xl md:text-4xl font-bold text-text mb-8 md:mb-12"
        >
          Đếm ngược đến ngày trọng đại
        </h2>

        {/* Countdown Cards Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8"
          role="timer"
          aria-label={countdown.announcementText}
        >
          {/* Days Card */}
          <div ref={el => (cardsRef.current[0] = el)}>
            <CountdownCard
              value={countdown.days}
              label="NGÀY"
              enableTransition={!reducedMotion}
              ariaLabel={`${countdown.days} ngày`}
            />
          </div>

          {/* Hours Card */}
          <div ref={el => (cardsRef.current[1] = el)}>
            <CountdownCard
              value={countdown.hours}
              label="GIỜ"
              enableTransition={!reducedMotion}
              ariaLabel={`${countdown.hours} giờ`}
            />
          </div>

          {/* Minutes Card */}
          <div ref={el => (cardsRef.current[2] = el)}>
            <CountdownCard
              value={countdown.minutes}
              label="PHÚT"
              enableTransition={!reducedMotion}
              ariaLabel={`${countdown.minutes} phút`}
            />
          </div>

          {/* Seconds Card */}
          <div ref={el => (cardsRef.current[3] = el)}>
            <CountdownCard
              value={countdown.seconds}
              label="GIÂY"
              enableTransition={!reducedMotion}
              ariaLabel={`${countdown.seconds} giây`}
            />
          </div>
        </div>

        {/* Event Date Display */}
        <p className="font-sans text-base md:text-lg text-text-secondary">
          {formatVietnameseDate(targetDate)} • {eventLocation}
        </p>
      </div>

      {/* Screen Reader Only - Live Announcements */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {shouldAnnounce && countdown.announcementText}
      </div>
    </section>
  )
}

export default CountdownTimer
