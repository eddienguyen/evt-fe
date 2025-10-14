/**
 * Timeline Connector Component
 * 
 * Visual connector lines between timeline items for better visual flow.
 * 
 * @module components/timeline/TimelineConnector
 */

import React from 'react'
import { cn } from '../../lib/utils/cn'

export interface TimelineConnectorProps {
  /** Layout variant */
  layout: 'vertical' | 'horizontal'
  /** Position for horizontal layout */
  position?: 'left' | 'right'
  /** Whether this is the last connector (hide it) */
  isLast?: boolean
  /** Custom className */
  className?: string
}

/**
 * Timeline Connector Component
 * 
 * Renders visual connector lines between timeline items.
 * - Vertical layout: Vertical line with dots
 * - Horizontal layout: Horizontal line (hidden on mobile)
 */
const TimelineConnector: React.FC<TimelineConnectorProps> = ({
  layout,
  position: _position = 'left', // Reserved for future use
  isLast = false,
  className
}) => {
  if (isLast) {
    return null
  }

  const isVertical = layout === 'vertical'

  return (
    <div 
      className={cn(
        'timeline-connector',
        isVertical && 'flex justify-center my-6',
        !isVertical && 'hidden md:flex items-center justify-center col-span-2 my-8',
        className
      )}
      aria-hidden="true"
    >
      {isVertical ? (
        // Mobile: Vertical connector with dot
        <div className="relative flex flex-col items-center">
          {/* Top dot */}
          <div className="w-3 h-3 rounded-full bg-accent-gold/40" />
          
          {/* Vertical line */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-accent-gold/40 to-accent-gold/10" />
          
          {/* Bottom dot */}
          <div className="w-3 h-3 rounded-full bg-accent-gold/40" />
        </div>
      ) : (
        // Desktop: Horizontal connector with decorative elements
        <div className="flex items-center w-full max-w-md mx-auto">
          {/* Left dot */}
          <div className="w-2 h-2 rounded-full bg-accent-gold/30 flex-shrink-0" />
          
          {/* Horizontal line with gradient */}
          <div className="flex-1 h-0.5 bg-gradient-to-r from-accent-gold/30 via-accent-gold/20 to-accent-gold/30 mx-2" />
          
          {/* Center decorative element */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-1 h-1 rounded-full bg-accent-gold/40" />
            <div className="w-2 h-2 rounded-full bg-accent-gold/50" />
            <div className="w-1 h-1 rounded-full bg-accent-gold/40" />
          </div>
          
          {/* Horizontal line with gradient */}
          <div className="flex-1 h-0.5 bg-gradient-to-r from-accent-gold/30 via-accent-gold/20 to-accent-gold/30 mx-2" />
          
          {/* Right dot */}
          <div className="w-2 h-2 rounded-full bg-accent-gold/30 flex-shrink-0" />
        </div>
      )}
    </div>
  )
}

export default TimelineConnector
