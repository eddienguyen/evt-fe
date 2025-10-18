/**
 * Guest Admin Service
 * 
 * Handles all admin guest-related API calls including list, update, delete operations.
 * Uses the apiRetryService for intelligent retry logic on machine wake-up scenarios.
 * 
 * @module services/guestAdminService
 */

import axios from 'axios';
import { apiConfig } from '../config/api';
import { executeWithRetry, getErrorMessage } from './apiRetryService';
import type {
  GuestListResponse,
  UpdateGuestResponse,
  DeleteGuestResponse,
  CheckGuestRSVPsResponse,
  GuestFilters,
  UpdateGuestData,
} from '../types/admin';

/**
 * Get paginated list of guests with optional filters
 * 
 * @param filters - Filter options for venue, search, pagination, sorting
 * @returns Promise with paginated guest list
 */
export const getGuests = async (
  filters?: GuestFilters
): Promise<GuestListResponse> => {
  try {
    console.log('📋 [Guest Admin Service] Fetching guests with filters:', filters);

    const params = new URLSearchParams();
    
    if (filters?.venue && filters.venue !== 'all') {
      params.append('venue', filters.venue);
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    
    if (filters?.sortDirection) {
      params.append('sortDirection', filters.sortDirection);
    }

    const queryString = params.toString();
    const baseUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.guests}`;
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log('🌐 [Guest Admin Service] Request URL:', url);

    const response = await executeWithRetry<GuestListResponse>(
      () => axios.get<GuestListResponse>(url)
    );

    console.log('✅ [Guest Admin Service] Guests fetched successfully:', response.data.data.guests.length);
    return response.data;
  } catch (error) {
    console.error('❌ [Guest Admin Service] Error fetching guests:', error);
    throw new Error(getErrorMessage(error as Error));
  }
};

/**
 * Update an existing guest
 * 
 * @param id - Guest ID
 * @param data - Updated guest data
 * @returns Promise with updated guest
 */
export const updateGuest = async (
  id: string,
  data: UpdateGuestData
): Promise<UpdateGuestResponse> => {
  try {
    console.log(`📝 [Guest Admin Service] Updating guest ${id}:`, data);

    const url = `${apiConfig.baseUrl}${apiConfig.endpoints.guests}/${id}`;

    const response = await executeWithRetry<UpdateGuestResponse>(
      () => axios.patch<UpdateGuestResponse>(url, data)
    );

    console.log('✅ [Guest Admin Service] Guest updated successfully');
    return response.data;
  } catch (error) {
    console.error(`❌ [Guest Admin Service] Error updating guest ${id}:`, error);
    throw new Error(getErrorMessage(error as Error));
  }
};

/**
 * Delete a guest
 * 
 * @param id - Guest ID
 * @returns Promise with deletion confirmation
 */
export const deleteGuest = async (
  id: string
): Promise<DeleteGuestResponse> => {
  try {
    console.log(`🗑️ [Guest Admin Service] Deleting guest ${id}`);

    const url = `${apiConfig.baseUrl}${apiConfig.endpoints.guests}/${id}`;

    const response = await executeWithRetry<DeleteGuestResponse>(
      () => axios.delete<DeleteGuestResponse>(url)
    );

    console.log('✅ [Guest Admin Service] Guest deleted successfully');
    return response.data;
  } catch (error) {
    console.error(`❌ [Guest Admin Service] Error deleting guest ${id}:`, error);
    throw new Error(getErrorMessage(error as Error));
  }
};

/**
 * Check for RSVPs associated with a guest
 * 
 * @param guestId - Guest ID
 * @returns Promise with RSVP check result
 */
export const checkGuestRSVPs = async (guestId: string): Promise<CheckGuestRSVPsResponse> => {
  try {
    console.log(`🔍 [Guest Admin Service] Checking RSVPs for guest ${guestId}`);

    const url = `${apiConfig.baseUrl}${apiConfig.endpoints.rsvp}?guestId=${guestId}`;

    const response = await executeWithRetry<{ success: boolean; data: unknown[] }>(
      () => axios.get<{ success: boolean; data: unknown[] }>(url)
    );

    const count = response.data.data?.length || 0;
    console.log(`✅ [Guest Admin Service] Found ${count} RSVPs for guest`);
    
    return {
      hasRSVPs: count > 0,
      rsvpCount: count,
      message: count > 0 
        ? `Khách này có ${count} RSVP liên quan. Việc xóa sẽ ảnh hưởng đến các RSVP này.`
        : 'Khách này chưa có RSVP nào.',
    };
  } catch (error) {
    console.warn(`⚠️ [Guest Admin Service] Error checking RSVPs for guest ${guestId}:`, error);
    // Return no RSVPs if check fails (don't block deletion)
    return {
      hasRSVPs: false,
      rsvpCount: 0,
      message: 'Không thể kiểm tra RSVP liên quan',
    };
  }
};
