/**
 * Guest Table
 * 
 * Main table component for guest management.
 * Displays guest list with sorting, filtering, and pagination.
 * 
 * @module pages/admin/_components/GuestTable
 */

import type { GuestRecord, GuestSortField, SortDirection } from '../../../types/admin';
import { GuestTableRow } from './GuestTableRow';
import { getSortIcon } from './guestTableUtils';

interface GuestTableProps {
  guests: GuestRecord[];
  expandedRows: Set<string>;
  sortField: GuestSortField;
  sortDirection: SortDirection;
  onToggleExpand: (guestId: string) => void;
  onSort: (field: GuestSortField) => void;
  onEdit: (guest: GuestRecord) => void;
  onDelete: (guest: GuestRecord) => void;
  isLoading?: boolean;
}

export const GuestTable: React.FC<GuestTableProps> = ({
  guests,
  expandedRows,
  sortField,
  sortDirection,
  onToggleExpand,
  onSort,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  // Safety check: ensure guests is an array
  const safeGuests = Array.isArray(guests) ? guests : [];
  
  if (safeGuests.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-text-light/30 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <p className="text-text-light text-lg">Không tìm thấy khách mời nào</p>
        <p className="text-text-light/70 text-sm mt-2">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Desktop Table Header */}
      <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 bg-base-light/30 dark:bg-base-light/10 rounded-lg">
        <button
          onClick={() => onSort('name')}
          className="text-sm font-medium text-text-light uppercase tracking-wide
                   hover:text-accent-gold transition-colors text-left
                   flex items-center gap-1"
        >
          Tên khách
          {' '}
          <span className="text-xs">{getSortIcon('name', sortField, sortDirection)}</span>
        </button>

        <button
          onClick={() => onSort('venue')}
          className="text-sm font-medium text-text-light uppercase tracking-wide
                   hover:text-accent-gold transition-colors text-left
                   flex items-center gap-1"
        >
          Địa điểm
          {' '}
          <span className="text-xs">{getSortIcon('venue', sortField, sortDirection)}</span>
        </button>

        <div className="text-sm font-medium text-text-light uppercase tracking-wide text-left">
          Ghi chú
        </div>

        <div className="text-sm font-medium text-text-light uppercase tracking-wide text-left">
          Thiệp mời
        </div>

        <button
          onClick={() => onSort('createdAt')}
          className="text-sm font-medium text-text-light uppercase tracking-wide
                   hover:text-accent-gold transition-colors text-left
                   flex items-center gap-1"
        >
          Ngày tạo
          {' '}
          <span className="text-xs">{getSortIcon('createdAt', sortField, sortDirection)}</span>
        </button>

        <div className="text-sm font-medium text-text-light uppercase tracking-wide text-right">
          Thao tác
        </div>
      </div>

      {/* Table Rows / Cards */}
      <div className="space-y-2">
        {safeGuests.map((guest) => (
          <GuestTableRow
            key={guest.id}
            guest={guest}
            isExpanded={expandedRows.has(guest.id)}
            onToggleExpand={() => onToggleExpand(guest.id)}
            onEdit={() => onEdit(guest)}
            onDelete={() => onDelete(guest)}
          />
        ))}
      </div>
    </div>
  );
};
