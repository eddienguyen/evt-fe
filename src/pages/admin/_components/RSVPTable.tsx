/**
 * RSVP Table
 * 
 * Main table component for RSVP management.
 * Displays RSVP list with sorting, filtering, and pagination.
 * 
 * @module pages/admin/_components/RSVPTable
 */

import type { RSVPRecord, RSVPSortField, SortDirection } from '../../../types/rsvp';
import { RSVPTableRow } from './RSVPTableRow';
import { getSortIcon } from './rsvpTableUtils';

interface RSVPTableProps {
  rsvps: RSVPRecord[];
  expandedRows: Set<string>;
  sortField: RSVPSortField;
  sortDirection: SortDirection;
  onToggleExpand: (rsvpId: string) => void;
  onSort: (field: RSVPSortField) => void;
  onEdit: (rsvp: RSVPRecord) => void;
  onDelete: (rsvp: RSVPRecord) => void;
  isLoading?: boolean;
}

export const RSVPTable: React.FC<RSVPTableProps> = ({
  rsvps,
  expandedRows,
  sortField,
  sortDirection,
  onToggleExpand,
  onSort,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (rsvps.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-text-light text-lg">Không tìm thấy RSVP nào</p>
        <p className="text-text-light/70 text-sm mt-2">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 p-4 bg-base-light/30 dark:bg-base-light/10 rounded-lg">
        <button
          onClick={() => onSort('name')}
          className="text-sm font-medium text-text-light uppercase tracking-wide
                   hover:text-accent-gold transition-colors text-left
                   flex items-center gap-1"
        >
          Tên khách mời
          {' '}
          <span className="text-xs">{getSortIcon(sortField, 'name', sortDirection)}</span>
        </button>

        <button
          onClick={() => onSort('name')}
          className="text-sm font-medium text-text-light uppercase tracking-wide
                   hover:text-accent-gold transition-colors text-left
                   flex items-center gap-1"
        >
          Tên người trả lời
          {' '}
          <span className="text-xs">{getSortIcon(sortField, 'name', sortDirection)}</span>
        </button>

        <button
          onClick={() => onSort('guestCount')}
          className="text-sm font-medium text-text-light uppercase tracking-wide
                   hover:text-accent-gold transition-colors text-center
                   flex items-center justify-center gap-1"
        >
          SL Khách
          {' '}
          <span className="text-xs">{getSortIcon(sortField, 'guestCount', sortDirection)}</span>
        </button>

        <div className="text-sm font-medium text-text-light uppercase tracking-wide text-left">
          Tham dự
        </div>

        <button
          onClick={() => onSort('venue')}
          className="text-sm font-medium text-text-light uppercase tracking-wide
                   hover:text-accent-gold transition-colors text-left
                   flex items-center gap-1"
        >
          Địa điểm
          {' '}
          <span className="text-xs">{getSortIcon(sortField, 'venue', sortDirection)}</span>
        </button>

        <button
          onClick={() => onSort('createdAt')}
          className="text-sm font-medium text-text-light uppercase tracking-wide
                   hover:text-accent-gold transition-colors text-left
                   flex items-center gap-1"
        >
          Ngày
          {' '}
          <span className="text-xs">{getSortIcon(sortField, 'createdAt', sortDirection)}</span>
        </button>

        <div className="text-sm font-medium text-text-light uppercase tracking-wide text-right">
          Thao tác
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {rsvps.map((rsvp) => (
          <RSVPTableRow
            key={rsvp.id}
            rsvp={rsvp}
            isExpanded={expandedRows.has(rsvp.id)}
            onToggleExpand={() => onToggleExpand(rsvp.id)}
            onEdit={() => onEdit(rsvp)}
            onDelete={() => onDelete(rsvp)}
          />
        ))}
      </div>
    </div>
  );
};
