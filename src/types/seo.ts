/**
 * SEO Type Definitions
 * 
 * Type definitions for SEO metadata and configuration
 * 
 * @module types/seo
 */

export interface SEOData {
  // Page-specific metadata
  title: string;
  description: string;
  keywords?: string[];
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'event';
  
  // Additional metadata
  canonical?: string;
  robots?: string;
  lang?: string;
}

export interface SEOConfig {
  defaultSEO: SEOData;
  siteName: string;
  siteUrl: string;
  defaultOGImage: string;
}

export interface EventStructuredData {
  "@context": "https://schema.org";
  "@type": "Event";
  name: string;
  startDate: string;
  endDate?: string;
  location: {
    "@type": "Place";
    name: string;
    address: string;
  };
  organizer: {
    "@type": "Person";
    name: string;
  };
  description: string;
  image?: string;
  url?: string;
}

export interface WebsiteStructuredData {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  inLanguage: string;
}

export type StructuredDataType = EventStructuredData | WebsiteStructuredData;
