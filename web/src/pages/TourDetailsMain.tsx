// src/pages/TourDetailsMain.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toursApiService, { type Tour } from '../api/tours';
import reviewsApiService, { type Review } from '../api/reviews';
import BookingForm from '../components/common/BookingForm';
import ReviewForm from '../components/common/ReviewForm';
import ReviewList from '../components/common/ReviewList';
import FavoriteButton from '../components/common/FavoriteButton';
import HeaderThree from '../layouts/headers/HeaderThree';
import FooterThree from '../layouts/footers/FooterThree';

const TourDetailsMain: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (slug) {
      fetchTourData();
    }
  }, [slug]);

  const fetchTourData = async () => {
    if (!slug) {
      setError('Tour slug not provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching tour with slug:', slug);
      const tourData = await toursApiService.getTourBySlug(slug);
      console.log('Tour data received:', tourData);
      
      // Check if tour data is empty or invalid
      if (!tourData || !tourData.id) {
        throw new Error('Tour not found');
      }
      
      setTour(tourData);
      
      // Fetch reviews for this tour (separate try-catch to not affect tour data)
      try {
        const tourReviews = await reviewsApiService.getTourReviews(tourData.id);
        setReviews(tourReviews);
      } catch (reviewError) {
        console.warn('Failed to fetch reviews:', reviewError);
        setReviews([]); // Set empty reviews array if reviews fail
      }
    } catch (err) {
      console.error('Failed to fetch tour data:', err);
      setError('Tour not found');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    // Refresh reviews after new review is submitted
    if (tour) {
      reviewsApiService.getTourReviews(tour.id)
        .then(setReviews)
        .catch(error => {
          console.warn('Failed to refresh reviews:', error);
          setReviews([]);
        });
    }
  };

  if (loading) {
    return (
      <>
        <HeaderThree />
        <div className="tour-details-loading">
          <div className="loading-spinner">Loading tour details...</div>
        </div>
        <FooterThree />
      </>
    );
  }

  if (error || !tour) {
    return (
      <>
        <HeaderThree />
        <div className="tour-details-error" style={{ padding: '50px 20px', textAlign: 'center' }}>
          <h1>Tour Not Found</h1>
          <p>The tour "{slug}" you're looking for doesn't exist.</p>
          <p>Please check the URL or go back to the <a href="/tours">tours page</a>.</p>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
        <FooterThree />
      </>
    );
  }

  const lowestPrice = Math.min(...tour.packages.map(pkg => Number(pkg.adultPrice)));

  return (
    <>
      <HeaderThree />
      <main className="tour-details-main">
        {/* Hero Section */}
        <section className="tour-hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-image">
                <img src={(() => {
                  const imgUrl = tour.images?.[0] || tour.thumbnail || '/assets/img/listing/listing-1.jpg';
                  // If it's already a full URL, return as is
                  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
                    return imgUrl;
                  }
                  // If it starts with /uploads/, prepend backend URL
                  if (imgUrl.startsWith('/uploads/')) {
                    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imgUrl}`;
                  }
                  return imgUrl;
                })()} alt={tour.title} />
                <div className="hero-badge">
                  {tour.featured && <span className="featured-badge">Featured</span>}
                  <span className="price-badge">From ${lowestPrice}</span>
                </div>
              </div>
              <div className="hero-info">
                <h1>{tour.title}</h1>
                <div className="tour-meta">
                  <span className="location">📍 {tour.destination?.name}, {tour.destination?.country}</span>
                  <span className="duration">⏱️ {tour.duration || 'Full Day'}</span>
                </div>
                <div className="hero-actions">
                  <FavoriteButton tourId={tour.id} className="favorite-btn" />
                  <button 
                    className="book-now-btn"
                    onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tour Content */}
        <section className="tour-content">
          <div className="container">
            <div className="content-layout">
              <div className="main-content">
                {/* Tabs */}
                <div className="tour-tabs">
                  <button 
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button 
                    className={`tab ${activeTab === 'packages' ? 'active' : ''}`}
                    onClick={() => setActiveTab('packages')}
                  >
                    Packages
                  </button>
                  <button 
                    className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews ({reviews.length})
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {activeTab === 'overview' && (
                    <div className="overview-tab">
                      <h2>About This Tour</h2>
                      <div className="tour-description">
                        {tour.description?.split('\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'packages' && (
                    <div className="packages-tab">
                      <h2>Available Packages</h2>
                      <div className="packages-grid">
                        {tour.packages.map((pkg) => (
                          <div key={pkg.id} className="package-card">
                            <div className="package-header">
                              <h3>{pkg.name}</h3>
                              <span className="package-language">{pkg.language}</span>
                            </div>
                            <div className="package-prices">
                              <div className="price-item">
                                <span>Adult:</span>
                                <span>€{pkg.adultPrice}</span>
                              </div>
                              <div className="price-item">
                                <span>Child:</span>
                                <span>€{pkg.childPrice}</span>
                              </div>
                              <div className="price-item">
                                <span>Infant:</span>
                                <span>€{pkg.infantPrice}</span>
                              </div>
                            </div>
                            {pkg.description && (
                              <p className="package-description">{pkg.description}</p>
                            )}
                            {pkg.capacity && (
                              <div className="package-capacity">
                                Max {pkg.capacity} participants
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="reviews-tab">
                      <ReviewList reviews={reviews} />
                      <ReviewForm tourId={tour.id} onReviewSubmitted={handleReviewSubmitted} />
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="sidebar">
                <div className="booking-card">
                  <h3>Book This Tour</h3>
                  <div className="price-info">
                    <span className="price-label">Starting from</span>
                    <span className="price-amount">${lowestPrice}</span>
                    <span className="price-per">per person</span>
                  </div>
                  <div className="tour-info-summary">
                    <div className="info-item">
                      <span className="info-label">Duration:</span>
                      <span className="info-value">{tour.duration || 'Full Day'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{tour.destination?.name}, {tour.destination?.country}</span>
                    </div>
                  </div>
                  <button 
                    className="sidebar-book-btn"
                    onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking-section" className="booking-section">
          <div className="container">
            <BookingForm tourId={tour.id} onBookingSubmitted={() => console.log('Booking submitted')} />
          </div>
        </section>
      </main>
      <FooterThree />

      <style>{`
        .tour-details-loading,
        .tour-details-error {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-spinner {
          font-size: 18px;
          color: #666;
        }

        .tour-details-error h1 {
          color: #e74c3c;
          margin-bottom: 10px;
        }

        .tour-details-main {
          min-height: 100vh;
        }

        .tour-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 60px 0;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .hero-image {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        .hero-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .hero-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .featured-badge,
        .price-badge {
          background: rgba(255, 255, 255, 0.9);
          color: #2c3e50;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
        }

        .hero-info h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .tour-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          font-size: 16px;
        }

        .hero-actions {
          display: flex;
          gap: 15px;
        }

        .favorite-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .favorite-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .book-now-btn {
          background: #28a745;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .book-now-btn:hover {
          background: #218838;
        }

        .tour-content {
          padding: 60px 0;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        .tour-tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 30px;
        }

        .tab {
          padding: 15px 25px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: #2c3e50;
        }

        .tab.active {
          color: #3498db;
          border-bottom-color: #3498db;
        }

        .tab-content {
          min-height: 400px;
        }

        .overview-tab h2,
        .packages-tab h2,
        .reviews-tab h2 {
          font-size: 24px;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .tour-description p {
          font-size: 16px;
          line-height: 1.6;
          color: #555;
          margin-bottom: 15px;
        }

        .packages-grid {
          display: grid;
          gap: 20px;
        }

        .package-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          background: #f8f9fa;
        }

        .package-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .package-header h3 {
          font-size: 18px;
          color: #2c3e50;
          margin: 0;
        }

        .package-language {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .package-prices {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }

        .price-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
        }

        .price-item span:first-child {
          color: #666;
          font-size: 14px;
        }

        .price-item span:last-child {
          font-weight: 600;
          color: #2c3e50;
        }

        .package-description {
          color: #666;
          font-size: 14px;
          margin: 0 0 10px 0;
        }

        .package-capacity {
          font-size: 12px;
          color: #999;
        }

        .sidebar {
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .booking-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .booking-card h3 {
          font-size: 20px;
          color: #2c3e50;
          margin: 0 0 20px 0;
        }

        .price-info {
          text-align: center;
          margin-bottom: 25px;
        }

        .price-label {
          display: block;
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }

        .price-amount {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: #2ecc71;
          margin-bottom: 5px;
        }

        .price-per {
          font-size: 14px;
          color: #666;
        }

        .tour-info-summary {
          margin-bottom: 25px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 500;
          color: #2c3e50;
        }

        .info-value {
          color: #666;
          font-size: 14px;
        }

        .sidebar-book-btn {
          width: 100%;
          background: #3498db;
          color: white;
          padding: 15px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .sidebar-book-btn:hover {
          background: #2980b9;
        }

        .booking-section {
          background: #f8f9fa;
          padding: 60px 0;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .hero-info h1 {
            font-size: 28px;
          }

          .content-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .tour-tabs {
            flex-direction: column;
          }

          .tab {
            text-align: center;
            border-bottom: none;
            border-left: 3px solid transparent;
          }

          .tab.active {
            border-left-color: #3498db;
            border-bottom-color: transparent;
          }

          .packages-grid {
            grid-template-columns: 1fr;
          }

          .package-prices {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default TourDetailsMain;
