// src/components/admin/ReviewsAdmin.tsx
import React, { useState, useEffect } from 'react';
import reviewsApiService, { type Review } from '../../api/reviews';

const ReviewsAdmin: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '', // 'pending', 'approved', 'rejected'
    search: '',
  });

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Review[];
      
      if (filters.status === 'pending') {
        data = await reviewsApiService.getPendingReviews();
      } else {
        const filterParams: any = {};
        if (filters.status === 'approved') filterParams.approved = true;
        if (filters.status === 'rejected') filterParams.approved = false;
        
        data = await reviewsApiService.getReviews(filterParams);
      }
      
      // Search filter
      if (filters.search) {
        data = data.filter(review => 
          review.content.toLowerCase().includes(filters.search.toLowerCase()) ||
          review.tour.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          review.user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
          review.user.lastName.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setReviews(data);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await reviewsApiService.approveReview(id);
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, approved: true } : review
      ));
    } catch (err) {
      alert('Failed to approve review');
      console.error('Error approving review:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await reviewsApiService.rejectReview(id);
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, approved: false } : review
      ));
    } catch (err) {
      alert('Failed to reject review');
      console.error('Error rejecting review:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewsApiService.deleteReview(id);
      setReviews(reviews.filter(review => review.id !== id));
    } catch (err) {
      alert('Failed to delete review');
      console.error('Error deleting review:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="reviews-admin">
      <div className="admin-header">
        <div className="header-content">
          <h1>Reviews Management</h1>
          <p>Moderate customer reviews and feedback</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="filter-select"
            >
              <option value="">All Reviews</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search reviews..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="reviews-table-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⭐</div>
            <h3>No reviews found</h3>
            <p>No reviews match your current filters</p>
          </div>
        ) : (
          <div className="reviews-table">
            <div className="table-header">
              <div className="col-rating">Rating</div>
              <div className="col-content">Review</div>
              <div className="col-user">User</div>
              <div className="col-tour">Tour</div>
              <div className="col-date">Date</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Actions</div>
            </div>

            {reviews.map((review) => (
              <div key={review.id} className="table-row">
                <div className="col-rating">
                  <div className="rating-display">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= review.rating ? 'filled' : 'empty'}`}
                      >
                        ⭐
                      </span>
                    ))}
                    <span className="rating-number">{review.rating}</span>
                  </div>
                </div>
                
                <div className="col-content">
                  <div className="review-content">
                    {review.title && (
                      <div className="review-title">{review.title}</div>
                    )}
                    <div className="review-text">
                      {review.content.length > 100 
                        ? `${review.content.substring(0, 100)}...` 
                        : review.content
                      }
                    </div>
                  </div>
                </div>
                
                <div className="col-user">
                  <div className="user-info">
                    <div className="user-avatar">
                      {review.user.firstName[0]}{review.user.lastName[0]}
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {review.user.firstName} {review.user.lastName}
                      </div>
                      <div className="user-email">{review.user.email}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-tour">
                  <div className="tour-info">
                    <div className="tour-title">{review.tour.title}</div>
                    <div className="tour-slug">/{review.tour.slug}</div>
                  </div>
                </div>
                
                <div className="col-date">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="col-status">
                  <span className={`status-badge ${review.approved ? 'approved' : 'pending'}`}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                
                <div className="col-actions">
                  <div className="action-buttons">
                    {!review.approved && (
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(review.id)}
                      >
                        Approve
                      </button>
                    )}
                    {review.approved && (
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(review.id)}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .reviews-admin {
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .loading-spinner {
          font-size: 18px;
          color: #666;
        }

        .admin-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .header-content h1 {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .header-content p {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .filters-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .filter-input,
        .filter-select {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #3498db;
        }

        .reviews-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 16px;
          border-left: 4px solid #dc3545;
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
          margin: 0;
        }

        .reviews-table {
          overflow-x: auto;
        }

        .table-header {
          display: grid;
          grid-template-columns: 120px 1fr 200px 200px 100px 100px 200px;
          gap: 16px;
          padding: 16px 20px;
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #e0e0e0;
        }

        .table-row {
          display: grid;
          grid-template-columns: 120px 1fr 200px 200px 100px 100px 200px;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .rating-display {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .star {
          font-size: 14px;
        }

        .star.filled {
          filter: brightness(1);
        }

        .star.empty {
          filter: grayscale(1) brightness(0.5);
        }

        .rating-number {
          margin-left: 8px;
          font-weight: 600;
          color: #2c3e50;
        }

        .review-content {
          max-width: 300px;
        }

        .review-title {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .review-text {
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 12px;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        .user-email {
          font-size: 12px;
          color: #666;
        }

        .tour-info {
          max-width: 180px;
        }

        .tour-title {
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .tour-slug {
          font-size: 12px;
          color: #666;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.approved {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-approve,
        .btn-reject,
        .btn-delete {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-approve {
          background: #28a745;
          color: white;
        }

        .btn-approve:hover {
          background: #218838;
        }

        .btn-reject {
          background: #ffc107;
          color: #212529;
        }

        .btn-reject:hover {
          background: #e0a800;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .btn-delete:hover {
          background: #c82333;
        }

        @media (max-width: 1200px) {
          .table-header,
          .table-row {
            grid-template-columns: 100px 1fr 150px 150px 80px 80px 150px;
            gap: 12px;
          }
        }

        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr;
          }

          .reviews-table {
            font-size: 14px;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .col-rating,
          .col-content,
          .col-user,
          .col-tour,
          .col-date,
          .col-status,
          .col-actions {
            display: flex;
            align-items: center;
            padding: 8px 0;
          }

          .col-rating::before {
            content: "Rating: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-content::before {
            content: "Review: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-user::before {
            content: "User: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-tour::before {
            content: "Tour: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-date::before {
            content: "Date: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-status::before {
            content: "Status: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-actions::before {
            content: "Actions: ";
            font-weight: 600;
            margin-right: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewsAdmin;
