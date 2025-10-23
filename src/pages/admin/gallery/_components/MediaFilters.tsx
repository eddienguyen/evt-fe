/**
 * Media Filters Component
 * 
 * Search and filter controls for media management.
 * Provides search input, category filtering, and sorting options.
 * 
 * @module pages/admin/gallery/_components/MediaFilters
 */

import React from 'react';
import type { MediaCategory, MediaSortBy } from '../../../../types/gallery';

/**
 * Media filters props interface
 */
interface MediaFiltersProps {
  searchQuery: string;
  categoryFilter: MediaCategory | 'all';
  sortBy: MediaSortBy;
  totalItems: number;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: MediaCategory | 'all') => void;
  onSortChange: (sortBy: MediaSortBy) => void;
}

/**
 * MediaFilters Component
 * 
 * Provides search, category filtering, and sorting controls for the media grid.
 */
export const MediaFilters: React.FC<MediaFiltersProps> = ({
  searchQuery,
  categoryFilter,
  sortBy,
  totalItems,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}) => {
  // Category options
  const categories: Array<{ value: MediaCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Categories' },
    { value: 'ceremony', label: 'Ceremony' },
    { value: 'reception', label: 'Reception' },
    { value: 'portraits', label: 'Portraits' },
    { value: 'candid', label: 'Candid' },
    { value: 'details', label: 'Details' },
    { value: 'venue', label: 'Venue' },
    { value: 'general', label: 'General' },
  ];

  // Sort options
  const sortOptions: Array<{ value: MediaSortBy; label: string }> = [
    { value: 'date', label: 'Date Added' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'File Size' },
    { value: 'displayOrder', label: 'Display Order' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search media..."
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category Filter */}
          <div className="min-w-[160px]">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value as MediaCategory | 'all')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="min-w-[140px]">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as MediaSortBy)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(searchQuery || categoryFilter !== 'all') && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Active filters:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Search: "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Category: {categories.find(c => c.value === categoryFilter)?.label}
                <button
                  onClick={() => onCategoryChange('all')}
                  className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};