import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toursApiService, { type Tour } from "../../../api/tours";
import reviewsApiService, { type Review } from "../../../api/reviews";
import Breadcrumb from "./Breadcrumb"
import FeatureDetailsArea from "./FeatureDetailsArea"
import FeatureAboutArea from "./FeatureAboutArea"
import HeaderThree from "../../../layouts/headers/HeaderThree"
import FooterThree from "../../../layouts/footers/FooterThree"

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
      `}</style>
      <HeaderThree />
      <main>
        <Breadcrumb tour={tour} />
        <FeatureDetailsArea tour={tour} />
        <FeatureAboutArea tour={tour} reviews={reviews} onReviewSubmitted={handleReviewSubmitted} />
      </main>
      <FooterThree />
    </>
  );
};

export default FeatureDetailsOne
