import React, { useEffect, useState } from 'react';
import settingsApi, { type SiteSettingsData } from '../../api/settings';
import ImageUpload from '../common/ImageUpload';

const SiteSettings: React.FC = () => {
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
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof SiteSettingsData, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="admin-card">
      <h2>Site Settings</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={update} className="settings-grid">
          <div className="form-row">
            <ImageUpload
              label="Logo (Normal Header)"
              folder="site"
              currentImage={form.logo || ''}
              onImageUploaded={(url) => set('logo', url)}
              maxSize={2}
              hint="Ideal boyut: 200x60px (genişlik x yükseklik). PNG formatı önerilir. Şeffaf arka plan desteklenir."
            />
            <ImageUpload
              label="Logo (Sticky Header)"
              folder="site"
              currentImage={form.logoSticky || ''}
              onImageUploaded={(url) => set('logoSticky', url)}
              maxSize={2}
              hint="Sticky header için logo. Yüklenmezse normal logo kullanılır. Ideal boyut: 200x60px. PNG formatı önerilir."
            />
          </div>
          <ImageUpload
            label="Logo (Footer)"
            folder="site"
            currentImage={form.footerLogo || ''}
            onImageUploaded={(url) => set('footerLogo', url)}
            maxSize={2}
            hint="Footer için logo. Yüklenmezse normal logo kullanılır. Ideal boyut: 200x60px. PNG formatı önerilir."
          />
          <ImageUpload
            label="Favicon"
            folder="site"
            currentImage={form.favicon || ''}
            onImageUploaded={(url) => set('favicon', url)}
          />
          <div className="form-group">
            <label>Company Description</label>
            <textarea 
              value={form.companyDescription || ''} 
              onChange={e => set('companyDescription', e.target.value)}
              rows={4}
              placeholder="Discover amazing travel experiences with LEXOR Travel. We offer carefully curated tours to destinations around the world."
            />
          </div>
          <div className="form-group"><label>Office Address</label><input value={form.officeAddress || ''} onChange={e => set('officeAddress', e.target.value)} /></div>
          {/* City/Country removed; officeAddress is sufficient */}
          <div className="form-row">
            <div className="form-group"><label>Phone</label><input value={form.phone || ''} onChange={e => set('phone', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Email</label><input value={form.email || ''} onChange={e => set('email', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Facebook</label><input value={form.facebook || ''} onChange={e => set('facebook', e.target.value)} /></div>
            <div className="form-group"><label>Instagram</label><input value={form.instagram || ''} onChange={e => set('instagram', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Twitter</label><input value={form.twitter || ''} onChange={e => set('twitter', e.target.value)} /></div>
            <div className="form-group"><label>Youtube</label><input value={form.youtube || ''} onChange={e => set('youtube', e.target.value)} /></div>
          </div>
          <div className="form-group">
            <label>Map Embed URL</label>
            <input 
              value={form.mapEmbedUrl || ''} 
              onChange={e => {
                let value = e.target.value;
                // If user pastes full iframe code, extract the src URL
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
                set('mapEmbedUrl', value);
              }} 
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Google Maps'te konumunuzu açın → "Paylaş" → "Haritayı yerleştir" → Embed URL'sini kopyalayın<br/>
              <strong>İpucu:</strong> Iframe kodunu yapıştırırsanız, URL otomatik olarak çıkarılacaktır.
            </small>
          </div>

          {/* SEO Settings */}
          <div className="form-section-header" style={{ marginTop: '30px', marginBottom: '20px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>SEO Settings</h3>
          </div>
          
          <div className="form-group">
            <label>Site Title</label>
            <input 
              value={form.siteTitle || ''} 
              onChange={e => set('siteTitle', e.target.value)} 
              placeholder="Lexor Holiday - Travel Agency"
            />
          </div>
          
          <div className="form-group">
            <label>Site Description (Meta Description)</label>
            <textarea 
              value={form.siteDescription || ''} 
              onChange={e => set('siteDescription', e.target.value)}
              rows={3}
              placeholder="Premium travel agency offering curated tours and unforgettable experiences..."
            />
          </div>
          
          <div className="form-group">
            <label>Site Keywords</label>
            <input 
              value={form.siteKeywords || ''} 
              onChange={e => set('siteKeywords', e.target.value)} 
              placeholder="lexor holiday, travel agency, turkey tours, antalya tours"
            />
          </div>
          
          <div className="form-group">
            <label>Site URL</label>
            <input 
              value={form.siteUrl || ''} 
              onChange={e => set('siteUrl', e.target.value)} 
              placeholder="https://lexorholiday.com"
            />
          </div>
          
          <ImageUpload
            label="Open Graph Image (Default for social media sharing)"
            folder="site"
            currentImage={form.ogImage || ''}
            onImageUploaded={(url) => set('ogImage', url)}
          />
          
          <div className="form-group">
            <label>Twitter Handle</label>
            <input 
              value={form.twitterHandle || ''} 
              onChange={e => set('twitterHandle', e.target.value)} 
              placeholder="@lexorholiday"
            />
          </div>

          {/* Page Hero Images */}
          <div className="form-section-header" style={{ marginTop: '30px', marginBottom: '20px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Page Hero Images</h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>Upload hero/banner images for different pages</p>
          </div>

          <div className="form-row">
            <ImageUpload
              label="Tours Page Hero Image"
              folder="site"
              currentImage={form.toursHeroImage || ''}
              onImageUploaded={(url) => set('toursHeroImage', url)}
            />
            <ImageUpload
              label="Cart Page Hero Image"
              folder="site"
              currentImage={form.cartHeroImage || ''}
              onImageUploaded={(url) => set('cartHeroImage', url)}
            />
          </div>

          <div className="form-row">
            <ImageUpload
              label="Contact Page Hero Image"
              folder="site"
              currentImage={form.contactHeroImage || ''}
              onImageUploaded={(url) => set('contactHeroImage', url)}
            />
            <ImageUpload
              label="Blog Page Hero Image"
              folder="site"
              currentImage={form.blogHeroImage || ''}
              onImageUploaded={(url) => set('blogHeroImage', url)}
            />
          </div>

          <div className="form-row">
            <ImageUpload
              label="About Page Hero Image"
              folder="site"
              currentImage={form.aboutHeroImage || ''}
              onImageUploaded={(url) => set('aboutHeroImage', url)}
            />
          </div>

          {/* About Page Settings */}
          <div className="form-section-header" style={{ marginTop: '30px', marginBottom: '20px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>About Page Settings</h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>Customize the About page content</p>
          </div>

          <div className="form-group">
            <label>About Page Subtitle</label>
            <input 
              value={form.aboutPageSubtitle || ''} 
              onChange={e => set('aboutPageSubtitle', e.target.value)} 
              placeholder="Explore the world with us"
            />
          </div>

          <div className="form-group">
            <label>About Page Title</label>
            <input 
              value={form.aboutPageTitle || ''} 
              onChange={e => set('aboutPageTitle', e.target.value)} 
              placeholder="The perfect vacation come true with our Travel Agency"
            />
          </div>

          <div className="form-group">
            <label>About Page Description</label>
            <textarea 
              value={form.aboutPageDescription || ''} 
              onChange={e => set('aboutPageDescription', e.target.value)}
              rows={4}
              placeholder="when an unknown printer took a galley of type and scrambled it to make a type specimen book..."
            />
          </div>

          <div className="form-group">
            <label>About Page Button Text</label>
            <input 
              value={form.aboutPageButtonText || ''} 
              onChange={e => set('aboutPageButtonText', e.target.value)} 
              placeholder="Book Your Room"
            />
          </div>

          <div className="form-section-header" style={{ marginTop: '20px', marginBottom: '15px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>About Page Images</h4>
          </div>

          <div className="form-row">
            <ImageUpload
              label="About Page Image 1"
              folder="site"
              currentImage={form.aboutPageImage1 || ''}
              onImageUploaded={(url) => set('aboutPageImage1', url)}
            />
            <ImageUpload
              label="About Page Image 2"
              folder="site"
              currentImage={form.aboutPageImage2 || ''}
              onImageUploaded={(url) => set('aboutPageImage2', url)}
            />
          </div>

          <ImageUpload
            label="About Page Image 3"
            folder="site"
            currentImage={form.aboutPageImage3 || ''}
            onImageUploaded={(url) => set('aboutPageImage3', url)}
          />

          {error && <div className="error">{error}</div>}
          {success && <div className="success">Saved</div>}
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Settings'}</button>
        </form>
      )}

      <style>{`
        .admin-card{background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .settings-grid{display:flex;flex-direction:column;gap:14px}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .form-group{display:flex;flex-direction:column;gap:6px}
        .form-group input{border:1px solid #e0e0e0;border-radius:8px;padding:10px}
        .form-group textarea{border:1px solid #e0e0e0;border-radius:8px;padding:10px;font-family:inherit;resize:vertical;min-height:100px}
        .btn-primary{background:#3498db;color:#fff;border:none;border-radius:8px;padding:10px 16px;font-weight:600;cursor:pointer}
        .error{color:#e74c3c}
        .success{color:#2ecc71}
        @media(max-width:768px){.form-row{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
};

export default SiteSettings;


