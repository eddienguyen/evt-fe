/**
 * Timeline Item Component
 *
 * Individual milestone display with responsive layouts and animations.
 *
 * @module components/timeline/TimelineItem
 */

import React, { useRef, useEffect } from "react";
import { type TimelineMilestone } from "../../config/timeline";
import {
  formatVietnameseDate,
  formatDateForScreenReader,
} from "../../lib/utils/date";
import { cn } from "../../lib/utils/cn";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../lib/a11y";
import CustomEase from "gsap/CustomEase";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export interface TimelineItemProps {
  /** Milestone data */
  milestone: TimelineMilestone;
  /** Item index for animation stagger */
  index: number;
  /** Layout variant */
  layout: "vertical" | "horizontal";
  /** Position for horizontal layout */
  position?: "left" | "right";
  /** Enable animations */
  enableAnimations?: boolean;
}

/**
 * Timeline Item Component
 *
 * Displays a single milestone with date, title, description, and optional image.
 * Supports vertical (mobile) and horizontal (desktop) layouts with GSAP animations.
 */
const TimelineItem: React.FC<TimelineItemProps> = ({
  milestone,
  index,
  layout,
  position = "left",
  enableAnimations = true,
}) => {
  const itemRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isVertical = layout === "vertical";
  const isImageLeft = position === "left";
  const shouldAnimate = enableAnimations && !prefersReducedMotion();

  // Category icon/badge
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "meeting":
        return "❤️";
      case "dating":
        return "💑";
      case "milestone":
        return "⭐";
      case "proposal":
        return "💍";
      case "wedding-prep":
        return "🎉";
      default:
        return "📅";
    }
  };

  useEffect(() => {
    if (!shouldAnimate || !itemRef.current) return;

    const item = itemRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (isVertical) {
      gsap.set(item, {
        opacity: 0,
        y: 80,
        scale: 0.9,
      });

      ScrollTrigger.create({
        trigger: item,
        start: "top 90%",
        onEnter: () => {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: CustomEase.create("custom", ".87, 0, .13, 1"),
          });
        },
        once: true,
        // Enable markers for debugging (remove in production)
        markers: false,
      });
    } else {
      if (image && content) {
        gsap.set(image, {
          x: isImageLeft ? -300 : 300,
          y: 200,
          opacity: 0,
          scale: 1.5,
        });
        gsap.set(content, {
          x: isImageLeft ? 300 : -300,
          y: 200,
          opacity: 0,
          scale: 1.5,
        });
        let tlImage = gsap.timeline();
        let tlText = gsap.timeline();

        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          onEnter: () => {
            tlImage
              .to(image, {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: CustomEase.create("custom", ".87, 0, .13, 1"),
              })
              .to(
                image,
                {
                  y: 0,
                  duration: 1.5,
                  ease: CustomEase.create("custom", ".87, 0, .13, 1"),
                },
                "-=0.8"
              ); // Overlap with previous animation

            tlText
              .to(content, {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay: 0.3,
                ease: CustomEase.create("custom", ".87, 0, .13, 1"),
              })
              .to(
                content,
                {
                  y: 0,
                  duration: 1.5,
                  ease: CustomEase.create("custom", ".87, 0, .13, 1"),
                },
                "-=0.8"
              ); // Overlap with previous animation
          },
          once: false,
          markers: false,
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === item) {
          trigger.kill();
        }
      });
    };
  }, [shouldAnimate, isVertical, isImageLeft]);

  return (
    <article
      ref={itemRef}
      className={cn(
        "timeline-item",
        isVertical ? "flex flex-col" : "grid grid-cols-2 gap-12 items-center",
        !isVertical && !isImageLeft && "direction-rtl"
      )}
      data-index={index}
      aria-labelledby={`milestone-${milestone.id}-title`}
    >
      {/* Desktop Layout: Image + Content Side by Side */}
      {!isVertical && (
        <>
          {/* Image Section */}
          <div
            ref={imageRef}
            className={cn(
              "timeline-image",
              isImageLeft ? "order-1" : "order-2"
            )}
          >
            {milestone.image && (
              <div
                className="w-full h-80 bg-gradient-to-br from-accent-gold/5 to-base-light rounded-lg overflow-hidden shadow-medium flex items-center justify-center"
                role="img"
                aria-label={milestone.image.alt}
              >
                {/* Placeholder for actual image */}
                <div className="text-center text-text-lighter p-8">
                  <div className="text-6xl mb-4">
                    {getCategoryIcon(milestone.category)}
                  </div>
                  <p className="text-sm font-medium">{milestone.image.alt}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div
            ref={contentRef}
            className={cn(
              "timeline-content",
              isImageLeft ? "order-2" : "order-1"
            )}
          >
            {/* Date Badge */}
            <div className="mb-6">
              <time
                dateTime={milestone.date}
                className="inline-block px-5 py-2 bg-accent-gold/10 text-accent-gold rounded-full text-sm font-semibold"
                aria-label={formatDateForScreenReader(milestone.date)}
              >
                {formatVietnameseDate(milestone.date)}
              </time>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-lg shadow-soft p-8 hover:shadow-medium transition-shadow duration-300">
              {/* Category Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-3xl"
                  role="img"
                  aria-label={milestone.category}
                >
                  {getCategoryIcon(milestone.category)}
                </span>
                {milestone.featured && (
                  <span className="px-3 py-1 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-wider rounded-full">
                    Đặc biệt
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                id={`milestone-${milestone.id}-title`}
                className="font-heading text-2xl md:text-3xl font-bold text-text mb-4"
              >
                {milestone.title}
              </h3>

              {/* Description */}
              <p className="text-text-light text-lg leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Mobile Layout: Vertical Stack */}
      {isVertical && (
        <>
          {/* Date Badge */}
          <div className="mb-4">
            <time
              dateTime={milestone.date}
              className="inline-block px-4 py-2 bg-accent-gold/10 text-accent-gold rounded-full text-sm font-semibold"
              aria-label={formatDateForScreenReader(milestone.date)}
            >
              {formatVietnameseDate(milestone.date)}
            </time>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow duration-300 mb-4">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-2xl"
                role="img"
                aria-label={milestone.category}
              >
                {getCategoryIcon(milestone.category)}
              </span>
              {milestone.featured && (
                <span className="px-2 py-1 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-wide rounded">
                  Đặc biệt
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              id={`milestone-${milestone.id}-title`}
              className="font-heading text-xl md:text-2xl font-semibold text-text mb-3"
            >
              {milestone.title}
            </h3>

            {/* Description */}
            <p className="text-text-light leading-relaxed">
              {milestone.description}
            </p>
          </div>

          {/* Image */}
          {milestone.image && (
            <div className="timeline-image w-full">
              <div
                className="w-full h-56 bg-gradient-to-br from-accent-gold/5 to-base-light rounded-lg overflow-hidden shadow-soft flex items-center justify-center"
                role="img"
                aria-label={milestone.image.alt}
              >
                {/* Placeholder for actual image */}
                <div className="text-center text-text-lighter p-6">
                  <div className="text-5xl mb-3">
                    {getCategoryIcon(milestone.category)}
                  </div>
                  <p className="text-sm">{milestone.image.alt}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
};

export default TimelineItem;
