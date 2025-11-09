// src/components/admin/ToursAdmin.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toursApiService from '../../api/tours';
import type { Tour } from '../../api/tours';
import { normalizeImageUrl } from '../../utils/imageUtils';

const ToursAdmin: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    published: '',
    featured: '',
  });

  useEffect(() => {
    fetchTours();
  }, [filters]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams: any = {};
      if (filters.search) filterParams.search = filters.search;
      if (filters.published) filterParams.published = filters.published === 'true';
      if (filters.featured) filterParams.featured = filters.featured === 'true';
      
      const data = await toursApiService.getTours(filterParams);
      setTours(data);
    } catch (err) {
      setError('Failed to fetch tours');
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    
    try {
      await toursApiService.deleteTour(id);
      setTours(tours.filter(tour => tour.id !== id));
    } catch (err) {
      alert('Failed to delete tour');
      console.error('Error deleting tour:', err);
    }
  };

  const togglePublished = async (tour: Tour) => {
    try {
      const updatedTour = await toursApiService.updateTour(tour.id, {
        published: !tour.published,
      });
      
      setTours(tours.map(t => t.id === tour.id ? updatedTour : t));
    } catch (err) {
      alert('Failed to update tour');
      console.error('Error updating tour:', err);
    }
  };

  const toggleFeatured = async (tour: Tour) => {
    try {
      const updatedTour = await toursApiService.updateTour(tour.id, {
        featured: !tour.featured,
      });
      
      setTours(tours.map(t => t.id === tour.id ? updatedTour : t));
    } catch (err) {
      alert('Failed to update tour');
      console.error('Error updating tour:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading tours...</div>
      </div>
    );
  }

  return (
    <div className="tours-admin">
      <div className="admin-header">
        <div className="header-content">
          <h1>Tours Management</h1>
          <p>Manage your tour packages and destinations</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/tours/new" className="btn-primary">
            ➕ Add New Tour
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search tours..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.published}
              onChange={(e) => setFilters({...filters, published: e.target.value})}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Featured</label>
            <select
              value={filters.featured}
              onChange={(e) => setFilters({...filters, featured: e.target.value})}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tours Table */}
      <div className="tours-table-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {tours.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h3>No tours found</h3>
            <p>Create your first tour to get started</p>
            <Link to="/admin/tours/new" className="btn-primary">
              Create Tour
            </Link>
          </div>
        ) : (
          <div className="tours-table">
            <div className="table-header">
              <div className="col-image">Image</div>
              <div className="col-title">Title</div>
              <div className="col-destination">Destination</div>
              <div className="col-category">Category</div>
              <div className="col-duration">Duration</div>
              <div className="col-price">Price</div>
              <div className="col-status">Status</div>
              <div className="col-featured">Featured</div>
              <div className="col-actions">Actions</div>
            </div>

            {tours.map((tour) => (
              <div key={tour.id} className="table-row">
                <div className="col-image">
                  {(() => {
                    // Get image: thumbnail first, then first image from images array, then placeholder
                    let imageUrl: string | null = null;
                    
                    if (tour.thumbnail) {
                      imageUrl = tour.thumbnail;
                    } else if (tour.images && Array.isArray(tour.images) && tour.images.length > 0) {
                      // Get first valid uploaded image (skip stock photos)
                      const firstValidImage = tour.images.find(img => 
                        img && 
                        !img.includes('/assets/img/listing/') && 
                        !img.includes('listing-') && 
                        !img.includes('default-tour') &&
                        (img.startsWith('/uploads/') || img.includes('/uploads/') || img.startsWith('http'))
                      );
                      if (firstValidImage) {
                        imageUrl = firstValidImage;
                      }
                    }
                    
                    if (imageUrl) {
                      return (
                        <img 
                          src={normalizeImageUrl(imageUrl)} 
                          alt={tour.title}
                          className="tour-thumbnail"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23f0f0f0" width="60" height="60"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      );
                    } else {
                      // Placeholder
                      return (
                        <div 
                          className="tour-thumbnail-placeholder"
                          style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '12px',
                            fontWeight: 500
                          }}
                        >
                          No Image
                        </div>
                      );
                    }
                  })()}
                </div>
                
                <div className="col-title">
                  <div className="tour-title">{tour.title}</div>
                  <div className="tour-slug">/{tour.slug}</div>
                </div>
                
                <div className="col-destination">
                  <span className="destination-name">{tour.destination?.name}</span>
                  <span className="destination-country">{tour.destination?.country}</span>
                </div>
                
                <div className="col-category">
                  <span className="category-badge">{tour.category?.name}</span>
                </div>
                
                <div className="col-duration">
                  {tour.duration || 'N/A'}
                </div>
                
                <div className="col-price">
                  {tour.packages.length > 0 ? (
                    <div className="price-info">
                      <div className="price-from">From</div>
                      <div className="price-amount">
                        ${Math.min(...tour.packages.map(p => p.adultPrice))}
                      </div>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </div>
                
                <div className="col-status">
                  <button
                    className={`status-toggle ${tour.published ? 'published' : 'draft'}`}
                    onClick={() => togglePublished(tour)}
                  >
                    {tour.published ? 'Published' : 'Draft'}
                  </button>
                </div>
                
                <div className="col-featured">
                  <button
                    className={`featured-toggle ${tour.featured ? 'featured' : 'not-featured'}`}
                    onClick={() => toggleFeatured(tour)}
                  >
                    {tour.featured ? '⭐ Featured' : '☆ Not Featured'}
                  </button>
                </div>
                
                <div className="col-actions">
                  <div className="action-buttons">
                    <Link to={`/admin/tours/${tour.id}`} className="btn-edit">
                      Edit
                    </Link>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(tour.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .tours-admin {
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

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          background: #3498db;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .filters-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
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

        .filter-input,
        .filter-select {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #3498db;
        }

        .tours-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 16px;
          border-left: 4px solid #dc3545;
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
          margin: 0 0 24px 0;
        }

        .tours-table {
          overflow-x: auto;
        }

        .table-header {
          display: grid;
          grid-template-columns: 80px 1fr 120px 120px 100px 100px 100px 120px 200px;
          gap: 16px;
          padding: 16px 20px;
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #e0e0e0;
        }

        .table-row {
          display: grid;
          grid-template-columns: 80px 1fr 120px 120px 100px 100px 100px 120px 200px;
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

        .category-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .price-info {
          text-align: center;
        }

        .price-from {
          font-size: 12px;
          color: #666;
        }

        .price-amount {
          font-weight: 600;
          color: #2c3e50;
        }

        .status-toggle,
        .featured-toggle {
          padding: 6px 12px;
          border: none;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-toggle.published {
          background: #d4edda;
          color: #155724;
        }

        .status-toggle.draft {
          background: #fff3cd;
          color: #856404;
        }

        .featured-toggle.featured {
          background: #cce5ff;
          color: #004085;
        }

        .featured-toggle.not-featured {
          background: #f8f9fa;
          color: #666;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-edit {
          padding: 6px 12px;
          background: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-edit:hover {
          background: #2980b9;
        }

        .btn-delete {
          padding: 6px 12px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-delete:hover {
          background: #c0392b;
        }

        @media (max-width: 1200px) {
          .table-header,
          .table-row {
            grid-template-columns: 60px 1fr 100px 100px 80px 80px 80px 100px 150px;
            gap: 12px;
          }
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .tours-table {
            font-size: 14px;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .col-image,
          .col-title,
          .col-destination,
          .col-category,
          .col-duration,
          .col-price,
          .col-status,
          .col-featured,
          .col-actions {
            display: flex;
            align-items: center;
            padding: 8px 0;
          }

          .col-image::before {
            content: "Image: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-title::before {
            content: "Title: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-destination::before {
            content: "Destination: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-category::before {
            content: "Category: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-duration::before {
            content: "Duration: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-price::before {
            content: "Price: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-status::before {
            content: "Status: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-featured::before {
            content: "Featured: ";
            font-weight: 600;
            margin-right: 8px;
          }

          .col-actions::before {
            content: "Actions: ";
            font-weight: 600;
            margin-right: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ToursAdmin;
