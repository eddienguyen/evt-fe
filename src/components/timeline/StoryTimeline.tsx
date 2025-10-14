/**
 * Story Timeline Component
 * 
 * Main timeline container displaying the couple's relationship journey
 * with responsive layouts and scroll-triggered animations.
 * 
 * @module components/timeline/StoryTimeline
 */

import React from 'react'
import { getSortedMilestones, type TimelineMilestone } from '../../config/timeline'
import TimelineItem from './TimelineItem'
import TimelineConnector from './TimelineConnector'
import { cn } from '../../lib/utils/cn'

export interface StoryTimelineProps {
  /** Optional milestone override (for API data) */
  milestones?: TimelineMilestone[]
  /** Additional CSS classes */
  className?: string
  /** Enable/disable animations */
  enableAnimations?: boolean
}

/**
 * Story Timeline Component
 * 
 * Displays the couple's relationship journey in a responsive timeline layout.
 * Mobile: Vertical timeline. Desktop: Horizontal scroll with animated transitions.
 * 
 * @example
 * ```tsx
 * // Default with local data
 * <StoryTimeline />
 * 
 * // With API data
 * <StoryTimeline milestones={apiData} />
 * 
 * // Disable animations for testing
 * <StoryTimeline enableAnimations={false} />
 * ```
 */
const StoryTimeline: React.FC<StoryTimelineProps> = ({
  milestones = getSortedMilestones(),
  className,
  enableAnimations = true
}) => {
  return (
    <section 
      className={cn(
        'story-timeline py-16 md:py-24 bg-base',
        className
      )}
      aria-labelledby="story-timeline-heading"
    >
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 
          id="story-timeline-heading" 
          className="font-heading text-3xl md:text-4xl font-bold text-text mb-4"
        >
          Câu chuyện tình yêu
        </h2>
        <p className="text-text-light text-lg max-w-2xl mx-auto">
          Hành trình từ những ngày đầu đến ngày trọng đại
        </p>
      </div>

      {/* Timeline Content */}
      <div className="container mx-auto px-4">
        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden">
          <ol className="space-y-8" role="list">
            {milestones.map((milestone, index) => (
              <React.Fragment key={milestone.id}>
                <li role="listitem">
                  <TimelineItem
                    milestone={milestone}
                    index={index}
                    layout="vertical"
                    enableAnimations={enableAnimations}
                  />
                </li>
                <TimelineConnector 
                  layout="vertical"
                  isLast={index === milestones.length - 1}
                />
              </React.Fragment>
            ))}
          </ol>
        </div>

        {/* Desktop: Horizontal Scroll Layout */}
        <div className="hidden md:block">
          <div className="relative">
            <ol className="space-y-16" role="list">
              {milestones.map((milestone, index) => (
                <React.Fragment key={milestone.id}>
                  <li role="listitem">
                    <TimelineItem
                      milestone={milestone}
                      index={index}
                      layout="horizontal"
                      position={index % 2 === 0 ? 'left' : 'right'}
                      enableAnimations={enableAnimations}
                    />
                  </li>
                  <TimelineConnector 
                    layout="horizontal"
                    position={index % 2 === 0 ? 'left' : 'right'}
                    isLast={index === milestones.length - 1}
                  />
                </React.Fragment>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StoryTimeline
