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
          <ImageUpload
            label="Logo"
            folder="site"
            currentImage={form.logo || ''}
            onImageUploaded={(url) => set('logo', url)}
          />
          <div className="form-row">
            <ImageUpload
              label="Header Image"
              folder="site"
              currentImage={form.headerImage || ''}
              onImageUploaded={(url) => set('headerImage', url)}
            />
            <ImageUpload
              label="Footer Image"
              folder="site"
              currentImage={form.footerImage || ''}
              onImageUploaded={(url) => set('footerImage', url)}
            />
          </div>
          <ImageUpload
            label="Favicon"
            folder="site"
            currentImage={form.favicon || ''}
            onImageUploaded={(url) => set('favicon', url)}
          />
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
          <div className="form-group"><label>Map Embed URL</label><input value={form.mapEmbedUrl || ''} onChange={e => set('mapEmbedUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?..." /></div>

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
        .btn-primary{background:#3498db;color:#fff;border:none;border-radius:8px;padding:10px 16px;font-weight:600;cursor:pointer}
        .error{color:#e74c3c}
        .success{color:#2ecc71}
        @media(max-width:768px){.form-row{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
};

export default SiteSettings;


