/**
 * RSVP Management Hook
 * 
 * Central state management hook for RSVP management table.
 * Handles data fetching, filtering, sorting, pagination, and CRUD operations.
 * 
 * @module pages/admin/_components/useRSVPManagement
 */

import { useState, useCallback, useEffect } from 'react';
import * as rsvpAdminService from '../../../services/rsvpAdminService';
import type {
  RSVPRecord,
  RSVPManagementState,
  RSVPManagementActions,
  VenueFilter,
  AttendanceFilter,
  RSVPSortField,
  SortDirection,
  UpdateRSVPData,
} from '../../../types/rsvp';

const INITIAL_STATE: RSVPManagementState = {
  // Data States
  rsvps: [],
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
  attendanceFilter: 'all',
  
  // UI States
  expandedRows: new Set<string>(),
  selectedRSVP: null,
  isEditModalOpen: false,
  isDeleteDialogOpen: false,
  
  // Sort States
  sortField: 'createdAt',
  sortDirection: 'desc',
};

/**
 * Custom hook for RSVP management
 */
export const useRSVPManagement = (): RSVPManagementState & RSVPManagementActions => {
  const [state, setState] = useState<RSVPManagementState>(INITIAL_STATE);

  /**
   * Fetch RSVPs from API with current filters
   */
  const fetchRSVPs = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const filters = {
        page: state.currentPage,
        limit: state.itemsPerPage,
        sortBy: state.sortField,
        sortOrder: state.sortDirection,
        ...(state.venueFilter !== 'all' && { venue: state.venueFilter }),
        ...(state.attendanceFilter !== 'all' && {
          willAttend: state.attendanceFilter === 'attending'
        }),
        ...(state.searchQuery && { search: state.searchQuery }),
      };

      const response = await rsvpAdminService.getRSVPs(filters);

      setState(prev => ({
        ...prev,
        rsvps: response.data.rsvps,
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
        error: error instanceof Error ? error.message : 'Không thể tải danh sách RSVP',
        isLoading: false,
      }));
    }
  }, [state.currentPage, state.itemsPerPage, state.sortField, state.sortDirection, state.venueFilter, state.attendanceFilter, state.searchQuery]);

  /**
   * Debounced search effect
   */
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRSVPs();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [state.searchQuery, fetchRSVPs]);

  /**
   * Fetch on filter/sort/pagination changes (except search which is debounced)
   */
  useEffect(() => {
    fetchRSVPs();
  }, [state.currentPage, state.itemsPerPage, state.sortField, state.sortDirection, state.venueFilter, state.attendanceFilter]);

  /**
   * Refresh data (manual)
   */
  const refreshData = useCallback(async () => {
    await fetchRSVPs();
  }, [fetchRSVPs]);

  /**
   * Update RSVP
   */
  const updateRSVP = useCallback(async (
    id: string,
    data: UpdateRSVPData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await rsvpAdminService.updateRSVP(id, data);

      // Update local state optimistically
      setState(prev => ({
        ...prev,
        rsvps: prev.rsvps.map(rsvp =>
          rsvp.id === id ? { ...rsvp, ...data, updatedAt: new Date().toISOString() } : rsvp
        ),
        isEditModalOpen: false,
        selectedRSVP: null,
      }));

      // Refresh data to get accurate state from server
      await fetchRSVPs();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Không thể cập nhật RSVP',
      };
    }
  }, [fetchRSVPs]);

  /**
   * Delete RSVP
   */
  const deleteRSVP = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await rsvpAdminService.deleteRSVP(id);

      // Remove from local state
      setState(prev => ({
        ...prev,
        rsvps: prev.rsvps.filter(rsvp => rsvp.id !== id),
        isDeleteDialogOpen: false,
        selectedRSVP: null,
        totalItems: prev.totalItems - 1,
      }));

      // Refresh data to recalculate pagination
      await fetchRSVPs();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Không thể xóa RSVP',
      };
    }
  }, [fetchRSVPs]);

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
   * Set attendance filter
   */
  const setAttendanceFilter = useCallback((attendance: AttendanceFilter) => {
    setState(prev => ({
      ...prev,
      attendanceFilter: attendance,
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
      attendanceFilter: 'all',
      currentPage: 1,
    }));
  }, []);

  /**
   * Toggle row expansion
   */
  const toggleRowExpansion = useCallback((rsvpId: string) => {
    setState(prev => {
      const expandedRows = new Set(prev.expandedRows);
      if (expandedRows.has(rsvpId)) {
        expandedRows.delete(rsvpId);
      } else {
        expandedRows.add(rsvpId);
      }
      return { ...prev, expandedRows };
    });
  }, []);

  /**
   * Open edit modal
   */
  const openEditModal = useCallback((rsvp: RSVPRecord) => {
    setState(prev => ({
      ...prev,
      selectedRSVP: rsvp,
      isEditModalOpen: true,
    }));
  }, []);

  /**
   * Close edit modal
   */
  const closeEditModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedRSVP: null,
      isEditModalOpen: false,
    }));
  }, []);

  /**
   * Open delete dialog
   */
  const openDeleteDialog = useCallback((rsvp: RSVPRecord) => {
    setState(prev => ({
      ...prev,
      selectedRSVP: rsvp,
      isDeleteDialogOpen: true,
    }));
  }, []);

  /**
   * Close delete dialog
   */
  const closeDeleteDialog = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedRSVP: null,
      isDeleteDialogOpen: false,
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
    field: RSVPSortField,
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
    fetchRSVPs,
    refreshData,
    updateRSVP,
    deleteRSVP,
    setSearchQuery,
    setVenueFilter,
    setAttendanceFilter,
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
