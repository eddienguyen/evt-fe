/**
 * Guest Table Skeleton
 * 
 * Loading skeleton for guest management table.
 * Provides visual feedback during data fetch.
 * 
 * @module pages/admin/_components/GuestTableSkeleton
 */

interface GuestTableSkeletonProps {
  rows?: number;
}

export const GuestTableSkeleton: React.FC<GuestTableSkeletonProps> = ({ rows = 5 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Desktop Table Header Skeleton */}
      <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 bg-base-light dark:bg-base-light/10 rounded-lg">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`header-${i}`} className="h-4 bg-base-light/50 dark:bg-base-light/20 rounded" />
        ))}
      </div>

      {/* Desktop Table Rows Skeleton */}
      <div className="hidden md:block space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={`row-${i}`} className="grid grid-cols-6 gap-4 p-4 bg-base dark:bg-base rounded-lg">
            <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded" />
            <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-20" />
            <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-24" />
            <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-32" />
            <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-24" />
            <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-20" />
          </div>
        ))}
      </div>

      {/* Mobile Card Skeleton */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={`card-${i}`} className="bg-base dark:bg-base rounded-lg p-4 space-y-3">
            {/* Name */}
            <div className="h-5 bg-base-light/30 dark:bg-base-light/10 rounded w-3/4" />
            
            {/* Venue badge */}
            <div className="h-6 bg-base-light/30 dark:bg-base-light/10 rounded w-20" />
            
            {/* Details */}
            <div className="space-y-2">
              <div className="h-4 bg-base-light/20 dark:bg-base-light/10 rounded w-full" />
              <div className="h-4 bg-base-light/20 dark:bg-base-light/10 rounded w-2/3" />
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <div className="h-8 bg-base-light/30 dark:bg-base-light/10 rounded w-20" />
              <div className="h-8 bg-base-light/30 dark:bg-base-light/10 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
