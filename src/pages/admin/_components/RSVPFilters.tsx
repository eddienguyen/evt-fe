/**
 * RSVP Filters
 * 
 * Search and filter controls for RSVP management table.
 * Includes search input, venue filter, and attendance filter.
 * 
 * @module pages/admin/_components/RSVPFilters
 */

import type { VenueFilter, AttendanceFilter } from '../../../types/rsvp';

interface RSVPFiltersProps {
  searchQuery: string;
  venueFilter: VenueFilter;
  attendanceFilter: AttendanceFilter;
  onSearchChange: (query: string) => void;
  onVenueChange: (venue: VenueFilter) => void;
  onAttendanceChange: (attendance: AttendanceFilter) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export const RSVPFilters: React.FC<RSVPFiltersProps> = ({
  searchQuery,
  venueFilter,
  attendanceFilter,
  onSearchChange,
  onVenueChange,
  onAttendanceChange,
  onClearFilters,
  isLoading = false,
}) => {
  const hasActiveFilters = searchQuery || venueFilter !== 'all' || attendanceFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-text-light/20 rounded-lg
                     bg-base dark:bg-base text-text dark:text-text
                     placeholder:text-text-light/50
                     focus:outline-none focus:ring-2 focus:ring-accent-gold
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-accent-gold
                     border border-accent-gold rounded-lg
                     hover:bg-accent-gold/10
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors whitespace-nowrap"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Venue Filter */}
        <div className="flex-1">
          <label htmlFor="venue-filter" className="block text-sm font-medium text-text-light mb-2">
            Địa điểm
          </label>
          <select
            id="venue-filter"
            value={venueFilter}
            onChange={(e) => onVenueChange(e.target.value as VenueFilter)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-text-light/20 rounded-lg
                     bg-base dark:bg-base text-text dark:text-text
                     focus:outline-none focus:ring-2 focus:ring-accent-gold
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            <option value="all">Tất cả địa điểm</option>
            <option value="hue">Huế</option>
            <option value="hanoi">Hà Nội</option>
          </select>
        </div>

        {/* Attendance Filter */}
        <div className="flex-1">
          <label htmlFor="attendance-filter" className="block text-sm font-medium text-text-light mb-2">
            Trạng thái tham dự
          </label>
          <select
            id="attendance-filter"
            value={attendanceFilter}
            onChange={(e) => onAttendanceChange(e.target.value as AttendanceFilter)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-text-light/20 rounded-lg
                     bg-base dark:bg-base text-text dark:text-text
                     focus:outline-none focus:ring-2 focus:ring-accent-gold
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            <option value="all">Tất cả</option>
            <option value="attending">Tham dự</option>
            <option value="not-attending">Không tham dự</option>
          </select>
        </div>
      </div>
    </div>
  );
};
