import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import location_data from "../../../data/LocationData";
import toursApiService from "../../../api/tours";
import { destinationsApiService } from "../../../api/destinations";
import type { Tour } from "../../../api/tours";
import type { Destination } from "../../../api/destinations";

// --- Yardımcı tipler ---
type LocItem = {
  id: number;
  page: string;
  thumb: string;
  title: string;
  total?: string;
  class?: string;
};

// --- Normalizasyon: İstanbul/İzmir gibi aksan farklarını eşitle ---
const canonical = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/İ/g, "I")
    .replace(/ı/g, "i")
    .toLowerCase()
    .trim();

// Anasayfada göstereceğimiz 8 destinasyon (sırayla)
const WANTED: readonly string[] = [
  "Istanbul",
  "Antalya",
  "Cappadocia",
  "Kusadasi",
  "Side",
  "Fethiye",
  "Belek",
  "Alanya",
];

const Location = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fetchedTours, destinations] = await Promise.all([
        toursApiService.getTours({}),
        destinationsApiService.getFeaturedDestinations(8)
      ]);
      setTours(fetchedTours);
      setFeaturedDestinations(destinations || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Fallback to old method if API fails
      fetchTours();
      setFeaturedDestinations([]);
    }
  };

  const fetchTours = async () => {
    try {
      const fetchedTours = await toursApiService.getTours({});
      setTours(fetchedTours);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    }
  };

  // API'den gelen turları say ve destinasyon başına bir sayaç oluştur
  const tourCountByDest = useMemo(() => {
    const map = new Map<string, number>();

    tours.forEach((tour) => {
      const destinationName = typeof tour.destination === 'string' 
        ? tour.destination 
        : tour.destination?.name;
      
      if (!destinationName) return;
      
      const key = canonical(destinationName);
      if (!key) return;
      map.set(key, (map.get(key) ?? 0) + 1);
    });

    return map;
  }, [tours]);

  // Use featured destinations from API if available, otherwise fallback to hardcoded data
  const cards = useMemo(() => {
    // Always prioritize API data if available
    if (featuredDestinations && featuredDestinations.length > 0) {
      const mappedCards = featuredDestinations.map(dest => {
        const tourCount = dest._count?.tours || tourCountByDest.get(canonical(dest.name)) || 0;
        const imageUrl = dest.image 
          ? (dest.image.startsWith('http') ? dest.image : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${dest.image}`)
          : `/assets/img/destination/${dest.slug}.jpg`;
        
        return {
          id: dest.id,
          title: dest.name,
          thumb: imageUrl,
          total: tourCount.toString(),
        };
      });
      return mappedCards;
    }

    // Fallback to old method only if no featured destinations from API
    const locList: LocItem[] = (location_data as unknown as LocItem[]).filter(
      (i) => i.page === "home_3"
    );
    const wantedNorm = WANTED.map(canonical);
    const picked: LocItem[] = locList
      .filter((i) => wantedNorm.includes(canonical(i.title)))
      .sort(
        (a, b) =>
          wantedNorm.indexOf(canonical(a.title)) -
          wantedNorm.indexOf(canonical(b.title))
      )
      .slice(0, 8);
    return picked.length ? picked : locList.slice(0, 8);
  }, [featuredDestinations, tourCountByDest]);

  return (
    <div className="tg-location-area p-relative pb-40 tg-grey-bg pt-140">
      <img
        className="tg-location-shape d-none d-lg-block"
        src="/assets/img/location/shape-2.png"
        alt="shape"
      />
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tg-location-section-title text-center mb-30">
              <h5
                className="tg-section-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Next Adventure Destination
              </h5>
              <h2
                className="mb-15 text-capitalize wow fadeInUp"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Popular Travel Destinations <br />
                Available Worldwide
              </h2>
              <p
                className="text-capitalize wow fadeInUp"
                data-wow-delay=".6s"
                data-wow-duration=".9s"
              >
                Are you tired of the typical tourist destinations and looking
                <br />
                to step out of your comfort zonetravel
              </p>
            </div>
          </div>

          {cards.map((item) => {
            const destKey = canonical(item.title);
            const count = typeof item.total === 'string' ? parseInt(item.total) : (tourCountByDest.get(destKey) ?? 0);
            const destParam = encodeURIComponent(item.title);
            const imageUrl = item.thumb?.startsWith('http') 
              ? item.thumb 
              : (item.thumb?.startsWith('/uploads/') 
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${item.thumb}`
                : item.thumb || '/assets/img/destination/des.jpg');

            return (
              <div
                key={item.id || item.title}
                className="col-lg-3 col-md-6 col-sm-6 wow fadeInUp"
                data-wow-delay=".3s"
                data-wow-duration=".9s"
              >
                <div className="bg-white tg-round-25 p-relative z-index-1">
                  <div className="tg-location-wrap p-relative mb-30">
                    <div className="tg-location-thumb">
                      <Link
                        to={`/tours?destination=${destParam}`}
                        aria-label={`Go to ${item.title} tours`}
                      >
                        <img
                          className="w-100"
                          src={imageUrl}
                          alt={item.title}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/img/destination/des.jpg';
                          }}
                        />
                      </Link>
                    </div>

                    <div className="tg-location-content text-center">
                      <span className="tg-location-time">
                        {count} {count === 1 ? "Tour" : "Tours"}
                      </span>
                      <h3 className="tg-location-title mb-0">
                        <Link to={`/tours?destination=${destParam}`}>
                          {item.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="tg-location-border one"></div>
                    <div className="tg-location-border two"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Location;
