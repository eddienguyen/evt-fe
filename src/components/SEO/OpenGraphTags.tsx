/**
 * OpenGraphTags Component
 * 
 * Renders Open Graph meta tags for social media sharing
 * 
 * @module components/SEO/OpenGraphTags
 */

import { Helmet } from 'react-helmet-async';
import type { SEOData } from '../../types/seo';

interface OpenGraphTagsProps {
  data: SEOData;
  siteName: string;
}

/**
 * Open Graph tags component for Facebook, LinkedIn, WhatsApp
 */
export const OpenGraphTags = ({ data, siteName }: OpenGraphTagsProps) => {
  return (
    <Helmet>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={data.ogType || 'website'} />
      <meta property="og:url" content={data.ogUrl || data.canonical} />
      <meta property="og:title" content={data.ogTitle || data.title} />
      <meta property="og:description" content={data.ogDescription || data.description} />
      <meta property="og:image" content={data.ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Additional OG tags for better sharing */}
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={data.title} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={data.ogUrl || data.canonical} />
      <meta name="twitter:title" content={data.ogTitle || data.title} />
      <meta name="twitter:description" content={data.ogDescription || data.description} />
      <meta name="twitter:image" content={data.ogImage} />
    </Helmet>
  );
};
