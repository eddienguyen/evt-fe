import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SEOHead } from "../components/SEO";
import { StoryTimeline } from "../components/timeline";
import { EventDetailsSection } from "../components/events";
import { CountdownTimer } from "../components/countdown";
import { CouplePresentation } from "../components/couple";
import { FamilyInformation } from "../components/family";
import { eventsConfig } from "../config/events";
import { useGuest } from "../contexts/GuestContext";
import figure from "../public/HN-invitation.jpg";
import HeroSection from "@/components/HeroSection";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import Gallery from "./Gallery";
import { GalleryTeaser } from "@/components/gallery";
import MobileRSVPSection from "@/components/MobileRSVPSection";
import GiftPanel from "@/components/GiftPanel";
import { BANK_DETAILS_LIST } from "@/lib/constants/gift";

const HN: React.FC = () => {
  const { guestId } = useParams<{ guestId?: string }>();
  const { guest, isLoading, error, fetchGuest } = useGuest();
  const [showGiftPanel, setShowGiftPanel] = useState(false);

  useEffect(() => {
    if (guestId) {
      fetchGuest(guestId);
    }
  }, [guestId, fetchGuest]);

  // Determine which image to use: guest's custom image or default
  // const invitationImage = guest?.invitationImageMainUrl || figure;

  return (
    <>
      <SEOHead />
      <HeroSection eventID="hanoi" />
      <BackgroundCanvas />
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen bg-base">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-light">Đang tải thông tin...</p>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading */}
      {!isLoading && (
        <>
          {/* Couple Presentation Section */}
          <CouplePresentation enableAnimations={true} eventID="hanoi" />

          {/* Family Information Section */}
          <FamilyInformation enableAnimations={true} eventID="hanoi"/>

          {/* Wedding Invitation Banner - Personalized if guest data available */}
          <section aria-label="Wedding invitation" className="bg-base">
            {guest && (
              <div className="relative z-10 py-4 text-center">
                <p className="text-lg md:text-xl font-medium text-text">
                  Kính mời{" "}
                  <span className="font-bold text-primary">{guest.name}</span>
                </p>
                {guest.secondaryNote && (
                  <p className="text-sm text-text-light mt-1">
                    {guest.secondaryNote}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Event Details Section */}
          <EventDetailsSection enableAnimations={true} eventID="hanoi" />

          {/* Countdown Timer Section */}
          <CountdownTimer
            targetDate={eventsConfig.hanoi.date}
            eventName="Tiệc cưới Hà Nội"
            eventLocation="Hà Nội"
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
                  bankAccounts={[BANK_DETAILS_LIST[0]]}
                />
              </div>
            </div>
          )}

          <GalleryTeaser enableAnimations={true} />

          {/* Placeholder: Location & Directions */}
          {/* <section
            className="container mx-auto px-4 py-16 bg-base-light"
            aria-labelledby="hanoi-location-heading"
          >
            <div className="text-center max-w-4xl mx-auto">
              <h2
                id="hanoi-location-heading"
                className="font-heading text-3xl md:text-4xl font-bold text-text mb-6"
              >
                🗺️ Địa điểm & Đường đi
              </h2>
              <p className="text-text-light text-lg mb-8">
                Thông tin chi tiết về địa điểm tổ chức và cách di chuyển
              </p>
              <div className="bg-white rounded-lg shadow-soft p-8">
                <p className="text-text-lighter italic">
                  Bản đồ và hướng dẫn đến địa điểm sẽ hiển thị tại đây
                </p>
                <p className="text-sm text-text-lighter mt-2">
                  Location Map section - Coming in Story #20
                </p>
              </div>
            </div>
          </section> */}
        </>
      )}

      {/* Error State - Still show page but without personalization */}
      {error && !isLoading ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Không thể tải thông tin khách mời.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <></>
        // <img
        //   src={invitationImage}
        //   alt="Wedding invitation card for Ngọc & Quân's ceremony in Hanoi, Vietnam on November 8th, 2025"
        //   className="w-full h-auto relative z-1"
        // />
      )}
    </>
  );
};

export default HN;
