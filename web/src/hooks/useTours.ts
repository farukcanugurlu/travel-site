// src/hooks/useTours.ts
import { useState, useEffect } from 'react';
import type { TourProduct } from '../data/ToursData';
import { transformTourToProduct } from '../data/ToursData';
import toursApiService, { type TourFilters } from '../api/tours';
import mockToursData from '../data/ToursData';

export const useTours = (filters?: TourFilters) => {
  const [tours, setTours] = useState<TourProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('useTours: Fetching tours from API...');
        // API'den turları çek
        const apiTours = await toursApiService.getTours(filters);
        console.log('useTours: API response:', apiTours);
        
        // API verilerini frontend formatına dönüştür
        const transformedTours = apiTours.map(transformTourToProduct);
        console.log('useTours: Transformed tours:', transformedTours);
        
        setTours(transformedTours);
      } catch (err) {
        console.warn('API failed, using mock data:', err);
        // API başarısız olursa mock data kullan
        setTours(mockToursData);
        setError('Using offline data');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [filters]);

  return { tours, loading, error };
};

export const useFeaturedTours = (limit: number = 8) => {
  const [tours, setTours] = useState<TourProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // API'den featured turları çek
        const apiTours = await toursApiService.getFeaturedTours(limit);
        
        // API verilerini frontend formatına dönüştür
        const transformedTours = apiTours.map(transformTourToProduct);
        
        setTours(transformedTours);
      } catch (err) {
        console.warn('API failed, using mock data:', err);
        // API başarısız olursa mock data'dan featured olanları al
        const featuredMockTours = mockToursData.filter(tour => tour.featured).slice(0, limit);
        setTours(featuredMockTours);
        setError('Using offline data');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, [limit]);

  return { tours, loading, error };
};

export const useTour = (id: string) => {
  const [tour, setTour] = useState<TourProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // API'den tur detayını çek
        const apiTour = await toursApiService.getTourById(id);
        
        // API verisini frontend formatına dönüştür
        const transformedTour = transformTourToProduct(apiTour);
        
        setTour(transformedTour);
      } catch (err) {
        console.warn('API failed, using mock data:', err);
        // API başarısız olursa mock data'dan bul
        const mockTour = mockToursData.find(t => t.id === id);
        setTour(mockTour || null);
        setError('Using offline data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id]);

  return { tour, loading, error };
};

export const useTourBySlug = (slug: string) => {
  const [tour, setTour] = useState<TourProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // API'den slug ile tur detayını çek
        const apiTour = await toursApiService.getTourBySlug(slug);
        
        // API verisini frontend formatına dönüştür
        const transformedTour = transformTourToProduct(apiTour);
        
        setTour(transformedTour);
      } catch (err) {
        console.warn('API failed, using mock data:', err);
        // API başarısız olursa mock data'dan bul (slug'e göre)
        const mockTour = mockToursData.find(t => 
          t.title.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
        );
        setTour(mockTour || null);
        setError('Using offline data');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTour();
    }
  }, [slug]);

  return { tour, loading, error };
};
