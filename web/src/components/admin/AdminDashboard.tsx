// src/components/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toursApiService from '../../api/tours';
import blogApiService from '../../api/blog';
import authApiService from '../../api/auth';

interface DashboardStats {
  tours: number;
  bookings: number;
  reviews: number;
  users: number;
  blogPosts: number;
  featuredTours: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    tours: 0,
    bookings: 0,
    reviews: 0,
    users: 0,
    blogPosts: 0,
    featuredTours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentTours, setRecentTours] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [tours, featuredTours, blogPosts] = await Promise.all([
          toursApiService.getTours(),
          toursApiService.getFeaturedTours(),
          blogApiService.getPosts(),
        ]);

        // Calculate stats
        const dashboardStats: DashboardStats = {
          tours: tours.length,
          bookings: 0, // Will be implemented when bookings API is ready
          reviews: 0, // Will be implemented when reviews API is ready
          users: 1, // Current user
          blogPosts: blogPosts.length,
          featuredTours: featuredTours.length,
        };

        setStats(dashboardStats);
        setRecentTours(tours.slice(0, 5));
        setRecentBookings([]); // Will be implemented when bookings API is ready
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const currentUser = authApiService.getCurrentUser();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {currentUser?.firstName || 'Admin'}!</h1>
        <p>Here's what's happening with your travel business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.tours}</div>
            <div className="stat-label">Total Tours</div>
          </div>
          <Link to="/admin/tours" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-number">{stats.featuredTours}</div>
            <div className="stat-label">Featured Tours</div>
          </div>
          <Link to="/admin/tours?featured=true" className="stat-link">View Featured</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-number">{stats.bookings}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <Link to="/admin/bookings" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">{stats.blogPosts}</div>
            <div className="stat-label">Blog Posts</div>
          </div>
          <Link to="/admin/blog" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-number">{stats.reviews}</div>
            <div className="stat-label">Reviews</div>
          </div>
          <Link to="/admin/reviews" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.users}</div>
            <div className="stat-label">Users</div>
          </div>
          <Link to="/admin/users" className="stat-link">View All</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/tours/new" className="action-card">
            <div className="action-icon">➕</div>
            <div className="action-title">Add New Tour</div>
            <div className="action-description">Create a new tour package</div>
          </Link>

          <Link to="/admin/blog/new" className="action-card">
            <div className="action-icon">📝</div>
            <div className="action-title">Write Blog Post</div>
            <div className="action-description">Create new blog content</div>
          </Link>

          <Link to="/admin/destinations" className="action-card">
            <div className="action-icon">📍</div>
            <div className="action-title">Manage Destinations</div>
            <div className="action-description">Add new destinations</div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="recent-tours">
          <h2>Recent Tours</h2>
          <div className="tours-list">
            {recentTours.length > 0 ? (
              recentTours.map((tour) => (
                <div key={tour.id} className="tour-item">
                  <div className="tour-image">
                    <img src={tour.thumbnail || '/assets/img/listing/listing-1.jpg'} alt={tour.title} />
                  </div>
                  <div className="tour-info">
                    <h3>{tour.title}</h3>
                    <p>{tour.destination?.name}</p>
                    <div className="tour-meta">
                      <span className={`status ${tour.published ? 'published' : 'draft'}`}>
                        {tour.published ? 'Published' : 'Draft'}
                      </span>
                      {tour.featured && <span className="featured">Featured</span>}
                    </div>
                  </div>
                  <div className="tour-actions">
                    <Link to={`/admin/tours/${tour.id}`} className="btn-edit">Edit</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No tours found. <Link to="/admin/tours/new">Create your first tour</Link></p>
              </div>
            )}
          </div>
        </div>

        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          <div className="bookings-list">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-info">
                    <h3>{booking.tour?.title}</h3>
                    <p>{booking.user?.email}</p>
                    <div className="booking-meta">
                      <span className={`status ${booking.status}`}>{booking.status}</span>
                      <span className="amount">€{booking.totalAmount}</span>
                    </div>
                  </div>
                  <div className="booking-actions">
                    <Link to={`/admin/bookings/${booking.id}`} className="btn-view">View</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No recent bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .loading-spinner {
          font-size: 18px;
          color: #666;
        }

        .dashboard-header {
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .dashboard-header p {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 32px;
          margin-right: 16px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .stat-label {
          color: #666;
          font-size: 14px;
        }

        .stat-link {
          color: #3498db;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        .stat-link:hover {
          text-decoration: underline;
        }

        .quick-actions {
          margin-bottom: 40px;
        }

        .quick-actions h2 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
          text-align: center;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .action-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .action-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .action-description {
          color: #666;
          font-size: 14px;
        }

        .recent-activity {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        @media (max-width: 768px) {
          .recent-activity {
            grid-template-columns: 1fr;
          }
        }

        .recent-tours h2,
        .recent-bookings h2 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .tours-list,
        .bookings-list {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .tour-item,
        .booking-item {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .tour-item:last-child,
        .booking-item:last-child {
          border-bottom: none;
        }

        .tour-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 16px;
        }

        .tour-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tour-info,
        .booking-info {
          flex: 1;
        }

        .tour-info h3,
        .booking-info h3 {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 4px 0;
        }

        .tour-info p,
        .booking-info p {
          color: #666;
          font-size: 14px;
          margin: 0 0 8px 0;
        }

        .tour-meta,
        .booking-meta {
          display: flex;
          gap: 8px;
        }

        .status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status.published {
          background: #d4edda;
          color: #155724;
        }

        .status.draft {
          background: #fff3cd;
          color: #856404;
        }

        .featured {
          background: #cce5ff;
          color: #004085;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .amount {
          color: #28a745;
          font-weight: 600;
        }

        .tour-actions,
        .booking-actions {
          margin-left: 16px;
        }

        .btn-edit,
        .btn-view {
          padding: 6px 12px;
          background: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-edit:hover,
        .btn-view:hover {
          background: #2980b9;
        }

        .empty-state {
          padding: 40px;
          text-align: center;
          color: #666;
        }

        .empty-state a {
          color: #3498db;
          text-decoration: none;
        }

        .empty-state a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
