/**
 * Event Card Component
 * 
 * Displays comprehensive details for a single wedding event including
 * venue, schedule, and location information.
 * 
 * @module components/events/EventCard
 */

import React from 'react'
import { MapPin, Calendar, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { generateGoogleMapsUrl } from '@/lib/utils/maps'
import type { EventDetails } from '@/config/events'
import IconWrapper from '@/components/ui/IconWrapper'
import ScheduleTimeline from './ScheduleTimeline'
import Button from '@/components/ui/Button'

export interface EventCardProps {
  /** Event details */
  event: EventDetails
  /** Additional CSS classes */
  className?: string
  /** Enable animations */
  enableAnimations?: boolean
}

/**
 * Event Card Component
 * 
 * Displays a complete event card with venue information, schedule timeline,
 * address, and interactive map button.
 * 
 * @example
 * ```tsx
 * import { eventsConfig } from '@/config/events'
 * 
 * <EventCard
 *   event={eventsConfig.hue}
 *   enableAnimations={true}
 * />
 * ```
 */
const EventCard: React.FC<EventCardProps> = ({
  event,
  className,
  enableAnimations = true
}) => {
  const mapUrl = generateGoogleMapsUrl(event.venue.coordinates, event.venue.name)

  return (
    <article
      className={cn(
        'bg-base rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300',
        'p-6 md:p-8 lg:p-10 space-y-6',
        className
      )}
      aria-labelledby={`event-${event.id}-title`}
    >
      {/* Event Title */}
      <header>
        <h3
          id={`event-${event.id}-title`}
          className="font-display text-3xl font-semibold text-accent-gold mb-2"
        >
          {event.displayName}
        </h3>
        <p className="font-semibold text-2xl text-text-secondary">
          {event.dateDisplay}
        </p>
      </header>

      {/* Venue Information */}
      <div className="space-y-4">
        {/* Venue Name */}
        <div className="flex items-start gap-4">
          <IconWrapper size="md" variant="gold" ariaLabel="Venue">
            <MapPin />
          </IconWrapper>
          
          <div className="flex-1">
            <h4 className="font-body text-xl font-semibold text-text mb-1">
              {event.venue.name}
            </h4>
            <p className="font-body text-sm text-text-secondary">
              {event.venue.address}
            </p>
          </div>
        </div>

        {/* Date Display */}
        <div className="flex items-start gap-4">
          <IconWrapper size="md" variant="gold" ariaLabel="Date">
            <Calendar />
          </IconWrapper>
          
          <div className="flex-1">
            <p className="font-body text-base text-text">
              {event.dateDisplay}
            </p>
             <p className="font-body text-xs text-text-light">
              {event.dateDisplay2}
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div>
        <h4 className="font-body text-lg font-semibold text-text mb-4">
          Chương trình
        </h4>
        <ScheduleTimeline
          schedule={event.schedule}
          enableAnimations={enableAnimations}
        />
      </div>

      {/* Map Button */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => window.open(mapUrl, '_blank', 'noopener,noreferrer')}
          aria-label={`View ${event.venue.name} on map`}
        >
          <div className="flex">
            <Navigation className="w-5 h-5 mr-2" />
            Xem bản đồ
          </div>
        </Button>
      </div>

      {/* Notes */}
      {event.notes && event.notes.length > 0 && (
        <div className="pt-4 border-t border-accent-gold/20">
          <ul className="space-y-2" role="list">
            {event.notes.map((note, index) => (
              <li
                key={index}
                className="font-body text-sm italic text-text-secondary flex items-start gap-2"
              >
                <span className="text-accent-gold mt-1" aria-hidden="true">
                  •
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

export default EventCard
