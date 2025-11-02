/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import FeatureTop from "./FeatureTop";
import FeatureSidebar from "./FeatureSidebar";
import ReactPaginate from "react-paginate";
import { useTours } from "../../../hooks/useTours";

const ITEMS_PER_PAGE = 9;

const FeatureArea = () => {
  const { tours, loading, error } = useTours();
  const [isListView, setIsListView] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Debug: API'den gelen verileri konsola yazdır
  useEffect(() => {
    console.log('FeatureArea - API Data:', { tours, loading, error });
    console.log('Tours count:', tours?.length);
    console.log('Tours data:', tours);
  }, [tours, loading, error]);

  // API'den gelen turları kullan
  const shopItems = useMemo(
    () => Array.isArray(tours) ? tours : [],
    [tours]
  );

  // Filtered products'i başlangıçta tüm turlar olarak ayarla
  useEffect(() => {
    if (shopItems.length > 0 && filteredProducts.length === 0) {
      setFilteredProducts(shopItems);
    }
  }, [shopItems, filteredProducts.length]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const currentItems = useMemo(() => {
    const start = itemOffset;
    const end = Math.min(itemOffset + ITEMS_PER_PAGE, totalItems);
    return filteredProducts.slice(start, end);
  }, [filteredProducts, itemOffset, totalItems]);

  useEffect(() => {
    // filtreler değiştiğinde sayfalama başa dönsün
    setItemOffset(0);
  }, [filteredProducts]);

  const startOffset = Math.min(itemOffset + 1, totalItems || 1);
  const endOffset = Math.min(itemOffset + ITEMS_PER_PAGE, totalItems);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newOffset = selected * ITEMS_PER_PAGE;
    setItemOffset(newOffset);
  };

  const handleListViewClick = () => setIsListView(true);
  const handleGridViewClick = () => setIsListView(false);

  // Loading durumu
  if (loading) {
    return (
      <div className="tg-listing-grid-area mb-85">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading tours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error durumu
  if (error) {
    console.warn('Tours loading error:', error);
  }

  return (
    <div className="tg-listing-grid-area mb-85">
      {/* Görsel, hover ve kart küçük düzeltmeleri */}
      <style>{`
        .tg-listing-card-thumb{
          position:relative;
          overflow:hidden;
          border-radius:16px 16px 0 0;
        }
        .tg-listing-card-thumb img{
          display:block;
          width:100%;
          height:auto;
          border-radius:inherit;
          transition:transform .35s ease;
          object-fit:cover;
        }
        .tg-listing-card-item:hover .tg-listing-card-thumb img{
          transform:scale(1.04);
        }
        .tg-thumb-link{ display:block; position:relative; z-index:1; }
        /* wishlist tamamen kaldırıldı */
      `}</style>

      <div className="container">
        <div className="row">
          {/* SOL FİLTRE */}
          <FeatureSidebar setProducts={setFilteredProducts} allProducts={shopItems} />

          {/* SAĞ LİSTE */}
          <div className="col-xl-9 col-lg-8">
            <div className="tg-listing-item-box-wrap ml-10">
              <FeatureTop
                startOffset={startOffset}
                endOffset={endOffset}
                totalItems={totalItems}
                setProducts={setFilteredProducts}
                allProducts={shopItems}
                isListView={isListView}
                handleListViewClick={handleListViewClick}
                handleGridViewClick={handleGridViewClick}
              />

              <div className="tg-listing-grid-item">
                <div
                  className={`row list-card ${
                    isListView ? "list-card-open" : ""
                  }`}
                >
                  {currentItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="col-xxl-4 col-xl-6 col-lg-6 col-md-6 tg-grid-full"
                    >
                      <div className="tg-listing-card-item mb-30">
                        {/* THUMB */}
                        <div className="tg-listing-card-thumb fix mb-15 p-relative">
                          {/* Görselin tamamı linkli */}
                          <Link
                            to={`/tour/${item.slug || item.id}`}
                            className="tg-thumb-link"
                            aria-label={item.title}
                          >
                            <img
                              className="tg-card-border w-100"
                              src={item.thumb}
                              alt="listing"
                            />
                            {item.tag &&
                              // Avoid duplicate "Featured" badges when item is featured
                              (!item.featured || String(item.tag).toLowerCase() !== 'featured') && (
                                <span className="tg-listing-item-price-discount shape">
                                  {item.tag}
                                </span>
                              )}
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
                            {item.offer && (
                              <span className="tg-listing-item-price-discount offer-btm shape-2">
                                {item.offer}
                              </span>
                            )}
                          </Link>
                        </div>

                        {/* CONTENT */}
                        <div className="tg-listing-main-content">
                          <div className="tg-listing-card-content">
                            <h4 className="tg-listing-card-title">
                              <Link to={`/tour/${item.slug || item.id}`}>{item.title}</Link>
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
                                {item.location ?? item.destination}
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
                                {item.duration ?? item.time}
                              </span>
                            </div>
                          </div>

                          {/* PRICE + REVIEWS */}
                          <div
                            className="tg-listing-card-price d-flex align-items-center"
                            style={{ marginTop: 10 }}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{
                                gap: 4,
                                marginLeft: 16,
                                marginRight: 18,
                              }}
                            >
                              <span
                                style={{
                                  background: "var(--tg-theme-1, #ffffff)",
                                  color: "#7f0af5",
                                  padding: "4px 8px",
                                  borderRadius: 10,
                                  fontWeight: 700,
                                  lineHeight: 1,
                                  fontSize: 12,
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                Starts
                              </span>
                              <span
                                style={{
                                  background: "var(--tg-theme-1, #ff4d30)",
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
                                <span className="currency-symbol">$</span>
                                {item.price}
                              </span>
                            </div>

                            <div className="tg-listing-card-review space">
                              <span className="tg-listing-rating-icon">
                                <i className="fa-sharp fa-solid fa-star"></i>
                              </span>
                              <span className="tg-listing-rating-percent">
                                ({item.total_review ?? 0} Reviews)
                              </span>
                            </div>
                          </div>
                          {/* /PRICE */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="tg-pagenation-wrap text-center mt-50 mb-30">
                  <nav>
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel={<i className="p-btn">Next Page</i>}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      pageCount={totalPages}
                      previousLabel={<i className="p-btn">Previous Page</i>}
                      renderOnZeroPageCount={null}
                    />
                  </nav>
                </div>
              </div>

              {/* boş liste uyarısı */}
              {totalItems === 0 && (
                <div className="text-center py-5">
                  No tours found. Try clearing filters.
                </div>
              )}
            </div>
          </div>
          {/* /SAĞ LİSTE */}
        </div>
      </div>
    </div>
  );
};

export default FeatureArea;
