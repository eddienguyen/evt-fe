/**
 * Guest Filters
 * 
 * Search and filter controls for guest management table.
 * Includes search input and venue filter.
 * 
 * @module pages/admin/_components/GuestFilters
 */

import type { VenueFilter } from '../../../types/admin';

interface GuestFiltersProps {
  searchQuery: string;
  venueFilter: VenueFilter;
  onSearchChange: (query: string) => void;
  onVenueChange: (venue: VenueFilter) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export const GuestFilters: React.FC<GuestFiltersProps> = ({
  searchQuery,
  venueFilter,
  onSearchChange,
  onVenueChange,
  onClearFilters,
  isLoading = false,
}) => {
  const hasActiveFilters = searchQuery || venueFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách mời..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-text-light/20 rounded-lg
                       bg-base dark:bg-base text-text dark:text-text
                       placeholder:text-text-light/50
                       focus:outline-none focus:ring-2 focus:ring-accent-gold
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            />
          </div>
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

      {/* Venue Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 sm:max-w-xs">
          <label htmlFor="venue-filter" className="block text-sm font-medium text-text-light mb-2">
            Địa điểm tổ chức
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
      </div>
    </div>
  );
};
