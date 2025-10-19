/**
 * Site Configuration
 * 
 * Central configuration file for all site-wide metadata including
 * couple names, event information, and SEO data.
 * 
 * @module config/site
 */

export interface SiteConfig {
  // Couple Information
  couple: {
    full: string;           // "Ngọc & Quân"
    displayName: string;    // For headings/titles
    husband: string;        // "Quân"
    wife: string;          // "Ngọc"
    husbandImage: string;  // Path to husband's image
    wifeImage: string;     // Path to wife's image
    husbandMom: string;    // Mother's name for Family Information Section
    husbandDad: string;    // Father's name for Family Information Section
    wifeMom: string;       // Mother's name for Family Information Section
    wifeDad: string;       // Father's name for Family Information Section
    heroImage?: string;   // Optional hero image for couple section
  };

  // Event Information
  events: {
    hue: {
      date: string;
      dateDisplay: string;
      location: string;
      locationShort: string;
    };
    hanoi: {
      date: string;
      dateDisplay: string;
      location: string;
      locationShort: string;
    };
  };

  // Metadata
  meta: {
    title: string;
    description: string;
    url: string;
    ogImage?: string;
  };

  // Copyright
  copyright: {
    year: number;
    text: string;
  };
}

export const siteConfig: SiteConfig = {
  couple: {
    full: "Ngọc & Quân",
    displayName: "Ngọc & Quân",
    husband: "Hoàng Quân",
    wife: "Kim Ngọc",
    heroImage: "/album/NAM_0526.jpeg",
    husbandImage: "/album/NAM_0059.jpeg",
    wifeImage: "/album/NAM_9659.jpeg",
    husbandMom: "Nguyễn Thanh Vân",
    husbandDad: "Nguyễn Thanh Phú ",
    wifeMom: "Lê Thị Kim Anh",
    wifeDad: "Đinh Viết Phúc"
  },

  events: {
    hue: {
      date: "2025-11-01",
      dateDisplay: "November 1st, 2025",
      location: "Hue, Vietnam",
      locationShort: "Huế",
    },
    hanoi: {
      date: "2025-11-08",
      dateDisplay: "November 8th, 2025",
      location: "Hanoi, Vietnam",
      locationShort: "Hà Nội",
    },
  },

  meta: {
    title: "Ngoc Quan's Wedding",
    description: "Join us in celebrating our wedding in Hue (Nov 1st) and Hanoi (Nov 8th), 2025",
    url: "https://ngocquanwd.com",
    ogImage: "/og-image.jpg",
  },

  copyright: {
    year: new Date().getFullYear(),
    text: "Ngọc & Quân marriage",
  },
};

// Convenience exports for common use cases
export const { couple, events, meta, copyright } = siteConfig;
