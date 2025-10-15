/**
 * FaviconLinks Component
 * 
 * Renders favicon and app icon links
 * 
 * @module components/SEO/FaviconLinks
 */

import { Helmet } from 'react-helmet-async';

/**
 * Favicon and app icon links component
 */
export const FaviconLinks = () => {
  return (
    <Helmet>
      {/* Standard favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      
      {/* Apple touch icon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Android Chrome icons */}
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      
      {/* Web app manifest */}
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};
