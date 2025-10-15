/**
 * useSEO Hook
 * 
 * Custom hook for managing dynamic SEO metadata based on current route
 * 
 * @module hooks/useSEO
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { SEOData, StructuredDataType } from '../types/seo';
import { seoConfig, getRouteSpecificSEO, generateWebsiteSchema, generateEventSchema } from '../config/seo';

interface UseSEOOptions {
  pageData?: Partial<SEOData>;
}

interface UseSEOReturn {
  seoData: SEOData;
  structuredData: StructuredDataType | null;
}

/**
 * Hook to get SEO data for current route
 * 
 * @param options - Optional page-specific SEO overrides
 * @returns SEO data and structured data for the current page
 * 
 * @example
 * ```tsx
 * const { seoData, structuredData } = useSEO({
 *   pageData: {
 *     title: 'Custom Page Title',
 *     description: 'Custom description'
 *   }
 * });
 * ```
 */
export const useSEO = (options?: UseSEOOptions): UseSEOReturn => {
  const location = useLocation();
  const { pageData } = options || {};

  // Compute SEO data with priority: pageData > routeData > defaultData
  const seoData = useMemo((): SEOData => {
    const defaultData = seoConfig.defaultSEO;
    const routeData = getRouteSpecificSEO(location.pathname);
    
    const merged = {
      ...defaultData,
      ...routeData,
      ...pageData,
      canonical: `${seoConfig.siteUrl}${location.pathname}`,
    };

    // Ensure OG fields are populated
    merged.ogTitle = merged.ogTitle || merged.title;
    merged.ogDescription = merged.ogDescription || merged.description;
    merged.ogUrl = merged.ogUrl || merged.canonical;
    merged.ogImage = merged.ogImage || seoConfig.defaultOGImage;

    return merged;
  }, [location.pathname, pageData]);

  // Generate structured data based on route
  const structuredData = useMemo((): StructuredDataType | null => {
    const pathname = location.pathname;

    // Home page - Website schema
    if (pathname === '/') {
      return generateWebsiteSchema();
    }

    // Event pages - Event schema
    if (pathname.startsWith('/hn')) {
      return generateEventSchema('hanoi');
    }

    if (pathname.startsWith('/hue')) {
      return generateEventSchema('hue');
    }

    // Other pages - no specific structured data
    return null;
  }, [location.pathname]);

  return {
    seoData,
    structuredData,
  };
};
