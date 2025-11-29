import { PrismaService } from '../prisma/prisma.service';
export declare class SitemapService {
    private prisma;
    constructor(prisma: PrismaService);
    generateSitemap(): Promise<string>;
}
