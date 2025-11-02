// src/components/common/SearchFilter.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toursApiService from '../../api/tours';
import type { TourFilters, TourPackage } from '../../api/tours';

interface SearchFilterProps {
  onResults?: (tours: any[]) => void;
  showResults?: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onResults, showResults = true }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TourFilters>({
    category: '',
    destination: '',
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [localFilters, setLocalFilters] = useState({
    duration: '',
    difficulty: '',
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (searchTerm || Object.values(filters).some(filter => filter !== '')) {
      performSearch();
    }
  }, [searchTerm, filters]);

  const fetchFilterOptions = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setCategories([
        { id: '1', name: 'City Tours' },
        { id: '2', name: 'Adventure Tours' },
        { id: '3', name: 'Cultural Tours' },
        { id: '4', name: 'Nature Tours' },
      ]);

      setDestinations([
        { id: '1', name: 'Istanbul', country: 'Turkey' },
        { id: '2', name: 'Antalya', country: 'Turkey' },
        { id: '3', name: 'Cappadocia', country: 'Turkey' },
        { id: '4', name: 'Pamukkale', country: 'Turkey' },
      ]);
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchFilters: TourFilters = {
        ...filters,
        search: searchTerm,
      };

      const tours = await toursApiService.getTours(searchFilters);
      setResults(tours);
      
      if (onResults) {
        onResults(tours);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof TourFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLocalFilterChange = (field: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      destination: '',
      minPrice: undefined,
      maxPrice: undefined,
    });
    setLocalFilters({
      duration: '',
      difficulty: '',
    });
  };

  const handleTourClick = (tour: any) => {
    navigate(`/tour-details?slug=${tour.slug}`);
  };

  return (
    <div className="search-filter-container">
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn" onClick={performSearch}>
            🔍
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Destination</label>
            <select
              value={filters.destination}
              onChange={(e) => handleFilterChange('destination', e.target.value)}
              className="filter-select"
            >
              <option value="">All Destinations</option>
              {destinations.map(dest => (
                <option key={dest.id} value={dest.id}>{dest.name}, {dest.country}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Duration</label>
            <select
              value={localFilters.duration}
              onChange={(e) => handleLocalFilterChange('duration', e.target.value)}
              className="filter-select"
            >
              <option value="">Any Duration</option>
              <option value="half-day">Half Day</option>
              <option value="full-day">Full Day</option>
              <option value="2-days">2 Days</option>
              <option value="3-days">3 Days</option>
              <option value="week">1 Week</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty</label>
            <select
              value={localFilters.difficulty}
              onChange={(e) => handleLocalFilterChange('difficulty', e.target.value)}
              className="filter-select"
            >
              <option value="">Any Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price ($)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="0"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Max Price ($)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="1000"
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="search-results">
          {loading ? (
            <div className="loading-spinner">Searching...</div>
          ) : (
            <>
              <div className="results-header">
                <h3>Search Results ({results.length})</h3>
              </div>
              
              {results.length === 0 ? (
                <div className="no-results">
                  <p>No tours found matching your criteria.</p>
                </div>
              ) : (
                <div className="results-grid">
                  {results.map((tour) => (
                    <div key={tour.id} className="tour-card" onClick={() => handleTourClick(tour)}>
                      <div className="tour-image">
                        <img src={(() => {
                          const imgUrl = tour.thumbnail || '/assets/img/listing/listing-1.jpg';
                          if (imgUrl.startsWith('/uploads/')) {
                            return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imgUrl}`;
                          }
                          return imgUrl;
                        })()} alt={tour.title} />
                        {tour.featured && <span className="featured-badge">Featured</span>}
                      </div>
                      <div className="tour-info">
                        <h4>{tour.title}</h4>
                        <p className="tour-location">
                          📍 {tour.destination?.name}, {tour.destination?.country}
                        </p>
                        <p className="tour-duration">⏱️ {tour.duration || 'Full Day'}</p>
                        <div className="tour-price">
                          From ${Math.min(...tour.packages.map((pkg: TourPackage) => Number(pkg.adultPrice)))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        .search-filter-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .search-bar {
          margin-bottom: 30px;
        }

        .search-input-group {
          display: flex;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-input {
          flex: 1;
          padding: 15px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 8px 0 0 8px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          border-color: #3498db;
        }

        .search-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 15px 20px;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s ease;
        }

        .search-btn:hover {
          background: #2980b9;
        }

        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .filter-select,
        .filter-input {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .filter-select:focus,
        .filter-input:focus {
          border-color: #3498db;
        }

        .filter-actions {
          display: flex;
          justify-content: center;
        }

        .clear-filters-btn {
          background: #95a5a6;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .clear-filters-btn:hover {
          background: #7f8c8d;
        }

        .search-results {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .results-header h3 {
          font-size: 20px;
          color: #2c3e50;
          margin: 0 0 20px 0;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          font-size: 16px;
          color: #666;
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .tour-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .tour-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .tour-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .tour-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .featured-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #e74c3c;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .tour-info {
          padding: 20px;
        }

        .tour-info h4 {
          font-size: 18px;
          color: #2c3e50;
          margin: 0 0 10px 0;
          line-height: 1.3;
        }

        .tour-location,
        .tour-duration {
          color: #666;
          font-size: 14px;
          margin: 0 0 8px 0;
        }

        .tour-price {
          font-size: 18px;
          font-weight: 700;
          color: #2ecc71;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr;
          }

          .search-input-group {
            flex-direction: column;
          }

          .search-input {
            border-radius: 8px 8px 0 0;
          }

          .search-btn {
            border-radius: 0 0 8px 8px;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchFilter;
