/**
 * RSVP Table Utilities
 * 
 * Helper functions for RSVP table operations including formatting,
 * filtering, sorting, and data transformations.
 * 
 * @module pages/admin/_components/rsvpTableUtils
 */

import type { RSVPRecord, RSVPSortField, SortDirection } from '../../../types/rsvp';

/**
 * Format date string to locale format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Format date to short format (date only)
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

/**
 * Get venue display name
 */
export const getVenueName = (venue: 'hue' | 'hanoi'): string => {
  return venue === 'hue' ? 'Huế' : 'Hà Nội';
};

/**
 * Get attendance status display
 */
export const getAttendanceStatus = (willAttend: boolean): {
  text: string;
  className: string;
} => {
  if (willAttend) {
    return {
      text: 'Tham dự',
      className: 'text-green-600 dark:text-green-400',
    };
  }
  return {
    text: 'Không tham dự',
    className: 'text-red-600 dark:text-red-400',
  };
};

/**
 * Get guest name or fallback
 */
export const getGuestDisplayName = (rsvp: RSVPRecord): string => {
  if (rsvp.guest?.name) {
    return rsvp.guest.name;
  }
  return 'Khách mời';
};

/**
 * Truncate wishes text for display
 */
export const truncateWishes = (wishes: string | null, maxLength = 50): string => {
  if (!wishes) return '-';
  if (wishes.length <= maxLength) return wishes;
  return wishes.substring(0, maxLength) + '...';
};

/**
 * Client-side sort function (backup for when server sort isn't available)
 */
export const sortRSVPs = (
  rsvps: RSVPRecord[],
  sortField: RSVPSortField,
  sortDirection: SortDirection
): RSVPRecord[] => {
  return [...rsvps].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'guestCount':
        comparison = a.guestCount - b.guestCount;
        break;
      case 'venue':
        comparison = a.venue.localeCompare(b.venue);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

/**
 * Client-side filter function (backup for when server filter isn't available)
 */
export const filterRSVPs = (
  rsvps: RSVPRecord[],
  searchQuery: string,
  venueFilter: 'all' | 'hue' | 'hanoi',
  attendanceFilter: 'all' | 'attending' | 'not-attending'
): RSVPRecord[] => {
  return rsvps.filter((rsvp) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = rsvp.name.toLowerCase().includes(query);
      const matchesGuestName = rsvp.guest?.name?.toLowerCase().includes(query);
      if (!matchesName && !matchesGuestName) {
        return false;
      }
    }

    // Venue filter
    if (venueFilter !== 'all' && rsvp.venue !== venueFilter) {
      return false;
    }

    // Attendance filter
    if (attendanceFilter === 'attending' && !rsvp.willAttend) {
      return false;
    }
    if (attendanceFilter === 'not-attending' && rsvp.willAttend) {
      return false;
    }

    return true;
  });
};

/**
 * Get sort icon for table header
 */
export const getSortIcon = (
  currentField: RSVPSortField,
  field: RSVPSortField,
  direction: SortDirection
): '↑' | '↓' | '↕' => {
  if (currentField !== field) {
    return '↕';
  }
  return direction === 'asc' ? '↑' : '↓';
};

/**
 * Calculate pagination info
 */
export const getPaginationInfo = (
  page: number,
  limit: number,
  total: number
): {
  start: number;
  end: number;
  showing: string;
} => {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const showing = `Hiển thị ${start}-${end} trong tổng số ${total} RSVP`;
  
  return { start, end, showing };
};
