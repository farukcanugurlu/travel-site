import React, { useEffect, useState } from 'react';
import settingsApi, { type SiteSettingsData } from '../../api/settings';
import ImageUpload from '../common/ImageUpload';
import { toast } from 'react-toastify';

const HomepageSettings: React.FC = () => {
  const [form, setForm] = useState<SiteSettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await settingsApi.getSettings();
        setForm(data || {});
      } catch (err) {
        setError('Failed to load settings');
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await settingsApi.updateSettings(form);
      setSuccess(true);
      toast.success('Homepage settings saved successfully!');
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Failed to save settings');
      toast.error('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof SiteSettingsData, v: string | string[]) => {
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const addHeroImage = () => {
    setForm(prev => ({
      ...prev,
      heroSliderImages: [...(prev.heroSliderImages || []), '']
    }));
  };

  const removeHeroImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      heroSliderImages: (prev.heroSliderImages || []).filter((_, i) => i !== index)
    }));
  };

  const updateHeroImage = (index: number, url: string) => {
    setForm(prev => ({
      ...prev,
      heroSliderImages: (prev.heroSliderImages || []).map((img, i) => i === index ? url : img)
    }));
  };

  return (
    <div className="homepage-settings-admin">
      <div className="admin-header">
        <div className="header-content">
          <h1>🏠 Homepage Settings</h1>
          <p>Customize the content and images displayed on your homepage</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="loading-spinner">Loading settings...</div>
        </div>
      ) : (
        <form onSubmit={update} className="settings-form">
          {/* Hero Section */}
          <div className="settings-section">
            <h2 className="section-title">Hero Section</h2>
            <div className="form-group">
              <label>Hero Title</label>
              <input 
                type="text"
                value={form.heroTitle || ''} 
                onChange={e => set('heroTitle', e.target.value)}
                placeholder="Lexor Holiday"
              />
            </div>
            <div className="form-group">
              <label>Hero Subtitle</label>
              <textarea 
                value={form.heroSubtitle || ''} 
                onChange={e => set('heroSubtitle', e.target.value)}
                rows={3}
                placeholder="From the first click to the final memory: Lexor Holiday is with you."
              />
            </div>
            <div className="form-group">
              <label>Hero Button Text</label>
              <input 
                type="text"
                value={form.heroButtonText || ''} 
                onChange={e => set('heroButtonText', e.target.value)}
                placeholder="Take a Tour"
              />
            </div>
            <div className="form-group">
              <label>Hero Slider Images</label>
              <div className="image-list">
                {(form.heroSliderImages || []).map((img, index) => (
                  <div key={index} className="image-item">
                    <ImageUpload
                      label={`Image ${index + 1}`}
                      folder="homepage"
                      currentImage={img}
                      onImageUploaded={(url) => updateHeroImage(index, url)}
                    />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={() => removeHeroImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-image"
                  onClick={addHeroImage}
                >
                  + Add Image
                </button>
              </div>
            </div>
          </div>

          {/* Popular Tours Section */}
          <div className="settings-section">
            <h2 className="section-title">Popular Tours Section</h2>
            <div className="form-group">
              <label>Subtitle</label>
              <input 
                type="text"
                value={form.popularTourSubtitle || ''} 
                onChange={e => set('popularTourSubtitle', e.target.value)}
                placeholder="Most Popular Tour"
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text"
                value={form.popularTourTitle || ''} 
                onChange={e => set('popularTourTitle', e.target.value)}
                placeholder="Let's Discover The World With Our Excellent Eyes"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={form.popularTourDescription || ''} 
                onChange={e => set('popularTourDescription', e.target.value)}
                rows={4}
                placeholder="Whether you're looking for a romantic getaway, family-friendly solo journey to explore the world, a travel agency can provide tailored itinerary that exceeds your expectations."
              />
            </div>
          </div>

          {/* About Section Images */}
          <div className="settings-section">
            <h2 className="section-title">About Section Images</h2>
            <div className="form-group">
              <label>Logo</label>
              <ImageUpload
                label="About Logo"
                folder="homepage"
                currentImage={form.aboutLogo || ''}
                onImageUploaded={(url) => set('aboutLogo', url)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Left Image 1</label>
                <ImageUpload
                  label=""
                  folder="homepage"
                  currentImage={form.aboutLeftImage1 || ''}
                  onImageUploaded={(url) => set('aboutLeftImage1', url)}
                />
              </div>
              <div className="form-group">
                <label>Left Image 2</label>
                <ImageUpload
                  label=""
                  folder="homepage"
                  currentImage={form.aboutLeftImage2 || ''}
                  onImageUploaded={(url) => set('aboutLeftImage2', url)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Right Image 1</label>
                <ImageUpload
                  label=""
                  folder="homepage"
                  currentImage={form.aboutRightImage1 || ''}
                  onImageUploaded={(url) => set('aboutRightImage1', url)}
                />
              </div>
              <div className="form-group">
                <label>Right Image 2</label>
                <ImageUpload
                  label=""
                  folder="homepage"
                  currentImage={form.aboutRightImage2 || ''}
                  onImageUploaded={(url) => set('aboutRightImage2', url)}
                />
              </div>
            </div>
          </div>

          {/* Choose Section */}
          <div className="settings-section">
            <h2 className="section-title">Choose Section</h2>
            <div className="form-group">
              <label>Subtitle</label>
              <input 
                type="text"
                value={form.chooseSubtitle || ''} 
                onChange={e => set('chooseSubtitle', e.target.value)}
                placeholder="Choose Your Dream Tour With Us"
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text"
                value={form.chooseTitle || ''} 
                onChange={e => set('chooseTitle', e.target.value)}
                placeholder="discover when even you want to go"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={form.chooseDescription || ''} 
                onChange={e => set('chooseDescription', e.target.value)}
                rows={3}
                placeholder="Are you tired of the typical tourist destinations and looking to step out of your comfort zone? Adventure travel may be the perfect solution for you! Here are four."
              />
            </div>
            <div className="form-group">
              <label>Feature 1 - Title</label>
              <input 
                type="text"
                value={form.chooseFeature1Title || ''} 
                onChange={e => set('chooseFeature1Title', e.target.value)}
                placeholder="Best Travel Agency"
              />
            </div>
            <div className="form-group">
              <label>Feature 1 - Description</label>
              <textarea 
                value={form.chooseFeature1Description || ''} 
                onChange={e => set('chooseFeature1Description', e.target.value)}
                rows={2}
                placeholder="Are you tired of the typical tourist destinatio and looking step out of your comfort."
              />
            </div>
            <div className="form-group">
              <label>Feature 2 - Title</label>
              <input 
                type="text"
                value={form.chooseFeature2Title || ''} 
                onChange={e => set('chooseFeature2Title', e.target.value)}
                placeholder="Secure Journey With Us"
              />
            </div>
            <div className="form-group">
              <label>Feature 2 - Description</label>
              <textarea 
                value={form.chooseFeature2Description || ''} 
                onChange={e => set('chooseFeature2Description', e.target.value)}
                rows={2}
                placeholder="Are you tired of the typical tourist destinatio and looking step out of your comfort."
              />
            </div>
            <div className="form-group">
              <label>Button Text</label>
              <input 
                type="text"
                value={form.chooseButtonText || ''} 
                onChange={e => set('chooseButtonText', e.target.value)}
                placeholder="Book Your Trip"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Image 1</label>
                <ImageUpload
                  label=""
                  folder="homepage"
                  currentImage={form.chooseImage1 || ''}
                  onImageUploaded={(url) => set('chooseImage1', url)}
                />
              </div>
              <div className="form-group">
                <label>Image 2</label>
                <ImageUpload
                  label=""
                  folder="homepage"
                  currentImage={form.chooseImage2 || ''}
                  onImageUploaded={(url) => set('chooseImage2', url)}
                />
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Settings saved successfully!</div>}
          
          <button type="submit" disabled={saving} className="btn-save">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      )}

      <style>{`
        .homepage-settings-admin {
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-header {
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

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .settings-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid #3498db;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-group label {
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .image-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .image-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .image-item > div {
          flex: 1;
        }

        .btn-remove-image {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: background 0.2s ease;
          align-self: flex-start;
          margin-top: 32px;
        }

        .btn-remove-image:hover {
          background: #c0392b;
        }

        .btn-add-image {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
          width: fit-content;
        }

        .btn-add-image:hover {
          background: #2980b9;
        }

        .btn-save {
          background: #27ae60;
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          width: fit-content;
          align-self: flex-start;
        }

        .btn-save:hover:not(:disabled) {
          background: #229954;
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee;
          color: #e74c3c;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e74c3c;
        }

        .success-message {
          background: #efe;
          color: #27ae60;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #27ae60;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .image-item {
            flex-direction: column;
          }

          .btn-remove-image {
            margin-top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HomepageSettings;

