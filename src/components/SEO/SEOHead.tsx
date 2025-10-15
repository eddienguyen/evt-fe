/**
 * SEOHead Component
 * 
 * Main SEO component that orchestrates all SEO-related components
 * 
 * @module components/SEO/SEOHead
 */

import { MetaTags } from './MetaTags';
import { OpenGraphTags } from './OpenGraphTags';
import { StructuredData } from './StructuredData';
import { FaviconLinks } from './FaviconLinks';
import { useSEO } from '../../hooks/useSEO';
import { seoConfig } from '../../config/seo';
import type { SEOData } from '../../types/seo';

interface SEOHeadProps {
  pageData?: Partial<SEOData>;
}

/**
 * Main SEO wrapper component
 * 
 * Integrates all SEO components and manages dynamic metadata
 * 
 * @example
 * ```tsx
 * <SEOHead pageData={{ title: 'Custom Title' }} />
 * ```
 */
export const SEOHead = ({ pageData }: SEOHeadProps) => {
  const { seoData, structuredData } = useSEO({ pageData });

  return (
    <>
      <MetaTags data={seoData} />
      <OpenGraphTags data={seoData} siteName={seoConfig.siteName} />
      <StructuredData data={structuredData} />
      <FaviconLinks />
    </>
  );
};
