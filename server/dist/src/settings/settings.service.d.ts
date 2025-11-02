import { PrismaService } from '../prisma/prisma.service';
export interface SiteSettingsData {
    logo?: string;
    headerImage?: string;
    footerImage?: string;
    favicon?: string;
    companyDescription?: string;
    officeAddress?: string;
    city?: string;
    country?: string;
    phone?: string;
    email?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    mapEmbedUrl?: string;
}
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    get(): Promise<any>;
    update(data: SiteSettingsData): Promise<any>;
}
