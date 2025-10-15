/**
 * Guest Context
 * 
 * Provides guest information throughout the invitation pages.
 * Fetches and stores guest data when accessing personalized invitation links.
 * 
 * @module contexts/GuestContext
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface GuestData {
  id: string;
  name: string;
  venue: 'hue' | 'hanoi';
  secondaryNote?: string;
  invitationUrl: string;
  invitationImageFrontUrl?: string;
  invitationImageMainUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface GuestContextValue {
  guest: GuestData | null;
  isLoading: boolean;
  error: string | null;
  fetchGuest: (guestId: string) => Promise<void>;
  clearGuest: () => void;
}

const GuestContext = createContext<GuestContextValue | undefined>(undefined);

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// LocalStorage key for caching guest data
const GUEST_CACHE_KEY = 'wedding_guest_data';
const GUEST_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CachedGuestData {
  data: GuestData;
  timestamp: number;
}

/**
 * Guest Context Provider
 * 
 * Manages guest data fetching, caching, and state management.
 */
export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load guest from localStorage cache
   */
  const loadFromCache = useCallback((guestId: string): GuestData | null => {
    try {
      const cached = localStorage.getItem(`${GUEST_CACHE_KEY}_${guestId}`);
      if (!cached) return null;

      const parsed: CachedGuestData = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - parsed.timestamp > GUEST_CACHE_EXPIRY) {
        localStorage.removeItem(`${GUEST_CACHE_KEY}_${guestId}`);
        return null;
      }

      return parsed.data;
    } catch (err) {
      console.error('Failed to load guest from cache:', err);
      return null;
    }
  }, []);

  /**
   * Save guest to localStorage cache
   */
  const saveToCache = useCallback((guestData: GuestData) => {
    try {
      const cached: CachedGuestData = {
        data: guestData,
        timestamp: Date.now()
      };
      localStorage.setItem(`${GUEST_CACHE_KEY}_${guestData.id}`, JSON.stringify(cached));
    } catch (err) {
      console.error('Failed to save guest to cache:', err);
    }
  }, []);

  /**
   * Fetch guest data from API
   */
  const fetchGuest = useCallback(async (guestId: string) => {
    // Check cache first
    const cachedGuest = loadFromCache(guestId);
    if (cachedGuest) {
      console.log('✅ Loaded guest from cache:', cachedGuest.name);
      setGuest(cachedGuest);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/guests/${guestId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Không tìm thấy thông tin khách mời');
        }
        throw new Error('Không thể tải thông tin khách mời');
      }

      const result = await response.json();

      if (result.success && result.data) {
        const guestData = result.data as GuestData;
        setGuest(guestData);
        saveToCache(guestData);
        console.log('✅ Guest data loaded:', guestData.name);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      console.error('Failed to fetch guest:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadFromCache, saveToCache]);

  /**
   * Clear guest data (for logout or navigation away)
   */
  const clearGuest = useCallback(() => {
    setGuest(null);
    setError(null);
  }, []);

  const value: GuestContextValue = useMemo(() => ({
    guest,
    isLoading,
    error,
    fetchGuest,
    clearGuest
  }), [guest, isLoading, error, fetchGuest, clearGuest]);

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
};

/**
 * Hook to use guest context
 */
export const useGuest = (): GuestContextValue => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within GuestProvider');
  }
  return context;
};

export default GuestContext;
