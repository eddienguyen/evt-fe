/**
 * MapFallback Component
 * 
 * Fallback component displayed when map fails to load.
 * Shows static information and alternative directions.
 * 
 * @module pages/_components/MapFallback
 */

import React from 'react'
import { AlertCircle, MapPin } from 'lucide-react'
import type { VenueDetails } from '@/config/events'
import { cn } from '@/lib/utils/cn'
import { formatCoordinates } from '@/lib/mapUtils'

export interface MapFallbackProps {
  /** Venues to display fallback information for */
  venues: VenueDetails[]
  /** Additional CSS classes */
  className?: string
  /** Error message to display */
  errorMessage?: string
}

/**
 * MapFallback Component
 * 
 * Provides fallback UI when interactive map cannot load
 */
export const MapFallback: React.FC<MapFallbackProps> = ({
  venues,
  className,
  errorMessage = 'Unable to load interactive map. Please see venue information below.'
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Error Message */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Map Unavailable
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Static Venue Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {venues.map((venue) => (
          <div
            key={venue.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {venue.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {venue.address}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {formatCoordinates(venue.coordinates.lat, venue.coordinates.lng)}
                </p>
              </div>
            </div>

            {/* Alternative Directions Link */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center justify-center w-full',
                  'px-4 py-2 rounded-lg',
                  'bg-blue-600 hover:bg-blue-700 text-white',
                  'text-sm font-medium',
                  'transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
