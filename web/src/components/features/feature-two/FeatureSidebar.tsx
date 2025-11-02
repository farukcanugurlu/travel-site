/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PriceRange from "./PriceRange";
import { selectProducts } from "../../../redux/features/productSlice";

const TOUR_PAGES = new Set(["shop_2", "home_3"]);

const DESTINATION_OPTIONS = [
  "Antalya",
  "Istanbul",
  "Bodrum",
  "Kusadasi",
  "Fethiye",
  "Cappadocia",
  "Marmaris",
  "Kemer",
  "Cesme",
  "Icmeler",
  "Belek",
  "Side",
  "Alanya",
  "Pamukkale",
  "Kas",
  "Kalkan",
  "Izmir",
] as const;

const LANGUAGE_OPTIONS = ["English", "Russian"] as const;

interface FeatureSidebarProps {
  setProducts: (products: any[]) => void;
  allProducts?: any[]; // API'den gelen veriler
}

const FeatureSidebar = ({ setProducts, allProducts = [] }: FeatureSidebarProps) => {
  const locationHook = useLocation();

  // Redux'tan veri çekmek yerine, parent'tan gelen verileri kullan
  // const allProducts = useSelector(selectProducts);

  const all = useMemo<any[]>(
    () => (Array.isArray(allProducts) ? allProducts : []),
    [allProducts]
  );

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

  // fiyat okuma
  const getPrice = (p: any): number | null => {
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
  };

  const maxPrice = useMemo(() => {
    let max = 0;
    for (const p of baseProducts) {
      const pr = getPrice(p);
      if (typeof pr === "number" && pr > max) max = pr;
    }
    return max;
  }, [baseProducts]);

  // state
  const [destinationSelected, setDestinationSelected] = useState<string>("");
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
    if (selected) {
      const hasMatch = baseProducts.some((p: any) => {
        const d = (p?.destination ?? p?.location ?? "")
          .toString()
          .toLowerCase();
        return d === selected.toLowerCase();
      });
      setDestinationSelected(hasMatch ? selected : "");
    } else {
      setDestinationSelected("");
    }
  }, [locationHook.search, baseProducts]);

  // Filtre uygula
  useEffect(() => {
    let filtered = [...baseProducts];

    if (destinationSelected) {
      filtered = filtered.filter((p: any) => {
        const dest = (p?.destination ?? p?.location ?? "")
          .toString()
          .toLowerCase();
        return dest === destinationSelected.toLowerCase();
      });
    }

    if (languageSelected) {
      filtered = filtered.filter(
        (p: any) =>
          (p?.language ?? "").toString().toLowerCase() ===
          languageSelected.toLowerCase()
      );
    }

    if (maxPrice > 0) {
      const [minP, maxP] = priceValue;
      filtered = filtered.filter((p: any) => {
        const pr = getPrice(p);
        if (pr == null) return true;
        return pr >= minP && pr <= maxP;
      });
    }

    // sonuç boşsa fallback olarak temel listeden ver
    setProducts(filtered.length ? filtered : baseProducts);
  }, [
    baseProducts,
    destinationSelected,
    languageSelected,
    priceValue,
    maxPrice,
    setProducts,
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
          <div className="tg-filter-list">
            <ul>
              {DESTINATION_OPTIONS.map((dest) => (
                <li
                  key={dest}
                  onClick={() =>
                    setDestinationSelected((prev) =>
                      prev === dest ? "" : dest
                    )
                  }
                >
                  <div className="checkbox d-flex">
                    <input
                      className="tg-checkbox"
                      type="checkbox"
                      checked={destinationSelected === dest}
                      readOnly
                      id={`destination_${dest}`}
                    />
                    <label
                      className="tg-label"
                      htmlFor={`destination_${dest}`}
                      onClick={() =>
                        setDestinationSelected((prev) =>
                          prev === dest ? "" : dest
                        )
                      }
                    >
                      {dest}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

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
