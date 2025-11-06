// src/components/admin/TourForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toursApiService from '../../api/tours';
import { destinationsApiService } from '../../api/destinations';
import ImageUpload from '../common/ImageUpload';
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
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      setPackages(tour.packages || []);
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

      // Prepare tour data with new fields
      const cleanTourData: any = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        excerpt: formData.excerpt,
        duration: formData.duration,
        thumbnail: formData.thumbnail,
        images: formData.images,
        featured: formData.featured,
        published: formData.published,
        type: formData.type || null,
        groupSize: formData.groupSize || null,
        included: formData.included.length > 0 ? formData.included : null,
        excluded: formData.excluded.length > 0 ? formData.excluded : null,
        highlights: formData.highlights.length > 0 ? formData.highlights : null,
        itinerary: formData.itinerary.length > 0 ? formData.itinerary : null,
        locationLatitude: formData.locationLatitude ? parseFloat(formData.locationLatitude) : null,
        locationLongitude: formData.locationLongitude ? parseFloat(formData.locationLongitude) : null,
        locationDescription: formData.locationDescription || null,
        languages: formData.languages.length > 0 ? formData.languages : null,
        availableTimes: formData.availableTimes.length > 0 ? formData.availableTimes : null,
      };
      
      // For update, send packages separately
      if (isEditing && id) {
        // Always include destinationId
        if (formData.destinationId) {
          cleanTourData.destinationId = formData.destinationId;
        }
        console.log('Updating tour with data:', cleanTourData);
        // Update tour without packages
        await toursApiService.updateTour(id, cleanTourData);
        
        // TODO: Update packages separately if needed
        // For now, packages are managed through the UI separately
      } else {
        // For create, include packages
        const tourData = {
          ...cleanTourData,
          destinationId: formData.destinationId,
          // Ensure images array is populated
          images: cleanTourData.images && cleanTourData.images.length > 0 
            ? cleanTourData.images 
            : (cleanTourData.thumbnail ? [cleanTourData.thumbnail] : []),
          packages: packages.map(pkg => ({
            name: pkg.name || 'Standard Package',
            description: pkg.description || '',
            adultPrice: pkg.adultPrice || 0,
            childPrice: pkg.childPrice || 0,
            infantPrice: pkg.infantPrice || 0,
            language: pkg.language || 'English',
            capacity: pkg.capacity || 10,
          })),
        };
        console.log('Creating tour with data:', JSON.stringify(tourData, null, 2));
        await toursApiService.createTour(tourData);
      }

      navigate('/admin/tours');
    } catch (err) {
      setError('Failed to save tour');
      console.error('Error saving tour:', err);
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
                  <label>Adult Price ($)</label>
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
                  <label>Child Price ($)</label>
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
                  <label>Infant Price ($)</label>
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
                const langs = e.target.value.split(/[,\n]/).map(l => l.trim()).filter(l => l);
                handleInputChange('languages', langs);
              }}
              placeholder="English, Turkish, Russian, German"
              rows={3}
              className="form-textarea"
            />
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
                console.log('Image uploaded, setting thumbnail and images:', url);
                // Set thumbnail
                setFormData(prev => ({
                  ...prev,
                  thumbnail: url
                }));
                // Add to images array if empty
                setFormData(prev => ({
                  ...prev,
                  images: prev.images.length > 0 ? prev.images : [url]
                }));
              }}
              currentImage={formData.thumbnail || (formData.images && formData.images[0])}
              label="Upload Thumbnail"
              folder="tours"
              maxSize={5}
            />
          </div>

          <div className="form-group">
            <label>Gallery Images</label>
            <p className="form-hint">Upload multiple images for the tour gallery</p>
            {/* TODO: Add multiple image upload */}
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
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
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