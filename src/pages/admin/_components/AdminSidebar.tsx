/**
 * Admin Sidebar Component
 * 
 * Navigation sidebar for admin dashboard with active state indicators
 * and responsive mobile behavior.
 * 
 * @module pages/admin/_components/AdminSidebar
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NavigationItem } from '../../../types/admin';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Admin Sidebar Navigation Component
 * 
 * Renders navigation menu with active state highlighting.
 * Supports both desktop fixed and mobile overlay modes.
 * 
 * @param {AdminSidebarProps} props - Component props
 * @returns {React.ReactElement} Rendered sidebar
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  /**
   * Check if a navigation item is active
   */
  const isActive = (href: string): boolean => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  /**
   * Navigation items configuration
   */
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      description: 'Overview & Statistics',
    },
    {
      id: 'guests',
      label: 'Quản lý khách mời',
      href: '/admin/guests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: 'View & Manage Guests',
    },
    {
      id: 'rsvps',
      label: 'Quản lý đơn tham dự',
      href: '/admin/rsvps',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      description: 'View & Manage RSVPs',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-text-light/20
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:fixed lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-text-light/20">
          <h2 className="text-xl font-semibold text-text">Admin Panel</h2>
          
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden text-text-light hover:text-text transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-all duration-200
                  ${active
                    ? 'bg-accent-gold text-white shadow-md'
                    : 'text-text-light hover:bg-base-light hover:text-text'
                  }
                `}
              >
                <span className={`mr-3 ${active ? 'text-white' : 'text-accent-gold'}`}>
                  {item.icon}
                </span>
                
                <div className="flex-1">
                  <p className={`font-medium ${active ? 'text-white' : 'text-text'}`}>
                    {item.label}
                  </p>
                  {item.description && (
                    <p className={`text-xs mt-0.5 ${active ? 'text-white/80' : 'text-text-light'}`}>
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-text-light/20">
          <Link
            to="/"
            className="flex items-center justify-center px-4 py-2 text-sm text-text-light hover:text-text transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Về trang thiệp mời online
          </Link>
        </div>
      </aside>
    </>
  );
};
