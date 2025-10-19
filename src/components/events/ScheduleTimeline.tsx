/**
* Schedule Timeline Component
*
* Displays event schedule items in a vertical timeline format
* with scroll-triggered animations.
*
* @module components/events/ScheduleTimeline
*/
 
import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/a11y'
import { cn } from '@/lib/utils/cn'
import type { ScheduleItem } from '@/config/events'
 
// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)
 
export interface ScheduleTimelineProps {
  /** Array of schedule items */
  schedule: ScheduleItem[]
  /** Enable animations */
  enableAnimations?: boolean
  /** Additional CSS classes */
  className?: string
}
 
/**
* Schedule Timeline Component
*
* Renders a vertical timeline of event schedule items with optional
* scroll-triggered stagger animations.
*
* @example
* ```tsx
* <ScheduleTimeline
*   schedule={event.schedule}
*   enableAnimations={true}
* />
* ```
*/
const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  schedule,
  enableAnimations = true,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
 
  useEffect(() => {
    if (!enableAnimations || prefersReducedMotion() || !containerRef.current) {
      return
    }
 
    const items = itemsRef.current.filter(Boolean)
 
    if (items.length === 0) {
      return
    }
 
    // Animate schedule items with stagger
    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      })
    }, containerRef)
 
    return () => {
      ctx.revert()
    }
  }, [schedule, enableAnimations])
 
  if (!schedule || schedule.length === 0) {
    return null
  }
 
  return (
    <div
      ref={containerRef}
      className={cn('space-y-3', className)}
      role="list"
      aria-label="Event schedule"
    >
      {schedule.map((item, index) => (
        <div
          key={`${item.time}-${index}`}
          ref={(el) => {
            itemsRef.current[index] = el
          }}
          className="flex items-start gap-4 group"
          role="listitem"
        >
          {/* Timeline dot */}
          <div className="relative pt-1 shrink-0">
            <div
              className={cn(
                'w-3 h-3 rounded-full border-2 border-accent-gold bg-base',
                'group-hover:bg-accent-gold transition-colors duration-200'
              )}
              aria-hidden="true"
            />
            
            {/* Connector line (hide for last item) */}
            {index < schedule.length - 1 && (
              <div
                className="absolute top-5 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-accent-gold/30"
                aria-hidden="true"
              />
            )}
          </div>
 
          {/* Schedule content */}
          <div className="flex-1 pb-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <time
                className={`font-body  text-accent-gold ${item.hightlight ? "font-extrabold text-lg" : "font-semibold text-sm"} shrink-0`}
                dateTime={item.time}
              >
                {item.time}
              </time>
              
              <span className={`font-body  text-text ${item.hightlight ? "text-accent-gold font-semibold text-lg md:text-2xl" : "font-medium text-base md:text-lg"}`}>
                {item.title}
              </span>
            </div>
            
            {/* {item.description && (
              <p className="font-body text-sm text-text-secondary mt-1">
                {item.description}
              </p>
            )} */}
          </div>
        </div>
      ))}
    </div>
  )
}
 
export default ScheduleTimeline