// Add polaroid style to image
import React, { useState } from "react";
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
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      className={cn(
        "relative bg-base-light border rounded-md shadow-xl hover:shadow-2xl transition-shadow  cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-2 lg:p-4 ",
        className,
        text && "pb-7 lg:pb-20"
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      aria-label={
        alt ||
        (typeof image === "string"
          ? "Gallery image"
          : image.alt || "Gallery image")
      }
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-base-light animate-pulse" />
      )}

      {hasError ? (
        <div className="w-full h-56 md:h-64 lg:h-80 bg-base-light flex items-center justify-center">
          <div className="text-center text-text-lighter">
            <svg
              className="w-16 h-16 mx-auto mb-2 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-1.414 1.414M5.636 18.364l-1.414 1.414M6.05 6.05l1.414-1.414M17.95 17.95l1.414-1.414M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-text-lighter">Failed to load image</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={typeof image === "string" ? image : image.url}
            alt={alt || (typeof image === "string" ? "" : image.alt)}
            className={`object-cover w-full h-full rounded${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className="absolute inset-0 rounded shadow-[inset_0_0_4px_rgba(0,0,0,.3)]" />
        </div>
      )}
      {text && (
        <p className="absolute bottom-1 md:bottom-6 left-1/2 transform -translate-x-1/2 text-center md:text-3xl text-text-light italic font-handwritten">
          {text}
        </p>
      )}
    </div>
  );
}
ImagePolaroid.displayName = "ImagePolaroid";
