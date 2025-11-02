import React, { useState } from 'react';
import reviewsApiService from '../../api/reviews';
import authApiService from '../../api/auth';

interface ReviewFormProps {
  tourId: string;
  rating?: number;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ tourId, rating = 5, onReviewSubmitted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const currentUser = authApiService.getCurrentUser();
    if (!currentUser) {
      setError('Please log in to write a review');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      // Keep template look; submit minimal required review fields
      const payload = {
        rating,
        title: name || undefined,
        content: message,
        tourId,
        // backend requires userId
        userId: currentUser.id,
      } as any;
      // eslint-disable-next-line no-console
      console.log('Submitting review payload:', payload);
      const created = await reviewsApiService.createReview(payload);
      // eslint-disable-next-line no-console
      console.log('Review created response:', created);
      if (!created || !created.id) {
        throw new Error('Review create returned no id');
      }
      setName('');
      setEmail('');
      setMessage('');
      setSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      setError('Failed to submit review');
      // eslint-disable-next-line no-console
      console.error('Review submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-6 mb-15">
          <input
            className="input"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-lg-6 mb-15">
          <input
            className="input"
            type="email"
            placeholder="E-mail Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-lg-12">
          <textarea
            className="textarea  mb-5"
            placeholder="Write Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="review-checkbox d-flex align-items-center mb-25">
            <input className="tg-checkbox" type="checkbox" id="australia" />
            <label htmlFor="australia" className="tg-label">Save my name, email, and website in this browser for the next time I comment.</label>
          </div>
          {success && (
            <div style={{ color: '#28a745', marginBottom: 10 }}>Thank you! Your review has been submitted.</div>
          )}
          {error && (
            <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>
          )}
          <button type="submit" disabled={submitting} className="tg-btn tg-btn-switch-animation">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;
