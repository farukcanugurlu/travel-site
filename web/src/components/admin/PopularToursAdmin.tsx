// src/components/admin/PopularToursAdmin.tsx
import React, { useState, useEffect } from 'react';
import toursApiService from '../../api/tours';
import type { Tour } from '../../api/tours';
import { toast } from 'react-toastify';

const PopularToursAdmin: React.FC = () => {
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [popularTours, setPopularTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get all tours (published ve unpublished)
      const tours = await toursApiService.getTours();
      console.log('Fetched tours:', tours.length, tours);
      setAllTours(tours);
      
      // Get popular tours
      const popular = tours.filter(tour => tour.popular);
      console.log('Popular tours:', popular.length, popular);
      setPopularTours(popular);
    } catch (err) {
      toast.error('Failed to fetch tours');
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePopular = async (tourId: string, isPopular: boolean) => {
    try {
      setSaving(true);
      const tour = allTours.find(t => t.id === tourId);
      if (!tour) return;

      await toursApiService.updateTour(tourId, { popular: !isPopular });
      
      // Update local state
      if (isPopular) {
        setPopularTours(prev => prev.filter(t => t.id !== tourId));
      } else {
        const tourToAdd = allTours.find(t => t.id === tourId);
        if (tourToAdd) {
          setPopularTours(prev => [...prev, { ...tourToAdd, popular: true }]);
        }
      }
      
      setAllTours(prev => 
        prev.map(t => t.id === tourId ? { ...t, popular: !isPopular } : t)
      );
      
      toast.success(isPopular ? 'Removed from popular tours' : 'Added to popular tours');
    } catch (err) {
      toast.error('Failed to update tour');
      console.error('Error updating tour:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredTours = allTours.filter(tour =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.destination?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading tours...</div>
      </div>
    );
  }

  return (
    <div className="popular-tours-admin">
      <div className="admin-header">
        <div className="header-content">
          <h1>⭐ Popular Tours Management</h1>
          <p>Select which tours appear in the "Most Popular Tours" section on the homepage</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-number">{popularTours.length}</span>
            <span className="stat-label">Popular Tours</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Search Tours</label>
          <input
            type="text"
            placeholder="Search by title or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-info">
          <p>💡 Showing all tours. Select tours below to mark them as popular.</p>
        </div>
      </div>

      {/* Popular Tours List */}
      {popularTours.length > 0 && (
        <div className="content-section">
          <h3 className="section-title">Currently Popular Tours ({popularTours.length})</h3>
          <div className="tours-grid">
            {popularTours.map((tour) => (
              <div key={tour.id} className="tour-card popular-card">
                <div className="card-header">
                  <div className="card-image">
                    <img
                      src={(() => {
                        const imgUrl = tour.thumbnail || tour.images?.[0] || '/assets/img/listing/listing-1.jpg';
                        if (imgUrl.startsWith('/uploads/')) {
                          return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imgUrl}`;
                        }
                        return imgUrl;
                      })()}
                      alt={tour.title}
                    />
                    <span className="popular-badge">⭐ Popular</span>
                  </div>
                  <div className="card-content">
                    <h4>{tour.title}</h4>
                    <p className="destination">{tour.destination?.name}, {tour.destination?.country}</p>
                    <div className="card-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => togglePopular(tour.id, true)}
                        disabled={saving}
                      >
                        Remove from Popular
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Tours */}
      <div className="content-section">
        <h3 className="section-title">
          All Tours ({filteredTours.length})
          {popularTours.length > 0 && (
            <span className="subtitle"> - Select from below to add to popular</span>
          )}
        </h3>
        
        {filteredTours.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h3>No tours found</h3>
            <p>Try adjusting your search</p>
          </div>
        ) : (
          <div className="tours-table">
            <div className="table-header">
              <div className="col-image">Image</div>
              <div className="col-title">Title</div>
              <div className="col-destination">Destination</div>
              <div className="col-status">Status</div>
              <div className="col-action">Action</div>
            </div>

            {filteredTours.map((tour) => (
              <div key={tour.id} className="table-row">
                <div className="col-image">
                  <img
                    src={(() => {
                      const imgUrl = tour.thumbnail || tour.images?.[0] || '/assets/img/listing/listing-1.jpg';
                      if (imgUrl.startsWith('/uploads/')) {
                        return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imgUrl}`;
                      }
                      return imgUrl;
                    })()}
                    alt={tour.title}
                    className="tour-thumbnail"
                  />
                </div>
                
                <div className="col-title">
                  <div className="tour-title">{tour.title}</div>
                  <div className="tour-slug">/{tour.slug}</div>
                </div>
                
                <div className="col-destination">
                  <span className="destination-name">{tour.destination?.name}</span>
                  <span className="destination-country">{tour.destination?.country}</span>
                </div>
                
                <div className="col-status">
                  <div className="status-group">
                    {tour.popular ? (
                      <span className="status-badge popular-badge">⭐ Popular</span>
                    ) : (
                      <span className="status-badge">Not Popular</span>
                    )}
                    {!tour.published && (
                      <span className="status-badge unpublished-badge">Unpublished</span>
                    )}
                  </div>
                </div>
                
                <div className="col-action">
                  <button
                    className={`btn-toggle ${tour.popular ? 'btn-remove' : 'btn-add'}`}
                    onClick={() => togglePopular(tour.id, tour.popular || false)}
                    disabled={saving}
                  >
                    {tour.popular ? 'Remove' : 'Add to Popular'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .popular-tours-admin {
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .loading-spinner {
          font-size: 18px;
          color: #666;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .header-content h1 {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .header-content p {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .header-stats {
          display: flex;
          gap: 16px;
        }

        .stat-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: 700;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          opacity: 0.9;
          margin-top: 4px;
        }

        .filters-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .filter-info {
          margin-top: 16px;
          padding: 12px;
          background: #e8f4f8;
          border-radius: 6px;
          border-left: 3px solid #3498db;
        }

        .filter-info p {
          margin: 0;
          color: #2c3e50;
          font-size: 14px;
        }

        .filter-input {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-input:focus {
          outline: none;
          border-color: #3498db;
        }

        .content-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 20px 0;
        }

        .subtitle {
          font-size: 14px;
          font-weight: 400;
          color: #666;
        }

        .tours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .popular-card {
          border: 2px solid #667eea;
        }

        .tour-card {
          background: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e0e0e0;
        }

        .card-header {
          display: flex;
          flex-direction: column;
        }

        .card-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .popular-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
        }

        .card-content {
          padding: 16px;
        }

        .card-content h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .card-content .destination {
          color: #666;
          font-size: 14px;
          margin: 0 0 12px 0;
        }

        .tours-table {
          overflow-x: auto;
        }

        .table-header {
          display: grid;
          grid-template-columns: 80px 2fr 150px 120px 150px;
          gap: 16px;
          padding: 16px 20px;
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #e0e0e0;
        }

        .table-row {
          display: grid;
          grid-template-columns: 80px 2fr 150px 120px 150px;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .tour-thumbnail {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
        }

        .tour-title {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .tour-slug {
          font-size: 12px;
          color: #666;
        }

        .destination-name {
          display: block;
          font-weight: 500;
          color: #2c3e50;
        }

        .destination-country {
          font-size: 12px;
          color: #666;
        }

        .status-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }

        .popular-badge {
          background: #667eea;
          color: white;
        }

        .unpublished-badge {
          background: #f39c12;
          color: white;
        }

        .btn-toggle {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-add {
          background: #3498db;
          color: white;
        }

        .btn-add:hover:not(:disabled) {
          background: #2980b9;
        }

        .btn-remove {
          background: #e74c3c;
          color: white;
        }

        .btn-remove:hover:not(:disabled) {
          background: #c0392b;
        }

        .btn-danger {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-danger:hover:not(:disabled) {
          background: #c0392b;
        }

        .btn-sm {
          font-size: 12px;
          padding: 6px 12px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          color: #666;
          margin: 0;
        }

        @media (max-width: 1200px) {
          .table-header,
          .table-row {
            grid-template-columns: 60px 1fr 120px 100px 130px;
            gap: 12px;
          }
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .table-header,
          .table-row {
            grid-template-columns: 60px 1fr 100px;
            gap: 8px;
          }

          .col-destination,
          .col-status {
            display: none;
          }

          .tours-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PopularToursAdmin;


