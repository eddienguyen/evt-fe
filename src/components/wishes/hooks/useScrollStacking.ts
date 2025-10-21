/**
 * useScrollStacking Hook
 *
 * Manages scroll-triggered stacking animation for wish cards using GSAP ScrollTrigger.
 * Handles animation initialization, progress tracking, and cleanup.
 *
 * @module components/wishes/hooks/useScrollStacking
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { gsap, ScrollTrigger } from "../../../utils/gsap";
import type { WishItem } from "../../../types/wishes";

export interface StackingAnimationOptions {
  /** Enable/disable animation */
  enabled: boolean;
  /** Spacing between stacked cards in pixels */
  cardSpacing: number;
  /** Animation duration in seconds */
  animationDuration: number;
  /** GSAP easing function */
  easingFunction: string;
  /** Whether reduced motion is preferred */
  reducedMotion: boolean;
}

export interface StackingState {
  /** Whether animation is initialized */
  isInitialized: boolean;
  /** Currently active card index */
  activeCardIndex: number;
  /** Scroll progress (0-1) */
  scrollProgress: number;
}

export interface UseScrollStackingReturn {
  /** Animation state */
  state: StackingState;
  /** Container ref to attach to stacked container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Card refs array for individual card animations */
  cardRefs: Array<{ current: HTMLDivElement | null }>;
  /** Initialize stacking animation */
  initializeStacking: () => void;
  /** Cleanup animation resources */
  cleanup: () => void;
}

const DEFAULT_OPTIONS: StackingAnimationOptions = {
  enabled: true,
  cardSpacing: 24,
  animationDuration: 0.6,
  easingFunction: "power2.out",
  reducedMotion: false,
};

/**
 * useScrollStacking Hook
 *
 * Manages GSAP-based scroll stacking animation for wish cards.
 *
 * @param wishes - Array of wish items to animate
 * @param options - Animation configuration options
 * @returns Stacking animation state and controls
 *
 * @example
 * ```tsx
 * const { containerRef, cardRefs, state } = useScrollStacking(wishes, {
 *   enabled: true,
 *   cardSpacing: 32,
 *   reducedMotion: false
 * })
 *
 * return (
 *   <div ref={containerRef}>
 *     {wishes.map((wish, index) => (
 *       <div key={wish.id} ref={cardRefs[index]}>
 *         <WishCard wish={wish} />
 *       </div>
 *     ))}
 *   </div>
 * )
 * ```
 */
export function useScrollStacking(
  wishes: WishItem[],
  options: Partial<StackingAnimationOptions> = {}
): UseScrollStackingReturn {
  // Merge options with defaults (memoized to prevent infinite loops)
  const enabled = options.enabled ?? DEFAULT_OPTIONS.enabled;
  const cardSpacing = options.cardSpacing ?? DEFAULT_OPTIONS.cardSpacing;
  const reducedMotion = options.reducedMotion ?? DEFAULT_OPTIONS.reducedMotion;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const sectionScrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const cardScrollTriggersRef = useRef<ScrollTrigger[]>([]);

  // Create refs array for cards
  const cardRefsArray = useRef<Array<{ current: HTMLDivElement | null }>>(
    wishes.map(() => ({ current: null }))
  );

  // Update refs array when wishes length changes
  useEffect(() => {
    const newRefs: Array<{ current: HTMLDivElement | null }> = [];
    for (let i = 0; i < wishes.length; i++) {
      newRefs.push(cardRefsArray.current[i] || { current: null });
    }
    cardRefsArray.current = newRefs;
  }, [wishes.length]);

  const [state, setState] = useState<StackingState>({
    isInitialized: false,
    activeCardIndex: 0,
    scrollProgress: 0,
  });

  const cleanup = useCallback(() => {
    // Kill section-level ScrollTrigger
    if (sectionScrollTriggerRef.current) {
      sectionScrollTriggerRef.current.kill();
      sectionScrollTriggerRef.current = null;
    }
    
    // Kill all card-level ScrollTriggers
    for (const trigger of cardScrollTriggersRef.current) {
      trigger.kill();
    }
    cardScrollTriggersRef.current = [];
    
    // Kill main ScrollTrigger (if any)
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    
    setState({
      isInitialized: false,
      activeCardIndex: 0,
      scrollProgress: 0,
    });
  }, []);

  const initializeStacking = useCallback(() => {
    if (!enabled || reducedMotion || wishes.length === 0) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Cleanup existing animation
    cleanup();

    // Clear previous card triggers
    cardScrollTriggersRef.current = [];

    // // Pin the entire section (including title) when it reaches the top
    // sectionScrollTriggerRef.current = ScrollTrigger.create({
    //   trigger: container,
    //   markers: true,
    //   start: "top 25%",
    //   end: () => {
    //     // Calculate total scroll distance needed for all cards to stack
    //     const lastCard = cardRefsArray.current[wishes.length - 1]?.current;
    //     if (!lastCard) return "+=1000";
        
    //     const lastCardRect = lastCard.getBoundingClientRect();
    //     const containerRect = container.getBoundingClientRect();
    //     const distanceToLastCard = lastCardRect.bottom - containerRect.top;
        
    //     // Add extra space for the stacking effect
    //     return `+=${distanceToLastCard + (wishes.length * cardSpacing)}`;
    //   },
    //   pin: true,
    //   pinSpacing: true,
    // });

    // Setup initial z-index for proper stacking order
    for (let index = 0; index < cardRefsArray.current.length; index++) {
      const ref = cardRefsArray.current[index];
      if (ref?.current) {
        gsap.set(ref.current, {
          zIndex: index,
        });
      }
    }

    // Create reference point for the last card
    const lastCardST = ScrollTrigger.create({
      trigger: cardRefsArray.current[wishes.length - 1].current,
      start: "bottom bottom",
    });

    // Pin each card individually as it reaches center of viewport (within the pinned section)
    for (let index = 0; index < cardRefsArray.current.length; index++) {
      const ref = cardRefsArray.current[index];
      if (ref?.current) {
        const cardTrigger = ScrollTrigger.create({
          trigger: ref.current,
          start: "top 25%",
          end: () => lastCardST.start + index * cardSpacing,
          pin: true,
          pinSpacing: false,
          toggleActions: "restart none none reverse",
          onUpdate: () => {
            // Once this card is scrolled to top, update opacity of previous cards to 0
            setState((prev) => ({
              ...prev,
              activeCardIndex: index,
              scrollProgress: cardTrigger.progress,
            }));
            for (let j = 0; j < index; j++) {
              const prevRef = cardRefsArray.current[j];
              if (prevRef?.current) {
                gsap.to(prevRef.current, {
                  opacity: 0,
                  duration: 0.3,
                  ease: "power1.out",
                });
              }
            }
            // Restore opacity of subsequent cards
            for (let k = index; k < cardRefsArray.current.length; k++) {
              const nextRef = cardRefsArray.current[k];
              if (nextRef?.current) {
                gsap.to(nextRef.current, {
                  opacity: 1,
                  duration: 0.3,
                  ease: "power1.out",
                });
              }
            }
          }
        });
        cardScrollTriggersRef.current.push(cardTrigger);
      }
    }

    setState((prev) => ({ ...prev, isInitialized: true }));
  }, [wishes.length, enabled, reducedMotion, cardSpacing, cleanup]);

  // Initialize animation on mount and when dependencies change
  useEffect(() => {
    if (enabled && !reducedMotion && wishes.length > 0) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(initializeStacking, 100);
      return () => {
        clearTimeout(timeoutId);
        cleanup();
      };
    }
    return cleanup;
  }, [enabled, reducedMotion, cardSpacing, wishes.length, initializeStacking, cleanup]);

  return {
    state,
    containerRef,
    cardRefs: cardRefsArray.current,
    initializeStacking,
    cleanup,
  };
}

export default useScrollStacking;
