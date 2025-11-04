// web/src/components/admin/DestinationsAdmin.tsx
import React, { useState, useEffect } from 'react';
import { destinationsApiService } from '../../api/destinations';
import type { DestinationFilters, Destination } from '../../api/destinations';
import { toast } from 'react-toastify';

const DestinationsAdmin: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DestinationFilters>({
    search: '',
    country: '',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);

  useEffect(() => {
    fetchDestinations();
  }, [filters]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await destinationsApiService.getDestinations(filters);
      setDestinations(data);
    } catch (err) {
      setError('Failed to fetch destinations');
      console.error('Error fetching destinations:', err);
      toast.error('Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;

    try {
      await destinationsApiService.deleteDestination(id);
      setDestinations(destinations.filter(dest => dest.id !== id));
      toast.success('Destination deleted successfully');
    } catch (err: any) {
      console.error('Error deleting destination:', err);
      if (err.message?.includes('tours')) {
        toast.error('Cannot delete destination that has tours. Please delete or reassign tours first.');
      } else {
        toast.error('Failed to delete destination');
      }
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value === '' ? undefined : value }));
  };

  const handleCreate = async (destinationData: any) => {
    try {
      const newDestination = await destinationsApiService.createDestination(destinationData);
      setDestinations([newDestination, ...destinations]);
      setShowCreateModal(false);
      toast.success('Destination created successfully');
    } catch (err: any) {
      console.error('Error creating destination:', err);
      if (err.message?.includes('already exists')) {
        toast.error('Destination with this name or slug already exists');
      } else {
        toast.error('Failed to create destination');
      }
    }
  };

  const handleUpdate = async (id: string, destinationData: any) => {
    try {
      const updatedDestination = await destinationsApiService.updateDestination(id, destinationData);
      setDestinations(destinations.map(dest => dest.id === id ? updatedDestination : dest));
      setEditingDestination(null);
      toast.success('Destination updated successfully');
    } catch (err: any) {
      console.error('Error updating destination:', err);
      if (err.message?.includes('already exists')) {
        toast.error('Destination with this name or slug already exists');
      } else {
        toast.error('Failed to update destination');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading destinations...</div>
      </div>
    );
  }

  return (
    <div className="destinations-admin">
      <div className="admin-header">
        <div className="header-content">
          <h1>📍 Destinations Management</h1>
          <p>Manage your travel destinations and locations</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Add New Destination
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <div className="stat-number">{destinations.length}</div>
            <div className="stat-label">Total Destinations</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <div className="stat-number">{new Set(destinations.map(d => d.country)).size}</div>
            <div className="stat-label">Countries</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-number">{destinations.filter(d => new Date(d.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</div>
            <div className="stat-label">Added This Month</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>🔍 Search & Filter</h3>
        </div>
        <div className="filter-group">
          <div className="filter-item">
            <label>Search Destinations</label>
            <input
              type="text"
              name="search"
              placeholder="Search by name..."
              value={filters.search || ''}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          <div className="filter-item">
            <label>Filter by Country</label>
            <input
              type="text"
              name="country"
              placeholder="Filter by country..."
              value={filters.country || ''}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        {destinations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <h3>No destinations found</h3>
            <p>Start building your travel catalog by adding your first destination.</p>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="btn-icon">+</span>
              Add Your First Destination
            </button>
          </div>
        ) : (
          <div className="destinations-grid">
            {destinations.map((destination) => (
              <div key={destination.id} className="destination-card">
                <div className="card-header">
                  <div className="card-title">
                    <h3>{destination.name}</h3>
                    <span className="country-badge">{destination.country}</span>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingDestination(destination)}
                      title="Edit destination"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(destination.id)}
                      title="Delete destination"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Slug:</span>
                    <span className="info-value">{destination.slug}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Created:</span>
                    <span className="info-value">{new Date(destination.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Updated:</span>
                    <span className="info-value">{new Date(destination.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <DestinationModal
          destination={null}
          onSave={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Modal */}
      {editingDestination && (
        <DestinationModal
          destination={editingDestination}
          onSave={(data) => handleUpdate(editingDestination.id, data)}
          onClose={() => setEditingDestination(null)}
        />
      )}

      <style>{`
        .destinations-admin {
          max-width: 1400px;
          margin: 0 auto;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 16px;
          border-left: 4px solid #dc3545;
          margin-bottom: 24px;
          border-radius: 4px;
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
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-primary:hover {
          background: #2980b9;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .stat-label {
          color: #7f8c8d;
          font-size: 14px;
          font-weight: 500;
        }

        .filters-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .filters-header h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 18px;
        }

        .filter-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .filter-item label {
          display: block;
          margin-bottom: 8px;
          color: #2c3e50;
          font-weight: 500;
        }

        .filter-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .filter-input:focus {
          outline: none;
          border-color: #3498db;
        }

        .content-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          color: #2c3e50;
          margin-bottom: 12px;
        }

        .empty-state p {
          color: #7f8c8d;
          margin-bottom: 24px;
        }

        .btn-large {
          padding: 16px 32px;
          font-size: 16px;
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .destination-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .destination-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .card-title h3 {
          margin: 0 0 8px 0;
          color: #2c3e50;
          font-size: 20px;
        }

        .country-badge {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
          border-radius: 6px;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border: none;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
          border: none;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-label {
          color: #7f8c8d;
          font-weight: 500;
          font-size: 14px;
        }

        .info-value {
          color: #2c3e50;
          font-size: 14px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover {
          background: #5a6fd8;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .stats-section {
            grid-template-columns: 1fr;
          }

          .filter-group {
            grid-template-columns: 1fr;
          }

          .destinations-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// Destination Modal Component
interface DestinationModalProps {
  destination: Destination | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const DestinationModal: React.FC<DestinationModalProps> = ({ destination, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: destination?.name || '',
    slug: destination?.slug || '',
    country: destination?.country || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.country) {
      toast.error('Please fill in all fields');
      return;
    }
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name
    if (name === 'name' && !destination) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{destination ? 'Edit Destination' : 'Create New Destination'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Antalya"
            />
          </div>
          <div className="form-group">
            <label>Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="e.g., antalya"
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens allowed"
            />
          </div>
          <div className="form-group">
            <label>Country *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="e.g., Turkey"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {destination ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DestinationsAdmin;
