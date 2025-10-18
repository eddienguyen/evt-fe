/**
 * Admin Type Definitions
 * 
 * Type definitions for admin-specific features including
 * guest management and invitation generation.
 * 
 * @module types/admin
 */

// Shared Types
export type VenueFilter = 'all' | 'hue' | 'hanoi';

export interface GuestFormData {
  name: string;
  venue: 'hue' | 'hanoi';
  secondaryNote?: string;
}

export interface GuestRecord {
  id: string;
  name: string;
  venue: 'hue' | 'hanoi';
  secondaryNote: string;
  invitationUrl: string;
  invitationImageFrontUrl?: string;
  invitationImageMainUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestResponse {
  success: boolean;
  data: GuestRecord;
  message?: string;
  warnings?: string[];
}

export interface CreateGuestError {
  success: false;
  error: string;
  details?: Record<string, string>;
}

export interface TextPositionSettings {
  nameX: number;
  nameY: number;
  secondaryNoteX: number;
  secondaryNoteY: number;
  textColor: string;
}

/**
 * Admin Dashboard Statistics
 */
export interface AdminStats {
  // Guest Statistics
  totalGuests: number;
  guestsByVenue: {
    hue: number;
    hanoi: number;
  };
  
  // RSVP Statistics
  totalRsvps: number;
  rsvpsByVenue: {
    hue: number;
    hanoi: number;
  };
  attendingGuests: number;
  responseRate: number;
  
  // Recent Activity
  recentActivity: number;
  lastUpdated: string;
}

/**
 * Breadcrumb Navigation Item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive: boolean;
}

/**
 * Sidebar Navigation Item
 */
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

/**
 * Admin Layout Context Type
 */
export interface AdminLayoutContextType {
  stats: AdminStats | null;
  isLoadingStats: boolean;
  statsError: string | null;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  fetchStats: () => Promise<void>;
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
}

/**
 * Stats Card Component Props
 */
export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  href?: string;
}

/**
 * Guest Management Types
 */

export interface GuestListResponse {
  success: boolean;
  data: {
    guests: GuestRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
}

export interface UpdateGuestData {
  name?: string;
  venue?: 'hue' | 'hanoi';
  secondaryNote?: string;
}

export interface UpdateGuestResponse {
  success: boolean;
  data: GuestRecord;
  message?: string;
}

export interface DeleteGuestResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
  };
}

export interface CheckGuestRSVPsResponse {
  hasRSVPs: boolean;
  rsvpCount: number;
  message: string;
}

export interface GuestFilters {
  venue?: 'all' | 'hue' | 'hanoi';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: GuestSortField;
  sortDirection?: 'asc' | 'desc';
}

export type GuestSortField = 'name' | 'venue' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface GuestManagementState {
  // Data States
  guests: GuestRecord[];
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
  
  // UI States
  expandedRows: Set<string>;
  selectedGuest: GuestRecord | null;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  deleteWarning: {
    hasRSVPs: boolean;
    rsvpCount: number;
    message: string;
  } | null;
  
  // Sort States
  sortField: GuestSortField;
  sortDirection: SortDirection;
}

export interface GuestManagementActions {
  // Data Actions
  fetchGuests: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateGuest: (id: string, data: UpdateGuestData) => Promise<{ success: boolean; error?: string }>;
  deleteGuest: (id: string) => Promise<{ success: boolean; error?: string }>;
  checkGuestRSVPs: (guestId: string) => Promise<void>;
  
  // Filter Actions
  setSearchQuery: (query: string) => void;
  setVenueFilter: (venue: VenueFilter) => void;
  clearFilters: () => void;
  
  // UI Actions
  toggleRowExpansion: (guestId: string) => void;
  openEditModal: (guest: GuestRecord) => void;
  closeEditModal: () => void;
  openDeleteDialog: (guest: GuestRecord) => void;
  closeDeleteDialog: () => void;
  
  // Pagination Actions
  goToPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  
  // Sort Actions
  setSortField: (field: GuestSortField, direction?: SortDirection) => void;
}
