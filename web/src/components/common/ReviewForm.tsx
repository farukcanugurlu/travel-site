// src/components/common/ReviewForm.tsx
import React, { useState } from 'react';
import reviewsApiService from '../../api/reviews';
import type { CreateReviewData } from '../../api/reviews';

interface ReviewFormProps {
  tourId: string;
  onReviewSubmitted?: () => void;
  className?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ tourId, onReviewSubmitted, className = '' }) => {
  const [formData, setFormData] = useState<CreateReviewData>({
    rating: 5,
    title: '',
    content: '',
    tourId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError('Please write a review');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await reviewsApiService.createReview(formData);
      
      setSuccess(true);
      setFormData({
        rating: 5,
        title: '',
        content: '',
        tourId,
      });
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Review submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  if (success) {
    return (
      <div className={`review-form-success ${className}`}>
        <div className="success-icon">✅</div>
        <h3>Thank you for your review!</h3>
        <p>Your review has been submitted and will be published after moderation.</p>
      </div>
    );
  }

  return (
    <div className={`review-form ${className}`}>
      <h3>Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="form-group">
          <label>Rating *</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${star <= formData.rating ? 'active' : ''}`}
                onClick={() => handleRatingChange(star)}
              >
                ⭐
              </button>
            ))}
            <span className="rating-text">
              {formData.rating === 1 && 'Poor'}
              {formData.rating === 2 && 'Fair'}
              {formData.rating === 3 && 'Good'}
              {formData.rating === 4 && 'Very Good'}
              {formData.rating === 5 && 'Excellent'}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title (Optional)</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Summarize your experience..."
            className="form-input"
          />
        </div>

        {/* Content */}
        <div className="form-group">
          <label htmlFor="content">Review *</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Tell us about your experience..."
            rows={5}
            className="form-textarea"
            required
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.content.trim()}
          className="submit-btn"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <style>{`
        .review-form {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .review-form h3 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 20px 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .rating-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .star {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          transition: transform 0.2s ease;
          padding: 4px;
        }

        .star:hover {
          transform: scale(1.1);
        }

        .star.active {
          filter: brightness(1.2);
        }

        .rating-text {
          margin-left: 12px;
          font-weight: 500;
          color: #666;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          border-left: 4px solid #dc3545;
        }

        .submit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2980b9;
        }

        .submit-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .review-form-success {
          background: white;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .success-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .review-form-success h3 {
          font-size: 24px;
          color: #27ae60;
          margin: 0 0 12px 0;
        }

        .review-form-success p {
          color: #666;
          font-size: 16px;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default ReviewForm;
