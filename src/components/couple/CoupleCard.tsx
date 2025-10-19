import React, { useState } from "react";
import type { CoupleCardProps } from "../../types/couple";

/**
 * CoupleCard Component
 * 
 * Displays an individual card for either the bride or groom with their title and image.
 * Includes loading states, error handling, and hover interactions.
 */
export const CoupleCard: React.FC<CoupleCardProps> = ({
  title,
  imageSrc,
  imageAlt,
  enableAnimations = true,
  position,
}) => {
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
      className={`
        relative
        ${enableAnimations ? "animate-fade-in-up" : ""}
      `}
      style={{
        animationDelay: position === 'right' ? '200ms' : '0ms',
      }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 group">
        {/* Loading Skeleton */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-base-light animate-pulse" />
        )}

        {/* Error Fallback */}
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">Không thể tải ảnh</p>
            </div>
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={imageAlt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`
              w-full h-56 md:h-64 lg:h-80 object-cover
              transition-all duration-300
              group-hover:scale-105
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            loading="lazy"
          />
        )}
      </div>

      {/* Title - Now below the image */}
      <div className="mt-4 text-center">
        <h3 className="font-heading text-2xl md:text-3xl font-semibold text-text">
          {title}
        </h3>
      </div>
    </div>
  );
};
