/**
 * useMap Hook
 * 
 * Custom hook for managing map state, venue selection,
 * and map interactions.
 * 
 * @module hooks/useMap
 */

import { useState, useCallback } from 'react'
import type { VenueDetails } from '@/config/events'
import { openDirections as openDirectionsUtil } from '@/lib/mapUtils'

/**
 * Map state interface
 */
interface MapState {
  selectedVenue: string | null
  mapReady: boolean
  mapError: boolean
  activeMarker: string | null
}

/**
 * useMap hook return type
 */
interface UseMapReturn extends MapState {
  selectVenue: (venueId: string) => void
  openDirections: (venue: VenueDetails) => void
  setMapReady: (ready: boolean) => void
  setMapError: (error: boolean) => void
  clearSelection: () => void
}

/**
 * Custom hook for map state management
 * 
 * @returns Map state and control functions
 */
export function useMap(): UseMapReturn {
  const [mapState, setMapState] = useState<MapState>({
    selectedVenue: null,
    mapReady: false,
    mapError: false,
    activeMarker: null
  })

  /**
   * Select a venue and update active marker
   */
  const selectVenue = useCallback((venueId: string) => {
    setMapState(prev => ({
      ...prev,
      selectedVenue: venueId,
      activeMarker: venueId
    }))
  }, [])

  /**
   * Clear venue selection
   */
  const clearSelection = useCallback(() => {
    setMapState(prev => ({
      ...prev,
      selectedVenue: null,
      activeMarker: null
    }))
  }, [])

  /**
   * Open directions to venue
   */
  const openDirections = useCallback((venue: VenueDetails) => {
    openDirectionsUtil(venue)
  }, [])

  /**
   * Set map ready state
   */
  const setMapReady = useCallback((ready: boolean) => {
    setMapState(prev => ({ ...prev, mapReady: ready }))
  }, [])

  /**
   * Set map error state
   */
  const setMapError = useCallback((error: boolean) => {
    setMapState(prev => ({ ...prev, mapError: error }))
  }, [])

  return {
    ...mapState,
    selectVenue,
    openDirections,
    setMapReady,
    setMapError,
    clearSelection
  }
}
