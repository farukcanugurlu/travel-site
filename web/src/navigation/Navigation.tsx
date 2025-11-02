import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

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
import AdminRoute from "../components/admin/AdminRoute";
import SiteSettings from "../components/admin/SiteSettings";

const AppNavigation = () => {
  return (
    <Router>
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
