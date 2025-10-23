import React, { useState } from "react";
import { SEOHead } from "../components/SEO";
import HeroSection from "../components/HeroSection";
import { StoryTimeline } from "../components/timeline";
import { EventDetailsSection } from "../components/events";
import { CountdownTimer } from "../components/countdown";
import { GalleryTeaser } from "../components/gallery";
import { eventsConfig } from "../config/events";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import MobileRSVPSection from "@/components/MobileRSVPSection";
import GiftPanel from "@/components/GiftPanel";
import { BANK_DETAILS_LIST } from "@/lib/constants/gift";
import { WishesSection } from "@/components/wishes";
import { CouplePresentation } from "@/components/couple/CouplePresentation";
import { FamilyInformation } from "@/components/family";

const Home: React.FC = () => {
  const [showGiftPanel, setShowGiftPanel] = useState(false);

  return (
    <>
      <SEOHead />
      <HeroSection />
      <BackgroundCanvas />

      <CouplePresentation enableAnimations={true} eventID="hue" />

      <FamilyInformation enableAnimations={true} />

      {/* Event Details Section */}
      <EventDetailsSection enableAnimations={true} />

      {/* Countdown Timer Section */}
      <CountdownTimer
        targetDate={eventsConfig.hue.date}
        eventName="Đám cưới Ngọc & Quân"
        eventLocation="Huế"
        enableAnimations={true}
      />

      {/* Story Timeline Section */}
      {/* <StoryTimeline enableAnimations={true} /> */}

      {/* Mobile-only RSVP section with gift trigger button */}
      <MobileRSVPSection onOpenGift={() => setShowGiftPanel(true)} />

      {/* Gift Panel - Slide-over on mobile (triggered by button) */}
      {showGiftPanel && (
        <div className="md:hidden fixed inset-0 z-modal">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowGiftPanel(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <GiftPanel
              isOpen={true}
              onClose={() => setShowGiftPanel(false)}
              inline={false}
              bankAccounts={BANK_DETAILS_LIST}
            />
          </div>
        </div>
      )}

      {/* Latest Wishes Section */}
      <section className="container mx-auto px-4 py-16 bg-base-light">
        <WishesSection limit={9} animationMode="stacked" className="" />
      </section>

      {/* Gallery Teaser Section */}
      <GalleryTeaser imageCount={6} enableAnimations={true} />
    </>
  );
};

export default Home;
