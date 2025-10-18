/**
 * Stats Card Component
 * 
 * Displays a single metric card with optional icon, subtitle, and trend indicator.
 * Follows the design system with accent-gold theme and smooth hover effects.
 * 
 * @module pages/admin/_components/StatsCard
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { StatsCardProps } from '../../../types/admin';

/**
 * Stats Card Component
 * 
 * Renders a metric card with hover effects and optional click-through link.
 * 
 * @param {StatsCardProps} props - Component props
 * @returns {React.ReactElement} Rendered stats card
 * 
 * @example
 * ```typescript
 * <StatsCard
 *   title="Total Guests"
 *   value={30}
 *   subtitle="Across both venues"
 *   icon={<UsersIcon />}
 *   href="/admin/guests"
 * />
 * ```
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  isLoading = false,
  href,
}) => {
  const cardContent = (
    <div className="flex flex-col h-full">
      {/* Header with Icon */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-light">{title}</h3>
        {icon && (
          <div className="text-accent-gold">
            {icon}
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="flex-1">
        {isLoading ? (
          <div className="h-10 bg-text-light/10 animate-pulse rounded" />
        ) : (
          <p className="text-3xl font-bold text-text mb-2">
            {value}
          </p>
        )}
      </div>

      {/* Subtitle and Trend */}
      <div className="flex items-center justify-between mt-auto">
        {subtitle && (
          <p className="text-sm text-text-light">
            {subtitle}
          </p>
        )}
        
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  // Render as link if href provided
  if (href) {
    return (
      <Link
        to={href}
        className="block bg-base-light rounded-lg p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
      >
        {cardContent}
      </Link>
    );
  }

  // Render as static card
  return (
    <div className="bg-base-light rounded-lg p-6 shadow-soft">
      {cardContent}
    </div>
  );
};
