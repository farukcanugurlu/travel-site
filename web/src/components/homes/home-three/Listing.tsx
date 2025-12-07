// src/components/homes/home-three/Listing.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useMemo, useState } from "react";
import Isotope from "isotope-layout";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { type Tour } from "../../../api/tours";
import toursApiService from "../../../api/tours";
import favoritesApiService from "../../../api/favorites";
import authApiService from "../../../api/auth";
import { normalizeImageUrl } from "../../../utils/imageUtils";

const Listing = () => {
  const iso = useRef<Isotope | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteTours, setFavoriteTours] = useState<Set<string>>(new Set());

  // Fetch popular tours from API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await toursApiService.getPopularTours(20); // Get popular tours (limit 20 for grid)
        setTours(data);
      } catch (err) {
        setError('Failed to load tours');
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Check favorite status for current user
  useEffect(() => {
    const checkFavorites = async () => {
      const currentUser = authApiService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        return;
      }

      try {
        const favoriteIds = new Set<string>();
        for (const tour of tours) {
          const isFavorite = await favoritesApiService.isFavorite(currentUser.id, tour.id);
          if (isFavorite) {
            favoriteIds.add(tour.id);
          }
        }
        setFavoriteTours(favoriteIds);
      } catch (error) {
        console.error('Error checking favorites:', error);
        // Don't show error to user for favorites check
      }
    };

    if (tours.length > 0) {
      checkFavorites();
    }
  }, [tours]);

  // Ensure Isotope recalculates layout after data/favorite toggles or hard reloads
  useEffect(() => {
    const raf = requestAnimationFrame(() => iso.current?.layout?.());
    const timeout = setTimeout(() => iso.current?.layout?.(), 300);
    const onLoad = () => iso.current?.layout?.();
    window.addEventListener('load', onLoad, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      window.removeEventListener('load', onLoad);
    };
  }, [tours.length, favoriteTours.size]);

  // Handle favorite toggle
  const handleFavoriteToggle = async (tour: Tour) => {
    const currentUser = authApiService.getCurrentUser();
    if (!currentUser) {
      toast.error('Please log in to add to favorites', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const isFavorite = favoriteTours.has(tour.id);
      if (isFavorite) {
        await favoritesApiService.removeFromFavorites(currentUser.id, tour.id);
        setFavoriteTours(prev => {
          const newSet = new Set(prev);
          newSet.delete(tour.id);
          return newSet;
        });
        toast.success('Removed from favorites');
      } else {
        await favoritesApiService.addToFavorites(currentUser.id, tour.id);
        setFavoriteTours(prev => new Set(prev).add(tour.id));
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  // Isotope init/destroy – sadece layout için
  useEffect(() => {
    const grid = document.querySelector(
      ".isotope-wrapper"
    ) as HTMLElement | null;
    if (!grid) return;

    let isoInstance: Isotope | null = null;
    let mounted = true;

    const waitForImages = (root: Element) =>
      new Promise<void>((resolve) => {
        const imgs = Array.from(root.querySelectorAll("img"));
        if (!imgs.length) return resolve();
        let loaded = 0;
        const done = () => {
          loaded += 1;
          if (loaded >= imgs.length) resolve();
        };
        imgs.forEach((img) => {
          const el = img as HTMLImageElement;
          if (el.complete) return done();
          el.addEventListener("load", done, { once: true });
          el.addEventListener("error", done, { once: true });
        });
      });

    const init = async () => {
      try {
        await waitForImages(grid);
        const Iso: any = (Isotope as any)?.default ?? Isotope;
        if (!mounted || !Iso) return;
        isoInstance = new Iso(grid, {
          itemSelector: ".isotope-filter-item",
          layoutMode: "fitRows",
        });
        iso.current = isoInstance;
      } catch (err) {
        // init sırasında oluşan hataları bilerek yok sayıyoruz
        void err;
      }
    };

    init();
    return () => {
      mounted = false;
      try {
        isoInstance?.destroy();
      } catch (err) {
        // destroy hatalarını da sessizce yut
        void err;
      }
      iso.current = null;
    };
  }, []);


  // Filter out stock photos - only show uploaded images
  const getValidImage = (tour: Tour): string | null => {
    // First check thumbnail
    if (tour.thumbnail) {
      const thumb = tour.thumbnail;
      // Check if it's an uploaded image (starts with /uploads/ or is a full URL with /uploads/)
      if (thumb.startsWith('/uploads/') || thumb.includes('/uploads/') || thumb.startsWith('http')) {
        // Skip stock photos and default template images
        if (!thumb.includes('/assets/img/listing/') && 
            !thumb.includes('/assets/img/hero/') && 
            !thumb.includes('listing-') && 
            !thumb.includes('default-tour') &&
            !thumb.includes('hero-')) {
          return thumb;
        }
      }
    }
    
    // Then check images array - only include uploaded images
    if (tour.images && Array.isArray(tour.images)) {
      for (const img of tour.images) {
        // Skip stock photos and default template images
        if (img && 
            !img.includes('/assets/img/listing/') && 
            !img.includes('/assets/img/hero/') && 
            !img.includes('listing-') && 
            !img.includes('default-tour') &&
            !img.includes('hero-')) {
          // Only include uploaded images or full URLs
          if (img.startsWith('/uploads/') || img.includes('/uploads/') || img.startsWith('http')) {
            return img;
          }
        }
      }
    }
    
    // No valid image found
    return null;
  };

  // Sadece home_3 grid verisi
  const gridItems = useMemo(
    () => tours,
    [tours]
  );

  return (
    <div className="tg-listing-area tg-grey-bg pt-140 pb-110 p-relative z-index-9">
      <style>{`
        .project-active-two { row-gap: 24px; }
        .isotope-wrapper { transition: height .2s ease; }
        .isotope-filter-item { will-change: transform; }
        /* Prevent overlap on hard refresh by falling back to normal flow */
        .isotope-wrapper { position: static !important; height: auto !important; }
        .isotope-filter-item { position: static !important; transform: none !important; }
        .tg-listing-card-price { display:flex !important; }
        .lexor-starts-pill{
          background: var(--tg-theme-1, #ffffff);
          color:#7f0af5;
          padding:4px 8px;
          border-radius:10px;
          font-weight:700;
          line-height:1;
          font-size:12px;
          display:inline-flex;
          align-items:center;
        }
        .lexor-price-pill{
          background: var(--tg-theme-1, #ff4d30);
          color:#fff;
          padding:6px 12px;
          border-radius:10px;
          font-weight:800;
          line-height:1;
          font-size:14px;
          display:inline-flex;
          align-items:baseline;
        }
        
        /* Kart resim sabit yükseklik */
        .tg-listing-card-thumb{
          position:relative;
          overflow:hidden;
          border-radius:16px 16px 0 0;
          aspect-ratio: 16 / 9;
          height: auto;
        }
        .tg-listing-card-thumb img{
          display:block;
          width:100%;
          height:100%;
          object-fit:cover;
          border-radius:inherit;
          transition:transform .35s ease;
        }
        .tg-listing-card-item:hover .tg-listing-card-thumb img{
          transform:scale(1.04);
        }
        .tg-thumb-link{ display:block; position:relative; z-index:1; height:100%; }
        
        /* Rating yıldızları için sarı renk */
        .tg-listing-rating-icon .fa-sharp.fa-solid.fa-star,
        .tg-listing-rating-icon .fa-sharp.fa-solid.fa-star-half-stroke {
          color: #FFA500 !important;
          -webkit-text-fill-color: #FFA500 !important;
        }
        .tg-listing-rating-icon .fa-sharp.fa-regular.fa-star {
          color: #E0E0E0 !important;
          -webkit-text-fill-color: #E0E0E0 !important;
        }
        
        /* Rating yıldızları için sarı renk - genel selector */
        .tg-listing-card-review .fa-sharp.fa-solid.fa-star,
        .tg-listing-card-review .fa-sharp.fa-solid.fa-star-half-stroke {
          color: #FFA500 !important;
          -webkit-text-fill-color: #FFA500 !important;
        }
        .tg-listing-card-review .fa-sharp.fa-regular.fa-star {
          color: #E0E0E0 !important;
          -webkit-text-fill-color: #E0E0E0 !important;
        }
        
        /* Kart overflow düzeltmesi */
        .tg-listing-card-item {
          overflow: hidden;
        }
        .tg-listing-card-price {
          overflow: hidden;
          max-width: 100%;
        }
        .tg-listing-card-review {
          overflow: visible;
          max-width: 100%;
        }
      `}</style>

      <img
        className="tg-listing-shape d-none d-lg-block"
        src="/assets/img/listing/about-shape.png"
        alt=""
      />
      <img
        className="tg-listing-shape-2 d-none d-xl-block"
        src="/assets/img/listing/about-shape-2.png"
        alt=""
      />
      <img
        className="tg-listing-shape-3 d-none d-lg-block"
        src="/assets/img/listing/about-shape-3.png"
        alt=""
      />

      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tg-listing-section-title text-center mb-35">
              <h5
                className="tg-section-subtitle wow fadeInUp"
                data-wow-delay=".3s"
                data-wow-duration=".5s"
              >
                Our Most Popular Tours
              </h5>
              <h2
                className="mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".6s"
              >
                Something Amazing Waiting For you
              </h2>
            </div>
          </div>
          {/* Başlık altındaki küçük ikon & “Tours” butonu kaldırıldı */}
        </div>

        {/* GRID */}
        <div className="row isotope-wrapper project-active-two">
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="loading-spinner">Loading tours...</div>
            </div>
          ) : error ? (
            <div className="col-12 text-center py-5">
              <div className="error-message text-danger">{error}</div>
            </div>
          ) : gridItems.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="no-tours-message">No tours available</div>
            </div>
          ) : (
            gridItems.map((item: Tour) => {
            const price = item.packages?.[0]?.adultPrice || 0;
            const priceText = price ? price.toLocaleString() : "—";
            const reviews = item.reviews?.length || 0;
            const isFavorite = favoriteTours.has(item.id);

            return (
              <div
                key={item.id}
                className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 grid-item grid-sizer isotope-filter-item"
              >
                <div className="tg-listing-card-item mb-30">
                  <div className="tg-listing-card-thumb fix mb-15 p-relative">
                    <Link to={`/tour/${item.slug}`}>
                      {(() => {
                        const validImage = getValidImage(item);
                        if (validImage) {
                          const normalizedUrl = normalizeImageUrl(validImage);
                          if (normalizedUrl) {
                            return (
                              <img
                                className="tg-card-border w-100"
                                src={normalizedUrl}
                                alt={item.title}
                              />
                            );
                          }
                        }
                        // No valid image - show placeholder
                        return (
                          <div className="tg-card-border w-100" style={{
                            height: '200px',
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '14px',
                            borderRadius: '16px 16px 0 0'
                          }}>
                            No image available
                          </div>
                        );
                      })()}
                      {item.featured && (
                        <span className="tg-listing-item-price-discount shape-3">
                          <svg
                            width="12"
                            height="14"
                            viewBox="0 0 12 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.60156 1L0.601562 8.2H6.00156L5.40156 13L11.4016 5.8H6.00156L6.60156 1Z"
                              stroke="white"
                              strokeWidth="0.857143"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Featured
                        </span>
                      )}
                    </Link>
                    {/* Wishlist heart removed on home cards per template */}
                  </div>

                  <div className="tg-listing-card-content">
                    <h4 className="tg-listing-card-title">
                      <Link to={`/tour/${item.slug}`}>{item.title}</Link>
                    </h4>

                    <div className="tg-listing-card-duration-tour">
                      <span className="tg-listing-card-duration-map mb-5">
                        <svg
                          width="13"
                          height="16"
                          viewBox="0 0 13 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.3329 6.7071C12.3329 11.2324 6.55512 15.1111 6.55512 15.1111C6.55512 15.1111 0.777344 11.2324 0.777344 6.7071C0.777344 5.16402 1.38607 3.68414 2.46962 2.59302C3.55316 1.5019 5.02276 0.888916 6.55512 0.888916C8.08748 0.888916 9.55708 1.5019 10.6406 2.59302C11.7242 3.68414 12.3329 5.16402 12.3329 6.7071Z"
                            stroke="currentColor"
                            strokeWidth="1.15556"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.55512 8.64649C7.61878 8.64649 8.48105 7.7782 8.48105 6.7071C8.48105 5.636 7.61878 4.7677 6.55512 4.7677C5.49146 4.7677 4.6292 5.636 4.6292 6.7071C4.6292 7.7782 5.49146 8.64649 6.55512 8.64649Z"
                            stroke="currentColor"
                            strokeWidth="1.15556"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {typeof item.destination === 'string' ? item.destination : item.destination?.name || 'Location not specified'}
                      </span>
                      <span className="tg-listing-card-duration-time">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.00175 3.73329V7.99996L10.8462 9.42218M15.1128 8.00003C15.1128 11.9274 11.9291 15.1111 8.00174 15.1111C4.07438 15.1111 0.890625 11.9274 0.890625 8.00003C0.890625 4.07267 4.07438 0.888916 8.00174 0.888916C11.9291 0.888916 15.1128 4.07267 15.1128 8.00003Z"
                            stroke="currentColor"
                            strokeWidth="1.06667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {item.duration || 'Duration not specified'}
                      </span>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div
                    className="tg-listing-card-price d-flex align-items-center justify-content-between"
                    style={{ marginTop: 10, flexWrap: 'nowrap', gap: '12px', maxWidth: '100%', paddingLeft: '25px', paddingRight: '18px' }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: 4, flexShrink: 0 }}
                    >
                      <span 
                        className="lexor-price-pill"
                        style={{
                          background: "#7f0af5",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: 10,
                          fontWeight: 800,
                          lineHeight: 1,
                          fontSize: 14,
                          display: "inline-flex",
                          alignItems: "baseline",
                        }}
                      >
                        <span className="currency-symbol">€</span>
                        {priceText}
                      </span>
                    </div>

                    {/* Rating - Hemen sağında */}
                    {(() => {
                      // Tour detay sayfasındaki gibi hesapla
                      const totalReviews = item.rating?.total || item.reviews?.length || 0;
                      const averageRating = item.rating?.average || 
                        (item.reviews && Array.isArray(item.reviews) && item.reviews.length > 0
                          ? (() => {
                              // Sadece approved review'ları al
                              const approvedReviews = item.reviews.filter((r: any) => r.approved !== false);
                              if (approvedReviews.length === 0) return 0;
                              
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
                      
                      // Her zaman göster (review yoksa da 0.0 göster)
                      const displayRating = averageRating > 0 ? averageRating : 0;
                      
                      return (
                        <div 
                          className="tg-listing-card-review space" 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            flexShrink: 0
                          }}
                        >
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
                              const fullStars = Math.floor(displayRating);
                              const hasHalfStar = displayRating % 1 >= 0.5;
                              if (i < fullStars) {
                                return (
                                  <i 
                                    key={i} 
                                    className="fa-sharp fa-solid fa-star"
                                  ></i>
                                );
                              } else if (i === fullStars && hasHalfStar) {
                                return (
                                  <i 
                                    key={i} 
                                    className="fa-sharp fa-solid fa-star-half-stroke"
                                  ></i>
                                );
                              } else {
                                return (
                                  <i 
                                    key={i} 
                                    className="fa-sharp fa-regular fa-star"
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
                        </div>
                      );
                    })()}
                  </div>
                  {/* /PRICE */}
                </div>
              </div>
            );
          })
          )}
        </div>

        {/* See All Tours Button */}
        <div className="row mt-50">
          <div className="col-12 text-center">
            <a 
              href="https://lexorholiday.com/tours" 
              className="tg-btn tg-btn-switch-animation"
              style={{
                display: 'inline-block',
                padding: '15px 40px',
                background: '#7f0af5',
                color: '#fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#6a08d4';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#7f0af5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              See All Tours
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
