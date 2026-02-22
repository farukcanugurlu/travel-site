import apiService from './api';

export interface SiteSettingsData {
  // Images
  logo?: string;
  logoSticky?: string; // Logo for sticky header (if not set, uses logo)
  footerLogo?: string; // Logo for footer (if not set, uses logo)
  sidebarLogo?: string; // Logo for sidebar (if not set, uses logo)
  favicon?: string;

  // Company info
  companyDescription?: string;

  // Contact & address
  officeAddress?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;

  // Socials & map
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  mapEmbedUrl?: string;

  // Homepage settings
  heroTitle?: string;
  heroSubtitle?: string;
  heroButtonText?: string;
  heroSliderImages?: string[];
  popularTourSubtitle?: string;
  popularTourTitle?: string;
  popularTourDescription?: string;
  aboutLogo?: string;
  aboutLeftImage1?: string;
  aboutLeftImage2?: string;
  aboutRightImage1?: string;
  aboutRightImage2?: string;

  // Choose section settings
  chooseSubtitle?: string;
  chooseTitle?: string;
  chooseDescription?: string;
  chooseFeature1Title?: string;
  chooseFeature1Description?: string;
  chooseFeature2Title?: string;
  chooseFeature2Description?: string;
  chooseFeature3Title?: string;
  chooseFeature3Description?: string;
  chooseButtonText?: string;
  chooseImage1?: string;
  chooseImage2?: string;

  // Blog section settings
  blogSubtitle?: string;
  blogTitle?: string;
  blogDescription?: string;

  // SEO Settings
  siteTitle?: string;
  siteDescription?: string;
  siteKeywords?: string;
  siteUrl?: string;
  ogImage?: string;
  twitterHandle?: string;
  defaultMetaDescription?: string;

  // Page Hero Images
  toursHeroImage?: string;
  cartHeroImage?: string;
  contactHeroImage?: string;
  blogHeroImage?: string;
  aboutHeroImage?: string;

  // About Page Settings
  aboutPageSubtitle?: string;
  aboutPageTitle?: string;
  aboutPageDescription?: string;
  aboutPageButtonText?: string;
  aboutPageImage1?: string;
  aboutPageImage2?: string;
  aboutPageImage3?: string;

}

const SETTINGS_CACHE_KEY = 'site_settings_cache';
const SETTINGS_CACHE_TIMESTAMP_KEY = 'site_settings_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

class SettingsApiService {
  // Cache'den settings'i oku
  private getCachedSettings(): SiteSettingsData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
      const timestamp = localStorage.getItem(SETTINGS_CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const cacheTime = parseInt(timestamp, 10);
        const now = Date.now();
        
        // Cache hala geçerli mi? (5 dakika)
        if (now - cacheTime < CACHE_DURATION) {
          return JSON.parse(cached);
        }
      }
    } catch (e) {
      console.error('Error reading settings cache:', e);
    }
    
    return null;
  }

  // Settings'i cache'e kaydet
  private setCachedSettings(data: SiteSettingsData): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(SETTINGS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      console.error('Error saving settings cache:', e);
    }
  }

  // Cache'i temizle
  private clearCache(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(SETTINGS_CACHE_KEY);
      localStorage.removeItem(SETTINGS_CACHE_TIMESTAMP_KEY);
    } catch (e) {
      console.error('Error clearing settings cache:', e);
    }
  }

  // İlk render için cache'den oku (senkron)
  getCachedSettingsSync(): SiteSettingsData | null {
    return this.getCachedSettings();
  }

  async getSettings(): Promise<SiteSettingsData> {
    // Önce cache'den oku
    const cached = this.getCachedSettings();
    
    // API'den güncel veriyi çek
    try {
      const data = await apiService.get<SiteSettingsData>('/settings');
      // Cache'i güncelle
      this.setCachedSettings(data);
      return data;
    } catch (error) {
      // API hatası varsa cache'den döndür
      if (cached) {
        console.warn('Settings API error, using cache:', error);
        return cached;
      }
      throw error;
    }
  }

  async updateSettings(data: SiteSettingsData): Promise<SiteSettingsData> {
    const updated = await apiService.put<SiteSettingsData>('/settings', data);
    // Cache'i güncelle
    this.setCachedSettings(updated);
    return updated;
  }
}

export default new SettingsApiService();


