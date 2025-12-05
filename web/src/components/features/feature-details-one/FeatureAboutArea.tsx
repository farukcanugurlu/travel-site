import { type Tour } from "../../../api/tours";
import type { Review as ReviewModel } from "../../../api/reviews";
import AboutText from "./about/AboutText"
import Faq from "./about/Faq"
import Included from "./about/Included"
import { ReviewSection } from "./about/Review"
import ReviewDetails from "./about/ReviewDetails"
import ReviewFormArea from "./about/ReviewFormArea"
import FeatureSidebar from "./FeatureSidebar"
import SimilarTours from "./SimilarTours"

interface FeatureAboutAreaProps {
  tour: Tour;
  reviews: ReviewModel[];
  onReviewSubmitted?: () => void;
}

const FeatureAboutArea = ({ tour, reviews, onReviewSubmitted }: FeatureAboutAreaProps) => {
   return (
      <div className="tg-tour-about-area tg-tour-about-border pt-40 pb-70">
         <style>{`
           /* Mobilde Book This Tour'ı Customer Reviews'in üstüne al */
           @media (max-width: 991px) {
             /* Mobilde sağdaki sidebar'ı gizle */
             .col-xl-3.col-lg-4 {
               display: none !important;
             }
             
             /* Mobilde içerik içindeki booking section'ı göster */
             .mobile-booking-section {
               display: block !important;
             }
             
             /* Mobilde sidebar sticky olmasın */
             .mobile-booking-section .tg-tour-about-sidebar.top-sticky {
               position: relative !important;
               top: auto !important;
             }
           }
           
           /* Desktop'ta mobil booking section'ı gizle */
           @media (min-width: 992px) {
             .mobile-booking-section {
               display: none !important;
             }
           }
         `}</style>
         <div className="container">
            <div className="row">
               <div className="col-xl-9 col-lg-8">
                  <div className="tg-tour-about-wrap mr-55">
                     <div className="tg-tour-about-content">
                        <AboutText tour={tour} />
                        <div className="tg-tour-about-border mb-40"></div>
                        <Included tour={tour} />
                        <div className="tg-tour-about-border mb-40"></div>
                        <Faq tour={tour} />
                        <div className="tg-tour-about-border mb-45"></div>
                        <div className="tg-tour-about-map mb-40">
                           <h4 className="tg-tour-about-title mb-15">Location</h4>
                           <p className="text-capitalize lh-28">
                              {tour.location?.description || tour.destination?.name 
                                ? `${tour.destination?.name || ''}, ${tour.destination?.country || ''}. ${tour.location?.description || 'Explore this amazing destination with our carefully curated tour.'}`
                                : 'Explore this amazing destination with our carefully curated tour. Discover the best attractions and experiences.'
                              }
                           </p>
                           <div className="tg-tour-about-map h-100">
                              <iframe 
                                src={(() => {
                                  const lat = tour.location?.latitude || tour.destination?.latitude;
                                  const lng = tour.location?.longitude || tour.destination?.longitude;
                                  const locationName = `${tour.destination?.name || ''}, ${tour.destination?.country || ''}`;
                                  
                                  if (lat && lng) {
                                    // Use coordinates if available - Simple embed format
                                    return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`;
                                  } else {
                                    // Fallback to location name search
                                    const encodedLocation = encodeURIComponent(locationName || 'Travel Destination');
                                    return `https://maps.google.com/maps?q=${encodedLocation}&hl=en&z=14&output=embed`;
                                  }
                                })()}
                                width="600" 
                                height="450" 
                                style={{ border: "0" }} 
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                              ></iframe>
                           </div>
                        </div>
                        <div className="tg-tour-about-border mb-45"></div>
                        
                        {/* Similar Tours Section */}
                        <SimilarTours currentTour={tour} />
                        
                        <div className="tg-tour-about-border mb-45"></div>
                        
                        {/* Mobilde Book This Tour'ı buraya ekle */}
                        <div className="mobile-booking-section d-lg-none mb-40">
                          <FeatureSidebar tour={tour} />
                        </div>
                        
                        <ReviewSection reviews={reviews} tourDescription={tour.description} />
                        <div className="tg-tour-about-border mb-35"></div>
                        <ReviewDetails reviews={reviews} />
                        <div className="tg-tour-about-border mb-45"></div>
                        <ReviewFormArea tourId={tour.id} reviews={reviews} onReviewSubmitted={onReviewSubmitted} />
                     </div>
                  </div>
               </div>
               <div className="col-xl-3 col-lg-4">
                  <div className="tg-tour-about-sidebar top-sticky mb-50">
                     <FeatureSidebar tour={tour} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default FeatureAboutArea
