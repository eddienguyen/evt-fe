import React from "react";
import type { FamilyHouseCardProps } from "../../types/family";

/**
 * FamilyHouseCard Component
 * 
 * Displays family information for one household (Nhà trai or Nhà gái)
 * with parent names and honorifics in Vietnamese tradition.
 */
export const FamilyHouseCard: React.FC<FamilyHouseCardProps> = ({
  houseTitle,
  fatherName,
  motherName,
  enableAnimations = true,
  animationDelay = 0,
}) => {
  const animationClass = enableAnimations ? "animate-fade-in-up" : "";
  const animationStyle = enableAnimations
    ? { animationDelay: `${animationDelay}ms` }
    : {};

  return (
    <div
      className={`
        bg-base-white 
        shadow-soft 
        hover:shadow-medium 
        transition-shadow 
        duration-300
        rounded-xl 
        p-6 md:p-8 lg:p-10
        text-center
        ${animationClass}
      `}
      style={animationStyle}
    >
      {/* House Title */}
      <h3 className="font-heading text-2xl md:text-3xl font-bold text-text mb-4 md:mb-6">
        {houseTitle}
      </h3>

      {/* Parents Names */}
      <div className="space-y-3 md:space-y-4">
        {/* Father */}
        <div className="flex flex-col items-center">
          <span className="font-body text-lg md:text-xl text-text-light">
            Ông
          </span>
          <span className="font-body text-xl md:text-2xl font-medium text-text mt-1">
            {fatherName}
          </span>
        </div>

        {/* Mother */}
        <div className="flex flex-col items-center">
          <span className="font-body text-lg md:text-xl text-text-light">
            Bà
          </span>
          <span className="font-body text-xl md:text-2xl font-medium text-text mt-1">
            {motherName}
          </span>
        </div>
      </div>
    </div>
  );
};
