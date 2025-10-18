/**
 * Guest Management Hook
 * 
 * Central state management hook for guest management table.
 * Handles data fetching, filtering, sorting, pagination, and CRUD operations.
 * 
 * @module pages/admin/_components/useGuestManagement
 */

import { useState, useCallback, useEffect } from 'react';
import * as guestAdminService from '../../../services/guestAdminService';
import type {
  GuestRecord,
  GuestManagementState,
  GuestManagementActions,
  VenueFilter,
  GuestSortField,
  SortDirection,
  UpdateGuestData,
} from '../../../types/admin';

const INITIAL_STATE: GuestManagementState = {
  // Data States
  guests: [],
  isLoading: false,
  error: null,
  
  // Pagination States
  currentPage: 1,
  itemsPerPage: 20,
  totalItems: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  
  // Filter States
  searchQuery: '',
  venueFilter: 'all',
  
  // UI States
  expandedRows: new Set<string>(),
  selectedGuest: null,
  isEditModalOpen: false,
  isDeleteDialogOpen: false,
  deleteWarning: null,
  
  // Sort States
  sortField: 'createdAt',
  sortDirection: 'desc',
};

/**
 * Custom hook for guest management
 */
export const useGuestManagement = (): GuestManagementState & GuestManagementActions => {
  const [state, setState] = useState<GuestManagementState>(INITIAL_STATE);

  /**
   * Fetch guests from API with current filters
   */
  const fetchGuests = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const filters = {
        page: state.currentPage,
        limit: state.itemsPerPage,
        sortBy: state.sortField,
        sortOrder: state.sortDirection,
        ...(state.venueFilter !== 'all' && { venue: state.venueFilter }),
        ...(state.searchQuery && { search: state.searchQuery }),
      };

      const response = await guestAdminService.getGuests(filters);

      setState(prev => ({
        ...prev,
        guests: response.data.guests,
        totalItems: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        currentPage: response.data.pagination.page,
        hasNext: response.data.pagination.hasNext,
        hasPrevious: response.data.pagination.hasPrevious,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Không thể tải danh sách khách mời',
        isLoading: false,
      }));
    }
  }, [state.currentPage, state.itemsPerPage, state.sortField, state.sortDirection, state.venueFilter, state.searchQuery]);

  /**
   * Debounced search effect
   */
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchGuests();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [state.searchQuery, fetchGuests]);

  /**
   * Fetch on filter/sort/pagination changes (except search which is debounced)
   */
  useEffect(() => {
    fetchGuests();
  }, [state.currentPage, state.itemsPerPage, state.sortField, state.sortDirection, state.venueFilter]);

  /**
   * Refresh data (manual)
   */
  const refreshData = useCallback(async () => {
    await fetchGuests();
  }, [fetchGuests]);

  /**
   * Update guest
   */
  const updateGuest = useCallback(async (
    id: string,
    data: UpdateGuestData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await guestAdminService.updateGuest(id, data);

      // Update local state optimistically
      setState(prev => ({
        ...prev,
        guests: prev.guests.map(guest =>
          guest.id === id ? { ...guest, ...data, updatedAt: new Date().toISOString() } : guest
        ),
        isEditModalOpen: false,
        selectedGuest: null,
      }));

      // Refresh data to get accurate state from server
      await fetchGuests();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Không thể cập nhật khách mời',
      };
    }
  }, [fetchGuests]);

  /**
   * Delete guest with RSVP check
   */
  const deleteGuest = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await guestAdminService.deleteGuest(id);

      // Remove from local state
      setState(prev => ({
        ...prev,
        guests: prev.guests.filter(guest => guest.id !== id),
        isDeleteDialogOpen: false,
        selectedGuest: null,
        deleteWarning: null,
        totalItems: prev.totalItems - 1,
      }));

      // Refresh data to recalculate pagination
      await fetchGuests();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Không thể xóa khách mời',
      };
    }
  }, [fetchGuests]);

  /**
   * Check guest RSVPs before opening delete dialog
   */
  const checkGuestRSVPs = useCallback(async (guestId: string): Promise<void> => {
    try {
      const result = await guestAdminService.checkGuestRSVPs(guestId);
      
      setState(prev => ({
        ...prev,
        deleteWarning: result.hasRSVPs 
          ? {
              hasRSVPs: true,
              rsvpCount: result.rsvpCount || 0,
              message: result.message,
            }
          : null,
      }));
    } catch (error) {
      console.error('Failed to check guest RSVPs:', error);
      // Continue without warning if check fails
      setState(prev => ({
        ...prev,
        deleteWarning: null,
      }));
    }
  }, []);

  /**
   * Set search query
   */
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      currentPage: 1, // Reset to first page on search
    }));
  }, []);

  /**
   * Set venue filter
   */
  const setVenueFilter = useCallback((venue: VenueFilter) => {
    setState(prev => ({
      ...prev,
      venueFilter: venue,
      currentPage: 1,
    }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      venueFilter: 'all',
      currentPage: 1,
    }));
  }, []);

  /**
   * Toggle row expansion
   */
  const toggleRowExpansion = useCallback((guestId: string) => {
    setState(prev => {
      const expandedRows = new Set(prev.expandedRows);
      if (expandedRows.has(guestId)) {
        expandedRows.delete(guestId);
      } else {
        expandedRows.add(guestId);
      }
      return { ...prev, expandedRows };
    });
  }, []);

  /**
   * Open edit modal
   */
  const openEditModal = useCallback((guest: GuestRecord) => {
    setState(prev => ({
      ...prev,
      selectedGuest: guest,
      isEditModalOpen: true,
    }));
  }, []);

  /**
   * Close edit modal
   */
  const closeEditModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedGuest: null,
      isEditModalOpen: false,
    }));
  }, []);

  /**
   * Open delete dialog (with RSVP check)
   */
  const openDeleteDialog = useCallback((guest: GuestRecord) => {
    setState(prev => ({
      ...prev,
      selectedGuest: guest,
      isDeleteDialogOpen: true,
      deleteWarning: null, // Reset warning
    }));

    // Check for associated RSVPs asynchronously
    checkGuestRSVPs(guest.id);
  }, [checkGuestRSVPs]);

  /**
   * Close delete dialog
   */
  const closeDeleteDialog = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedGuest: null,
      isDeleteDialogOpen: false,
      deleteWarning: null,
    }));
  }, []);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  }, []);

  /**
   * Set items per page
   */
  const setItemsPerPage = useCallback((count: number) => {
    setState(prev => ({
      ...prev,
      itemsPerPage: count,
      currentPage: 1,
    }));
  }, []);

  /**
   * Set sort field and direction
   */
  const setSortField = useCallback((
    field: GuestSortField,
    direction?: SortDirection
  ) => {
    setState(prev => {
      // Toggle direction if same field, or use provided direction
      const newDirection = direction || (
        prev.sortField === field && prev.sortDirection === 'asc'
          ? 'desc'
          : 'asc'
      );

      return {
        ...prev,
        sortField: field,
        sortDirection: newDirection,
        currentPage: 1,
      };
    });
  }, []);

  return {
    ...state,
    fetchGuests,
    refreshData,
    updateGuest,
    deleteGuest,
    checkGuestRSVPs,
    setSearchQuery,
    setVenueFilter,
    clearFilters,
    toggleRowExpansion,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
    goToPage,
    setItemsPerPage,
    setSortField,
  };
};
