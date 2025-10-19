/**
 * Type definitions for Couple Presentation components
 */

import type { EventDetails } from "@/config/events";

export interface CoupleImage {
  src: string;
  alt: string;
  isLoaded: boolean;
  hasError: boolean;
}

export interface CoupleData {
  husband: {
    name: string;
    title: string; // "Chú rể"
    image: CoupleImage;
  };
  wife: {
    name: string;
    title: string; // "Cô dâu"
    image: CoupleImage;
  };
}

export interface CoupleComponentProps {
  enableAnimations?: boolean;
  lazyLoad?: boolean;
  className?: string;
  eventID?: EventDetails["id"];
}

export interface CoupleCardProps {
  subTitle: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  enableAnimations?: boolean;
  position: 'left' | 'right';
  flow: "normal" | "reverse";
  
}
