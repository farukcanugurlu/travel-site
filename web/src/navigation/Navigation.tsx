import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useSessionTimeout from "../hooks/useSessionTimeout";
import authApiService from "../api/auth";

// Home
import HomeThreeMain from "../pages/HomeThreeMain";

// Tours listesi
import HotelGridTwoMain from "../pages/HotelGridTwoMain";

// Tour details
import TourDetailsOneMain from "../pages/TourDetailsOneMain";

// Diğer sayfalar
import CartMain from "../pages/CartMain";
import CheckoutMain from "../pages/CheckoutMain";
import ContactMain from "../pages/ContactMain";
import AboutMain from "../pages/AboutMain";
import ErrorMain from "../pages/ErrorMain";
import BlogOne from "../components/blogs/blog-one";
import BlogDetails from "../components/blogs/blog-details";

// Auth
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import UserProfile from "../components/user/UserProfile";

// Common
import BookingForm from "../components/common/BookingForm";

// Admin
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../components/admin/AdminDashboard";
import ToursAdmin from "../components/admin/ToursAdmin";
import ReviewsAdmin from "../components/admin/ReviewsAdmin";
import BlogAdmin from "../components/admin/BlogAdmin";
import BlogCategoriesAdmin from "../components/admin/BlogCategoriesAdmin";
import TourForm from "../components/admin/TourForm";
import BlogForm from "../components/admin/BlogForm";
import BookingsAdmin from "../components/admin/BookingsAdmin";
import UsersAdmin from "../components/admin/UsersAdmin";
import DestinationsAdmin from "../components/admin/DestinationsAdmin";
import PopularToursAdmin from "../components/admin/PopularToursAdmin";
import AdminRoute from "../components/admin/AdminRoute";
import SiteSettings from "../components/admin/SiteSettings";
import HomepageSettings from "../components/admin/HomepageSettings";

const SessionManager = () => {
  const navigate = useNavigate();

  // Session timeout management
  useSessionTimeout({
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes warning
    onWarning: (remainingTime) => {
      const minutes = Math.floor(remainingTime / 60000);
      const message = `Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''} due to inactivity. Please save your work.`;
      
      // Show toast notification if available, otherwise alert
      if (window.confirm(message + '\n\nClick OK to continue your session.')) {
        // User clicked OK, timer will reset automatically
      }
    },
    onLogout: () => {
      navigate('/login', {
        state: {
          message: 'Your session has expired due to inactivity. Please log in again.'
        }
      });
    }
  });

  // Check token expiration on app load and periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!authApiService.isAuthenticated()) {
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        return;
      }

      try {
        // Decode JWT token (without verification, just to check expiration)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;

        // If token expires in less than 5 minutes, show warning
        if (timeUntilExpiration > 0 && timeUntilExpiration < 5 * 60 * 1000) {
          const minutes = Math.floor(timeUntilExpiration / 60000);
          console.warn(`Token will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        }

        // If token is expired, logout
        if (timeUntilExpiration <= 0) {
          console.warn('Token has expired, logging out...');
          authApiService.logout();
          navigate('/login', {
            state: {
              message: 'Your session has expired. Please log in again.'
            }
          });
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        // If token is invalid, logout
        authApiService.logout();
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return null; // This component doesn't render anything
};

const AppNavigation = () => {
  return (
    <Router>
      <SessionManager />
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomeThreeMain />} />

               {/* Tours */}
               <Route path="/tours" element={<HotelGridTwoMain />} />
               <Route path="/tour-details" element={<TourDetailsOneMain />} />
               <Route path="/tour/:slug" element={<TourDetailsOneMain />} />

        {/* Cart & Checkout & Contact & About */}
        <Route path="/cart" element={<CartMain />} />
        <Route path="/checkout" element={<CheckoutMain />} />
        <Route path="/contact" element={<ContactMain />} />
        <Route path="/about" element={<AboutMain />} />

        {/* Blog */}
        <Route path="/blog" element={<BlogOne />} />
        <Route path="/blog-details/:slug" element={<BlogDetails />} />

        {/* 404 */}
        <Route path="*" element={<ErrorMain />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/user-profile" element={<UserProfile />} />

        {/* Booking Routes */}
        <Route path="/book/:tourId" element={<BookingForm />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/tours" element={<AdminRoute><AdminLayout><ToursAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/tours/new" element={<AdminRoute><AdminLayout><TourForm /></AdminLayout></AdminRoute>} />
        <Route path="/admin/tours/:id" element={<AdminRoute><AdminLayout><TourForm /></AdminLayout></AdminRoute>} />
        <Route path="/admin/destinations" element={<AdminRoute><AdminLayout><DestinationsAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/popular-tours" element={<AdminRoute><AdminLayout><PopularToursAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/homepage" element={<AdminRoute><AdminLayout><HomepageSettings /></AdminLayout></AdminRoute>} />
        <Route path="/admin/blog" element={<AdminRoute><AdminLayout><BlogAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/blog/new" element={<AdminRoute><AdminLayout><BlogForm /></AdminLayout></AdminRoute>} />
        <Route path="/admin/blog/:id" element={<AdminRoute><AdminLayout><BlogForm /></AdminLayout></AdminRoute>} />
        <Route path="/admin/blog-categories" element={<AdminRoute><AdminLayout><BlogCategoriesAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><AdminLayout><ReviewsAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminLayout><BookingsAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminLayout><UsersAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminLayout><SiteSettings /></AdminLayout></AdminRoute>} />
      </Routes>
    </Router>
  );
};

export default AppNavigation;
