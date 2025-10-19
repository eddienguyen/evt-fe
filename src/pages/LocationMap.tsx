/**
 * LocationMap Page
 * 
 * Interactive map page displaying venue locations for both
 * Hue and Hanoi wedding ceremonies with directions integration.
 * 
 * @module pages/LocationMap
 */

import React, { Suspense, lazy } from 'react'
import { SEOHead } from '../components/SEO'
import { getAllEvents } from '@/config/events'
import { useMap } from '@/hooks/useMap'
import { VenueCard } from './_components/VenueCard'
import { MapFallback } from './_components/MapFallback'

// Lazy load the map component for better performance
const InteractiveMap = lazy(() => 
  import('./_components/InteractiveMap').then(module => ({ 
    default: module.InteractiveMap 
  }))
)

/**
 * Loading placeholder for map
 */
const MapLoadingPlaceholder: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
    <div className="text-center space-y-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
    </div>
  </div>
)

const LocationMap: React.FC = () => {
  const events = getAllEvents()
  const venues = events.map(event => event.venue)
  
  const {
    selectedVenue,
    mapError,
    selectVenue,
    openDirections,
    setMapReady,
    setMapError
  } = useMap()

  const handleMarkerClick = (venueId: string) => {
    selectVenue(venueId)
  }

  return (
    <>
      <SEOHead 
        pageData={{
          title: "Venue Locations - Wedding of Quan & Thuy",
          description: "Find the venue locations for our wedding ceremonies in Hue and Hanoi, Vietnam. Get directions and plan your visit."
        }}
      />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-gray-800 dark:to-transparent py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Venue Locations
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Join us for our wedding celebrations in Hue and Hanoi. 
              Find directions and venue information below.
            </p>
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div 
            className="h-[60vh] min-h-[400px] max-h-[600px] w-full rounded-lg overflow-hidden shadow-xl"
            role="application"
            aria-label="Interactive map showing wedding venue locations"
          >
            {mapError ? (
              <MapFallback venues={venues} className="h-full p-6" />
            ) : (
              <Suspense fallback={<MapLoadingPlaceholder />}>
                <InteractiveMap
                  venues={venues}
                  selectedVenue={selectedVenue}
                  onMarkerClick={handleMarkerClick}
                  onMapReady={() => setMapReady(true)}
                  onMapError={(error) => {
                    console.error('Map error:', error)
                    setMapError(true)
                  }}
                />
              </Suspense>
            )}
          </div>
        </div>

        {/* Venue Cards Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <VenueCard
                key={event.id}
                event={event}
                isSelected={selectedVenue === event.venue.name}
                onSelect={() => selectVenue(event.venue.name)}
                onDirections={openDirections}
              />
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Need Help Finding Us?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Click on the venue markers on the map or use the "Get Directions" buttons 
              to open navigation in your preferred map application.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              If you have any questions about the venues or need assistance with directions, 
              please don't hesitate to contact us.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default LocationMap