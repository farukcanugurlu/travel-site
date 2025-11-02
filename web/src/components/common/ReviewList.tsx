// src/components/common/ReviewList.tsx
import React from 'react';
import type { Review } from '../../api/reviews';

interface ReviewListProps {
  reviews: Review[];
  className?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, className = '' }) => {
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (reviews.length === 0) {
    return (
      <div className={`review-list-empty ${className}`}>
        <div className="empty-icon">💬</div>
        <h3>No reviews yet</h3>
        <p>Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className={`review-list ${className}`}>
      <div className="review-stats-header">
        <div className="rating-summary">
          <div className="rating-number">{averageRating.toFixed(1)}</div>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`star ${star <= Math.round(averageRating) ? 'filled' : 'empty'}`}>
                ⭐
              </span>
            ))}
          </div>
          <div className="rating-text">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
      
      <h3>Customer Reviews ({reviews.length})</h3>
      
      <div className="reviews-container">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
              <div className="reviewer-avatar">
                {review.user?.firstName?.[0] || 'U'}{review.user?.lastName?.[0] || ''}
              </div>
                <div className="reviewer-details">
                  <div className="reviewer-name">
                    {review.user?.firstName || 'Anonymous'} {review.user?.lastName || ''}
                  </div>
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="review-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= review.rating ? 'filled' : 'empty'}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            {review.title && (
              <div className="review-title">
                {review.title}
              </div>
            )}

            <div className="review-content">
              {review.content}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .review-list {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .review-stats-header {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e0e0e0;
        }

        .rating-summary {
          text-align: center;
        }

        .rating-number {
          font-size: 36px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .rating-stars {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .rating-stars .star {
          font-size: 20px;
        }

        .rating-text {
          font-size: 14px;
          color: #666;
        }

        .review-list h3 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 20px 0;
        }

        .reviews-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .review-item {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #fafafa;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .reviewer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .reviewer-details {
          flex: 1;
        }

        .reviewer-name {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 2px;
        }

        .review-date {
          font-size: 12px;
          color: #666;
        }

        .review-rating {
          display: flex;
          gap: 2px;
        }

        .star {
          font-size: 16px;
        }

        .star.filled {
          filter: brightness(1);
        }

        .star.empty {
          filter: grayscale(1) brightness(0.5);
        }

        .review-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .review-content {
          color: #555;
          line-height: 1.6;
          font-size: 14px;
        }

        .review-list-empty {
          background: white;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .review-list-empty h3 {
          font-size: 20px;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .review-list-empty p {
          color: #666;
          margin: 0;
        }

        @media (max-width: 768px) {
          .review-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .review-rating {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewList;
