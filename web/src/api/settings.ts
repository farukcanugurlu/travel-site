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


