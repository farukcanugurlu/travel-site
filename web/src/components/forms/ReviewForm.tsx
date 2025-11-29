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

  const currentUser = authApiService.getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  // Show disabled message for non-admin users
  if (!isAdmin) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px', 
        textAlign: 'center',
        color: '#666',
        marginBottom: '60px'
      }}>
        <p style={{ margin: 0, fontSize: '16px' }}>
          <strong>Geçici olarak devre dışı</strong>
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
          Yorum yapma özelliği şu anda sadece yöneticiler için açıktır.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
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
    <form onSubmit={handleSubmit} style={{ marginBottom: '60px' }}>
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
          <button type="submit" disabled={submitting} className="tg-btn tg-btn-switch-animation" style={{ marginBottom: '40px' }}>
            {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;
