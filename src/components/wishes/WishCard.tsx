/**
 * WishCard Component
 * 
 * Displays individual wish messages with consistent styling.
 * Features responsive layout and handwritten font for personal touch.
 * 
 * @module components/wishes/WishCard
 */

import type { WishItem } from '../../types/wishes'

export interface WishCardProps {
  /** The wish data to display */
  readonly wish: WishItem
  /** Additional CSS classes */
  readonly className?: string
  /** Loading state */
  readonly isLoading?: boolean
}

/**
 * WishCard Component
 * 
 * Displays a single wish with name and message.
 * Uses handwritten font for personal touch on wish text.
 * 
 * @param props - Component props
 * @returns Wish card component
 * 
 * @example
 * ```tsx
 * <WishCard 
 *   wish={{
 *     id: '1',
 *     name: 'John Doe',
 *     wish: 'Wishing you both endless love and happiness!',
 *     timestamp: '2024-01-15T10:30:00Z'
 *   }}
 * />
 * ```
 */
export function WishCard({ wish, className = '', isLoading = false }: WishCardProps) {
  if (isLoading) {
    return <WishCardSkeleton className={className} />
  }

  // Fallback handling for missing data
  const wishText = wish.wishes || 'Wishing you both love and happiness!'
  const authorName = wish.name || 'A Guest'
  const wishDate = wish.createdAt || new Date().toISOString()

  return (
    <article className={`
      group relative
      bg-white/90 backdrop-blur-sm
      border border-gray-200/50
      rounded-xl p-4 md:p-6
      shadow-sm hover:shadow-md
      transition-all duration-300 ease-in-out
      hover:transform hover:scale-[1.02]
      hover:bg-white/90
      ${className}
    `.trim()}
    aria-label={`Wish from ${wish.name || 'Guest'}`}
    >
      {/* Card Content */}
      <div className="space-y-4">
        {/* Wish Message */}
        <div className="relative">
          <blockquote className="
            font-rose text-lg leading-relaxed
            text-gray-700 
            relative z-10
            min-h-[3rem]
          ">
            "{wishText}"
          </blockquote>
          
          {/* Decorative Quote Mark */}
          <div className="
            absolute -top-2 -left-2 
            text-4xl text-gray-200 
            font-serif leading-none
            pointer-events-none
            select-none
          " aria-hidden="true">
            "
          </div>
        </div>

        {/* Author & Date */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex-1 min-w-0">
            <p className="
              text-base font-handwritten text-gray-800
              truncate
            ">
              {authorName}
            </p>
          </div>
          
          {/* Date */}
          <time 
            dateTime={wishDate}
            className="
              text-sm text-gray-500
              ml-3 flex-shrink-0
            "
          >
            {formatWishDate(wishDate)}
          </time>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="
        absolute inset-0 
        rounded-xl border-2 border-transparent
        group-hover:border-blue-100/50
        transition-colors duration-300
        pointer-events-none
      " />
    </article>
  )
}

/**
 * WishCard Skeleton Loading State
 */
function WishCardSkeleton({ className = '' }: { readonly className?: string }) {
  return (
    <div 
      className={`
        bg-white/60 backdrop-blur-sm
        border border-gray-200/30
        rounded-xl p-4 md:p-6
        animate-pulse
        ${className}
      `.trim()}
      aria-label="Loading wish..."
      aria-busy="true"
    >
      <div className="space-y-4">
        {/* Wish Message Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200/60 rounded-md w-full" />
          <div className="h-4 bg-gray-200/60 rounded-md w-5/6" />
          <div className="h-4 bg-gray-200/60 rounded-md w-4/6" />
        </div>

        {/* Author & Date Skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100/50">
          <div className="h-4 bg-gray-200/60 rounded-md w-1/3" />
          <div className="h-3 bg-gray-200/60 rounded-md w-16" />
        </div>
      </div>
    </div>
  )
}

/**
 * Format wish timestamp for display
 * 
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string
 */
function formatWishDate(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    // Show relative time for recent wishes
    if (diffInDays === 0) {
      return 'Today'
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else if (diffInDays < 30) {
      const weeksAgo = Math.floor(diffInDays / 7)
      return weeksAgo === 1 ? '1 week ago' : `${weeksAgo} weeks ago`
    }

    // For older wishes, show month and day
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  } catch (error) {
    console.warn('Error formatting wish date:', error)
    return 'Recently'
  }
}

export default WishCard