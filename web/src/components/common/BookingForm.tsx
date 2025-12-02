// src/components/common/BookingForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toursApiService from '../../api/tours';
import type { Tour, TourPackage } from '../../api/tours';
import authApiService from '../../api/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cartSlice';

interface CreateBookingPayload {
  userId: string;
  tourId: string;
  packageId: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  tourDate: string;
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
}

interface BookingFormProps {
  tourId?: string;
  onBookingSubmitted?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ tourId: propTourId, onBookingSubmitted }) => {
  const { tourId: paramTourId } = useParams<{ tourId: string }>();
  const tourId = propTourId || paramTourId;
  const [tour, setTour] = useState<Tour | null>(null);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    packageId: '',
    adultCount: 1,
    childCount: 0,
    infantCount: 0,
    tourDate: '',
    tourTime: '',
    specialRequests: '',
    contactPhone: '',
    contactEmail: '',
  });

  const currentUser = authApiService.getCurrentUser();

  useEffect(() => {
    if (tourId) {
      fetchTourData();
    }
  }, [tourId]);

  const fetchTourData = async () => {
    try {
      setLoading(true);
      const tourData = await toursApiService.getTourById(tourId!);
      setTour(tourData);
      setPackages(tourData.packages || []);
      
      // Set default package if available
      if (tourData.packages && tourData.packages.length > 0) {
        setFormData(prev => ({ ...prev, packageId: tourData.packages[0].id }));
      }
      
      // Set default time if available times exist
      const availableTimes = Array.isArray(tourData.availableTimes) && tourData.availableTimes.length > 0 
        ? tourData.availableTimes 
        : [];
      if (availableTimes.length > 0) {
        setFormData(prev => ({ ...prev, tourTime: availableTimes[0] }));
      }
    } catch (err) {
      setError('Failed to load tour data');
      console.error('Error fetching tour:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const calculateTotal = () => {
    const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);
    if (!selectedPackage) return 0;

    const adultTotal = formData.adultCount * selectedPackage.adultPrice;
    const childTotal = formData.childCount * selectedPackage.childPrice;
    const infantTotal = formData.infantCount * selectedPackage.infantPrice;

    return adultTotal + childTotal + infantTotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please log in to make a booking');
      return;
    }

    if (!formData.packageId) {
      setError('Please select a package');
      return;
    }

    if (!formData.tourDate) {
      setError('Please select a tour date');
      return;
    }

    if (formData.adultCount < 1) {
      setError('At least 1 adult is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const selectedPackage = packages.find(pkg => pkg.id === formData.packageId)!;
      const totalAmount = calculateTotal();

      // Build cart item compatible with template cart
      const cartItem = {
        id: `${tourId}-${formData.packageId}-${formData.tourDate}-${formData.tourTime || ''}-${formData.adultCount}-${formData.childCount}-${formData.infantCount}`,
        title: `${tour?.title || 'Tour'} - ${selectedPackage.name} (${formData.tourDate}${formData.tourTime ? ` ${formData.tourTime}` : ''})`,
        price: totalAmount,
        thumb: (() => {
          const imgUrl = tour?.images?.[0] || tour?.thumbnail || '/assets/img/listing/listing-1.jpg';
          if (!imgUrl) return '/assets/img/listing/listing-1.jpg';
          if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) return imgUrl;
          if (imgUrl.startsWith('/uploads/')) {
            return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imgUrl}`;
          }
          return imgUrl;
        })(),
        // extra meta if needed by future UI
        tourId: tourId!,
        packageId: formData.packageId,
        tourDate: formData.tourDate,
        tourTime: formData.tourTime || undefined,
        participants: {
          adults: formData.adultCount,
          children: formData.childCount,
          infants: formData.infantCount,
        },
      } as any;

      dispatch(addToCart(cartItem));
      toast.success('Added to cart. Redirecting to cart...');
      navigate('/cart');
    } catch (err) {
      setError('Failed to add to cart');
      console.error('Error adding booking to cart:', err);
      toast.error('Failed to add to cart');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner">Loading tour data...</div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="booking-error">
        <p>Tour not found</p>
      </div>
    );
  }

  const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);
  const totalAmount = calculateTotal();

  return (
    <div className="booking-form-container">
      <div className="booking-header">
        <h2>Book This Tour</h2>
        <div className="tour-info">
          <img src={tour.thumbnail || '/assets/img/listing/listing-1.jpg'} alt={tour.title} />
          <div>
            <h3>{tour.title}</h3>
            <p>{tour.destination?.name}, {tour.destination?.country}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Package Selection */}
        <div className="form-section">
          <h3>Select Package</h3>
          <div className="package-options">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`package-option ${formData.packageId === pkg.id ? 'selected' : ''}`}
                onClick={() => handleInputChange('packageId', pkg.id)}
              >
                <div className="package-header">
                  <h4>{pkg.name}</h4>
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
              </div>
            ))}
          </div>
        </div>

        {/* Participants */}
        <div className="form-section">
          <h3>Number of Participants</h3>
          <div className="participants-grid">
            <div className="form-group">
              <label htmlFor="adultCount">Adults *</label>
              <input
                type="number"
                id="adultCount"
                value={formData.adultCount}
                onChange={(e) => handleInputChange('adultCount', parseInt(e.target.value))}
                min="1"
                max="20"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="childCount">Children</label>
              <input
                type="number"
                id="childCount"
                value={formData.childCount}
                onChange={(e) => handleInputChange('childCount', parseInt(e.target.value))}
                min="0"
                max="20"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="infantCount">Infants</label>
              <input
                type="number"
                id="infantCount"
                value={formData.infantCount}
                onChange={(e) => handleInputChange('infantCount', parseInt(e.target.value))}
                min="0"
                max="20"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Tour Date */}
        <div className="form-section">
          <h3>Tour Date & Time</h3>
          <div className="form-group">
            <label htmlFor="tourDate">Select Date *</label>
            <input
              type="date"
              id="tourDate"
              value={formData.tourDate}
              onChange={(e) => handleInputChange('tourDate', e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          {tour && Array.isArray(tour.availableTimes) && tour.availableTimes.length > 0 && (
            <div className="form-group">
              <label htmlFor="tourTime">Select Time *</label>
              <select
                id="tourTime"
                value={formData.tourTime}
                onChange={(e) => handleInputChange('tourTime', e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select a time</option>
                {tour.availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactPhone">Phone Number</label>
              <input
                type="tel"
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+90 555 123 4567"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail">Email</label>
              <input
                type="email"
                id="contactEmail"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="your@email.com"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className="form-section">
          <h3>Special Requests</h3>
          <div className="form-group">
            <label htmlFor="specialRequests">Additional Information</label>
            <textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Any special requirements or requests..."
              rows={4}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Total Calculation */}
        <div className="total-section">
          <div className="total-breakdown">
            <h3>Booking Summary</h3>
            {selectedPackage && (
              <div className="breakdown-item">
                <span>{formData.adultCount} Adult(s) × €{selectedPackage.adultPrice}</span>
                <span>€{formData.adultCount * selectedPackage.adultPrice}</span>
              </div>
            )}
            {selectedPackage && formData.childCount > 0 && (
              <div className="breakdown-item">
                <span>{formData.childCount} Child(ren) × €{selectedPackage.childPrice}</span>
                <span>€{formData.childCount * selectedPackage.childPrice}</span>
              </div>
            )}
            {selectedPackage && formData.infantCount > 0 && (
              <div className="breakdown-item">
                <span>{formData.infantCount} Infant(s) × €{selectedPackage.infantPrice}</span>
                <span>€{formData.infantCount * selectedPackage.infantPrice}</span>
              </div>
            )}
            <div className="total-amount">
              <span>Total Amount:</span>
              <span>€{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-book"
            disabled={submitting || !currentUser}
          >
            {submitting ? 'Processing...' : 'Book Now'}
          </button>
        </div>
      </form>

      <style>{`
        .booking-form-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .booking-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .loading-spinner {
          font-size: 18px;
          color: #666;
        }

        .booking-error {
          text-align: center;
          padding: 40px;
          color: #e74c3c;
        }

        .booking-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }

        .booking-header h2 {
          font-size: 28px;
          margin: 0 0 20px 0;
        }

        .tour-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .tour-info img {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
        }

        .tour-info h3 {
          font-size: 20px;
          margin: 0 0 8px 0;
        }

        .tour-info p {
          margin: 0;
          opacity: 0.9;
        }

        .booking-form {
          padding: 30px;
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .form-section h3 {
          font-size: 20px;
          color: #2c3e50;
          margin: 0 0 20px 0;
        }

        .package-options {
          display: grid;
          gap: 15px;
        }

        .package-option {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .package-option:hover {
          border-color: #3498db;
        }

        .package-option.selected {
          border-color: #3498db;
          background: #f8f9ff;
        }

        .package-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .package-header h4 {
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
          background: #f8f9fa;
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
          margin: 0;
        }

        .participants-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .form-input,
        .form-textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-textarea {
          resize: vertical;
        }

        .total-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .total-breakdown h3 {
          font-size: 18px;
          color: #2c3e50;
          margin: 0 0 15px 0;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .breakdown-item:last-of-type {
          border-bottom: none;
        }

        .total-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          border-top: 2px solid #3498db;
          margin-top: 10px;
        }

        .form-actions {
          text-align: center;
        }

        .btn-book {
          background: #28a745;
          color: white;
          padding: 15px 40px;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-book:hover:not(:disabled) {
          background: #218838;
        }

        .btn-book:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 6px;
          border-left: 4px solid #dc3545;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .booking-form {
            padding: 20px;
          }

          .tour-info {
            flex-direction: column;
            text-align: center;
          }

          .participants-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .package-prices {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingForm;
