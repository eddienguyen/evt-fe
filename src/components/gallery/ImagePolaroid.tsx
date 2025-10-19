// Add polaroid style to image
import React from "react";
import { cn } from "@/lib/utils/cn";
import type { GalleryImage } from "@/types/gallery";

export interface ImagePolaroidProps {
  /** Gallery image data */
  image: string | GalleryImage;
  /** Additional CSS classes */
  className?: string;
  /** Image alt text override */
  alt?: string;
  text?: string;
  /** onClick handler */
  onClick?: () => void;
}

/**
 * Image Polaroid Component
 *
 * Displays an image with polaroid-style border and shadow.
 * Can be clicked to trigger an action (e.g., open lightbox).
 *
 * @example
 * ```tsx
 * <ImagePolaroid
 *   image={galleryImage}
 *   onClick={() => openLightbox(index)}
 * />
 * ```
 */
export default function ImagePolaroid({
  image,
  className,
  alt,
  text,
  onClick,
}: ImagePolaroidProps): React.ReactElement {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cn(
        "relative bg-white border shadow-xl hover:shadow-2xl transition-shadow p-8 pb-20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      aria-label={alt || (typeof image === "string" ? "Gallery image" : image.alt || "Gallery image")}
    >
      <img
        src={typeof image === "string" ? image : image.url}
        alt={alt || (typeof image === "string" ? "" : image.alt)}
        className="object-cover w-full h-full"
      />

      {text && (
        <p className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-sm text-text-light">
          {text}
        </p>
      )}
    </div>
  );
}
ImagePolaroid.displayName = "ImagePolaroid";
