/**
 * Wishes Components Barrel Export
 * 
 * Centralizes exports for all wishes-related components and hooks.
 * Provides clean import paths for consumers.
 * 
 * @module components/wishes
 */

// Main Components
export { WishesSection, type WishesSectionProps } from './WishesSection'
export { WishesGrid, type WishesGridProps } from './WishesGrid'
export { WishCard, type WishCardProps } from './WishCard'
export { WishesError, type WishesErrorProps } from './WishesError'
export { StackedWishCards, type StackedWishCardsProps } from './StackedWishCards'

// Hooks
export { useWishes, type UseWishesOptions, type UseWishesReturn } from './hooks'

// Default Export
export { default } from './WishesSection'