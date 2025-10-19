import React from "react";
import { FamilyHouseCard } from "./FamilyHouseCard";
import { couple } from "../../config/site";
import type { FamilyInformationProps } from "../../types/family";

/**
 * FamilyInformation Component
 * 
 * Main section displaying family information for both households
 * with parent names following Vietnamese wedding tradition.
 * Positioned below the Couple Presentation section.
 */
export const FamilyInformation: React.FC<FamilyInformationProps> = ({
  enableAnimations = true,
  className = "",
  eventID = ""
}) => {
  return (
    <section
      aria-label="Family information"
      className={`bg-base py-12 md:py-16 lg:py-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-Column Grid Layout */}
        <div className={`grid grid-cols-2 gap-1 md:gap-12 lg:gap-16 ${eventID === "hue" ? "flex-row-reverse" : ""}`}>
          {/* Husband's Family - Nhà trai */}
          <FamilyHouseCard
            houseTitle="Nhà trai"
            fatherName={couple.husbandDad}
            motherName={couple.husbandMom}
            enableAnimations={enableAnimations}
            animationDelay={0}
            className={eventID === "hanoi" ? "order-1" : "order-2"}
          />

          {/* Wife's Family - Nhà gái */}
          <FamilyHouseCard
            houseTitle="Nhà gái"
            fatherName={couple.wifeDad}
            motherName={couple.wifeMom}
            enableAnimations={enableAnimations}
            animationDelay={150}
            className={eventID === "hue" ? "order-1" : "order-2"}
          />
        </div>
      </div>
    </section>
  );
};
