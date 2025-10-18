/**
 * Admin Statistics Hook
 * 
 * Custom hook for fetching and managing admin dashboard statistics.
 * Integrates with retry logic for reliable API calls to Fly.io backend.
 * 
 * @module pages/admin/_components/useAdminStats
 */

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { executeWithRetry } from '../../../services/apiRetryService';
import { apiConfig } from '../../../config/api';
import type { AdminStats } from '../../../types/admin';

interface UseAdminStatsReturn {
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching admin statistics with retry logic
 * 
 * Automatically fetches stats on mount and provides refetch capability.
 * Handles Fly.io machine wake-up scenarios with exponential backoff.
 * 
 * @returns {UseAdminStatsReturn} Stats data, loading state, error, and refetch function
 * 
 * @example
 * ```typescript
 * const { stats, isLoading, error, refetch } = useAdminStats();
 * 
 * if (isLoading) return <StatsSkeleton />;
 * if (error) return <ErrorMessage error={error} onRetry={refetch} />;
 * 
 * return <StatsCard data={stats} />;
 * ```
 */
export const useAdminStats = (): UseAdminStatsReturn => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch admin statistics from backend
   * Uses retry logic to handle Fly.io machine wake-up
   */
  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use retry logic for Fly.io machine wake-up handling
      const response = await executeWithRetry(async () => {
        return await axios.get(`${apiConfig.baseUrl}${apiConfig.endpoints.adminStats}`);
      });
      
      // Extract data from response (backend returns { status: 'success', data: {...} })
      setStats(response.data.data || response.data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Không thể tải thống kê quản trị. Vui lòng thử lại.';
      
      setError(errorMessage);
      console.error('Admin stats fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};
