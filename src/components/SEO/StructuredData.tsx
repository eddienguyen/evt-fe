/**
 * StructuredData Component
 * 
 * Renders JSON-LD structured data for search engines
 * 
 * @module components/SEO/StructuredData
 */

import { Helmet } from 'react-helmet-async';
import type { StructuredDataType } from '../../types/seo';

interface StructuredDataProps {
  data: StructuredDataType | null;
}

/**
 * JSON-LD structured data component
 */
export const StructuredData = ({ data }: StructuredDataProps) => {
  if (!data) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};
