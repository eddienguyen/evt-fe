/**
 * RSVP Table Skeleton
 * 
 * Loading skeleton for RSVP management table.
 * Provides visual feedback during data fetch.
 * 
 * @module pages/admin/_components/RSVPTableSkeleton
 */

interface RSVPTableSkeletonProps {
  rows?: number;
}

export const RSVPTableSkeleton: React.FC<RSVPTableSkeletonProps> = ({ rows = 5 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-7 gap-4 p-4 bg-base-light dark:bg-base-light/10 rounded-lg">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`header-${i}`} className="h-4 bg-base-light/50 dark:bg-base-light/20 rounded" />
        ))}
      </div>

      {/* Table Rows Skeleton */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="grid grid-cols-7 gap-4 p-4 bg-base dark:bg-base rounded-lg">
          <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded" />
          <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded" />
          <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-12" />
          <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-20" />
          <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-16" />
          <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-24" />
          <div className="h-4 bg-base-light/30 dark:bg-base-light/10 rounded w-20" />
        </div>
      ))}
    </div>
  );
};
