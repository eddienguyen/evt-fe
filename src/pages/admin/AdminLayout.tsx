/**
 * Admin Layout Component
 * 
 * Main layout wrapper for admin pages providing consistent navigation,
 * header, and content structure across all admin views.
 * 
 * @module pages/admin/AdminLayout
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './_components/AdminSidebar';
import { AdminHeader } from './_components/AdminHeader';
import type { BreadcrumbItem } from '../../types/admin';

/**
 * Admin Layout Component
 * 
 * Provides the structural layout for all admin pages including:
 * - Responsive sidebar navigation
 * - Header with breadcrumbs
 * - Main content area with proper spacing
 * 
 * @returns {React.ReactElement} Admin layout with nested routes
 */
export const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();

  /**
   * Toggle sidebar visibility (mobile)
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /**
   * Close sidebar (mobile)
   */
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  /**
   * Update breadcrumbs based on current route
   */
  useEffect(() => {
    const path = location.pathname;
    const crumbs: BreadcrumbItem[] = [
      { label: 'Admin', href: '/admin', isActive: path === '/admin' },
    ];

    if (path.startsWith('/admin/guests')) {
      crumbs.push({
        label: 'Guests',
        href: '/admin/guests',
        isActive: true,
      });
    } else if (path.startsWith('/admin/rsvps')) {
      crumbs.push({
        label: 'RSVPs',
        href: '/admin/rsvps',
        isActive: true,
      });
    }

    setBreadcrumbs(crumbs);
  }, [location.pathname]);

  /**
   * Close sidebar when route changes (mobile)
   */
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-base">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Header */}
        <AdminHeader breadcrumbs={breadcrumbs} onMenuToggle={toggleSidebar} />

        {/* Page Content */}
        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
