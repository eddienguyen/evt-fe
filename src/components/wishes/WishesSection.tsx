/**
 * WishesSection Component
 * 
 * Main wishes display section that orchestrates all wishes components.
 * Handles data fetching, loading states, and responsive display.
 * 
 * @module components/wishes/WishesSection
 */

import { useWishes } from './hooks'
import { WishesGrid } from './WishesGrid'
import { StackedWishCards } from './StackedWishCards'
import { WishesError } from './WishesError'
import type { UseWishesOptions } from './hooks'
import type { AnimationMode, StackedAnimationConfig } from '../../types/wishes'

export interface WishesSectionProps extends UseWishesOptions {
  /** Section title */
  readonly title?: string
  /** Section subtitle */
  readonly subtitle?: string
  /** Additional CSS classes */
  readonly className?: string
  /** Maximum number of wishes to display */
  readonly displayLimit?: number
  /** Animation mode: 'grid' (default) or 'stacked' */
  readonly animationMode?: AnimationMode
  /** Configuration for stacked animation (only used when animationMode='stacked') */
  readonly stackedConfig?: StackedAnimationConfig
}

/**
 * WishesSection Component
 * 
 * Complete wishes display section with loading, error, and success states.
 * Integrates with wishes service and provides responsive layout.
 * Supports both grid and stacked animation modes.
 * 
 * @param props - Component props
 * @returns Wishes section component
 * 
 * @example
 * ```tsx
 * // Grid mode (default)
 * <WishesSection 
 *   title="Latest Wishes"
 *   limit={9}
 *   venue="hue"
 *   className="my-12"
 * />
 * 
 * // Stacked animation mode
 * <WishesSection 
 *   title="Latest Wishes"
 *   limit={9}
 *   venue="hue"
 *   animationMode="stacked"
 *   stackedConfig={{ scale: 0.95, offset: 20 }}
 * />
 * ```
 */
export function WishesSection({
  title = "Lời chúc",
  subtitle = "Mọi người trao gửi gì về đám cưới chúng mình",
  className = '',
  displayLimit,
  limit = 9,
  venue,
  autoLoad = true,
  animationMode = 'grid',
  stackedConfig
}: WishesSectionProps) {
  const { 
    wishes, 
    isLoading, 
    error, 
    hasData,
    isRetrying,
    retry 
  } = useWishes({
    limit,
    venue,
    autoLoad
  })

  // Apply display limit if specified
  const displayWishes = displayLimit 
    ? wishes.slice(0, displayLimit)
    : wishes

  // Don't render section if no data and not loading
  if (!isLoading && !hasData && !error) {
    return null
  }

  return (
    <section className={`
      w-full
      ${className}
    `.trim()}>
      {/* Content Area */}
      <div className="w-full max-w-md mx-auto">
        {error ? (
          <>
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="
                text-3xl md:text-4xl font-bold 
                text-gray-800 
                mb-4
              ">
                {title}
              </h2>
              
              {subtitle && (
                <p className="
                  text-lg text-gray-600
                  max-w-2xl mx-auto
                  leading-relaxed
                ">
                  {subtitle}
                </p>
              )}
            </div>
            
            <WishesError 
              message={error}
              onRetry={retry}
              isRetrying={isRetrying}
            />
          </>
        ) : (
          <>
            {animationMode === 'stacked' ? (
              <StackedWishCards
                wishes={displayWishes}
                isLoading={isLoading}
                cardSpacing={stackedConfig?.cardSpacing}
                animationDuration={stackedConfig?.animationDuration}
                title={title}
                subtitle={subtitle}
              />
            ) : (
              <>
                {/* Section Header */}
                <div className="text-center mb-12">
                  <h2 className="
                    text-3xl md:text-4xl font-bold 
                    text-gray-800 
                    mb-4
                  ">
                    {title}
                  </h2>
                  
                  {subtitle && (
                    <p className="
                      text-lg text-gray-600
                      max-w-2xl mx-auto
                      leading-relaxed
                    ">
                      {subtitle}
                    </p>
                  )}
                </div>
                
                <WishesGrid 
                  wishes={displayWishes}
                  isLoading={isLoading}
                  skeletonCount={Math.min(limit, 6)}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Show More Link (Future Enhancement) */}
      {hasData && displayLimit && wishes.length > displayLimit && (
        <div className="text-center mt-8">
          <button className="
            inline-flex items-center
            text-blue-600 hover:text-blue-700
            font-medium text-sm
            transition-colors duration-200
          ">
            View all wishes
            <svg 
              className="ml-2 h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}

export default WishesSection