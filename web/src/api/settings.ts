import apiService from './api';

export interface SiteSettingsData {
  // Images
  logo?: string;
  headerImage?: string;
  footerImage?: string;
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
  chooseButtonText?: string;
  chooseImage1?: string;
  chooseImage2?: string;

  // SEO Settings
  siteTitle?: string;
  siteDescription?: string;
  siteKeywords?: string;
  siteUrl?: string;
  ogImage?: string;
  twitterHandle?: string;
  defaultMetaDescription?: string;
}

class SettingsApiService {
  async getSettings(): Promise<SiteSettingsData> {
    return apiService.get<SiteSettingsData>('/settings');
  }

  async updateSettings(data: SiteSettingsData): Promise<SiteSettingsData> {
    return apiService.put<SiteSettingsData>('/settings', data);
  }
}

export default new SettingsApiService();


