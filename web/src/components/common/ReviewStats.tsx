// src/components/common/ReviewStats.tsx
import React from 'react';
import type { ReviewStats } from '../../api/reviews';

interface ReviewStatsProps {
  stats: ReviewStats;
  className?: string;
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ stats, className = '' }) => {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= rating ? 'filled' : 'empty'}`}
      >
        ⭐
      </span>
    ));
  };

  const getRatingPercentage = (rating: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((ratingDistribution[rating] / totalReviews) * 100);
  };

  return (
    <div className={`review-stats ${className}`}>
      <div className="stats-header">
        <div className="overall-rating">
          <div className="rating-number">{averageRating.toFixed(1)}</div>
          <div className="rating-stars">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="rating-text">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="rating-breakdown">
        <h4>Rating Breakdown</h4>
        <div className="breakdown-list">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="breakdown-item">
              <div className="rating-label">
                <span className="rating-number">{rating}</span>
                <span className="star">⭐</span>
              </div>
              <div className="rating-bar">
                <div 
                  className="rating-fill"
                  style={{ width: `${getRatingPercentage(rating)}%` }}
                />
              </div>
              <div className="rating-count">
                {ratingDistribution[rating] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .review-stats {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stats-header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .overall-rating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .rating-number {
          font-size: 48px;
          font-weight: 700;
          color: #2c3e50;
        }

        .rating-stars {
          display: flex;
          gap: 4px;
        }

        .star {
          font-size: 20px;
        }

        .star.filled {
          filter: brightness(1);
        }

        .star.empty {
          filter: grayscale(1) brightness(0.5);
        }

        .rating-text {
          color: #666;
          font-size: 14px;
        }

        .rating-breakdown h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 16px 0;
        }

        .breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .breakdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rating-label {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 60px;
        }

        .rating-label .rating-number {
          font-size: 14px;
          font-weight: 600;
          color: #2c3e50;
        }

        .rating-label .star {
          font-size: 12px;
        }

        .rating-bar {
          flex: 1;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .rating-fill {
          height: 100%;
          background: #3498db;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .rating-count {
          min-width: 30px;
          text-align: right;
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .rating-number {
            font-size: 36px;
          }

          .rating-stars .star {
            font-size: 16px;
          }

          .breakdown-item {
            gap: 8px;
          }

          .rating-label {
            min-width: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewStats;
