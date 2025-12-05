// src/components/admin/TourForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toursApiService from '../../api/tours';
import { destinationsApiService } from '../../api/destinations';
import ImageUpload from '../common/ImageUpload';
import MultipleImageUpload from '../common/MultipleImageUpload';
import type { TourPackage } from '../../api/tours';

const TourForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    excerpt: '',
    duration: '',
    type: '',
    groupSize: '',
    published: false,
    featured: false,
    destinationId: '',
    thumbnail: '',
    images: [] as string[],
    // New dynamic fields
    included: [] as string[],
    excluded: [] as string[],
    highlights: [] as string[],
    itinerary: [] as Array<{ day: string; title: string; description: string }>,
    locationLatitude: '',
    locationLongitude: '',
    locationDescription: '',
    // Meeting point (başlangıç buluşma noktası)
    meetingPointAddress: '',
    meetingPointMapUrl: '',
    languages: [] as string[],
    availableTimes: [] as string[],
  });

  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [originalPackageIds, setOriginalPackageIds] = useState<Set<string>>(new Set());
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedMonthlyPricing, setExpandedMonthlyPricing] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchInitialData();
    if (isEditing && id) {
      fetchTourData(id);
    }
  }, [id, isEditing]);

  const fetchInitialData = async () => {
    try {
      // Fetch destinations from API
      const fetchedDestinations = await destinationsApiService.getDestinations();
      setDestinations(fetchedDestinations);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      // Fallback to empty array if API fails
      setDestinations([]);
    }
  };

  const fetchTourData = async (tourId: string) => {
    try {
      setLoading(true);
      const tour = await toursApiService.getTourById(tourId);
      
      setFormData({
        title: tour.title,
        slug: tour.slug,
        description: tour.description || '',
        excerpt: tour.excerpt || '',
        duration: tour.duration || '',
        type: tour.type || '',
        groupSize: tour.groupSize || '',
        published: tour.published,
        featured: tour.featured,
        destinationId: tour.destination?.id || '',
        thumbnail: tour.thumbnail || '',
        images: tour.images || [],
        // New fields
        included: Array.isArray(tour.included) ? tour.included : [],
        excluded: Array.isArray(tour.excluded) ? tour.excluded : [],
        highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
        itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
        locationLatitude: tour.location?.latitude?.toString() || tour.destination?.latitude?.toString() || '',
        locationLongitude: tour.location?.longitude?.toString() || tour.destination?.longitude?.toString() || '',
        locationDescription: tour.location?.description || '',
        // Meeting point fields
        meetingPointAddress: (tour as any).meetingPointAddress || '',
        meetingPointMapUrl: (tour as any).meetingPointMapUrl || '',
        languages: Array.isArray(tour.languages) ? tour.languages : (tour.packages && tour.packages.length > 0 ? [...new Set(tour.packages.map(p => p.language))] : []),
        availableTimes: Array.isArray((tour as any).availableTimes) ? (tour as any).availableTimes : [],
      });

      const tourPackages = tour.packages || [];
      setPackages(tourPackages);
      // Store original package IDs to track deletions
      setOriginalPackageIds(new Set(tourPackages.filter(p => p.id).map(p => p.id)));
    } catch (err) {
      setError('Failed to fetch tour data');
      console.error('Error fetching tour:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === 'title') {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
    // console.log(`Updated ${field}:`, value);
  };

  const handlePackageChange = (index: number, field: string, value: any) => {
    const updatedPackages = [...packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value,
    };
    setPackages(updatedPackages);
  };

  const addPackage = () => {
    setPackages([
      ...packages,
      {
        id: '',
        name: '',
        description: '',
        adultPrice: 0,
        childPrice: 0,
        infantPrice: 0,
        language: 'English',
        capacity: 10,
        childMaxAge: undefined,
        infantMaxAge: undefined,
        monthlyPrices: undefined,
        tourId: '',
      },
    ]);
  };

  const removePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Tour title is required');
      return;
    }

    if (packages.length === 0) {
      setError('At least one package is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Helper function to clean strings (trim and return null if empty)
      const cleanString = (str: string | undefined | null): string | null => {
        if (!str || typeof str !== 'string') return null;
        const trimmed = str.trim();
        return trimmed.length > 0 ? trimmed : null;
      };

      // Helper function to clean arrays (remove empty strings and return null if empty)
      const cleanArray = (arr: string[] | undefined | null): string[] | null => {
        if (!arr || !Array.isArray(arr)) return null;
        const cleaned = arr.filter(item => item && typeof item === 'string' && item.trim().length > 0);
        return cleaned.length > 0 ? cleaned : null;
      };

      // Helper function to clean itinerary array
      const cleanItinerary = (arr: Array<{ day: string; title: string; description: string }> | undefined | null): Array<{ day: string; title: string; description: string }> | null => {
        if (!arr || !Array.isArray(arr)) return null;
        const cleaned = arr.filter(item => {
          const hasDay = item.day && typeof item.day === 'string' && item.day.trim().length > 0;
          const hasTitle = item.title && typeof item.title === 'string' && item.title.trim().length > 0;
          const hasDescription = item.description && typeof item.description === 'string' && item.description.trim().length > 0;
          return hasDay || hasTitle || hasDescription;
        });
        return cleaned.length > 0 ? cleaned : null;
      };

      // Prepare tour data with new fields - clean empty values
      const cleanTourData: any = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: cleanString(formData.description),
        excerpt: cleanString(formData.excerpt),
        duration: cleanString(formData.duration),
        thumbnail: cleanString(formData.thumbnail),
        images: formData.images && formData.images.length > 0 ? formData.images.filter(img => img && img.trim().length > 0) : [],
        featured: formData.featured,
        published: formData.published,
        type: cleanString(formData.type),
        groupSize: cleanString(formData.groupSize),
        included: cleanArray(formData.included),
        excluded: cleanArray(formData.excluded),
        highlights: cleanArray(formData.highlights),
        itinerary: cleanItinerary(formData.itinerary),
        locationLatitude: formData.locationLatitude && formData.locationLatitude.trim() ? parseFloat(formData.locationLatitude) : null,
        locationLongitude: formData.locationLongitude && formData.locationLongitude.trim() ? parseFloat(formData.locationLongitude) : null,
        locationDescription: cleanString(formData.locationDescription),
        meetingPointAddress: cleanString(formData.meetingPointAddress),
        meetingPointMapUrl: cleanString(formData.meetingPointMapUrl),
        languages: cleanArray(formData.languages),
        availableTimes: cleanArray(formData.availableTimes),
      };
      
      // For update, send packages separately
      if (isEditing && id) {
        // Always include destinationId
        if (formData.destinationId) {
          cleanTourData.destinationId = formData.destinationId;
        }
        console.log('Updating tour with data:', cleanTourData);
        // Update tour without packages
        try {
          await toursApiService.updateTour(id, cleanTourData);
        } catch (updateErr: any) {
          // Check for slug conflict error in update
          const updateErrorResponse = updateErr?.response?.data || updateErr?.response || {};
          const updateErrorMessage = updateErrorResponse?.message || updateErr?.message || '';
          
          if (updateErrorMessage.includes('slug') && (updateErrorMessage.includes('already exists') || updateErrorMessage.includes('Unique constraint'))) {
            throw new Error(`This slug "${formData.slug}" is already in use. Please choose a different slug.`);
          }
          throw updateErr;
        }
        
        // Find packages that were deleted (exist in original but not in current)
        const currentPackageIds = new Set(packages.filter(p => p.id).map(p => p.id));
        const deletedPackageIds = Array.from(originalPackageIds).filter(id => !currentPackageIds.has(id));
        
        // Delete removed packages from backend
        for (const deletedId of deletedPackageIds) {
          try {
            console.log('Deleting package:', deletedId);
            // First try without force delete
            try {
              await toursApiService.deleteTourPackage(deletedId, false);
            } catch (error: any) {
              // If error mentions bookings, try force delete
              const errorMessage = error?.response?.data?.message || error?.message || '';
              if (errorMessage.includes('associated booking')) {
                // Ask user if they want to force delete (for now, we'll force delete automatically)
                // In the future, you could show a confirmation dialog here
                console.warn('Package has associated bookings, force deleting...');
                await toursApiService.deleteTourPackage(deletedId, true);
              } else {
                throw error;
              }
            }
          } catch (error: any) {
            console.error('Error deleting package:', error);
            const errorMessage = error?.response?.data?.message || error?.message || `Failed to delete package: ${deletedId}`;
            throw new Error(errorMessage);
          }
        }
        
        // Helper function to clean package strings
        const cleanPackageString = (str: string | undefined | null): string | null => {
          if (!str || typeof str !== 'string') return null;
          const trimmed = str.trim();
          return trimmed.length > 0 ? trimmed : null;
        };

        // Update packages separately
        console.log('Updating packages:', packages);
        for (const pkg of packages) {
          try {
            const packageData: any = {
              name: cleanPackageString(pkg.name) || 'Standard Package',
              adultPrice: pkg.adultPrice || 0,
              childPrice: pkg.childPrice || 0,
              infantPrice: pkg.infantPrice || 0,
              language: cleanPackageString(pkg.language) || 'English',
              capacity: pkg.capacity || 10,
            };

            // Only include description if it's not empty
            const cleanedDescription = cleanPackageString(pkg.description);
            if (cleanedDescription) {
              packageData.description = cleanedDescription;
            }

            // Only include age limits if they have values
            if (pkg.childMaxAge !== undefined && pkg.childMaxAge !== null) {
              packageData.childMaxAge = pkg.childMaxAge;
            }
            if (pkg.infantMaxAge !== undefined && pkg.infantMaxAge !== null) {
              packageData.infantMaxAge = pkg.infantMaxAge;
            }

            // Only include monthlyPrices if it has entries
            if (pkg.monthlyPrices && Object.keys(pkg.monthlyPrices).length > 0) {
              packageData.monthlyPrices = pkg.monthlyPrices;
            }
            
            console.log('Package data to update:', packageData);
            
            if (pkg.id) {
              // Update existing package
              console.log('Updating existing package:', pkg.id);
              await toursApiService.updateTourPackage(pkg.id, packageData);
            } else {
              // Create new package
              console.log('Creating new package for tour:', id);
              await toursApiService.createTourPackage(id, packageData);
            }
          } catch (error) {
            console.error('Error updating package:', error);
            throw new Error(`Failed to update package: ${pkg.name || 'Unknown'}`);
          }
        }
      } else {
        // For create, include packages
        const tourData = {
          ...cleanTourData,
          destinationId: formData.destinationId,
          // Ensure images array is populated
          images: cleanTourData.images && cleanTourData.images.length > 0 
            ? cleanTourData.images 
            : (cleanTourData.thumbnail ? [cleanTourData.thumbnail] : []),
          packages: packages.map(pkg => {
            // Helper function to clean package strings
            const cleanPackageString = (str: string | undefined | null): string | null => {
              if (!str || typeof str !== 'string') return null;
              const trimmed = str.trim();
              return trimmed.length > 0 ? trimmed : null;
            };

            const packageData: any = {
              name: cleanPackageString(pkg.name) || 'Standard Package',
              adultPrice: pkg.adultPrice || 0,
              childPrice: pkg.childPrice || 0,
              infantPrice: pkg.infantPrice || 0,
              language: cleanPackageString(pkg.language) || 'English',
              capacity: pkg.capacity || 10,
            };

            // Only include description if it's not empty
            const cleanedDescription = cleanPackageString(pkg.description);
            if (cleanedDescription) {
              packageData.description = cleanedDescription;
            }

            // Only include age limits if they have values
            if (pkg.childMaxAge !== undefined && pkg.childMaxAge !== null) {
              packageData.childMaxAge = pkg.childMaxAge;
            }
            if (pkg.infantMaxAge !== undefined && pkg.infantMaxAge !== null) {
              packageData.infantMaxAge = pkg.infantMaxAge;
            }

            // Only include monthlyPrices if it has entries
            if (pkg.monthlyPrices && Object.keys(pkg.monthlyPrices).length > 0) {
              packageData.monthlyPrices = pkg.monthlyPrices;
            }

            return packageData;
          }),
        };
        console.log('Creating tour with data:', JSON.stringify(tourData, null, 2));
        await toursApiService.createTour(tourData);
      }

      navigate('/admin/tours');
    } catch (err: any) {
      console.error('Error saving tour:', err);
      
      // Check for slug conflict error
      const errorResponse = err?.response?.data || err?.response || {};
      const errorMessage = errorResponse?.message || err?.message || 'Failed to save tour';
      
      // Check if error is about slug already existing
      if (errorMessage.includes('slug') && (errorMessage.includes('already exists') || errorMessage.includes('Unique constraint'))) {
        setError(`This slug "${formData.slug}" is already in use. Please choose a different slug.`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading tour data...</div>
      </div>
    );
  }

  return (
    <div className="tour-form">
      <div className="form-header">
        <h1>{isEditing ? 'Edit Tour' : 'Create New Tour'}</h1>
        <button 
          className="btn-back"
          onClick={() => navigate('/admin/tours')}
        >
          ← Back to Tours
        </button>
      </div>

      <form onSubmit={handleSubmit} className="tour-form-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Tour Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter tour title..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="tour-slug"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="destinationId">Destination *</label>
              <select
                id="destinationId"
                value={formData.destinationId}
                onChange={(e) => handleInputChange('destinationId', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select Destination</option>
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id}>{dest.name}, {dest.country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt / Short Description</label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Brief description for listings..."
              rows={3}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Full Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed tour description..."
              rows={8}
              className="form-textarea"
              required
            />
          </div>
        </div>

        {/* Tour Details */}
        <div className="form-section">
          <h2>Tour Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 4 hours, 1 day, 2 Days"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Tour Type</label>
              <input
                type="text"
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                placeholder="e.g., Adventure, Cultural, Beach"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="groupSize">Group Size</label>
              <input
                type="text"
                id="groupSize"
                value={formData.groupSize}
                onChange={(e) => handleInputChange('groupSize', e.target.value)}
                placeholder="e.g., Small Group (Max 12), Medium Group (Max 25)"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Packages */}
        <div className="form-section">
          <div className="section-header">
            <h2>Tour Packages</h2>
            <button type="button" className="btn-add-package" onClick={addPackage}>
              ➕ Add Package
            </button>
          </div>

          {packages.map((pkg, index) => (
            <div key={index} className="package-form">
              <div className="package-header">
                <h3>Package {index + 1}</h3>
                <button 
                  type="button" 
                  className="btn-remove-package"
                  onClick={() => removePackage(index)}
                >
                  Remove
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Package Name</label>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                    placeholder="e.g., Standard, Premium"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Language</label>
                  <select
                    value={pkg.language}
                    onChange={(e) => handlePackageChange(index, 'language', e.target.value)}
                    className="form-select"
                  >
                    <option value="English">English</option>
                    <option value="Turkish">Turkish</option>
                    <option value="Russian">Russian</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Package Description</label>
                <textarea
                  value={pkg.description}
                  onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                  placeholder="Package details..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Adult Price (€)</label>
                  <input
                    type="number"
                    value={pkg.adultPrice || 0}
                    onChange={(e) => handlePackageChange(index, 'adultPrice', parseFloat(e.target.value) || 0)}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Child Price (€)</label>
                  <input
                    type="number"
                    value={pkg.childPrice || 0}
                    onChange={(e) => handlePackageChange(index, 'childPrice', parseFloat(e.target.value) || 0)}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Infant Price (€)</label>
                  <input
                    type="number"
                    value={pkg.infantPrice || 0}
                    onChange={(e) => handlePackageChange(index, 'infantPrice', parseFloat(e.target.value) || 0)}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Max Participants</label>
                  <input
                    type="number"
                    value={pkg.capacity || 10}
                    onChange={(e) => handlePackageChange(index, 'capacity', parseInt(e.target.value) || 10)}
                    className="form-input"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Child Max Age (years)</label>
                  <input
                    type="number"
                    value={pkg.childMaxAge || ''}
                    onChange={(e) => handlePackageChange(index, 'childMaxAge', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="form-input"
                    min="0"
                    max="18"
                    placeholder="e.g., 5 or 6"
                  />
                  <small className="form-hint">Maximum age for child ticket (e.g., 5 or 6 years)</small>
                </div>

                <div className="form-group">
                  <label>Infant Max Age (years)</label>
                  <input
                    type="number"
                    value={pkg.infantMaxAge || ''}
                    onChange={(e) => handlePackageChange(index, 'infantMaxAge', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="form-input"
                    min="0"
                    max="5"
                    placeholder="e.g., 2 or 3"
                  />
                  <small className="form-hint">Maximum age for infant ticket (e.g., 2 or 3 years)</small>
                </div>
              </div>

              {/* Monthly Pricing */}
              <div className="form-section-monthly" style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #e0e0e0' }}>
                <div 
                  className="monthly-pricing-header" 
                  onClick={() => {
                    const newExpanded = new Set(expandedMonthlyPricing);
                    if (newExpanded.has(index)) {
                      newExpanded.delete(index);
                    } else {
                      newExpanded.add(index);
                    }
                    setExpandedMonthlyPricing(newExpanded);
                  }}
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '15px',
                    padding: '10px',
                    borderRadius: '6px',
                    background: '#f8f9fa',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e9ecef'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9fa'}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>
                      Monthly Pricing (Optional)
                    </h4>
                    <p className="form-hint" style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>
                      Set different prices for each month. If not set, base prices will be used.
                    </p>
                  </div>
                  <span style={{ 
                    fontSize: '18px', 
                    color: '#666',
                    transition: 'transform 0.3s ease',
                    transform: expandedMonthlyPricing.has(index) ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </div>
                {expandedMonthlyPricing.has(index) && (
                <div className="monthly-prices-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {[
                    { num: 1, name: 'January' },
                    { num: 2, name: 'February' },
                    { num: 3, name: 'March' },
                    { num: 4, name: 'April' },
                    { num: 5, name: 'May' },
                    { num: 6, name: 'June' },
                    { num: 7, name: 'July' },
                    { num: 8, name: 'August' },
                    { num: 9, name: 'September' },
                    { num: 10, name: 'October' },
                    { num: 11, name: 'November' },
                    { num: 12, name: 'December' },
                  ].map((month) => {
                    const monthKey = month.num.toString();
                    const monthlyPrice = pkg.monthlyPrices?.[monthKey] || {};
                    
                    return (
                      <div key={month.num} className="monthly-price-item" style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', background: '#f9f9f9' }}>
                        <div className="monthly-price-header" style={{ marginBottom: '12px', fontWeight: 600, color: '#2c3e50' }}>
                          {month.name}
                        </div>
                        <div className="monthly-price-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div className="monthly-price-input">
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>Adult</label>
                            <input
                              type="number"
                              value={monthlyPrice.adultPrice || ''}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                const updatedMonthlyPrices = {
                                  ...(pkg.monthlyPrices || {}),
                                  [monthKey]: {
                                    ...monthlyPrice,
                                    adultPrice: value,
                                  },
                                };
                                // Remove month entry if all prices are empty
                                if (!value && !monthlyPrice.childPrice && !monthlyPrice.infantPrice) {
                                  delete updatedMonthlyPrices[monthKey];
                                }
                                handlePackageChange(index, 'monthlyPrices', Object.keys(updatedMonthlyPrices).length > 0 ? updatedMonthlyPrices : undefined);
                              }}
                              className="form-input"
                              min="0"
                              step="0.01"
                              placeholder="Base price"
                              style={{ width: '100%', padding: '6px 10px', fontSize: '13px' }}
                            />
                          </div>
                          <div className="monthly-price-input">
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>Child</label>
                            <input
                              type="number"
                              value={monthlyPrice.childPrice || ''}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                const updatedMonthlyPrices = {
                                  ...(pkg.monthlyPrices || {}),
                                  [monthKey]: {
                                    ...monthlyPrice,
                                    childPrice: value,
                                  },
                                };
                                if (!value && !monthlyPrice.adultPrice && !monthlyPrice.infantPrice) {
                                  delete updatedMonthlyPrices[monthKey];
                                }
                                handlePackageChange(index, 'monthlyPrices', Object.keys(updatedMonthlyPrices).length > 0 ? updatedMonthlyPrices : undefined);
                              }}
                              className="form-input"
                              min="0"
                              step="0.01"
                              placeholder="Base price"
                              style={{ width: '100%', padding: '6px 10px', fontSize: '13px' }}
                            />
                          </div>
                          <div className="monthly-price-input">
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>Infant</label>
                            <input
                              type="number"
                              value={monthlyPrice.infantPrice || ''}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                const updatedMonthlyPrices = {
                                  ...(pkg.monthlyPrices || {}),
                                  [monthKey]: {
                                    ...monthlyPrice,
                                    infantPrice: value,
                                  },
                                };
                                if (!value && !monthlyPrice.adultPrice && !monthlyPrice.childPrice) {
                                  delete updatedMonthlyPrices[monthKey];
                                }
                                handlePackageChange(index, 'monthlyPrices', Object.keys(updatedMonthlyPrices).length > 0 ? updatedMonthlyPrices : undefined);
                              }}
                              className="form-input"
                              min="0"
                              step="0.01"
                              placeholder="Base price"
                              style={{ width: '100%', padding: '6px 10px', fontSize: '13px' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Included/Excluded */}
        <div className="form-section">
          <h2>Included / Excluded</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Included Items (one per line)</label>
              <textarea
                value={formData.included.join('\n')}
                onChange={(e) => handleInputChange('included', e.target.value.split('\n').filter(item => item.trim()))}
                placeholder="Pick and Drop Service&#10;1 Meal Per Day&#10;Professional guide"
                rows={6}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label>Excluded Items (one per line)</label>
              <textarea
                value={formData.excluded.join('\n')}
                onChange={(e) => handleInputChange('excluded', e.target.value.split('\n').filter(item => item.trim()))}
                placeholder="Gratuities&#10;Travel insurance&#10;Personal expenses"
                rows={6}
                className="form-textarea"
              />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="form-section">
          <h2>Trip Highlights</h2>
          
          <div className="form-group">
            <label>Highlights (one per line)</label>
            <textarea
              value={formData.highlights.join('\n')}
              onChange={(e) => handleInputChange('highlights', e.target.value.split('\n').filter(item => item.trim()))}
              placeholder="Hot air balloon experience with 360-degree views&#10;Explore ancient underground cities&#10;Visit UNESCO World Heritage sites"
              rows={6}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Itinerary */}
        <div className="form-section">
          <h2>Tour Plan / Itinerary</h2>
          <p className="form-hint">Add daily itinerary items. Format: Day, Title, Description (each on a new line, separated by |)</p>
          
          <div className="form-group">
            <label>Itinerary Items</label>
            <textarea
              value={formData.itinerary.map(item => `${item.day}|${item.title}|${item.description}`).join('\n')}
              onChange={(e) => {
                const lines = e.target.value.split('\n').filter(line => line.trim());
                const itinerary = lines.map(line => {
                  const parts = line.split('|').map(p => p.trim());
                  return {
                    day: parts[0] || '',
                    title: parts[1] || '',
                    description: parts[2] || '',
                  };
                }).filter(item => {
                  // Only keep items that have at least one non-empty field
                  return item.day || item.title || item.description;
                });
                handleInputChange('itinerary', itinerary);
              }}
              placeholder="Day 1|Arrival & Hot Air Balloon|Morning pickup. Experience magical sunrise hot air balloon ride..."
              rows={8}
              className="form-textarea"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '8px' }}>
              Format: Day|Title|Description (use | to separate, one line per day)
            </small>
          </div>
        </div>

        {/* Location */}
        <div className="form-section">
          <h2>Location Information</h2>
          
          <div className="form-group">
            <label htmlFor="locationDescription">Location Description</label>
            <textarea
              id="locationDescription"
              value={formData.locationDescription}
              onChange={(e) => handleInputChange('locationDescription', e.target.value)}
              placeholder="Description about the tour location..."
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="locationLatitude">Latitude</label>
              <input
                type="number"
                id="locationLatitude"
                value={formData.locationLatitude}
                onChange={(e) => handleInputChange('locationLatitude', e.target.value)}
                placeholder="e.g., 36.8841"
                step="0.0001"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="locationLongitude">Longitude</label>
              <input
                type="number"
                id="locationLongitude"
                value={formData.locationLongitude}
                onChange={(e) => handleInputChange('locationLongitude', e.target.value)}
                placeholder="e.g., 30.7056"
                step="0.0001"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Meeting Point - Başlangıç Buluşma Noktası */}
        <div className="form-section">
          <h2>Meeting Point (Başlangıç Buluşma Noktası)</h2>
          
          <div className="form-group">
            <label htmlFor="meetingPointAddress">Meeting Point Address</label>
            <input
              type="text"
              id="meetingPointAddress"
              value={formData.meetingPointAddress}
              onChange={(e) => handleInputChange('meetingPointAddress', e.target.value)}
              placeholder="Örn: Hotel Lobby, Main Square, etc."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="meetingPointMapUrl">Meeting Point Map Embed URL</label>
            <input
              type="text"
              id="meetingPointMapUrl"
              value={formData.meetingPointMapUrl}
              onChange={(e) => {
                let value = e.target.value;
                // Extract URL from iframe code if user pasted full iframe HTML
                const iframeMatch = value.match(/src=["']([^"']+)["']/);
                if (iframeMatch) {
                  value = iframeMatch[1];
                } else {
                  // Extract URL if it's wrapped in quotes or other characters
                  const urlMatch = value.match(/https?:\/\/[^\s"'<>]+/);
                  if (urlMatch) {
                    value = urlMatch[0];
                  }
                }
                handleInputChange('meetingPointMapUrl', value);
              }}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="form-input"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '8px' }}>
              Google Maps'te buluşma noktasını açın → "Paylaş" → "Haritayı yerleştir" → Embed URL'sini kopyalayın
            </small>
          </div>

          {formData.meetingPointMapUrl && (
            <div className="form-group">
              <label>Map Preview</label>
              <div className="map-preview">
                <iframe
                  src={formData.meetingPointMapUrl}
                  width="100%"
                  height="300"
                  style={{ border: "0", borderRadius: "8px" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="form-section">
          <h2>Languages</h2>
          
          <div className="form-group">
            <label>Available Languages (comma or newline separated)</label>
            <textarea
              value={formData.languages.join(', ')}
              onChange={(e) => {
                // Split by comma or newline, but preserve spaces within language names
                // First split by newlines, then by commas, then trim each
                const lines = e.target.value.split('\n');
                const langs: string[] = [];
                lines.forEach(line => {
                  if (line.trim()) {
                    // Split by comma, but preserve spaces
                    const commaSeparated = line.split(',');
                    commaSeparated.forEach(lang => {
                      const trimmed = lang.trim();
                      if (trimmed) {
                        langs.push(trimmed);
                      }
                    });
                  }
                });
                handleInputChange('languages', langs);
              }}
              placeholder="English, Turkish, Russian, German"
              rows={3}
              className="form-textarea"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '8px' }}>
              You can use commas or newlines to separate languages. Spaces within language names are preserved.
            </small>
          </div>
        </div>

        {/* Available Times */}
        <div className="form-section">
          <h2>Available Times</h2>
          <p className="form-hint" style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Add available time slots for this tour. Customers will be able to select from these times when booking.
          </p>
          
          <div className="form-group">
            <label>Available Times</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.availableTimes.map((time, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const newTimes = [...formData.availableTimes];
                      newTimes[index] = e.target.value;
                      handleInputChange('availableTimes', newTimes);
                    }}
                    className="form-input"
                    style={{ flex: 1, maxWidth: '200px' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newTimes = formData.availableTimes.filter((_, i) => i !== index);
                      handleInputChange('availableTimes', newTimes);
                    }}
                    style={{
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#d32f2f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f44336';
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  handleInputChange('availableTimes', [...formData.availableTimes, '09:00']);
                }}
                style={{
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  alignSelf: 'flex-start',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#45a049';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#4caf50';
                }}
              >
                + Add Time Slot
              </button>
            </div>
            <p className="form-hint" style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              Format: HH:MM (24-hour format). Click "Add Time Slot" to add more times.
            </p>
          </div>
          
          {formData.availableTimes.length === 0 && (
            <div className="form-group">
              <p style={{ fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
                No time slots added yet. Click "Add Time Slot" to add your first time.
              </p>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="form-section">
          <h2>Tour Images</h2>
          
          <div className="form-group">
            <label>Thumbnail Image</label>
            <ImageUpload
              onImageUploaded={(url, key) => {
                console.log('Image uploaded, setting thumbnail:', url);
                // Set thumbnail
                setFormData(prev => ({
                  ...prev,
                  thumbnail: url
                }));
                // Add to images array if not already included
                setFormData(prev => ({
                  ...prev,
                  images: prev.images.includes(url) ? prev.images : [url, ...prev.images]
                }));
              }}
              currentImage={formData.thumbnail || (formData.images && formData.images[0])}
              label="Upload Thumbnail (or select from gallery below)"
              folder="tours"
              maxSize={5}
            />
            {formData.images.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Or select from gallery:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {formData.images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          thumbnail: img
                        }));
                      }}
                      style={{
                        padding: '4px 8px',
                        border: formData.thumbnail === img ? '2px solid #7f0af5' : '1px solid #ddd',
                        borderRadius: '4px',
                        background: formData.thumbnail === img ? '#f0e6ff' : '#fff',
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: formData.thumbnail === img ? '#7f0af5' : '#666',
                        fontWeight: formData.thumbnail === img ? 600 : 400
                      }}
                    >
                      {index === 0 ? 'First' : `Image ${index + 1}`}
                      {formData.thumbnail === img && ' ✓'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <MultipleImageUpload
              onImagesChange={(imageUrls) => {
                setFormData(prev => {
                  const newData = {
                    ...prev,
                    images: imageUrls
                  };
                  // If thumbnail is empty, set first image as thumbnail
                  if (!prev.thumbnail && imageUrls.length > 0) {
                    newData.thumbnail = imageUrls[0];
                  }
                  return newData;
                });
              }}
              currentImages={formData.images}
              label="Gallery Images"
              folder="tours"
              maxSize={5}
              maxFiles={20}
            />
            <p className="form-hint" style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Upload multiple images for the tour gallery. The first image will be used as thumbnail if no thumbnail is set.
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="form-section">
          <h2>Status & Settings</h2>
          
          <div className="form-row">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => handleInputChange('published', e.target.checked)}
                />
                Published
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                />
                Featured
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Tour' : 'Create Tour')}
          </button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/admin/tours')}
          >
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        .tour-form {
          max-width: 1000px;
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

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .form-header h1 {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .btn-back {
          background: #6c757d;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-back:hover {
          background: #5a6268;
        }

        .tour-form-content {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 24px;
          border-left: 4px solid #dc3545;
        }

        .form-section {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid #f0f0f0;
        }

        .form-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
        }

        .form-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 20px 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .btn-add-package {
          background: #28a745;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-add-package:hover {
          background: #218838;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .form-hint {
          color: #666;
          font-size: 13px;
          margin-bottom: 12px;
          font-style: italic;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
          line-height: 1.4;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
          resize: vertical;
          min-height: 100px;
          overflow-y: auto;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .checkbox-group {
          flex-direction: row;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 0 !important;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }

        .package-form {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .package-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .package-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .btn-remove-package {
          background: #dc3545;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .btn-remove-package:hover {
          background: #c82333;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .btn-save {
          background: #28a745;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-save:hover:not(:disabled) {
          background: #218838;
        }

        .btn-save:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-cancel:hover {
          background: #5a6268;
        }

        /* Map Preview Styles */
        .map-preview {
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .form-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default TourForm;