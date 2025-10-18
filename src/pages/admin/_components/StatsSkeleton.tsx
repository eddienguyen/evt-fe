/**
 * Stats Skeleton Component
 * 
 * Loading skeleton for stats cards to prevent layout shift.
 * Provides smooth loading animation while data is being fetched.
 * 
 * @module pages/admin/_components/StatsSkeleton
 */

import React from 'react';

interface StatsSkeletonProps {
  count?: number;
}

/**
 * Stats Skeleton Component
 * 
 * Renders placeholder cards with pulse animation during data loading.
 * Matches the layout of actual StatsCard components.
 * 
 * @param {StatsSkeletonProps} props - Component props
 * @returns {React.ReactElement} Rendered skeleton cards
 * 
 * @example
 * ```typescript
 * {isLoading && <StatsSkeleton count={4} />}
 * ```
 */
export const StatsSkeleton: React.FC<StatsSkeletonProps> = ({ count = 4 }) => {
  const skeletonIds = React.useMemo(() => 
    Array.from({ length: count }, (_, i) => `skeleton-card-${i}`),
    [count]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {skeletonIds.map((id) => (
        <div
          key={id}
          className="bg-base-light rounded-lg p-6 shadow-soft animate-pulse"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-text-light/10 rounded w-24" />
            <div className="h-8 w-8 bg-text-light/10 rounded-full" />
          </div>

          {/* Main Value */}
          <div className="h-10 bg-text-light/10 rounded w-20 mb-2" />

          {/* Subtitle */}
          <div className="h-4 bg-text-light/10 rounded w-32 mt-4" />
        </div>
      ))}
    </div>
  );
};
