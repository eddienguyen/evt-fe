/**
 * Map Utilities
 * 
 * Helper functions for map interactions, platform detection,
 * and directions integration.
 * 
 * @module lib/mapUtils
 */

import type { VenueDetails } from '@/config/events'

/**
 * Map configuration constants
 */
export const MAP_CONFIG = {
  // Center point between Hue and Hanoi (roughly central Vietnam)
  center: [18.7, 106] as [number, number],
  zoom: 6,
  maxZoom: 18,
  minZoom: 5,
  
  // Tile layer configuration
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
}

/**
 * Platform detection types
 */
export type Platform = 'ios' | 'android' | 'web'

/**
 * Detect user's platform for map application routing
 * 
 * @returns The detected platform
 */
export function detectPlatform(): Platform {
  const userAgent = navigator.userAgent || ''
  
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios'
  }
  
  if (/Android/.test(userAgent)) {
    return 'android'
  }
  
  return 'web'
}

/**
 * Generate directions URL based on platform and venue
 * 
 * @param venue - The venue details
 * @param platform - Optional platform override
 * @returns URL string for opening directions
 */
export function getDirectionsUrl(venue: VenueDetails, platform?: Platform): string {
  const { lat, lng } = venue.coordinates
  const address = encodeURIComponent(venue.address)
  const venueName = encodeURIComponent(venue.name)
  const detectedPlatform = platform || detectPlatform()
  
  switch (detectedPlatform) {
    case 'ios':
      // Apple Maps URL scheme
      return `maps://maps.apple.com/?daddr=${lat},${lng}&q=${venueName}`
    
    case 'android':
      // Google Maps intent URL for Android
      return `geo:${lat},${lng}?q=${lat},${lng}(${venueName})`
    
    case 'web':
    default:
      // Google Maps web URL
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${address}`
  }
}

/**
 * Open directions in appropriate map application
 * 
 * @param venue - The venue to get directions to
 */
export function openDirections(venue: VenueDetails): void {
  const url = getDirectionsUrl(venue)
  
  // Try to open in new window/tab
  const opened = globalThis.open(url, '_blank')
  
  // Fallback to current window if popup blocked
  if (!opened || opened.closed || opened.closed === undefined) {
    globalThis.location.href = url
  }
}

/**
 * Calculate bounds for multiple venues
 * 
 * @param venues - Array of venues
 * @returns Bounds array [[south, west], [north, east]]
 */
export function calculateBounds(venues: VenueDetails[]): [[number, number], [number, number]] {
  const lats = venues.map(v => v.coordinates.lat)
  const lngs = venues.map(v => v.coordinates.lng)
  
  const south = Math.min(...lats)
  const north = Math.max(...lats)
  const west = Math.min(...lngs)
  const east = Math.max(...lngs)
  
  // Add padding (roughly 10% on each side)
  const latPadding = (north - south) * 0.1
  const lngPadding = (east - west) * 0.1
  
  return [
    [south - latPadding, west - lngPadding],
    [north + latPadding, east + lngPadding]
  ]
}

/**
 * Format coordinates for display
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Formatted coordinate string
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  
  return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`
}
