import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { type Tour } from "../../../api/tours";
import favoritesApiService from "../../../api/favorites";
import authApiService from "../../../api/auth";
import FeatureList from "./FeatureList";
import { normalizeImageUrl } from "../../../utils/imageUtils";

interface FeatureDetailsAreaProps {
  tour: Tour;
}

const FeatureDetailsArea = ({ tour }: FeatureDetailsAreaProps) => {

   const [isInWishlist, setIsInWishlist] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [showShareMenu, setShowShareMenu] = useState(false);
   const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

   // Debug: API'den gelen tour verisini kontrol et
   useEffect(() => {
     if (tour) {
       console.log('FeatureDetailsArea - Tour data:', {
         id: tour.id,
         title: tour.title,
         thumbnail: tour.thumbnail,
         images: tour.images,
         imagesLength: tour.images?.length,
         firstImage: tour.images?.[0],
         normalizedThumbnail: normalizeImageUrl(tour.thumbnail),
         normalizedFirstImage: normalizeImageUrl(tour.images?.[0]),
       });
     }
   }, [tour]);

   // Check wishlist status when component mounts or tour changes
   useEffect(() => {
     const checkWishlistStatus = async () => {
       if (!authApiService.isAuthenticated()) {
         setIsInWishlist(false);
         return;
       }

       const currentUser = authApiService.getCurrentUser();
       if (!currentUser || !tour?.id) {
         setIsInWishlist(false);
         return;
       }

       try {
         const favorite = await favoritesApiService.isFavorite(currentUser.id, tour.id);
         setIsInWishlist(favorite);
       } catch (error) {
         console.error('Error checking wishlist status:', error);
         setIsInWishlist(false);
       }
     };

     checkWishlistStatus();
   }, [tour?.id]);

   // Close share menu when clicking outside
   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       const target = event.target as HTMLElement;
       if (!target.closest('.tg-tour-details-video-share')) {
         setShowShareMenu(false);
       }
     };

     if (showShareMenu) {
       document.addEventListener('mousedown', handleClickOutside);
     }

     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, [showShareMenu]);

   // Handle keyboard navigation for lightbox
   useEffect(() => {
     const handleKeyDown = (event: KeyboardEvent) => {
       if (selectedImageIndex === null) return;
       
       const allImages = tour.images && tour.images.length > 0 
         ? tour.images 
         : (tour.thumbnail ? [tour.thumbnail] : []);
       
       if (event.key === 'Escape') {
         setSelectedImageIndex(null);
       } else if (event.key === 'ArrowLeft') {
         setSelectedImageIndex((prev) => {
           if (prev === null) return null;
           return prev > 0 ? prev - 1 : allImages.length - 1;
         });
       } else if (event.key === 'ArrowRight') {
         setSelectedImageIndex((prev) => {
           if (prev === null) return null;
           return prev < allImages.length - 1 ? prev + 1 : 0;
         });
       }
     };

     if (selectedImageIndex !== null) {
       document.addEventListener('keydown', handleKeyDown);
       document.body.style.overflow = 'hidden'; // Prevent body scroll
       document.body.classList.add('lightbox-open'); // Add class to hide header on mobile
     }

     return () => {
       document.removeEventListener('keydown', handleKeyDown);
       document.body.style.overflow = '';
       document.body.classList.remove('lightbox-open');
     };
   }, [selectedImageIndex, tour.images, tour.thumbnail]);

   const handleWishlistToggle = async () => {
     if (isLoading) return;
     
     // Check if user is authenticated
     if (!authApiService.isAuthenticated()) {
       // Show toast notification instead of modal
       toast.error('Please log in to add to wishlist', {
         position: "top-center",
         autoClose: 3000,
       });
       return;
     }
     
     setIsLoading(true);
     try {
       const currentUser = authApiService.getCurrentUser();
       if (!currentUser) {
         throw new Error('User not found');
       }
       
       if (isInWishlist) {
         await favoritesApiService.removeFromFavorites(currentUser.id, tour.id);
         setIsInWishlist(false);
         toast.success('Removed from wishlist');
       } else {
         await favoritesApiService.addToFavorites(currentUser.id, tour.id);
         setIsInWishlist(true);
         toast.success('Added to wishlist');
       }
     } catch (error) {
       console.error('Failed to toggle wishlist:', error);
       toast.error('Failed to update wishlist');
     } finally {
       setIsLoading(false);
     }
   };

   const handleShare = async (platform?: string) => {
     const tourUrl = `${window.location.origin}/tour/${tour.slug || tour.id}`;
     const tourTitle = tour.title;
     const tourDescription = tour.description?.substring(0, 200) || '';
     const shareText = `${tourTitle} - ${tourDescription}`;

     // Check if Web Share API is available (mobile devices)
     if (navigator.share && !platform) {
       try {
         await navigator.share({
           title: tourTitle,
           text: tourDescription,
           url: tourUrl,
         });
         setShowShareMenu(false);
         return;
       } catch (error) {
         // User cancelled or error occurred
         if ((error as Error).name !== 'AbortError') {
           console.error('Error sharing:', error);
         }
       }
     }

     // Platform-specific sharing
     let shareUrl = '';
    
     switch (platform) {
       case 'facebook':
         shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tourUrl)}`;
         break;
       case 'twitter':
         shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(tourUrl)}&text=${encodeURIComponent(tourTitle)}`;
         break;
       case 'linkedin':
         shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(tourUrl)}`;
         break;
       case 'whatsapp':
         shareUrl = `https://wa.me/?text=${encodeURIComponent(`${tourTitle} ${tourUrl}`)}`;
         break;
       case 'telegram':
         shareUrl = `https://t.me/share/url?url=${encodeURIComponent(tourUrl)}&text=${encodeURIComponent(tourTitle)}`;
         break;
       case 'copy':
         try {
           await navigator.clipboard.writeText(tourUrl);
           toast.success('Link copied to clipboard!');
           setShowShareMenu(false);
           return;
         } catch (error) {
           console.error('Failed to copy:', error);
           toast.error('Failed to copy link');
           return;
         }
       default:
         setShowShareMenu(!showShareMenu);
         return;
     }

     if (shareUrl) {
       window.open(shareUrl, '_blank', 'width=600,height=400');
       setShowShareMenu(false);
     }
   };

   return (
      <>
         <div className="tg-tour-details-area pt-35 pb-25">
            <div className="container">
               <div className="row align-items-end mb-35">
                  <div className="col-xl-9 col-lg-8">
                     <div className="tg-tour-details-video-title-wrap">
                        <h2 className="tg-tour-details-video-title mb-15">{tour.title}</h2>
                        <div className="tg-tour-details-video-location d-flex flex-wrap">
                           <span className="mr-25"><i className="fa-regular fa-location-dot"></i> {typeof tour.destination === 'string' ? tour.destination : tour.destination?.name || 'Location not specified'}</span>
                           <div className="tg-tour-details-video-ratings" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {(() => {
                                // Sadece approved review'ları al
                                const approvedReviews = tour.reviews?.filter((r: any) => r.approved !== false) || [];
                                const totalReviews = tour.rating?.total || approvedReviews.length || 0;
                                
                                const averageRating = tour.rating?.average || 
                                  (approvedReviews.length > 0
                                    ? (() => {
                                        return approvedReviews.reduce((sum: number, review: any) => {
                                          // review.rating bir obje olabilir (location, price, amenities, rooms, services)
                                          // Eğer obje ise ortalamasını al, değilse direkt sayıyı kullan
                                          let ratingValue = 0;
                                          if (typeof review.rating === 'number') {
                                            ratingValue = review.rating;
                                          } else if (typeof review.rating === 'object' && review.rating !== null) {
                                            const ratings = Object.values(review.rating).filter((v: any) => typeof v === 'number' && v > 0) as number[];
                                            if (ratings.length > 0) {
                                              ratingValue = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                                            }
                                          }
                                          return sum + ratingValue;
                                        }, 0) / approvedReviews.length;
                                      })()
                                    : 0);
                                
                                const displayRating = averageRating > 0 ? averageRating : 0;
                                const fullStars = Math.floor(displayRating);
                                const hasHalfStar = displayRating % 1 >= 0.5;
                                
                                return (
                                  <>
                                    {/* Ortalama Puan */}
                                    <span style={{ 
                                      fontWeight: 700, 
                                      fontSize: '14px', 
                                      color: '#2c3e50',
                                      lineHeight: 1,
                                      flexShrink: 0
                                    }}>
                                      {displayRating.toFixed(1)}
                                    </span>
                                    
                                    {/* Yıldızlar */}
                                    <span 
                                      className="tg-listing-rating-icon" 
                                      style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '1px',
                                        fontSize: '12px',
                                        flexShrink: 0,
                                        lineHeight: 1
                                      }}
                                    >
                                      {[...Array(5)].map((_, i) => {
                                        if (i < fullStars) {
                                          return (
                                            <i 
                                              key={i} 
                                              className="fa-sharp fa-solid fa-star"
                                              style={{ color: '#FFA500' }}
                                            ></i>
                                          );
                                        } else if (i === fullStars && hasHalfStar) {
                                          return (
                                            <i 
                                              key={i} 
                                              className="fa-sharp fa-solid fa-star-half-stroke"
                                              style={{ color: '#FFA500' }}
                                            ></i>
                                          );
                                        } else {
                                          return (
                                            <i 
                                              key={i} 
                                              className="fa-sharp fa-regular fa-star"
                                              style={{ color: '#E0E0E0' }}
                                            ></i>
                                          );
                                        }
                                      })}
                                    </span>
                                    
                                    {/* Review Sayısı */}
                                    <span 
                                      className="tg-listing-rating-percent" 
                                      style={{ 
                                        color: '#757575', 
                                        fontSize: '12px',
                                        fontWeight: 400,
                                        flexShrink: 0,
                                        lineHeight: 1,
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      ({totalReviews})
                                    </span>
                                  </>
                                );
                              })()}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-4">
                     <div className="tg-tour-details-video-share text-end" style={{ position: 'relative' }}>
                        <button
                          onClick={() => handleShare()}
                          className="btn-link"
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'inherit',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5.87746 9.03227L10.7343 11.8625M10.7272 4.05449L5.87746 6.88471M14.7023 2.98071C14.7023 4.15892 13.7472 5.11405 12.569 5.11405C11.3908 5.11405 10.4357 4.15892 10.4357 2.98071C10.4357 1.80251 11.3908 0.847382 12.569 0.847382C13.7472 0.847382 14.7023 1.80251 14.7023 2.98071ZM6.16901 7.95849C6.16901 9.1367 5.21388 10.0918 4.03568 10.0918C2.85747 10.0918 1.90234 9.1367 1.90234 7.95849C1.90234 6.78029 2.85747 5.82516 4.03568 5.82516C5.21388 5.82516 6.16901 6.78029 6.16901 7.95849ZM14.7023 12.9363C14.7023 14.1145 13.7472 15.0696 12.569 15.0696C11.3908 15.0696 10.4357 14.1145 10.4357 12.9363C10.4357 11.7581 11.3908 10.8029 12.569 10.8029C13.7472 10.8029 14.7023 11.7581 14.7023 12.9363Z" stroke="currentColor" strokeWidth="0.977778" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                           Share
                        </button>
                        
                        {/* Share Menu Dropdown */}
                        {showShareMenu && (
                          <div 
                            className="share-dropdown"
                            style={{
                              position: 'absolute',
                              top: '100%',
                              right: 0,
                              marginTop: '10px',
                              background: '#fff',
                              borderRadius: '8px',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                              padding: '12px',
                              minWidth: '200px',
                              zIndex: 1000,
                              border: '1px solid #e0e0e0'
                            }}
                          >
                            <div style={{ fontWeight: 500, marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                              Share via:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <button
                                onClick={() => handleShare('facebook')}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  borderRadius: '6px',
                                  transition: 'background 0.2s',
                                  fontSize: '14px',
                                  color: '#333'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                <i className="fa-brands fa-facebook-f" style={{ color: '#1877F2', width: '16px' }}></i>
                                Facebook
                              </button>
                              <button
                                onClick={() => handleShare('twitter')}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  borderRadius: '6px',
                                  transition: 'background 0.2s',
                                  fontSize: '14px',
                                  color: '#333'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.33161 6.77486L15.1688 0H13.7856L8.71722 5.8826L4.66907 0H0L6.12155 8.89546L0 16H1.38336L6.73581 9.78785L11.0109 16H15.68L9.33148 6.77486H9.33187H9.33161ZM7.43696 8.97374L6.81669 8.088L1.88171 1.03969H4.00634L7.98902 6.72789L8.60929 7.61362L13.7863 15.0074H11.6616L7.43709 8.974V8.97361L7.43696 8.97374Z" fill="#1DA1F2" />
                                </svg>
                                Twitter
                              </button>
                              <button
                                onClick={() => handleShare('linkedin')}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  borderRadius: '6px',
                                  transition: 'background 0.2s',
                                  fontSize: '14px',
                                  color: '#333'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                <i className="fa-brands fa-linkedin-in" style={{ color: '#0A66C2', width: '16px' }}></i>
                                LinkedIn
                              </button>
                              <button
                                onClick={() => handleShare('whatsapp')}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  borderRadius: '6px',
                                  transition: 'background 0.2s',
                                  fontSize: '14px',
                                  color: '#333'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', width: '16px' }}></i>
                                WhatsApp
                              </button>
                              <button
                                onClick={() => handleShare('telegram')}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  borderRadius: '6px',
                                  transition: 'background 0.2s',
                                  fontSize: '14px',
                                  color: '#333'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                <i className="fa-brands fa-telegram" style={{ color: '#0088cc', width: '16px' }}></i>
                                Telegram
                              </button>
                              <div style={{ borderTop: '1px solid #e0e0e0', margin: '8px 0' }}></div>
                              <button
                                onClick={() => handleShare('copy')}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  borderRadius: '6px',
                                  transition: 'background 0.2s',
                                  fontSize: '14px',
                                  color: '#333'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.6667 2H5.33333C4.59695 2 4 2.59695 4 3.33333V10.6667C4 11.403 4.59695 12 5.33333 12H10.6667C11.403 12 12 11.403 12 10.6667V3.33333C12 2.59695 11.403 2 10.6667 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M8 12V14.6667C8 15.403 7.40305 16 6.66667 16H2C1.26362 16 0.666667 15.403 0.666667 14.6667V7.33333C0.666667 6.59695 1.26362 6 2 6H4.66667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Copy Link
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={handleWishlistToggle}
                          disabled={isLoading}
                          className="ml-25 btn-link"
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'inherit',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.6 : 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                           <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.2606 10.7831L10.2878 10.8183L10.2606 10.7831L10.2482 10.7928C10.0554 10.9422 9.86349 11.0909 9.67488 11.2404C9.32643 11.5165 9.01846 11.7565 8.72239 11.9304C8.42614 12.1044 8.19324 12.1804 7.99978 12.1804C7.80633 12.1804 7.57342 12.1044 7.27718 11.9304C6.9811 11.7565 6.67312 11.5165 6.32472 11.2404C6.13618 11.091 5.94436 10.9423 5.75159 10.7929L5.73897 10.7831C4.90868 10.1397 4.06133 9.48294 3.36178 8.6911C2.51401 7.73157 1.92536 6.61544 1.92536 5.16811C1.92536 3.75448 2.71997 2.57143 3.80086 2.07481C4.84765 1.59384 6.26028 1.71692 7.61021 3.12673L7.64151 3.09675L7.61021 3.12673C7.7121 3.23312 7.85274 3.2933 7.99978 3.2933C8.14682 3.2933 8.28746 3.23312 8.38936 3.12673L8.35868 3.09736L8.38936 3.12673C9.73926 1.71692 11.1519 1.59384 12.1987 2.07481C13.2796 2.57143 14.0742 3.75448 14.0742 5.16811C14.0742 6.61544 13.4856 7.73157 12.6378 8.69109L12.668 8.71776L12.6378 8.6911C11.9382 9.48294 11.0909 10.1397 10.2606 10.7831ZM5.10884 11.6673L5.13604 11.6321L5.10884 11.6673L5.10901 11.6674C5.29802 11.8137 5.48112 11.9554 5.65523 12.0933C5.99368 12.3616 6.35981 12.6498 6.73154 12.8682L6.75405 12.8298L6.73154 12.8682C7.10315 13.0864 7.53174 13.2667 7.99978 13.2667C8.46782 13.2667 8.89641 13.0864 9.26802 12.8682L9.24552 12.8298L9.26803 12.8682C9.63979 12.6498 10.0059 12.3615 10.3443 12.0933C10.5185 11.9553 10.7016 11.8136 10.8907 11.6673L10.8907 11.6673L10.8926 11.6659C11.7255 11.0212 12.6722 10.2884 13.4463 9.41228L13.413 9.38285L13.4463 9.41227C14.4145 8.31636 15.1553 6.95427 15.1553 5.16811C15.1553 3.34832 14.1308 1.76808 12.6483 1.08693C11.2517 0.445248 9.53362 0.635775 7.99979 1.99784C6.46598 0.635775 4.74782 0.445248 3.35124 1.08693C1.86877 1.76808 0.844227 3.34832 0.844227 5.16811C0.844227 6.95427 1.58502 8.31636 2.55325 9.41227C3.32727 10.2883 4.27395 11.0211 5.10682 11.6657L5.10884 11.6673Z" fill="currentColor" stroke="currentColor" strokeWidth="0.0888889" />
                           </svg>
                           {isLoading ? 'Loading...' : (isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
                        </button>
                     </div>
                  </div>
               </div>
               <div className="row gx-15 mb-25">
                  <div className="col-lg-7">
                     <div 
                        className="tg-tour-details-video-thumb mb-15"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          const allImages = tour.images && tour.images.length > 0 
                            ? tour.images 
                            : (tour.thumbnail ? [tour.thumbnail] : []);
                          if (allImages.length > 0) {
                            setSelectedImageIndex(0);
                          }
                        }}
                     >
                        <img
                          className="w-100"
                          src={normalizeImageUrl((tour.images && tour.images[0]) || tour.thumbnail || "/assets/img/listing/listing-1.jpg")}
                          alt={tour.title}
                          style={{ transition: 'transform 0.3s ease' }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                     </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="row gx-15">
                      {(tour.images || []).slice(1, 5).map((img, idx) => {
                        const imageIndex = idx + 1; // +1 because first image is in the main column
                        return (
                        <div key={idx} className="col-lg-6 col-md-6">
                            <div 
                              className="tg-tour-details-video-thumb mb-15"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                const allImages = tour.images && tour.images.length > 0 
                                  ? tour.images 
                                  : (tour.thumbnail ? [tour.thumbnail] : []);
                                if (allImages.length > imageIndex) {
                                  setSelectedImageIndex(imageIndex);
                                }
                              }}
                            >
                              <img 
                                className="w-100" 
                                src={normalizeImageUrl(img)} 
                                alt={`${tour.title} ${idx + 2}`}
                                style={{ transition: 'transform 0.3s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
               </div>
               
               {/* Lightbox Modal */}
               {selectedImageIndex !== null && (
                 <div
                   style={{
                     position: 'fixed',
                     top: 0,
                     left: 0,
                     right: 0,
                     bottom: 0,
                     backgroundColor: 'rgba(0, 0, 0, 0.95)',
                     zIndex: 9999,
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     padding: '20px'
                   }}
                   onClick={() => setSelectedImageIndex(null)}
                 >
                   <button
                     onClick={() => setSelectedImageIndex(null)}
                     className="lightbox-close-btn"
                     style={{
                       position: 'absolute',
                       top: '20px',
                       right: '20px',
                       background: 'rgba(255, 255, 255, 0.2)',
                       border: 'none',
                       color: 'white',
                       fontSize: '32px',
                       width: '50px',
                       height: '50px',
                       borderRadius: '50%',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       transition: 'background 0.3s ease',
                       zIndex: 10000
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                   >
                     ×
                   </button>
                   
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       const allImages = tour.images && tour.images.length > 0 
                         ? tour.images 
                         : (tour.thumbnail ? [tour.thumbnail] : []);
                       if (allImages.length > 0) {
                         setSelectedImageIndex(
                           selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1
                         );
                       }
                     }}
                     className="lightbox-nav-btn lightbox-prev-btn"
                     style={{
                       position: 'absolute',
                       left: '20px',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       background: 'rgba(255, 255, 255, 0.2)',
                       border: 'none',
                       color: 'white',
                       fontSize: '24px',
                       width: '50px',
                       height: '50px',
                       borderRadius: '50%',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       transition: 'background 0.3s ease',
                       zIndex: 10000
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                   >
                     ‹
                   </button>
                   
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       const allImages = tour.images && tour.images.length > 0 
                         ? tour.images 
                         : (tour.thumbnail ? [tour.thumbnail] : []);
                       if (allImages.length > 0) {
                         setSelectedImageIndex(
                           selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0
                         );
                       }
                     }}
                     className="lightbox-nav-btn lightbox-next-btn"
                     style={{
                       position: 'absolute',
                       right: '20px',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       background: 'rgba(255, 255, 255, 0.2)',
                       border: 'none',
                       color: 'white',
                       fontSize: '24px',
                       width: '50px',
                       height: '50px',
                       borderRadius: '50%',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       transition: 'background 0.3s ease',
                       zIndex: 10000
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                   >
                     ›
                   </button>
                   
                   <div
                     onClick={(e) => e.stopPropagation()}
                     className="lightbox-image-container"
                     style={{
                       width: '100%',
                       height: '100%',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       padding: '80px 100px',
                       boxSizing: 'border-box'
                     }}
                   >
                     {(() => {
                       const allImages = tour.images && tour.images.length > 0 
                         ? tour.images 
                         : (tour.thumbnail ? [tour.thumbnail] : []);
                       const currentImage = allImages[selectedImageIndex] || tour.thumbnail || "/assets/img/listing/listing-1.jpg";
                       
                       return (
                         <img
                           src={normalizeImageUrl(currentImage)}
                           alt={`${tour.title} - Image ${selectedImageIndex! + 1}`}
                           className="lightbox-image"
                           style={{
                             maxWidth: '100%',
                             maxHeight: '100%',
                             width: 'auto',
                             height: 'auto',
                             objectFit: 'contain',
                             borderRadius: '8px',
                             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                           }}
                         />
                       );
                     })()}
                   </div>
                   
                   {/* Image counter */}
                   {(() => {
                     const allImages = tour.images && tour.images.length > 0 
                       ? tour.images 
                       : (tour.thumbnail ? [tour.thumbnail] : []);
                     return (
                       <div
                         style={{
                           position: 'absolute',
                           bottom: '20px',
                           left: '50%',
                           transform: 'translateX(-50%)',
                           color: 'white',
                           background: 'rgba(0, 0, 0, 0.5)',
                           padding: '8px 16px',
                           borderRadius: '20px',
                           fontSize: '14px'
                         }}
                       >
                         {selectedImageIndex! + 1} / {allImages.length}
                       </div>
                     );
                   })()}
                 </div>
               )}
               <div className="tg-tour-details-feature-list-wrap">
                  <div className="row align-items-center">
                     <div className="col-lg-8">
                        <div className="tg-tour-details-video-feature-list">
                           <FeatureList tour={tour} />
                        </div>
                     </div>
                     <div className="col-lg-4">
                        <div className="tg-tour-details-video-feature-price mb-15">
                           <p>From <span>${Math.min(...tour.packages.map(pkg => Number(pkg.adultPrice))).toFixed(2)}</span> / Person</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
          {/* Video modal removed for cleaner dynamic gallery */}
          
          {/* CSS to hide header when lightbox is open and improve lightbox styling */}
          <style>{`
            /* Hide header on ALL devices when lightbox is open */
            body.lightbox-open header,
            body.lightbox-open #header-sticky,
            body.lightbox-open .tg-header__area,
            body.lightbox-open .tg-header-height,
            body.lightbox-open .header-sticky {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
              z-index: -1 !important;
            }

            /* Lightbox Close Button - Mobilde sağa geç */
            @media (max-width: 991px) {
              .lightbox-close-btn {
                top: 10px !important;
                right: 10px !important;
                width: 45px !important;
                height: 45px !important;
                font-size: 28px !important;
              }
            }

            /* Lightbox Navigation Buttons - Kenarlara taşı, fotoğrafı kapatmasın */
            .lightbox-nav-btn {
              top: 50% !important;
              transform: translateY(-50%) !important;
            }

            @media (max-width: 991px) {
              .lightbox-prev-btn {
                left: 10px !important;
                width: 45px !important;
                height: 45px !important;
              }
              .lightbox-next-btn {
                right: 10px !important;
                width: 45px !important;
                height: 45px !important;
              }
            }

            @media (min-width: 992px) {
              .lightbox-prev-btn {
                left: 30px !important;
              }
              .lightbox-next-btn {
                right: 30px !important;
              }
            }

            /* Lightbox Image Container - Orijinal boyutlarında göster */
            .lightbox-image-container {
              padding: 60px 120px !important;
            }

            @media (max-width: 991px) {
              .lightbox-image-container {
                padding: 50px 70px !important;
              }
            }

            @media (max-width: 575px) {
              .lightbox-image-container {
                padding: 40px 60px !important;
              }
            }

            /* Lightbox Image - Orijinal boyutlarında, sadece ekrana sığdır */
            .lightbox-image {
              max-width: 100% !important;
              max-height: 100% !important;
              width: auto !important;
              height: auto !important;
              object-fit: contain !important;
            }
          `}</style>
       </>
    )
}

export default FeatureDetailsArea
