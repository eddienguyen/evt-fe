import React from "react";
import { CoupleCard } from "./CoupleCard";
import { couple } from "../../config/site";
import type { CoupleComponentProps } from "../../types/couple";

/**
 * CouplePresentation Component
 * 
 * Main presentation section showing the bride and groom with their Vietnamese titles.
 * Features an asymmetric layout on desktop that adapts responsively to mobile.
 */
export const CouplePresentation: React.FC<CoupleComponentProps> = ({
  enableAnimations = true,
  className = "",
}) => {
  return (
    <section
      aria-label="Couple presentation"
      className={`bg-base py-12 md:py-16 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric Diagonal Layout */}
        <div className="relative">
          {/* Groom Card - Top Left */}
          <div className="w-full md:w-3/5 lg:w-1/2 md:ml-0 mb-8 md:mb-0">
            <CoupleCard
              title="Chú rể"
              imageSrc={couple.husbandImage}
              imageAlt={`${couple.husband} - Chú rể`}
              enableAnimations={enableAnimations}
              position="left"
            />
          </div>

          {/* Bride Card - Bottom Right (overlapping slightly on larger screens) */}
          <div className="w-full md:w-3/5 lg:w-1/2 md:ml-auto md:mt-12 lg:mt-16">
            <CoupleCard
              title="Cô dâu"
              imageSrc={couple.wifeImage}
              imageAlt={`${couple.wife} - Cô dâu`}
              enableAnimations={enableAnimations}
              position="right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
