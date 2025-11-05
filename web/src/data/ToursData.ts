import type { Tour } from '../api/tours';

// Frontend için uyumlu interface (mevcut component'lerle uyumlu)
export interface TourProduct {
  id: string;
  slug: string; // Add slug property
  page: "home_3";
  thumb: string;
  title: string;
  location: string; // "Kaş, Antalya" gibi
  destination: string | { id: string; name: string; slug: string; country: string }; // Filtre için: "Antalya", "Fethiye" vb.
  language: "English" | "Russian";
  duration: string; // "1 Hour", "2 Days" vb.
  price: number; // NUMARA (slider için şart)
  review: number; // 1..5
  total_review: number; // 12
  tag?: string;
  featured?: string;
  offer?: string;
  // Rating ve reviews alanlarını ekle
  rating?: {
    average: number;
    total: number;
  };
  reviews?: any[];
  // API Tour'un diğer alanlarını da ekle
  packages?: any[];
  images?: string[];
  thumbnail?: string;
}

// API Tour'u TourProduct'a dönüştürme fonksiyonu
export const transformTourToProduct = (tour: Tour): TourProduct => {
  // En düşük fiyatlı paketi al
  const minPricePackage = tour.packages && tour.packages.length > 0
    ? tour.packages.reduce((min, pkg) => 
        pkg.adultPrice < min.adultPrice ? pkg : min
      )
    : null;

  // Review ortalaması hesapla - rating obje olabilir
  const approvedReviews = tour.reviews ? tour.reviews.filter((r: any) => r.approved !== false) : [];
  let averageRating = 0;
  
  if (approvedReviews.length > 0) {
    averageRating = approvedReviews.reduce((sum: number, r: any) => {
      let ratingValue = 0;
      if (typeof r.rating === 'number') {
        ratingValue = r.rating;
      } else if (typeof r.rating === 'object' && r.rating !== null) {
        // Obje ise (location, price, amenities, rooms, services) ortalamasını al
        const ratings = Object.values(r.rating).filter((v: any) => typeof v === 'number' && v > 0) as number[];
        if (ratings.length > 0) {
          ratingValue = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        }
      }
      return sum + ratingValue;
    }, 0) / approvedReviews.length;
  }

  return {
    id: tour.id,
    slug: tour.slug,
    page: "home_3",
    thumb: tour.thumbnail || tour.images?.[0] || "/assets/img/listing/listing-1.jpg",
    title: tour.title,
    location: typeof tour.destination === 'string' 
      ? tour.destination 
      : `${tour.destination?.name || ''}, ${tour.destination?.country || ''}`,
    destination: typeof tour.destination === 'string' 
      ? tour.destination 
      : tour.destination || '',
    language: (minPricePackage?.language || "English") as "English" | "Russian",
    duration: tour.duration || "1 Day",
    price: minPricePackage ? Number(minPricePackage.adultPrice) : 0,
    review: Math.round(averageRating * 10) / 10,
    total_review: approvedReviews.length,
    tag: tour.featured ? "Featured" : undefined,
    featured: tour.featured ? "Featured" : undefined,
    // Rating ve reviews'ı ekle
    rating: tour.rating || {
      average: averageRating,
      total: approvedReviews.length,
    },
    reviews: tour.reviews || [],
    // Diğer alanları da ekle
    packages: tour.packages,
    images: tour.images,
    thumbnail: tour.thumbnail,
  };
};

// Mock data - API çalışmadığında fallback olarak kullanılır
const mockToursData: TourProduct[] = [
  {
    id: "mock-1",
    slug: "antalya-city-highlights",
    page: "home_3",
    thumb: "/assets/img/listing/listing-1.jpg",
    title: "Antalya City Highlights",
    location: "Antalya, Turkey",
    destination: "Antalya",
    language: "English",
    duration: "1 Day",
    price: 150,
    review: 5,
    total_review: 10,
    tag: "New",
  },
  {
    id: "mock-2",
    slug: "istanbul-old-city-walking",
    page: "home_3",
    thumb: "/assets/img/listing/listing-2.jpg",
    title: "Istanbul Old City Walking",
    location: "Istanbul, Turkey",
    destination: "Istanbul",
    language: "English",
    duration: "4 Hours",
    price: 80,
    review: 5,
    total_review: 14,
    offer: "% Offer",
  },
  {
    id: "mock-3",
    slug: "cappadocia-balloon-viewpoints",
    page: "home_3",
    thumb: "/assets/img/listing/listing-3.jpg",
    title: "Cappadocia Balloon Viewpoints",
    location: "Cappadocia, Turkey",
    destination: "Cappadocia",
    language: "English",
    duration: "1 Day",
    price: 300,
    review: 5,
    total_review: 18,
    tag: "New",
  },
];

export default mockToursData;
