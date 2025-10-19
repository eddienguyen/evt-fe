import React, { useState } from "react";
import type { CoupleCardProps } from "../../types/couple";
import ImagePolaroid from "../gallery/ImagePolaroid";

/**
 * CoupleCard Component
 *
 * Displays an individual card for either the bride or groom with their title and image.
 * Includes loading states, error handling, and hover interactions.
 */
export const CoupleCard: React.FC<CoupleCardProps> = ({
  title,
  subTitle,
  imageSrc,
  imageAlt,
  enableAnimations = true,
  position,
  flow = "normal",
}) => {
  return (
    <div
      className={`
        relative
        ${enableAnimations ? "animate-fade-in-up" : ""}
      `}
      style={{
        animationDelay: position === "right" ? "200ms" : "0ms",
      }}
    >
      <div
        className={`wrapper flex flex-col items-center ${
          flow === "reverse" ? "flex-col-reverse" : "flex-col"
        }`}
      >
        {/* Image Container */}
        <div className={`relative w-full overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group ${position=== "right" ? "rotate-2" : "-rotate-2"}`}>
          <ImagePolaroid
            image={imageSrc}
            alt={imageAlt}
            className={`
              w-full h-auto object-cover
              transition-all duration-300
            `}
            text={title}
          />
        </div>

        {/* Title - Now below the image */}
        <div className={`text-center ${flow === "reverse" ? "mb-6 md:mb-10" : "mt-6 md:mt-10"}`}>
          <h3 className="font-heading text-md md:text-4xl font-rose text-text font-light">
            {subTitle}
          </h3>
        </div>
      </div>
    </div>
  );
};
