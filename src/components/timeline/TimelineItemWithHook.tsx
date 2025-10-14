/**
 * Timeline Item Component (Hook-based version)
 * 
 * Alternative implementation using the useTimelineAnimation hook.
 * This version demonstrates centralized animation logic.
 * 
 * @module components/timeline/TimelineItemWithHook
 */

import React from 'react'
import { type TimelineMilestone } from '../../config/timeline'
import { formatVietnameseDate, formatDateForScreenReader } from '../../lib/utils/date'
import { cn } from '../../lib/utils/cn'
import { useTimelineAnimation } from '../../hooks/useTimelineAnimation'

export interface TimelineItemWithHookProps {
  /** Milestone data */
  milestone: TimelineMilestone
  /** Item index for animation stagger */
  index: number
  /** Layout variant */
  layout: 'vertical' | 'horizontal'
  /** Position for horizontal layout */
  position?: 'left' | 'right'
  /** Enable animations */
  enableAnimations?: boolean
}

/**
 * Timeline Item Component (Hook-based)
 * 
 * Displays a single milestone using the centralized animation hook.
 * This is an alternative implementation to demonstrate the hook usage.
 */
const TimelineItemWithHook: React.FC<TimelineItemWithHookProps> = ({
  milestone,
  index,
  layout,
  position = 'left',
  enableAnimations = true
}) => {
  // Use centralized animation hook
  const { containerRef, imageRef, contentRef } = useTimelineAnimation({
    layout,
    position,
    enabled: enableAnimations,
    duration: 0.6,
    ease: 'power2.out'
  })
  
  const isVertical = layout === 'vertical'
  const isLeft = position === 'left'

  // Category icon/badge
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'meeting':
        return '❤️'
      case 'dating':
        return '💑'
      case 'milestone':
        return '⭐'
      case 'proposal':
        return '💍'
      case 'wedding-prep':
        return '🎉'
      default:
        return '📅'
    }
  }

  return (
    <article 
      ref={containerRef}
      className={cn(
        'timeline-item',
        isVertical ? 'flex flex-col' : 'grid grid-cols-2 gap-12 items-center',
        !isVertical && !isLeft && 'direction-rtl'
      )}
      data-index={index}
      aria-labelledby={`milestone-${milestone.id}-title`}
    >
      {/* Desktop Layout: Image + Content Side by Side */}
      {!isVertical && (
        <>
          {/* Image Section */}
          <div 
            ref={imageRef}
            className={cn(
              'timeline-image',
              isLeft ? 'order-1' : 'order-2'
            )}
          >
            {milestone.image && (
              <div 
                className="w-full h-80 bg-gradient-to-br from-accent-gold/5 to-base-light rounded-2xl overflow-hidden shadow-medium flex items-center justify-center"
                role="img"
                aria-label={milestone.image.alt}
              >
                {/* Placeholder for actual image */}
                <div className="text-center text-text-lighter p-8">
                  <div className="text-6xl mb-4">{getCategoryIcon(milestone.category)}</div>
                  <p className="text-sm font-medium">{milestone.image.alt}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div 
            ref={contentRef}
            className={cn(
              'timeline-content',
              isLeft ? 'order-2' : 'order-1'
            )}
          >
            {/* Date Badge */}
            <div className="mb-6">
              <time 
                dateTime={milestone.date}
                className="inline-block px-5 py-2 bg-accent-gold/10 text-accent-gold rounded-full text-sm font-semibold"
                aria-label={formatDateForScreenReader(milestone.date)}
              >
                {formatVietnameseDate(milestone.date)}
              </time>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl shadow-soft p-8 hover:shadow-medium transition-shadow duration-300">
              {/* Category Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl" role="img" aria-label={milestone.category}>
                  {getCategoryIcon(milestone.category)}
                </span>
                {milestone.featured && (
                  <span className="px-3 py-1 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-wider rounded-full">
                    Đặc biệt
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 
                id={`milestone-${milestone.id}-title`}
                className="font-heading text-2xl md:text-3xl font-bold text-text mb-4"
              >
                {milestone.title}
              </h3>

              {/* Description */}
              <p className="text-text-light text-lg leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Mobile Layout: Vertical Stack */}
      {isVertical && (
        <>
          {/* Date Badge */}
          <div className="mb-4">
            <time 
              dateTime={milestone.date}
              className="inline-block px-4 py-2 bg-accent-gold/10 text-accent-gold rounded-full text-sm font-semibold"
              aria-label={formatDateForScreenReader(milestone.date)}
            >
              {formatVietnameseDate(milestone.date)}
            </time>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow duration-300 mb-4">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" role="img" aria-label={milestone.category}>
                {getCategoryIcon(milestone.category)}
              </span>
              {milestone.featured && (
                <span className="px-2 py-1 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-wide rounded">
                  Đặc biệt
                </span>
              )}
            </div>

            {/* Title */}
            <h3 
              id={`milestone-${milestone.id}-title`}
              className="font-heading text-xl md:text-2xl font-semibold text-text mb-3"
            >
              {milestone.title}
            </h3>

            {/* Description */}
            <p className="text-text-light leading-relaxed">
              {milestone.description}
            </p>
          </div>

          {/* Image */}
          {milestone.image && (
            <div className="timeline-image w-full">
              <div 
                className="w-full h-56 bg-gradient-to-br from-accent-gold/5 to-base-light rounded-lg overflow-hidden shadow-soft flex items-center justify-center"
                role="img"
                aria-label={milestone.image.alt}
              >
                {/* Placeholder for actual image */}
                <div className="text-center text-text-lighter p-6">
                  <div className="text-5xl mb-3">{getCategoryIcon(milestone.category)}</div>
                  <p className="text-sm">{milestone.image.alt}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  )
}

export default TimelineItemWithHook
