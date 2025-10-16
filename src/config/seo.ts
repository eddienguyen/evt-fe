/**
 * SEO Configuration
 * 
 * Central SEO configuration including default metadata,
 * route-specific configurations, and structured data schemas.
 * 
 * @module config/seo
 */

import type { SEOConfig, SEOData, EventStructuredData, WebsiteStructuredData } from '../types/seo';
import { siteConfig } from './site';

/**
 * Main SEO Configuration
 */
export const seoConfig: SEOConfig = {
  siteName: siteConfig.meta.title,
  siteUrl: siteConfig.meta.url,
  defaultOGImage: `${siteConfig.meta.url}/og-image.jpg`,
  
  defaultSEO: {
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    keywords: [
      'wedding',
      'vietnam',
      'hue',
      'hanoi',
      'celebration',
      'ngoc quan',
      'wedding invitation',
      'wedding ceremony'
    ],
    ogTitle: siteConfig.meta.title,
    ogDescription: siteConfig.meta.description,
    ogImage: `${siteConfig.meta.url}/og-image.jpg`,
    ogUrl: siteConfig.meta.url,
    ogType: 'website',
    robots: 'index, follow',
    lang: 'en',
  },
};

/**
 * Route-specific SEO configurations
 */
export const routeSEO: Record<string, Partial<SEOData>> = {
  '/': {
    title: `${siteConfig.couple.displayName}'s Wedding`,
    description: `Join us in celebrating the wedding of ${siteConfig.couple.displayName} in ${siteConfig.events.hue.location} (${siteConfig.events.hue.dateDisplay}) and ${siteConfig.events.hanoi.location} (${siteConfig.events.hanoi.dateDisplay})`,
    ogType: 'website',
  },
  
  '/gallery': {
    title: `Wedding Gallery - ${siteConfig.meta.title}`,
    description: `Browse through our beautiful wedding photo collection featuring moments from ${siteConfig.couple.displayName}'s special day`,
    keywords: ['wedding photos', 'wedding gallery', 'wedding album', 'vietnam wedding'],
    ogType: 'website',
  },
  
  '/hn': {
    title: `You are invited!`,
    description: `Join ${siteConfig.couple.displayName} for their wedding celebration in ${siteConfig.events.hanoi.location} on ${siteConfig.events.hanoi.dateDisplay}`,
    keywords: ['hanoi wedding', 'wedding ceremony', 'vietnam wedding', 'wedding invitation'],
    ogType: 'event',
  },
  
  '/hue': {
    title: `You are invited!`,
    description: `Join ${siteConfig.couple.displayName} for their wedding celebration in ${siteConfig.events.hue.location} on ${siteConfig.events.hue.dateDisplay}`,
    keywords: ['hue wedding', 'wedding ceremony', 'vietnam wedding', 'wedding invitation'],
    ogType: 'event',
  },
  
  '/location': {
    title: `Wedding Locations - ${siteConfig.meta.title}`,
    description: `Find directions and details for ${siteConfig.couple.displayName}'s wedding venues in Hue and Hanoi, Vietnam`,
    keywords: ['wedding location', 'venue', 'directions', 'map'],
    ogType: 'website',
  },
};

/**
 * Generate Website Structured Data
 */
export const generateWebsiteSchema = (): WebsiteStructuredData => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.meta.title,
  url: siteConfig.meta.url,
  description: siteConfig.meta.description,
  inLanguage: "en",
});

/**
 * Generate Event Structured Data
 */
export const generateEventSchema = (venue: 'hue' | 'hanoi'): EventStructuredData => {
  const event = venue === 'hue' ? siteConfig.events.hue : siteConfig.events.hanoi;
  const locationName = venue === 'hue' ? 'Hue Wedding Venue' : 'Hanoi Wedding Venue';
  
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${siteConfig.couple.displayName}'s Wedding - ${event.locationShort}`,
    startDate: event.date,
    location: {
      "@type": "Place",
      name: locationName,
      address: event.location,
    },
    organizer: {
      "@type": "Person",
      name: siteConfig.couple.displayName,
    },
    description: `Wedding celebration for ${siteConfig.couple.displayName} in ${event.location}`,
    image: `${siteConfig.meta.url}/og-image.jpg`,
    url: `${siteConfig.meta.url}/${venue === 'hue' ? 'hue' : 'hn'}`,
  };
};

/**
 * Get SEO data for a specific route
 */
export const getRouteSpecificSEO = (pathname: string): Partial<SEOData> => {
  // Handle guest-specific routes (e.g., /hn/guest-id or /hue/guest-id)
  if (pathname.startsWith('/hn')) {
    return routeSEO['/hn'];
  }
  if (pathname.startsWith('/hue')) {
    return routeSEO['/hue'];
  }
  
  // Return exact route match or empty object
  return routeSEO[pathname] || {};
};
