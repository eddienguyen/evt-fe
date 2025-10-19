/**
 * Type definitions for Couple Presentation components
 */

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
}

export interface CoupleCardProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  enableAnimations?: boolean;
  position: 'left' | 'right';
}
