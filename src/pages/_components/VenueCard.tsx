/**
 * VenueCard Component
 * 
 * Display card for venue information including address,
 * date, time, and directions.
 * 
 * @module pages/_components/VenueCard
 */

import React from 'react'
import { MapPin, Clock } from 'lucide-react'
import type { EventDetails } from '@/config/events'
import { cn } from '@/lib/utils/cn'
import { DirectionsButton } from './DirectionsButton'

export interface VenueCardProps {
  /** Event details containing venue information */
  event: EventDetails
  /** Whether this venue is currently selected */
  isSelected?: boolean
  /** Click handler for card selection */
  onSelect?: (eventId: string) => void
  /** Click handler for directions */
  onDirections: (venue: EventDetails['venue']) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * VenueCard Component
 * 
 * Displays comprehensive venue information with directions
 */
export const VenueCard: React.FC<VenueCardProps> = ({
  event,
  isSelected = false,
  onSelect,
  onDirections,
  className
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800',
        'rounded-xl shadow-lg',
        'p-6 space-y-6',
        'transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500',
        onSelect && 'cursor-pointer hover:shadow-xl',
        className
      )}
    >
      {/* Event Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {event.displayName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {event.dateDisplay}
        </p>
        {event.dateDisplay2 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {event.dateDisplay2}
          </p>
        )}
      </div>

      {/* Venue Information */}
      <div className="space-y-4">
        {/* Venue Name */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {event.venue.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {event.venue.address}
            </p>
          </div>
        </div>

        {/* Schedule Highlights */}
        {event.schedule && event.schedule.length > 0 && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              {event.schedule
                .filter(item => item.hightlight)
                .map((item) => (
                  <p key={`${item.time}-${item.title}`} className="text-sm text-gray-700 dark:text-gray-200">
                    <span className="font-medium">{item.time}</span> - {item.title}
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {event.notes && event.notes.length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            {event.notes.map((note) => (
              <p key={note} className="text-sm text-gray-600 dark:text-gray-400 italic">
                {note}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Directions Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <DirectionsButton
          venue={event.venue}
          onClick={onDirections}
          fullWidth
        />
      </div>
    </div>
  )
}
