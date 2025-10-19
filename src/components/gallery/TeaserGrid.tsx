/**
 * Teaser Grid Component
 *
 * Grid layout component for displaying featured gallery images
 * with responsive masonry design and scroll animations.
 *
 * @module components/gallery/TeaserGrid
 */

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils/cn";
import { prefersReducedMotion } from "@/lib/a11y";
import TeaserImage from "./TeaserImage";
import type { GalleryImage } from "@/types/gallery";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export interface TeaserGridProps {
  /** Gallery images to display */
  images: GalleryImage[];
  /** Enable GSAP scroll animations */
  enableAnimations?: boolean;
  /** Image click handler */
  onImageClick: (imageId: string, index: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Generate random rotation class for polaroid effect
 */
const getRandomRotation = (index: number): string => {
  const rotations = [
    'rotate-[-2deg]',
    'rotate-[-1deg]', 
    'rotate-[0deg]',
    'rotate-[1deg]',
    'rotate-[2deg]',
  ]
  return rotations[index % rotations.length]
}

/**
 * Teaser Grid Component
 *
 * Displays featured gallery images in a responsive masonry layout with polaroid styling.
 * - Mobile: 1-2 columns (shows first 3 images)
 * - Desktop: 3 columns (shows all 6 images)
 *
 * @example
 * ```tsx
 * <TeaserGrid
 *   imageCount={6}
 *   enableAnimations={true}
 *   onImageClick={(id, index) => navigate('/gallery')}
 * />
 * ```
 */
const TeaserGrid: React.FC<TeaserGridProps> = ({
  images,
  enableAnimations = true,
  onImageClick,
  className,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  /**
   * Setup GSAP stagger animations for grid items
   */
  useEffect(() => {
    if (!enableAnimations || prefersReducedMotion()) return;

    const grid = gridRef.current;
    if (!grid) return;

    // Find all image items within the grid
    const imageItems = grid.querySelectorAll("[data-teaser-image]");
    if (imageItems.length === 0) return;

    // Create stagger animation
    gsap.fromTo(
      imageItems,
      {
        opacity: 0.1,
        y: 90,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "sine.inOut",
        stagger: 0.07,
        scrollTrigger: {
          trigger: grid,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === grid) {
          trigger.kill();
        }
      });
    };
  }, [enableAnimations, images.length]);

  if (images.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-text-lighter italic">
          Không có hình ảnh nào để hiển thị
        </p>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className={cn(
        // Masonry layout using CSS columns
        "columns-1 sm:columns-2 md:columns-3",
        // Gap between columns and items
        "gap-4 sm:gap-6",
        className
      )}
      role="grid"
      aria-label="Ảnh nổi bật từ album cưới"
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            // Break-inside-avoid for masonry effect
            "break-inside-avoid mb-4 sm:mb-6",
            // Hide images beyond 3rd on mobile
            index >= 3 && "hidden sm:block",
            // Add random rotation for polaroid effect
            getRandomRotation(index)
          )}
          role="gridcell"
        >
          <TeaserImage
            image={image}
            index={index}
            onClick={onImageClick}
            data-teaser-image // For GSAP animation targeting
          />
        </div>
      ))}
    </div>
  );
};

export default TeaserGrid;
