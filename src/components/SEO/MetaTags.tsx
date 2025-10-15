/**
 * MetaTags Component
 * 
 * Renders base HTML meta tags for SEO
 * 
 * @module components/SEO/MetaTags
 */

import { Helmet } from 'react-helmet-async';
import type { SEOData } from '../../types/seo';

interface MetaTagsProps {
  data: SEOData;
}

/**
 * Base meta tags component
 */
export const MetaTags = ({ data }: MetaTagsProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{data.title}</title>
      <meta name="title" content={data.title} />
      <meta name="description" content={data.description} />
      
      {/* Keywords */}
      {data.keywords && data.keywords.length > 0 && (
        <meta name="keywords" content={data.keywords.join(', ')} />
      )}
      
      {/* Canonical URL */}
      {data.canonical && (
        <link rel="canonical" href={data.canonical} />
      )}
      
      {/* Robots */}
      {data.robots && (
        <meta name="robots" content={data.robots} />
      )}
      
      {/* Language */}
      {data.lang && (
        <html lang={data.lang} />
      )}
    </Helmet>
  );
};
