/**
 * API Configuration
 * 
 * Central configuration for backend API endpoints.
 * Automatically switches between development and production URLs
 * based on the environment.
 * 
 * @module config/api
 */

/**
 * Get the API base URL from environment variables
 * Falls back to production URL if not set
 */
const getApiBaseUrl = (): string => {
  // Vite exposes env variables with VITE_ prefix via import.meta.env
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl) {
    return envUrl;
  }

  // Fallback to production URL
  console.warn('VITE_API_BASE_URL not set, using production URL');
  return 'https://la-wed-be.onrender.com';
};

export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    health: string;
    healthDatabase: string;
    // Add more endpoints as they are implemented
    guests: string;
  };
}

/**
 * API Configuration Object
 */
export const apiConfig: ApiConfig = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    health: '/api/health',
    healthDatabase: '/api/health/database',
    guests: '/api/guests', // Placeholder for future implementation
  },
};

/**
 * Helper function to construct full API URLs
 * @param endpoint - The endpoint path (e.g., '/api/health')
 * @returns Full URL with base URL prepended
 */
export const getApiUrl = (endpoint: string): string => {
  return `${apiConfig.baseUrl}${endpoint}`;
};

/**
 * Log current API configuration (useful for debugging)
 */
export const logApiConfig = (): void => {
  console.log('API Configuration:', {
    baseUrl: apiConfig.baseUrl,
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  });
};

// Log configuration in development mode
if (import.meta.env.DEV) {
  logApiConfig();
}
