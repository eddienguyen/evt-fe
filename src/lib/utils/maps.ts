/**
 * Map Utilities
 * 
 * Helper functions for generating map URLs and handling location data
 * for event venues.
 * 
 * @module lib/utils/maps
 */

/**
 * Coordinates interface
 */
export interface Coordinates {
  lat: number
  lng: number
}

/**
 * Format coordinates for URL parameter
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Formatted coordinate string (e.g., "16.469093,107.594565")
 * 
 * @example
 * ```ts
 * formatCoordinatesForUrl(16.469093, 107.594565)
 * // Returns: "16.469093,107.594565"
 * ```
 */
export function formatCoordinatesForUrl(lat: number, lng: number): string {
  return `${lat},${lng}`
}

/**
 * Generate Google Maps URL with coordinates and optional venue name
 * 
 * @param coordinates - Location coordinates
 * @param venueName - Optional venue name for search query
 * @returns Full Google Maps URL
 * 
 * @example
 * ```ts
 * generateGoogleMapsUrl(
 *   { lat: 16.469093, lng: 107.594565 },
 *   'Trung Tâm Sự Kiện Asia Palace'
 * )
 * // Returns: "https://www.google.com/maps/search/?api=1&query=16.469093,107.594565&query_place_id=Trung+Tâm+Sự+Kiện+Asia+Palace"
 * ```
 */
export function generateGoogleMapsUrl(
  coordinates: Coordinates,
  venueName?: string
): string {
  const baseUrl = 'https://www.google.com/maps/search/?api=1'
  const coordString = formatCoordinatesForUrl(coordinates.lat, coordinates.lng)
  
  // Build query parameter
  let queryParam = `query=${encodeURIComponent(coordString)}`
  
  // Add venue name if provided
  if (venueName) {
    queryParam += `&query_place_id=${encodeURIComponent(venueName)}`
  }
  
  return `${baseUrl}&${queryParam}`
}

/**
 * Generate Google Maps directions URL from user's current location
 * 
 * @param coordinates - Destination coordinates
 * @param venueName - Optional venue name
 * @returns Google Maps directions URL
 * 
 * @example
 * ```ts
 * generateDirectionsUrl({ lat: 16.469093, lng: 107.594565 })
 * // Returns: "https://www.google.com/maps/dir/?api=1&destination=16.469093,107.594565"
 * ```
 */
export function generateDirectionsUrl(
  coordinates: Coordinates,
  venueName?: string
): string {
  const baseUrl = 'https://www.google.com/maps/dir/?api=1'
  const coordString = formatCoordinatesForUrl(coordinates.lat, coordinates.lng)
  
  let url = `${baseUrl}&destination=${encodeURIComponent(coordString)}`
  
  if (venueName) {
    url += `&destination_place_id=${encodeURIComponent(venueName)}`
  }
  
  return url
}

/**
 * Validate coordinates are within valid ranges
 * 
 * @param coordinates - Coordinates to validate
 * @returns True if coordinates are valid
 * 
 * @example
 * ```ts
 * validateCoordinates({ lat: 16.469093, lng: 107.594565 }) // true
 * validateCoordinates({ lat: 200, lng: 300 }) // false
 * ```
 */
export function validateCoordinates(coordinates: Coordinates): boolean {
  const { lat, lng } = coordinates
  
  // Latitude must be between -90 and 90
  if (lat < -90 || lat > 90) {
    return false
  }
  
  // Longitude must be between -180 and 180
  if (lng < -180 || lng > 180) {
    return false
  }
  
  return true
}

/**
 * Generate Apple Maps URL (for iOS/macOS devices)
 * 
 * @param coordinates - Location coordinates
 * @param venueName - Optional venue name
 * @returns Apple Maps URL
 * 
 * @example
 * ```ts
 * generateAppleMapsUrl({ lat: 16.469093, lng: 107.594565 }, 'Asia Palace')
 * // Returns: "https://maps.apple.com/?q=Asia+Palace&ll=16.469093,107.594565"
 * ```
 */
export function generateAppleMapsUrl(
  coordinates: Coordinates,
  venueName?: string
): string {
  const coordString = formatCoordinatesForUrl(coordinates.lat, coordinates.lng)
  let url = `https://maps.apple.com/?ll=${coordString}`
  
  if (venueName) {
    url += `&q=${encodeURIComponent(venueName)}`
  }
  
  return url
}

/**
 * Detect user's platform and return appropriate map URL
 * 
 * @param coordinates - Location coordinates
 * @param venueName - Optional venue name
 * @returns Platform-appropriate map URL
 */
export function generatePlatformMapUrl(
  coordinates: Coordinates,
  venueName?: string
): string {
  // Detect iOS/macOS for Apple Maps
  const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent)
  
  if (isAppleDevice) {
    return generateAppleMapsUrl(coordinates, venueName)
  }
  
  // Default to Google Maps for all other platforms
  return generateGoogleMapsUrl(coordinates, venueName)
}
