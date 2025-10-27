/**
 * Mobile Detection Hook
 * 
 * Detects device platform and capabilities for optimized UI rendering.
 * Provides platform-specific detection for iOS, Android, and desktop browsers.
 * 
 * @module pages/admin/_components/hooks/useMobileDetection
 */

import { useState, useEffect } from 'react';

export interface PlatformInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  userAgent: string;
}

/**
 * Detect device platform and capabilities
 * 
 * @returns Platform information object
 */
export const useMobileDetection = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() => {
    if (globalThis.window === undefined) {
      return {
        isMobile: false,
        isIOS: false,
        isAndroid: false,
        isDesktop: true,
        userAgent: ''
      };
    }

    const userAgent = globalThis.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);

    return {
      isMobile,
      isIOS,
      isAndroid,
      isDesktop: !isMobile,
      userAgent: globalThis.navigator.userAgent
    };
  });

  useEffect(() => {
    // Re-detect on window resize (e.g., device rotation)
    const handleResize = () => {
      const userAgent = globalThis.navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);

      setPlatformInfo({
        isMobile,
        isIOS,
        isAndroid,
        isDesktop: !isMobile,
        userAgent: globalThis.navigator.userAgent
      });
    };

    globalThis.addEventListener('resize', handleResize);
    return () => globalThis.removeEventListener('resize', handleResize);
  }, []);

  return platformInfo;
};
