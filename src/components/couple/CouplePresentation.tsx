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
  eventID = ""
}) => {
  return (
    <section
      aria-label="Couple presentation"
      className={`bg-base py-12 md:py-16 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric Diagonal Layout */}
        <div className={`relative flex ${eventID === "hue" ? "flex-row-reverse" : "flex-row"} gap-8 md:gap-16`}>
          <div className="w-1/2 ">
            <CoupleCard
              subTitle="Chú rể"
              title={couple.husband}
              imageSrc={couple.husbandImage}
              imageAlt={`${couple.husband} - Chú rể`}
              enableAnimations={enableAnimations}
              position={eventID === "hue" ? "right" : "left"}
              flow="normal"
            />
          </div>

          <div className="w-1/2 ">
            <CoupleCard
              title={couple.wife}
              subTitle="Cô dâu"
              imageSrc={couple.wifeImage}
              imageAlt={`${couple.wife} - Cô dâu`}
              enableAnimations={enableAnimations}
              position={eventID === "hue" ? "left" : "right"}
              flow="reverse"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
