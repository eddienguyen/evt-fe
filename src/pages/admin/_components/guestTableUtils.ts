/**
 * Guest Table Utilities
 * 
 * Helper functions for guest table operations including formatting,
 * filtering, sorting, and data transformations.
 * 
 * @module pages/admin/_components/guestTableUtils
 */

import type { GuestRecord, GuestSortField, SortDirection } from '../../../types/admin';

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
 * Get venue badge color
 */
export const getVenueBadgeColor = (venue: 'hue' | 'hanoi'): string => {
  return venue === 'hue'
    ? 'bg-purple-100 text-accent-gold-dark dark:bg-purple-900/30'
    : 'bg-blue-100 text-accent-gold-dark dark:bg-blue-900/30';
};

/**
 * Get sort icon name based on current sort state
 */
export const getSortIcon = (
  field: GuestSortField,
  currentField: GuestSortField,
  direction: SortDirection
): 'sort' | 'sort-asc' | 'sort-desc' => {
  if (field !== currentField) {
    return 'sort';
  }
  return direction === 'asc' ? 'sort-asc' : 'sort-desc';
};

/**
 * Get pagination info text
 */
export const getPaginationInfo = (
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
): {
  showing: string;
  start: number;
  end: number;
} => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    showing: `Hiển thị ${start}-${end} của ${totalItems} khách`,
    start,
    end,
  };
};

/**
 * Get sort field display name
 */
export const getSortFieldName = (field: GuestSortField): string => {
  const names: Record<GuestSortField, string> = {
    name: 'Tên',
    venue: 'Địa điểm',
    createdAt: 'Ngày tạo',
  };
  return names[field] || field;
};

/**
 * Filter guests by search query
 */
export const filterGuestsBySearch = (
  guests: GuestRecord[],
  searchQuery: string
): GuestRecord[] => {
  if (!searchQuery.trim()) {
    return guests;
  }

  const query = searchQuery.toLowerCase();
  return guests.filter(guest =>
    guest.name.toLowerCase().includes(query) ||
    guest.secondaryNote?.toLowerCase().includes(query)
  );
};

/**
 * Sort guests by field and direction
 */
export const sortGuests = (
  guests: GuestRecord[],
  field: GuestSortField,
  direction: SortDirection
): GuestRecord[] => {
  const sorted = [...guests].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (field) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'venue':
        aValue = a.venue;
        bValue = b.venue;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
};

/**
 * Get guest initials for avatar
 */
export const getGuestInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get invitation URL label
 */
export const getInvitationUrlLabel = (venue: 'hue' | 'hanoi'): string => {
  return venue === 'hue' ? 'hue/[id]' : 'hn/[id]';
};

/**
 * Check if guest has invitation images
 */
export const hasInvitationImages = (guest: GuestRecord): boolean => {
  return Boolean(guest.invitationImageFrontUrl && guest.invitationImageMainUrl);
};
