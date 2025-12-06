import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Tour } from '../../../api/tours';
import toursApiService from '../../../api/tours';
import { normalizeImageUrl } from '../../../utils/imageUtils';

interface SimilarToursProps {
  currentTour: Tour;
}

const SimilarTours: React.FC<SimilarToursProps> = ({ currentTour }) => {
  const [similarTours, setSimilarTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarTours();
  }, [currentTour]);

  const fetchSimilarTours = async () => {
    try {
      setLoading(true);
      
      // Mevcut turun fiyatını hesapla (en düşük paket fiyatı)
      const currentTourPrice = currentTour.packages && currentTour.packages.length > 0
        ? Math.min(...currentTour.packages.map(pkg => Number(pkg.adultPrice)))
        : 0;

      // Fiyat aralığı: %50 daha ucuz veya %100 daha pahalı
      const minPrice = currentTourPrice > 0 ? Math.max(0, currentTourPrice * 0.5) : undefined;
      const maxPrice = currentTourPrice > 0 ? currentTourPrice * 2 : undefined;

      // Önce aynı destination'dan turları getir
      const destinationTours = await toursApiService.getTours({
        destination: typeof currentTour.destination === 'object' 
          ? currentTour.destination.slug 
          : currentTour.destination,
        published: true,
      });

      // Mevcut turu hariç tut ve fiyat filtresi uygula
      let filteredTours = destinationTours
        .filter(tour => tour.id !== currentTour.id)
        .filter(tour => {
          if (!tour.packages || tour.packages.length === 0) return false;
          const tourPrice = Math.min(...tour.packages.map(pkg => Number(pkg.adultPrice)));
          
          if (minPrice !== undefined && maxPrice !== undefined) {
            return tourPrice >= minPrice && tourPrice <= maxPrice;
          }
          return true;
        });

      // Eğer aynı destination'dan yeterli tur yoksa, benzer fiyat aralığındaki turları da ekle
      if (filteredTours.length < 4 && currentTourPrice > 0) {
        const priceRangeTours = await toursApiService.getTours({
          published: true,
        });

        const additionalTours = priceRangeTours
          .filter(tour => 
            tour.id !== currentTour.id && 
            !filteredTours.some(ft => ft.id === tour.id)
          )
          .filter(tour => {
            if (!tour.packages || tour.packages.length === 0) return false;
            const tourPrice = Math.min(...tour.packages.map(pkg => Number(pkg.adultPrice)));
            return tourPrice >= minPrice! && tourPrice <= maxPrice!;
          })
          .slice(0, 4 - filteredTours.length);

        filteredTours = [...filteredTours, ...additionalTours];
      }

      // Sıralama: Önce aynı destination, sonra benzer fiyat
      filteredTours.sort((a, b) => {
        const aIsSameDestination = typeof currentTour.destination === 'object'
          ? (typeof a.destination === 'object' ? a.destination.id === currentTour.destination.id : false)
          : false;
        const bIsSameDestination = typeof currentTour.destination === 'object'
          ? (typeof b.destination === 'object' ? b.destination.id === currentTour.destination.id : false)
          : false;

        if (aIsSameDestination && !bIsSameDestination) return -1;
        if (!aIsSameDestination && bIsSameDestination) return 1;

        // Fiyat farkına göre sırala (daha yakın fiyatlar önce)
        const aPrice = Math.min(...a.packages.map(pkg => Number(pkg.adultPrice)));
        const bPrice = Math.min(...b.packages.map(pkg => Number(pkg.adultPrice)));
        const aDiff = Math.abs(aPrice - currentTourPrice);
        const bDiff = Math.abs(bPrice - currentTourPrice);
        return aDiff - bDiff;
      });

      // Maksimum 4 tur göster
      setSimilarTours(filteredTours.slice(0, 4));
    } catch (error) {
      console.error('Error fetching similar tours:', error);
      setSimilarTours([]);
    } finally {
      setLoading(false);
    }
  };

  // Eğer yeterli benzer tur yoksa (3'ten az), hiçbir şey gösterme
  if (loading || similarTours.length < 3) {
    return null;
  }

  const getTourImage = (tour: Tour) => {
    const imgUrl = tour.images?.[0] || tour.thumbnail;
    return normalizeImageUrl(imgUrl);
  };

  const getTourPrice = (tour: Tour) => {
    if (!tour.packages || tour.packages.length === 0) return 0;
    return Math.min(...tour.packages.map(pkg => Number(pkg.adultPrice)));
  };

  const getTourRating = (tour: Tour) => {
    if (!tour.reviews || tour.reviews.length === 0) return { average: 0, total: 0 };
    const approvedReviews = tour.reviews.filter((r: any) => r.approved);
    if (approvedReviews.length === 0) return { average: 0, total: 0 };
    const sum = approvedReviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0);
    return {
      average: sum / approvedReviews.length,
      total: approvedReviews.length,
    };
  };

  return (
    <div className="similar-tours-section">
      <h4 className="tg-tour-about-title mb-20">Similar Tours</h4>
      <div className="similar-tours-grid">
        {similarTours.map((tour) => {
          const imageUrl = getTourImage(tour);
          const price = getTourPrice(tour);
          const rating = getTourRating(tour);
          const destinationName = typeof tour.destination === 'object' 
            ? tour.destination.name 
            : tour.destination || 'Unknown';

          return (
            <Link 
              key={tour.id} 
              to={`/tour-details?slug=${tour.slug}`}
              className="similar-tour-card"
            >
              <div className="similar-tour-image">
                {imageUrl ? (
                  <img src={imageUrl} alt={tour.title} />
                ) : (
                  <div className="similar-tour-placeholder">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                )}
                {tour.featured && (
                  <span className="similar-tour-featured">Featured</span>
                )}
              </div>
              <div className="similar-tour-content">
                <h5 className="similar-tour-title">{tour.title}</h5>
                <div className="similar-tour-meta">
                  <span className="similar-tour-location">
                    <i className="fa-regular fa-location-dot"></i> {destinationName}
                  </span>
                  {tour.duration && (
                    <span className="similar-tour-duration">
                      <i className="fa-regular fa-clock"></i> {tour.duration}
                    </span>
                  )}
                </div>
                {rating.total > 0 && (
                  <div className="similar-tour-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i}
                          className={`fa-sharp fa-solid fa-star ${i < Math.round(rating.average) ? 'filled' : ''}`}
                        ></i>
                      ))}
                    </div>
                    <span className="rating-text">({rating.total})</span>
                  </div>
                )}
                <div className="similar-tour-price">
                  <span className="price-label">From</span>
                  <span className="price-amount">€{price}</span>
                  <span className="price-per">/ person</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .similar-tours-section {
          margin-top: 40px;
          margin-bottom: 40px;
        }

        .similar-tours-section h4 {
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 25px;
        }

        .similar-tours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        .similar-tour-card {
          display: block;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
        }

        .similar-tour-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .similar-tour-image {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .similar-tour-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .similar-tour-card:hover .similar-tour-image img {
          transform: scale(1.05);
        }

        .similar-tour-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ccc;
          background: #f9f9f9;
        }

        .similar-tour-featured {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #e74c3c;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .similar-tour-content {
          padding: 20px;
        }

        .similar-tour-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 12px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .similar-tour-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #666;
        }

        .similar-tour-location,
        .similar-tour-duration {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .similar-tour-location i,
        .similar-tour-duration i {
          font-size: 12px;
          color: #999;
        }

        .similar-tour-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .similar-tour-rating .stars {
          display: flex;
          gap: 2px;
        }

        .similar-tour-rating .stars i {
          font-size: 12px;
          color: #ddd;
        }

        .similar-tour-rating .stars i.filled {
          color: #f39c12;
        }

        .similar-tour-rating .rating-text {
          font-size: 12px;
          color: #666;
        }

        .similar-tour-price {
          display: flex;
          align-items: baseline;
          gap: 5px;
          padding-top: 15px;
          border-top: 1px solid #f0f0f0;
        }

        .similar-tour-price .price-label {
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
        }

        .similar-tour-price .price-amount {
          font-size: 22px;
          font-weight: 700;
          color: #2ecc71;
        }

        .similar-tour-price .price-per {
          font-size: 12px;
          color: #999;
        }

        @media (max-width: 768px) {
          .similar-tours-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }

          .similar-tour-content {
            padding: 15px;
          }

          .similar-tour-title {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .similar-tours-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SimilarTours;


