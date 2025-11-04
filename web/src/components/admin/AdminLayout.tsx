// src/components/admin/AdminLayout.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import authApiService from '../../api/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentUser = authApiService.getCurrentUser();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/tours', label: 'Tours', icon: '🗺️' },
    { path: '/admin/popular-tours', label: 'Popular Tours', icon: '⭐' },
    { path: '/admin/destinations', label: 'Destinations', icon: '📍' },
    { path: '/admin/blog', label: 'Blog Posts', icon: '📝' },
    { path: '/admin/blog-categories', label: 'Blog Categories', icon: '📂' },
    { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📋' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    authApiService.logout();
    window.location.href = '/';
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">✈️</div>
            <div className="logo-text">
              <span className="logo-brand">LEXOR</span>
              <span className="logo-subtitle">Admin</span>
            </div>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {currentUser?.firstName?.[0] || currentUser?.email[0] || 'A'}
            </div>
            <div className="user-details">
              <div className="user-name">
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser?.email}
              </div>
              <div className="user-role">{currentUser?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1>Admin Panel</h1>
          <button 
            className="btn-show-website"
            onClick={() => window.open('/', '_blank')}
          >
            <span className="btn-icon">🌐</span>
            Show Website
          </button>
        </div>
        
        <div className="admin-content">
          {children}
        </div>
      </div>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f5f5f5;
        }

        .admin-sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          transition: all 0.3s ease;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          z-index: 1000;
        }

        .admin-sidebar.open {
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #34495e;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3498db, #2980b9);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .logo-brand {
          font-size: 20px;
          font-weight: 800;
          color: white;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #3498db, #2980b9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-subtitle {
          font-size: 12px;
          font-weight: 500;
          color: #bdc3c7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-toggle {
            display: block;
          }
        }

        .sidebar-nav {
          padding: 20px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #bdc3c7;
          text-decoration: none;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: #34495e;
          color: white;
        }

        .nav-item.active {
          background: #3498db;
          color: white;
          border-left-color: #2980b9;
        }

        .nav-icon {
          margin-right: 12px;
          font-size: 16px;
        }

        .nav-label {
          font-weight: 500;
        }

        .sidebar-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          border-top: 1px solid #34495e;
        }

        .user-info {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3498db;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 12px;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 500;
          font-size: 14px;
        }

        .user-role {
          font-size: 12px;
          color: #bdc3c7;
          text-transform: uppercase;
        }

        .logout-btn {
          width: 100%;
          padding: 8px 16px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .logout-btn:hover {
          background: #c0392b;
        }

        .admin-main {
          flex: 1;
          margin-left: 250px;
          transition: margin-left 0.3s ease;
        }

        @media (max-width: 768px) {
          .admin-main {
            margin-left: 0;
          }
        }

        .admin-header {
          background: white;
          padding: 20px 30px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }


        .btn-show-website {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .btn-show-website:hover {
          background: linear-gradient(135deg, #2980b9, #1f618d);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
        }

        .btn-show-website .btn-icon {
          font-size: 16px;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          margin-right: 15px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }
        }

        .admin-header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
        }

        .admin-content {
          padding: 30px;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
