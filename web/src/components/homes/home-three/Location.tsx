import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import location_data from "../../../data/LocationData";
import toursApiService from "../../../api/tours";
import type { Tour } from "../../../api/tours";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const fetchedTours = await toursApiService.getTours({});
      setTours(fetchedTours);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verileri tipleyerek al
  const locList: LocItem[] = (location_data as unknown as LocItem[]).filter(
    (i) => i.page === "home_3"
  );

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

  // Sadece istediğimiz 8 destinasyonu, belirlediğimiz sırada al
  const wantedNorm = WANTED.map(canonical);
  const picked: LocItem[] = locList
    .filter((i) => wantedNorm.includes(canonical(i.title)))
    .sort(
      (a, b) =>
        wantedNorm.indexOf(canonical(a.title)) -
        wantedNorm.indexOf(canonical(b.title))
    )
    .slice(0, 8);

  // Fallback: veri eksikse ilk 8’i göster
  const cards: LocItem[] = picked.length ? picked : locList.slice(0, 8);

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
            const count = tourCountByDest.get(destKey) ?? 0;
            const destParam = encodeURIComponent(item.title);

            return (
              <div
                key={item.id}
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
                          src={item.thumb}
                          alt="location"
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
