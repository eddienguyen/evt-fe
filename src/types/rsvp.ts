/**
 * RSVP Management Type Definitions
 * 
 * Type definitions for RSVP management features including
 * records, filters, pagination, and API responses.
 * 
 * @module types/rsvp
 */

/**
 * RSVP Record from API
 */
export interface RSVPRecord {
  id: string;
  guestId: string | null;
  name: string;
  guestCount: number;
  willAttend: boolean;
  wishes: string | null;
  venue: 'hue' | 'hanoi';
  createdAt: string;
  updatedAt: string;
  guest?: {
    id: string;
    name: string;
    venue: 'hue' | 'hanoi';
  };
}

/**
 * Update RSVP Data (partial update)
 */
export interface UpdateRSVPData {
  name?: string;
  guestCount?: number;
  willAttend?: boolean;
  wishes?: string;
}

/**
 * RSVP List Response from API
 */
export interface RSVPListResponse {
  success: boolean;
  data: {
    rsvps: RSVPRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
  message?: string;
}

/**
 * RSVP Update Response
 */
export interface RSVPUpdateResponse {
  success: boolean;
  data: RSVPRecord;
  message: string;
}

/**
 * RSVP Delete Response
 */
export interface RSVPDeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Filter Options
 */
export type VenueFilter = 'all' | 'hue' | 'hanoi';
export type AttendanceFilter = 'all' | 'attending' | 'not-attending';
export type RSVPSortField = 'createdAt' | 'name' | 'guestCount' | 'venue' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

/**
 * RSVP Filters for API Query
 */
export interface RSVPFilters {
  venue?: 'hue' | 'hanoi';
  willAttend?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: RSVPSortField;
  sortOrder?: SortDirection;
}

/**
 * RSVP Management State
 */
export interface RSVPManagementState {
  // Data States
  rsvps: RSVPRecord[];
  isLoading: boolean;
  error: string | null;
  
  // Pagination States
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  
  // Filter States
  searchQuery: string;
  venueFilter: VenueFilter;
  attendanceFilter: AttendanceFilter;
  
  // UI States
  expandedRows: Set<string>;
  selectedRSVP: RSVPRecord | null;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  
  // Sort States
  sortField: RSVPSortField;
  sortDirection: SortDirection;
}

/**
 * RSVP Management Actions
 */
export interface RSVPManagementActions {
  // Data Actions
  fetchRSVPs: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateRSVP: (id: string, data: UpdateRSVPData) => Promise<{ success: boolean; error?: string }>;
  deleteRSVP: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Filter Actions
  setSearchQuery: (query: string) => void;
  setVenueFilter: (venue: VenueFilter) => void;
  setAttendanceFilter: (attendance: AttendanceFilter) => void;
  clearFilters: () => void;
  
  // UI Actions
  toggleRowExpansion: (rsvpId: string) => void;
  openEditModal: (rsvp: RSVPRecord) => void;
  closeEditModal: () => void;
  openDeleteDialog: (rsvp: RSVPRecord) => void;
  closeDeleteDialog: () => void;
  
  // Pagination Actions
  goToPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  
  // Sort Actions
  setSortField: (field: RSVPSortField, direction?: SortDirection) => void;
}
