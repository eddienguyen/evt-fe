/**
 * Admin Header Component
 * 
 * Header bar for admin pages with breadcrumb navigation
 * and mobile hamburger menu toggle.
 * 
 * @module pages/admin/_components/AdminHeader
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { BreadcrumbItem } from '../../../types/admin';

interface AdminHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  onMenuToggle: () => void;
}

/**
 * Admin Header Component
 * 
 * Displays breadcrumb navigation and mobile menu toggle.
 * Fixed at top of admin pages for consistent navigation.
 * 
 * @param {AdminHeaderProps} props - Component props
 * @returns {React.ReactElement} Rendered header
 */
export const AdminHeader: React.FC<AdminHeaderProps> = ({ breadcrumbs, onMenuToggle }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-text-light/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-text-light hover:text-text transition-colors p-2 -ml-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm flex-1 lg:flex-none">
          {breadcrumbs.map((item, index) => {
            const renderBreadcrumbItem = () => {
              if (item.isActive) {
                return (
                  <span className="font-medium text-text truncate">
                    {item.label}
                  </span>
                );
              }
              
              if (item.href) {
                return (
                  <Link
                    to={item.href}
                    className="text-text-light hover:text-accent-gold transition-colors truncate"
                  >
                    {item.label}
                  </Link>
                );
              }
              
              return (
                <span className="text-text-light truncate">
                  {item.label}
                </span>
              );
            };

            return (
              <React.Fragment key={item.href || item.label}>
                {index > 0 && (
                  <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                
                {renderBreadcrumbItem()}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Quick Actions (Desktop) */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link
            to="/"
            className="text-sm text-text-light hover:text-text transition-colors"
          >
            Trang thiệp cưới
          </Link>
        </div>
      </div>
    </header>
  );
};
