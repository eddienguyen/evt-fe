/**
 * Mobile RSVP Section Component
 *
 * Displays the RSVP panel inline on mobile devices (below GalleryTeaser).
 * On desktop, this component is hidden (floating FAB is used instead).
 *
 * @module components/MobileRSVPSection
 */

import React from "react";
import { Gift } from "lucide-react";
import RSVPPanel from "./RSVPPanel";
import { Button } from "./ui/Button";

/**
 * Mobile RSVP Section Props
 */
export interface MobileRSVPSectionProps {
  /** Additional CSS classes */
  className?: string;
  /** Callback to open gift panel */
  onOpenGift?: () => void;
}

/**
 * Mobile RSVP Section Component
 *
 * Wrapper for RSVPPanel that displays inline on mobile devices.
 * Hidden on desktop (≥768px) where floating FAB is used.
 *
 * @example
 * ```tsx
 * // In Hue.tsx / HN.tsx after GalleryTeaser
 * <MobileRSVPSection onOpenGift={() => setActivePanel('gift')} />
 * ```
 */
const MobileRSVPSection: React.FC<MobileRSVPSectionProps> = ({
  className = "",
  onOpenGift,
}) => {
  // No-op close handler since panel is always "open" in inline mode
  const handleClose = () => {
    // Panel is inline, no closing action needed
  };

  return (
    <section
      className={`md:hidden bg-warm-50 py-8 ${className}`}
      aria-label="RSVP Form Section"
    >
      <div className="container mx-auto px-4">
        {/* Panel displayed inline without backdrop/overlay */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
          <RSVPPanel isOpen={true} onClose={handleClose} inline={true} />

          {/* Gift Panel Trigger Button */}
          {onOpenGift && (
            <div className="p-6 border-t border-base-medium bg-base-light">
              <Button
                variant="outline"
                size="lg"
                onClick={onOpenGift}
                className="w-full flex items-center justify-center gap-2 hover:bg-accent-gold/10 hover:border-accent-gold transition-colors"
              >
                <span className="font-medium">Gửi quà cưới</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MobileRSVPSection;
