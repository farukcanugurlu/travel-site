import type { Tour } from '../api/tours';

// Frontend için uyumlu interface (mevcut component'lerle uyumlu)
export interface TourProduct {
  id: string;
  slug: string; // Add slug property
  page: "home_3";
  thumb: string;
  title: string;
  location: string; // "Kaş, Antalya" gibi
  destination: string; // Filtre için: "Antalya", "Fethiye" vb.
  language: "English" | "Russian";
  duration: string; // "1 Hour", "2 Days" vb.
  price: number; // NUMARA (slider için şart)
  review: number; // 1..5
  total_review: number; // 12
  tag?: string;
  featured?: string;
  offer?: string;
}

// API Tour'u TourProduct'a dönüştürme fonksiyonu
export const transformTourToProduct = (tour: Tour): TourProduct => {
  // En düşük fiyatlı paketi al
  const minPricePackage = tour.packages.reduce((min, pkg) => 
    pkg.adultPrice < min.adultPrice ? pkg : min
  );

  // Review ortalaması hesapla
  const approvedReviews = tour.reviews.filter(r => r.approved);
  const averageRating = approvedReviews.length > 0 
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length 
    : 0;

  return {
    id: tour.id,
    slug: tour.slug, // Add slug from API
    page: "home_3",
    thumb: tour.thumbnail || "/assets/img/listing/listing-1.jpg",
    title: tour.title,
    location: `${tour.destination.name}, ${tour.destination.country}`,
    destination: tour.destination.name,
    language: minPricePackage.language as "English" | "Russian",
    duration: tour.duration || "1 Day",
    price: Number(minPricePackage.adultPrice),
    review: Math.round(averageRating * 10) / 10, // 1 decimal place
    total_review: approvedReviews.length,
    tag: tour.featured ? "Featured" : undefined,
    featured: tour.featured ? "Featured" : undefined,
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
