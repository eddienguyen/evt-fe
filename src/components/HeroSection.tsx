/**
 * Hero Section Component
 *
 * Content-only hero section that layers above the 3D background canvas.
 * Phase 4A: Refactored to remove 3D canvas (now in BackgroundCanvas component).
 *
 * @module components/HeroSection
 */

import React, { useEffect, useRef } from "react";
import { couple, events } from "../config/site";
import type { EventDetails } from "@/config/events";

/**
 * Props for the HeroSection component
 */
interface HeroSectionProps {
  eventID?: EventDetails["id"];
}

/**
 * Hero Section - Content Only
 *
 * Displays the hero content (couple names, event dates) that layers above
 * the global 3D background canvas. No longer manages 3D rendering.
 *
 * @example
 * ```tsx
 * // In Home.tsx
 * <HeroSection />
 * ```
 */
const HeroSection: React.FC<HeroSectionProps> = ({ eventID = "" }) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (!backgroundRef.current) return;
      const scrollY = window.scrollY;
      const parallaxSpeed = 0.5; // Adjust this value to control parallax intensity
      backgroundRef.current.style.transform = `translateY(${
        scrollY * parallaxSpeed
      }px)`;
      backgroundRef.current.style.opacity = `${0.3 - scrollY / 1000}`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative h-screen w-full flex items-start lg:items-center justify-center z-content overflow-hidden"
      aria-label="Hero section"
    >
      {/* Parallax Background Image - Full Screen */}
      <div
        ref={backgroundRef}
        className="fixed inset-0 w-full h-screen z-[-1] opacity-30"
        style={{
          backgroundImage: `url(${couple.heroImage || "/album/NAM_0526.jpeg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          willChange: "transform",
        }}
      >
        {/* <img
          src={couple.heroImage || '/album/NAM_0526.jpeg'}
          alt="Wedding background"
          className="w-full h-full object-cover opacity-30"
        /> */}
        {/* Gradient overlay to ensure content readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="text-center mix-blend-soft-light text-accent-white px-4 relative z-10">
        {/* Couple Names - Positioned to align with 3D text */}
        <div className="mb-32">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-4 opacity-0">
            {/* Hidden but present for SEO and accessibility */}
            <span className="sr-only">{couple.displayName}'s Wedding</span>
          </h1>
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <h5 className="text-8xl font-bold mb-2 px-6 py-3 rounded-lg font-handwritten text-white/80">
            <span className="inline-block mb-10 text-left pr-10 ">
              {couple.husbandShortName}
            </span>
            <span className="inline-block mx-2">&</span>
            <span className="inline-block text-right pl-10 mt-10 ">
              {couple.wifeShortName}
            </span>
          </h5>
          {/* <p className="text-xl md:text-2xl font-light tracking-wide opacity-90">
            {eventID === "hanoi" ? events.hanoi.dateDisplay + " • " + events.hanoi.locationShort : events.hue.dateDisplay + " • " + events.hue.locationShort}
          </p>
          <div className="w-16 h-px bg-accent-gold mx-auto"></div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
