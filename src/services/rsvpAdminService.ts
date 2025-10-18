/**
 * RSVP Admin Service
 * 
 * Handles all admin RSVP-related API calls including list, update, delete operations.
 * Uses the apiRetryService for intelligent retry logic on machine wake-up scenarios.
 * 
 * @module services/rsvpAdminService
 */

import axios from 'axios';
import { apiConfig } from '../config/api';
import { executeWithRetry, getErrorMessage } from './apiRetryService';
import type {
  RSVPListResponse,
  RSVPUpdateResponse,
  RSVPDeleteResponse,
  RSVPFilters,
  UpdateRSVPData,
} from '../types/rsvp';

/**
 * Get paginated list of RSVPs with optional filters
 * 
 * @param filters - Filter options for venue, attendance, search, pagination, sorting
 * @returns Promise with paginated RSVP list
 */
export const getRSVPs = async (
  filters?: RSVPFilters
): Promise<RSVPListResponse> => {
  try {
    console.log('📋 [RSVP Admin Service] Fetching RSVPs with filters:', filters);

    const params = new URLSearchParams();
    
    if (filters?.venue) {
      params.append('venue', filters.venue);
    }
    
    if (filters?.willAttend !== undefined) {
      params.append('willAttend', filters.willAttend.toString());
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
    
    if (filters?.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }

    const url = `${apiConfig.baseUrl}${apiConfig.endpoints.rsvp}?${params.toString()}`;
    
    const response = await executeWithRetry<RSVPListResponse>(
      () => axios.get<RSVPListResponse>(url)
    );

    console.log('✅ [RSVP Admin Service] Fetched RSVPs:', {
      total: response.data.data.pagination.total,
      page: response.data.data.pagination.page,
      count: response.data.data.rsvps.length
    });

    return response.data;
  } catch (error) {
    console.error('❌ [RSVP Admin Service] Error fetching RSVPs:', error);
    throw new Error(getErrorMessage(error as Error));
  }
};

/**
 * Update an existing RSVP
 * 
 * @param id - RSVP ID to update
 * @param data - Partial RSVP data to update
 * @returns Promise with updated RSVP record
 */
export const updateRSVP = async (
  id: string,
  data: UpdateRSVPData
): Promise<RSVPUpdateResponse> => {
  try {
    console.log('✏️ [RSVP Admin Service] Updating RSVP:', { id, data });

    const url = `${apiConfig.baseUrl}${apiConfig.endpoints.rsvp}/${id}`;
    
    const response = await executeWithRetry<RSVPUpdateResponse>(
      () => axios.patch<RSVPUpdateResponse>(url, data)
    );

    console.log('✅ [RSVP Admin Service] RSVP updated successfully:', response.data);

    return response.data;
  } catch (error) {
    console.error('❌ [RSVP Admin Service] Error updating RSVP:', error);
    throw new Error(getErrorMessage(error as Error));
  }
};

/**
 * Delete an RSVP
 * 
 * @param id - RSVP ID to delete
 * @returns Promise with deletion confirmation
 */
export const deleteRSVP = async (id: string): Promise<RSVPDeleteResponse> => {
  try {
    console.log('🗑️ [RSVP Admin Service] Deleting RSVP:', id);

    const url = `${apiConfig.baseUrl}${apiConfig.endpoints.rsvp}/${id}`;
    
    const response = await executeWithRetry<RSVPDeleteResponse>(
      () => axios.delete<RSVPDeleteResponse>(url)
    );

    console.log('✅ [RSVP Admin Service] RSVP deleted successfully');

    return response.data;
  } catch (error) {
    console.error('❌ [RSVP Admin Service] Error deleting RSVP:', error);
    throw new Error(getErrorMessage(error as Error));
  }
};
