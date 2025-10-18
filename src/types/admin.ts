/**
 * Admin Type Definitions
 * 
 * Type definitions for admin-specific features including
 * guest management and invitation generation.
 * 
 * @module types/admin
 */

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
