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
                        
                        {/* Packages Section */}
                        {tour.packages && tour.packages.length > 0 && (
                          <>
                            <div className="tg-tour-about-packages mb-40">
                              <h4 className="tg-tour-about-title mb-20">Available Packages</h4>
                              <div className="packages-list" style={{ display: 'grid', gap: '20px' }}>
                                {tour.packages.map((pkg) => (
                                  <div key={pkg.id} className="package-item" style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    background: '#f8f9fa'
                                  }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                      <h5 style={{ margin: 0, fontSize: '18px', color: '#2c3e50' }}>{pkg.name}</h5>
                                      <span style={{
                                        background: '#e3f2fd',
                                        color: '#1976d2',
                                        padding: '4px 12px',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: 500
                                      }}>
                                        {pkg.language}
                                      </span>
                                    </div>
                                    {pkg.description && (
                                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{pkg.description}</p>
                                    )}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                      <div style={{ background: 'white', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Adult</div>
                                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>€{pkg.adultPrice}</div>
                                      </div>
                                      <div style={{ background: 'white', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Child</div>
                                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>€{pkg.childPrice}</div>
                                      </div>
                                      <div style={{ background: 'white', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Infant</div>
                                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>€{pkg.infantPrice}</div>
                                      </div>
                                    </div>
                                    {pkg.capacity && (
                                      <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                                        Max {pkg.capacity} participants
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="tg-tour-about-border mb-45"></div>
                          </>
                        )}
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
                        
                        {/* Similar Tours Section - Location'un hemen altında */}
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
