/**
 * Admin Dashboard Page
 * 
 * Main dashboard overview page displaying key statistics and quick actions.
 * Provides at-a-glance view of guest and RSVP data.
 * 
 * @module pages/admin/AdminDashboard
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStats } from './_components/useAdminStats';
import { StatsCard } from './_components/StatsCard';
import { StatsSkeleton } from './_components/StatsSkeleton';

/**
 * Admin Dashboard Component
 * 
 * Displays overview statistics and quick action buttons.
 * Automatically handles loading states and error scenarios.
 * 
 * @returns {React.ReactElement} Admin dashboard page
 */
export const AdminDashboard: React.FC = () => {
  const { stats, isLoading, error, refetch } = useAdminStats();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text dark:text-base-light">Tổng quan</h1>
          <p className="text-text-light mt-1">
            Tổng quan về quản lý đám cưới và thống kê
          </p>
        </div>

        <Link
          to="/admin/guests"
          className="inline-flex items-center px-4 py-2 bg-accent-gold text-white rounded-lg hover:bg-accent-gold-dark transition-colors shadow-soft hover:shadow-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo thiệp mời
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Statistics Grid */}
      {isLoading && <StatsSkeleton count={4} />}
      
      {!isLoading && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Guests */}
          <StatsCard
            title="Tổng số khách"
            value={stats.totalGuests}
            subtitle="Huế và HN"
            href="/admin/guests"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />

          {/* Total RSVPs */}
          <StatsCard
            title="Tổng số đơn tham dự"
            value={stats.totalRsvps}
            subtitle={`${stats.responseRate.toFixed(1)}% tỷ lệ trả lời`}
            href="/admin/rsvps"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />

          {/* Hue Venue */}
          <StatsCard
            title="Huế Venue"
            value={stats.guestsByVenue.hue}
            subtitle={`${stats.rsvpsByVenue.hue} RSVPs`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />

          {/* Hanoi Venue */}
          <StatsCard
            title="Hà Nội Venue"
            value={stats.guestsByVenue.hanoi}
            subtitle={`${stats.rsvpsByVenue.hanoi} RSVPs`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-base-light rounded-lg p-6 shadow-soft">
        <h2 className="text-lg font-medium text-text mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/guests"
            className="flex items-center p-4 border border-text-light/20 rounded-lg hover:bg-white hover:shadow-soft transition-all"
          >
            <svg className="w-8 h-8 text-accent-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <div>
              <h3 className="font-medium text-text">Quản lý khách mời</h3>
              <p className="text-sm text-text-light">Xem và chỉnh sửa danh sách khách mời</p>
            </div>
          </Link>

          <Link
            to="/admin/rsvps"
            className="flex items-center p-4 border border-text-light/20 rounded-lg hover:bg-white hover:shadow-soft transition-all"
          >
            <svg className="w-8 h-8 text-accent-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h3 className="font-medium text-text">Quản lý đơn tham dự</h3>
              <p className="text-sm text-text-light">Xem phản hồi của khách mời</p>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center p-4 border border-text-light/20 rounded-lg hover:bg-white hover:shadow-soft transition-all"
          >
            <svg className="w-8 h-8 text-accent-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <div>
              <h3 className="font-medium text-text">Xem trang thiệp mời</h3>
              <p className="text-sm text-text-light">Xem trước trải nghiệm của khách mời</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Last Updated */}
      {stats && (
        <div className="text-center text-sm text-text-light">
          Cập nhật lần cuối: {new Date(stats.lastUpdated).toLocaleString('vi-VN')}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
