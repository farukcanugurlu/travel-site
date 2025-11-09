import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SiteSettingsData {
  // Images (stored as uploaded URLs/paths)
  logo?: string;
  logoSticky?: string; // Logo for sticky header (if not set, uses logo)
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

  // Page Hero Images
  toursHeroImage?: string;
  cartHeroImage?: string;
  contactHeroImage?: string;
  blogHeroImage?: string;
}

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    try {
      const setting = await (this.prisma as any).setting.findUnique({ where: { id: 'singleton' } });
      return setting?.data ?? {};
    } catch (err) {
      console.error('SettingsService.get error', err);
      return {};
    }
  }

  async update(data: SiteSettingsData) {
    try {
      const sanitized = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      const updated = await (this.prisma as any).setting.upsert({
        where: { id: 'singleton' },
        update: { data: sanitized as any },
        create: { id: 'singleton', data: sanitized as any },
      });
      return updated.data;
    } catch (err) {
      console.error('SettingsService.update error', err, { data });
      throw err;
    }
  }
}


