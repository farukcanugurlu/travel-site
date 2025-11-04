/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PriceRange from "./PriceRange";
import toursApiService from "../../../api/tours";
import type { Destination } from "../../../api/tours";

const TOUR_PAGES = new Set(["shop_2", "home_3"]);

const LANGUAGE_OPTIONS = ["English", "Russian"] as const;

interface FeatureSidebarProps {
  setProducts: (products: any[]) => void;
  allProducts?: any[]; // API'den gelen veriler
}

const FeatureSidebar = ({ setProducts, allProducts = [] }: FeatureSidebarProps) => {
  const locationHook = useLocation();

  // Destinations state
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destinationsLoading, setDestinationsLoading] = useState(true);

  // Redux'tan veri çekmek yerine, parent'tan gelen verileri kullan
  // const allProducts = useSelector(selectProducts);

  const all = useMemo<any[]>(
    () => (Array.isArray(allProducts) ? allProducts : []),
    [allProducts]
  );

  // Destinations'ı API'den çek
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setDestinationsLoading(true);
        const dests = await toursApiService.getDestinations();
        setDestinations(dests);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setDestinations([]);
      } finally {
        setDestinationsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // 1) Önce shop_2/home_3 süz
  const pageFiltered = useMemo(
    () =>
      all.filter((p: any) =>
        TOUR_PAGES.has(String(p?.page ?? "").toLowerCase())
      ),
    [all]
  );

  // 2) Eğer boşsa, fallback olarak tüm ürünler
  const baseProducts = pageFiltered.length ? pageFiltered : all;

  // fiyat okuma - packages'dan en düşük fiyatı al
  const getPrice = useCallback((p: any): number | null => {
    // Önce packages'dan kontrol et (API'den gelen turlarda fiyat burada)
    if (p?.packages && Array.isArray(p.packages) && p.packages.length > 0) {
      const prices = p.packages
        .map((pkg: any) => {
          const price = pkg?.adultPrice;
          if (price == null) return null;
          // Decimal tipini number'a çevir
          let num: number;
          if (typeof price === "number") {
            num = price;
          } else if (typeof price === "string") {
            num = Number(price.replace(/[^\d.,]/g, "").replace(",", "."));
          } else {
            // Decimal veya diğer tipler için
            num = Number(price);
          }
          return Number.isFinite(num) && num > 0 ? num : null;
        })
        .filter((pr: number | null) => pr != null) as number[];
      
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        return minPrice;
      }
    }
    
    // Fallback: Diğer fiyat alanlarını kontrol et
    const raw =
      p?.price ??
      p?.current_price ??
      p?.amount ??
      p?.new_price ??
      p?.cost ??
      null;
    if (raw == null) return null;
    if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
    if (typeof raw === "string") {
      const num = Number(raw.replace(/[^\d.,]/g, "").replace(",", "."));
      return Number.isFinite(num) ? num : null;
    }
    return null;
  }, []);

  const maxPrice = useMemo(() => {
    let max = 0;
    for (const p of baseProducts) {
      const pr = getPrice(p);
      if (typeof pr === "number" && pr > max) max = pr;
    }
    console.log('Max price calculated:', max, 'from', baseProducts.length, 'tours');
    return max;
  }, [baseProducts, getPrice]);

  // state - Multiple destination selection
  const [selectedDestinations, setSelectedDestinations] = useState<Set<string>>(new Set());
  const [languageSelected, setLanguageSelected] = useState<
    "" | (typeof LANGUAGE_OPTIONS)[number]
  >("");
  const [priceValue, setPriceValue] = useState<[number, number]>([0, 0]);

  // fiyat aralığı
  useEffect(() => {
    if (maxPrice > 0) setPriceValue([0, maxPrice]);
    else setPriceValue([0, 0]);
  }, [maxPrice]);

  // URL -> destination ön-seçimi (yalnızca eşleşiyorsa uygula)
  useEffect(() => {
    const qs = new URLSearchParams(locationHook.search);
    const selected = qs.get("destination") || qs.get("location");
    if (selected && destinations.length > 0) {
      // Destinations'a göre kontrol et
      const matchingDest = destinations.find(d => 
        d.name.toLowerCase() === selected.toLowerCase() || 
        d.slug.toLowerCase() === selected.toLowerCase()
      );
      if (matchingDest) {
        setSelectedDestinations(new Set([matchingDest.name]));
      }
    }
  }, [locationHook.search, destinations]);

  // Selected destinations'ı array'e çevir (useEffect dependency için)
  // Set değiştiğinde yeni array oluştur
  const selectedDestinationsArray = useMemo(() => {
    const arr = Array.from(selectedDestinations).sort();
    return arr;
  }, [selectedDestinations.size, JSON.stringify(Array.from(selectedDestinations).sort())]);

  // Filtre uygula
  useEffect(() => {
    let filtered = [...baseProducts];
    
    // Aktif filtreleri kontrol et
    const hasDestinationFilter = selectedDestinationsArray.length > 0;
    const hasLanguageFilter = !!languageSelected;
    const [minP, maxP] = priceValue;
    
    // Fiyat filtresi aktif mi? (kullanıcı slider'ı varsayılan değerlerden değiştirmiş mi?)
    // Varsayılan değerler: [0, maxPrice] - eğer maxP < maxPrice ise filtre aktif
    const hasPriceFilter = maxPrice > 0 && maxP < maxPrice;
    const hasAnyFilter = hasDestinationFilter || hasLanguageFilter || hasPriceFilter;

    console.log('=== FILTER DEBUG ===');
    console.log('selectedDestinations:', selectedDestinationsArray);
    console.log('priceValue:', priceValue, 'minP:', minP, 'maxP:', maxP);
    console.log('maxPrice:', maxPrice);
    console.log('hasPriceFilter:', hasPriceFilter, '(maxP < maxPrice:', maxP < maxPrice, ')');
    console.log('hasAnyFilter:', hasAnyFilter);
    console.log('baseProducts count:', baseProducts.length);

    if (hasDestinationFilter) {
      filtered = filtered.filter((p: any) => {
        const destName = typeof p?.destination === 'object' 
          ? p.destination?.name 
          : (p?.destination ?? p?.location ?? "");
        const destNameStr = destName.toString().toLowerCase();
        
        // Seçili destination'lardan herhangi biriyle eşleşiyor mu?
        return selectedDestinationsArray.some(selected => 
          destNameStr === selected.toLowerCase()
        );
      });
      console.log('After destination filter:', filtered.length);
    }

    if (languageSelected) {
      filtered = filtered.filter(
        (p: any) =>
          (p?.language ?? "").toString().toLowerCase() ===
          languageSelected.toLowerCase()
      );
    }

    if (hasPriceFilter) {
      console.log('Applying price filter:', { minP, maxP });
      const beforeCount = filtered.length;
      const priceDetails: any[] = [];
      filtered = filtered.filter((p: any) => {
        const pr = getPrice(p);
        // Eğer fiyat yoksa ve fiyat filtresi aktifse, bu turu filtrele
        if (pr == null) {
          priceDetails.push({ title: p.title || p.id, price: null, inRange: false });
          return false;
        }
        // Fiyat aralığında mı kontrol et
        const inRange = pr >= minP && pr <= maxP;
        priceDetails.push({ title: p.title || p.id, price: pr, inRange });
        return inRange;
      });
      console.log('Price filter result:', { beforeCount, afterCount: filtered.length });
      console.log('Tour prices:', priceDetails);
    }

    // Eğer filtre aktifse ve sonuç boşsa, boş liste döndür
    // Eğer filtre yoksa, baseProducts'u göster
    console.log('Final result:', { hasAnyFilter, filteredCount: filtered.length, baseProductsCount: baseProducts.length });
    console.log('=== END FILTER DEBUG ===');
    setProducts(hasAnyFilter ? filtered : baseProducts);
  }, [
    baseProducts,
    selectedDestinationsArray, // Array'i dependency olarak kullan
    languageSelected,
    priceValue,
    maxPrice,
    setProducts,
    getPrice,
  ]);

  return (
    <div className="col-xl-3 col-lg-4 order-last order-lg-first">
      <div
        className="tg-filter-sidebar mb-40 top-sticky"
        style={{ position: "sticky", top: 110, zIndex: 2 }}
      >
        <div className="tg-filter-item">
          {/* DESTINATION */}
          <h4 className="tg-filter-title mb-15">Destination</h4>
          {destinationsLoading ? (
            <div className="text-muted small mb-15">Loading destinations...</div>
          ) : destinations.length > 0 ? (
            <div className="tg-filter-list">
              <ul>
                {destinations.map((dest) => {
                  const isSelected = selectedDestinations.has(dest.name);
                  return (
                    <li
                      key={dest.id}
                      onClick={() => {
                        setSelectedDestinations((prev) => {
                          const newSet = new Set(prev);
                          if (isSelected) {
                            newSet.delete(dest.name);
                          } else {
                            newSet.add(dest.name);
                          }
                          return newSet;
                        });
                      }}
                    >
                      <div className="checkbox d-flex">
                        <input
                          className="tg-checkbox"
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          id={`destination_${dest.id}`}
                        />
                        <label
                          className="tg-label"
                          htmlFor={`destination_${dest.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedDestinations((prev) => {
                              const newSet = new Set(prev);
                              if (isSelected) {
                                newSet.delete(dest.name);
                              } else {
                                newSet.add(dest.name);
                              }
                              return newSet;
                            });
                          }}
                        >
                          {dest.name}
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="text-muted small mb-15">No destinations available</div>
          )}

          <span className="tg-filter-border mt-25 mb-25" />

          {/* PRICE */}
          <div className="tg-filter-price-input">
            <h4 className="tg-filter-title mb-20">Price By Filter</h4>
            {maxPrice > 0 ? (
              <>
                <PriceRange
                  MAX={maxPrice}
                  MIN={0}
                  STEP={1}
                  values={priceValue}
                  handleChanges={(val: number[]) =>
                    setPriceValue([val[0], val[1]] as [number, number])
                  }
                />
                <div className="d-flex align-items-center mt-15">
                  <span className="input-range">
                    ${priceValue[0]} - ${priceValue[1]}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-muted small">
                Price range will appear when tours are loaded.
              </div>
            )}
          </div>

          <span className="tg-filter-border mt-25 mb-25" />

          {/* LANGUAGE */}
          <h4 className="tg-filter-title mb-15">Language</h4>
          <div className="tg-filter-list">
            <ul>
              {LANGUAGE_OPTIONS.map((lang) => (
                <li
                  key={lang}
                  onClick={() =>
                    setLanguageSelected((prev) => (prev === lang ? "" : lang))
                  }
                >
                  <div className="checkbox d-flex">
                    <input
                      className="tg-checkbox"
                      type="checkbox"
                      checked={languageSelected === lang}
                      readOnly
                      id={`language_${lang}`}
                    />
                    <label
                      className="tg-label"
                      htmlFor={`language_${lang}`}
                      onClick={() =>
                        setLanguageSelected((prev) =>
                          prev === lang ? "" : lang
                        )
                      }
                    >
                      {lang}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Kaldırılanlar: Duration, Amenities, Top Reviews */}
        </div>
      </div>
    </div>
  );
};

export default FeatureSidebar;
