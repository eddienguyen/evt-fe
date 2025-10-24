/**
 * StackedWishCards Component
 * 
 * Container component that manages scroll-triggered stacking animation for wish cards.
 * Uses GSAP ScrollTrigger for performance-optimized scroll animations.
 * 
 * @module components/wishes/StackedWishCards
 */

import type { WishItem } from '../../types/wishes'
import { WishCard } from './WishCard'
import { useScrollStacking, useReducedMotion } from './hooks'

export interface StackedWishCardsProps {
  /** Array of wishes to display */
  readonly wishes: WishItem[]
  /** Additional CSS classes */
  readonly className?: string
  /** Card spacing in pixels */
  readonly cardSpacing?: number
  /** Animation duration in seconds */
  readonly animationDuration?: number
  /** Loading state */
  readonly isLoading?: boolean
  /** Section title (optional - will be included in pinned area) */
  readonly title?: string
  /** Section subtitle (optional - will be included in pinned area) */
  readonly subtitle?: string
}

/**
 * StackedWishCards Component
 * 
 * Displays wish cards with scroll-triggered stacking animation.
 * Respects reduced motion preferences and provides fallback.
 * 
 * @param props - Component props
 * @returns Stacked wish cards component
 * 
 * @example
 * ```tsx
 * <StackedWishCards 
 *   wishes={wishesData}
 *   cardSpacing={32}
 *   animationDuration={0.6}
 * />
 * ```
 */
export function StackedWishCards({
  wishes,
  className = '',
  cardSpacing = 24,
  animationDuration = 0.6,
  isLoading = false,
  title,
  subtitle,
}: StackedWishCardsProps) {
  const prefersReducedMotion = useReducedMotion()
  
  const { containerRef, cardRefs } = useScrollStacking(wishes, {
    enabled: !isLoading && wishes.length > 0,
    cardSpacing,
    animationDuration,
    easingFunction: 'power2.out',
    reducedMotion: prefersReducedMotion,
  })

  // Handle loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`.trim()}>
        {[0, 1, 2].map((skeletonId) => (
          <WishCard
            key={`skeleton-stacked-${skeletonId}`}
            wish={{
              id: `skeleton-${skeletonId}`,
              name: '',
              wishes: '',
              createdAt: '',
            }}
            isLoading={true}
          />
        ))}
      </div>
    )
  }

  // Handle empty state
  if (wishes.length === 0) {
    return null
  }

  // If reduced motion is preferred, use simple stacked layout without animation
  if (prefersReducedMotion) {
    return (
      <div className={`space-y-6 ${className}`.trim()}>
        {wishes.map((wish) => (
          <WishCard key={wish.id} wish={wish} />
        ))}
      </div>
    )
  }

  // Render animated stacked cards
  return (
    <div
      ref={containerRef}
      id="stacked-wish-cards-container"
      className={`relative ${className}`.trim()}
      style={{
        minHeight: `${wishes.length * cardSpacing * 2}px`,
      }}
    >
      {/* Section Header - will be pinned along with cards */}
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="
              text-3xl md:text-4xl font-bold 
              text-gray-800 
              mb-4
            ">
              {title}
            </h2>
          )}
          
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
      )}
      
      {/* Stacked Cards */}
      {wishes.map((wish, index) => (
        <div
          key={wish.id}
          ref={(el) => {
            if (cardRefs[index]) {
              cardRefs[index].current = el
            }
          }}
          className="will-change-transform mb-2"
        >
          <WishCard wish={wish} />
        </div>
      ))}
    </div>
  )
}

export default StackedWishCards
