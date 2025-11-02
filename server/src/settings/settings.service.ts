import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SiteSettingsData {
  // Images (stored as uploaded URLs/paths)
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


