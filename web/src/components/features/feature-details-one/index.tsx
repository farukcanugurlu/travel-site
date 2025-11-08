import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toursApiService, { type Tour } from "../../../api/tours";
import reviewsApiService, { type Review } from "../../../api/reviews";
import FeatureDetailsArea from "./FeatureDetailsArea"
import FeatureAboutArea from "./FeatureAboutArea"
import HeaderThree from "../../../layouts/headers/HeaderThree"
import FooterThree from "../../../layouts/footers/FooterThree"
import Breadcrumb from "./Breadcrumb"

interface FeatureDetailsOneProps {
  slug?: string;
}

const FeatureDetailsOne = ({ slug: propSlug }: FeatureDetailsOneProps) => {
  const { slug: urlSlug } = useParams<{ slug: string }>();
  const slug = propSlug || urlSlug;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      const tourData = await toursApiService.getTourBySlug(slug);
      
      if (!tourData || !tourData.id) {
        throw new Error('Tour not found');
      }
      
      setTour(tourData);
      
      // Fetch reviews for this tour
      try {
        const tourReviews = await reviewsApiService.getTourReviews(tourData.id);
        setReviews(tourReviews);
      } catch (reviewError) {
        console.warn('Failed to fetch reviews:', reviewError);
        setReviews([]);
      }
    } catch (err) {
      console.error('Failed to fetch tour data:', err);
      setError('Tour not found');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = async () => {
    if (tour) {
      try {
        const tourReviews = await reviewsApiService.getTourReviews(tour.id);
        setReviews(tourReviews);
      } catch (reviewError) {
        console.warn('Failed to refresh reviews:', reviewError);
      }
    }
  };

  if (loading) {
    return (
      <>
        <HeaderThree />
        <main>
          <div className="container" style={{ padding: '50px 20px', textAlign: 'center' }}>
            <div className="loading-spinner">Loading tour details...</div>
          </div>
        </main>
        <FooterThree />
      </>
    );
  }

  if (error || !tour) {
    return (
      <>
        <HeaderThree />
        <main>
          <div className="container" style={{ padding: '50px 20px', textAlign: 'center' }}>
            <h1>Tour Not Found</h1>
            <p>The tour "{slug}" you're looking for doesn't exist.</p>
            <p>Please check the URL or go back to the <a href="/tours">tours page</a>.</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          </div>
        </main>
        <FooterThree />
      </>
    );
  }

  return (
    <>
      <style>{`
        /* (TR) Tour detay sayfasında footer üst boşluğunu ana sayfayla aynı yap */
        footer .tg-footer-area.tg-footer-space {
          padding-top: 56px !important;
        }
        @media (min-width: 1200px) {
          footer .tg-footer-area.tg-footer-space {
            padding-top: 64px !important;
          }
        }
        
        /* (TR) Header'ı absolute position yap ve breadcrumb'ın arkasında görünsün */
        header.tg-header-height {
          position: absolute !important;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 9999 !important;
        }
        .tg-header__area {
          position: relative !important;
          z-index: 9999 !important;
          background: transparent !important;
        }
        .tg-header__area.header-sticky {
          position: fixed !important;
          z-index: 9999 !important;
          background: rgba(255, 255, 255, 0.95) !important;
        }
        
        /* (TR) Breadcrumb header'ın arkasında görünsün */
        .tg-breadcrumb-spacing-3 {
          position: relative;
          z-index: 1;
          margin-top: 0;
          padding-top: 142px !important; /* Header yüksekliği için padding */
        }
        
        .tg-tour-details-area {
          position: relative;
          z-index: 1;
        }
        main {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <Breadcrumb tour={tour} />
      <HeaderThree />
      <main>
        <FeatureDetailsArea tour={tour} />
        <FeatureAboutArea tour={tour} reviews={reviews} onReviewSubmitted={handleReviewSubmitted} />
      </main>
      <FooterThree />
    </>
  );
};

export default FeatureDetailsOne
