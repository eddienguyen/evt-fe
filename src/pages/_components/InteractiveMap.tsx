/**
 * InteractiveMap Component
 * 
 * Leaflet-based interactive map component displaying venue markers
 * with popups and navigation controls.
 * 
 * @module pages/_components/InteractiveMap
 */

import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { VenueDetails } from '@/config/events'
import { MAP_CONFIG, calculateBounds } from '@/lib/mapUtils'
import { cn } from '@/lib/utils/cn'

// Fix Leaflet default marker icon issue with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

export interface InteractiveMapProps {
  /** Venues to display on map */
  venues: VenueDetails[]
  /** Selected venue ID */
  selectedVenue?: string | null
  /** Callback when marker is clicked */
  onMarkerClick?: (venueId: string) => void
  /** Callback when map is ready */
  onMapReady?: () => void
  /** Callback when map error occurs */
  onMapError?: (error: Error) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Component to fit map bounds to venues
 */
const MapBoundsController: React.FC<{ venues: VenueDetails[] }> = ({ venues }) => {
  const map = useMap()
  
  useEffect(() => {
    if (venues.length > 0) {
      const bounds = calculateBounds(venues)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [venues, map])
  
  return null
}

/**
 * InteractiveMap Component
 * 
 * Renders Leaflet map with venue markers and controls
 */
export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  venues,
  selectedVenue,
  onMarkerClick,
  onMapReady,
  onMapError,
  className
}) => {
  const mapRef = useRef<L.Map>(null)

  useEffect(() => {
    // Call onMapReady when component mounts
    if (onMapReady) {
      const timer = setTimeout(() => {
        onMapReady()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [onMapReady])

  const handleMarkerClick = (venue: VenueDetails) => {
    if (onMarkerClick) {
      // Use venue name as ID if no specific ID field exists
      const venueId = venue.name
      onMarkerClick(venueId)
    }
  }

  // Create custom icon for selected marker
  const createIcon = (isSelected: boolean) => {
    return new L.Icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: isSelected ? [30, 48] : [25, 41],
      iconAnchor: isSelected ? [15, 48] : [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  }

  try {
    return (
      <div className={cn('w-full h-full relative', className)}>
        <MapContainer
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.zoom}
          maxZoom={MAP_CONFIG.maxZoom}
          minZoom={MAP_CONFIG.minZoom}
          className="w-full h-full rounded-lg"
          ref={mapRef}
          scrollWheelZoom={true}
          attributionControl={true}
        >
          <TileLayer
            url={MAP_CONFIG.tileLayer.url}
            attribution={MAP_CONFIG.tileLayer.attribution}
          />
          
          {/* Fit bounds to show all venues */}
          <MapBoundsController venues={venues} />
          
          {/* Venue Markers */}
          {venues.map((venue) => {
            const isSelected = selectedVenue === venue.name
            
            return (
              <Marker
                key={venue.name}
                position={[venue.coordinates.lat, venue.coordinates.lng]}
                icon={createIcon(isSelected)}
                eventHandlers={{
                  click: () => handleMarkerClick(venue)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-base mb-2">
                      {venue.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {venue.address}
                    </p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Get Directions →
                    </a>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    )
  } catch (error) {
    // Call error handler if provided
    if (onMapError && error instanceof Error) {
      onMapError(error)
    }
    // Return null to let parent handle fallback
    return null
  }
}
