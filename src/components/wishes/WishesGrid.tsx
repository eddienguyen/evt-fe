/**
 * WishesGrid Component
 * 
 * Responsive grid layout for displaying multiple wish cards.
 * Handles different screen sizes with adaptive columns.
 * 
 * @module components/wishes/WishesGrid
 */

import { WishCard } from './WishCard'
import type { WishItem } from '../../types/wishes'

export interface WishesGridProps {
  /** Array of wishes to display */
  readonly wishes: WishItem[]
  /** Loading state for skeleton display */
  readonly isLoading?: boolean
  /** Additional CSS classes */
  readonly className?: string
  /** Number of skeleton cards to show when loading */
  readonly skeletonCount?: number
}

/**
 * WishesGrid Component
 * 
 * Displays wishes in a responsive grid layout.
 * Automatically adjusts columns based on screen size and content.
 * 
 * @param props - Component props
 * @returns Wishes grid component
 * 
 * @example
 * ```tsx
 * <WishesGrid 
 *   wishes={wishesData}
 *   isLoading={false}
 *   className="mt-8"
 * />
 * ```
 */
export function WishesGrid({ 
  wishes, 
  isLoading = false, 
  className = '', 
  skeletonCount = 6 
}: WishesGridProps) {
  // Show skeleton cards during loading
  if (isLoading) {
    return (
      <div className={`
        grid gap-6
        grid-cols-1 
        md:grid-cols-2 
        xl:grid-cols-3
        ${className}
      `.trim()}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <WishCard 
            key={`skeleton-${index}`}
            wish={{} as WishItem} // Type assertion for skeleton state
            isLoading={true}
          />
        ))}
      </div>
    )
  }

  // Handle empty state
  if (wishes.length === 0) {
    return (
      <div className={`
        text-center py-12
        ${className}
      `.trim()}>
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5}
                d="M7 8h10M7 12h4m6-4h.01M17 16h.01M7 16h4m6 0h.01M3 8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No wishes yet
          </h3>
          <p className="text-sm text-gray-500">
            Be the first to share your wishes for the happy couple!
          </p>
        </div>
      </div>
    )
  }

  // Determine optimal grid layout based on number of items
  const getGridClasses = () => {
    const count = wishes.length
    
    if (count === 1) {
      return 'grid-cols-1 max-w-md mx-auto'
    } else if (count === 2) {
      return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
    } else if (count <= 4) {
      return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
    } else {
      return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
    }
  }

  return (
    <div className={`
      grid gap-6
      ${getGridClasses()}
      ${className}
    `.trim()}>
      {wishes.map((wish) => (
        <WishCard 
          key={wish.id}
          wish={wish}
        />
      ))}
    </div>
  )
}

export default WishesGrid