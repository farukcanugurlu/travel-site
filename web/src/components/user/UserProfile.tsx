// src/components/user/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authApiService from '../../api/auth';
import bookingsApiService from '../../api/bookings';
import favoritesApiService from '../../api/favorites';
import type { Booking } from '../../api/bookings';
import type { Favorite } from '../../api/favorites';
import reviewsApiService, { type Review } from '../../api/reviews';
import HeaderThree from '../../layouts/headers/HeaderThree';
import FooterThree from '../../layouts/footers/FooterThree';
import { toast } from 'react-toastify';

interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get tab from URL query parameter or default to 'profile'
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');

  useEffect(() => {
    const currentUser = authApiService.getCurrentUser();
    if (currentUser) {
      // Convert User to UserProfileData by adding createdAt
      const userProfileData: UserProfileData = {
        ...currentUser,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        createdAt: new Date().toISOString(), // Default value since User doesn't have createdAt
      };
      setUser(userProfileData);
      fetchUserData(currentUser.id);
    }
    setLoading(false);
  }, []);

  // Update active tab when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const fetchUserData = async (userId: string) => {
    try {
      const [userBookings, userFavorites, userReviews] = await Promise.all([
        bookingsApiService.getBookingsByUser(userId),
        favoritesApiService.getUserFavorites(userId),
        reviewsApiService.getReviews({ userId, approved: true }),
      ]);
      setBookings(userBookings);
      setFavorites(userFavorites);
      setReviews(userReviews);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const handleLogout = () => {
    authApiService.logout();
    window.location.href = '/';
  };

  const handleDownloadPDF = async (bookingId: string) => {
    try {
      await bookingsApiService.downloadPDF(bookingId);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Please log in to view your profile</h2>
        <Link to="/login" className="btn-login">Sign In</Link>
      </div>
    );
  }

  return (
    <>
      <div className="profile-dark-header"><HeaderThree /></div>
      <main className="user-profile">
      <div className="profile-topbar">
        <button className="btn-back" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}>
          ← Go Back
        </button>
      </div>
      <div className="profile-header">
        <div className="profile-avatar">
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div className="profile-info">
          <h1>{user.firstName} {user.lastName}</h1>
          <p>{user.email}</p>
          <span className="user-role">{user.role}</span>
        </div>
        <div className="profile-actions">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            My Reviews
          </button>
          <button
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            My Wishlist
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h2>Profile Information</h2>
              <div className="profile-details">
                <div className="detail-item">
                  <label>First Name</label>
                  <span>{user.firstName}</span>
                </div>
                <div className="detail-item">
                  <label>Last Name</label>
                  <span>{user.lastName}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{user.email}</span>
                </div>
                <div className="detail-item">
                  <label>Role</label>
                  <span className="role-badge">{user.role}</span>
                </div>
                <div className="detail-item">
                  <label>Member Since</label>
                  <span>{new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <h2>My Bookings ({bookings.length})</h2>
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No bookings yet</h3>
                  <p>Start exploring our amazing tours!</p>
                  <Link to="/tours" className="btn-primary">
                    Browse Tours
                  </Link>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-item">
                      <div className="booking-image">
                        <img 
                          src={booking.tour?.thumbnail || '/assets/img/listing/listing-1.jpg'} 
                          alt={booking.tour?.title} 
                        />
                      </div>
                      <div className="booking-info">
                        <h3>{booking.tour?.title}</h3>
                        <p className="booking-package">{booking.package?.name} - {booking.package?.language}</p>
                        <div className="booking-details">
                          <span className="booking-date">
                            📅 {new Date(booking.tourDate).toLocaleDateString()}
                          </span>
                          <span className="booking-participants">
                            👥 {booking.adultCount} Adult{booking.adultCount > 1 ? 's' : ''}
                            {booking.childCount > 0 && `, ${booking.childCount} Child${booking.childCount > 1 ? 'ren' : ''}`}
                            {booking.infantCount > 0 && `, ${booking.infantCount} Infant${booking.infantCount > 1 ? 's' : ''}`}
                          </span>
                        </div>
                        <div className="booking-status">
                          <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                          <span className="booking-amount">${booking.totalAmount}</span>
                        </div>
                      </div>
                      <div className="booking-actions">
                        <Link to={`/tour-details?slug=${booking.tour?.slug}`} className="btn-view">
                          View Tour
                        </Link>
                        <button
                          onClick={() => handleDownloadPDF(booking.id)}
                          className="btn-download-pdf"
                          title="Download PDF Voucher"
                        >
                          📄 Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <h2>My Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">⭐</div>
                  <h3>No reviews yet</h3>
                  <p>Share your travel experiences with others!</p>
                  <Link to="/tours" className="btn-primary">Write a Review</Link>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="review-item-card">
                      <div className="review-item-header">
                        <h4 className="review-tour-title">
                          <Link to={`/tour/${rev.tour?.slug}`}>{rev.tour?.title}</Link>
                        </h4>
                        <div className="review-rating">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className={`star ${star <= rev.rating ? 'filled' : ''}`}>⭐</span>
                          ))}
                        </div>
                      </div>
                      {rev.title && <div className="review-title-text">{rev.title}</div>}
                      <div className="review-content-text">{rev.content}</div>
                      <div className="review-meta">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-tab">
              <h2>My Wishlist ({favorites.length})</h2>
              {favorites.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">❤️</div>
                  <h3>No items in your wishlist yet</h3>
                  <p>Save tours you love for later!</p>
                  <Link to="/tours" className="btn-primary">
                    Explore Tours
                  </Link>
                </div>
              ) : (
                <div className="favorites-list">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="favorite-item">
                      <div className="favorite-image">
                        <img 
                          src={favorite.tour?.thumbnail || '/assets/img/listing/listing-1.jpg'} 
                          alt={favorite.tour?.title} 
                        />
                      </div>
                      <div className="favorite-info">
                        <h3>{favorite.tour?.title}</h3>
                        <p className="favorite-location">
                          {favorite.tour?.destination?.name}, {favorite.tour?.destination?.country}
                        </p>
                        <div className="favorite-price">
                          From ${favorite.tour?.packages?.[0]?.adultPrice || 0}
                        </div>
                      </div>
                      <div className="favorite-actions">
                        <Link to={`/tour/${favorite.tour?.slug}`} className="btn-view">
                          View Tour
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Profile-specific dark header */
        .profile-dark-header #header-sticky,
        .profile-dark-header #header-sticky.header-sticky {
          background: #000 !important;
          box-shadow: none !important;
        }

        .user-profile {
          max-width: 1000px;
          margin: 0 auto;
          padding: 100px 20px 0; /* below header; no extra bottom gap before footer */
          background: #f8f9fa; /* light contrast so white header is visible */
          min-height: 100vh;
        }

        .profile-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .btn-back {
          background: #f1f3f5;
          color: #2c3e50;
          padding: 8px 14px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-back:hover { background: #e9ecef; }

        .profile-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .loading-spinner {
          font-size: 18px;
          color: #666;
        }

        .profile-error {
          text-align: center;
          padding: 60px 20px;
        }

        .profile-error h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .btn-login {
          background: #3498db;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-login:hover {
          background: #2980b9;
        }

        .profile-header {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 600;
        }

        .profile-info {
          flex: 1;
        }

        .profile-info h1 {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .profile-info p {
          color: #666;
          font-size: 16px;
          margin: 0 0 8px 0;
        }

        .user-role {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
        }

        .btn-logout {
          background: #e74c3c;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-logout:hover {
          background: #c0392b;
        }

        .profile-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .profile-tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
        }

        .tab {
          flex: 1;
          padding: 16px 20px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab:hover {
          background: #f8f9fa;
          color: #2c3e50;
        }

        .tab.active {
          background: #3498db;
          color: white;
        }

        .tab-content {
          padding: 30px;
        }

        .profile-tab h2,
        .bookings-tab h2,
        .reviews-tab h2,
        .favorites-tab h2 {
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 24px 0;
        }

        .reviews-list { display: flex; flex-direction: column; gap: 16px; }
        .review-item-card { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; }
        .review-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .review-tour-title { margin: 0; font-size: 16px; }
        .review-rating .star { font-size: 14px; filter: grayscale(1) brightness(0.6); }
        .review-rating .star.filled { filter: none; }
        .review-title-text { font-weight: 600; margin-bottom: 4px; }
        .review-content-text { color: #555; }
        .review-meta { font-size: 12px; color: #888; margin-top: 8px; }

        .profile-details {
          display: grid;
          gap: 20px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-item label {
          font-weight: 500;
          color: #2c3e50;
        }

        .detail-item span {
          color: #666;
        }

        .role-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          color: #666;
          margin: 0 0 24px 0;
        }

        .btn-primary {
          background: #3498db;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .booking-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .booking-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .booking-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .booking-info {
          flex: 1;
        }

        .booking-info h3 {
          font-size: 18px;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .booking-package {
          color: #666;
          font-size: 14px;
          margin: 0 0 12px 0;
        }

        .booking-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }

        .booking-date,
        .booking-participants {
          font-size: 14px;
          color: #555;
        }

        .booking-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-confirmed {
          background: #d4edda;
          color: #155724;
        }

        .status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .status-completed {
          background: #cce5ff;
          color: #004085;
        }

        .booking-amount {
          font-weight: 600;
          color: #2ecc71;
          font-size: 16px;
        }

        .booking-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-view {
          background: #3498db;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
          text-align: center;
        }

        .btn-view:hover {
          background: #2980b9;
        }

        .btn-download-pdf {
          background: #27ae60;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-download-pdf:hover {
          background: #229954;
        }

        .favorites-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .favorite-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .favorite-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .favorite-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .favorite-info {
          flex: 1;
        }

        .favorite-info h3 {
          font-size: 18px;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .favorite-location {
          color: #666;
          font-size: 14px;
          margin: 0 0 8px 0;
        }

        .favorite-price {
          font-weight: 600;
          color: #2ecc71;
          font-size: 16px;
        }

        .favorite-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-book {
          background: #28a745;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
          text-align: center;
        }

        .btn-book:hover {
          background: #218838;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .profile-actions {
            width: 100%;
            justify-content: center;
          }

          .profile-tabs {
            flex-direction: column;
          }

          .tab {
            text-align: center;
          }

          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .booking-item {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }

          .booking-status {
            flex-direction: column;
            gap: 8px;
          }

          .favorite-item {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }

          .favorite-actions {
            flex-direction: row;
            justify-content: center;
          }
        }
      `}</style>
      </main>
      <FooterThree />
    </>
  );
};

export default UserProfile;
