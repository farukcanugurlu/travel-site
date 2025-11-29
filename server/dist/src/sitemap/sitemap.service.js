"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SitemapService = class SitemapService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateSitemap() {
        const baseUrl = 'https://lexorholiday.com';
        const currentDate = new Date().toISOString().split('T')[0];
        const tours = await this.prisma.tour.findMany({
            where: { published: true },
            select: {
                slug: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
        const blogPosts = await this.prisma.blogPost.findMany({
            where: { published: true },
            select: {
                slug: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
        const staticPages = [
            { url: '/', priority: '1.0', changefreq: 'weekly' },
            { url: '/tours', priority: '0.9', changefreq: 'weekly' },
            { url: '/blog', priority: '0.8', changefreq: 'weekly' },
            { url: '/about', priority: '0.7', changefreq: 'monthly' },
            { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        ];
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;
        for (const page of staticPages) {
            xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
        }
        for (const tour of tours) {
            const lastmod = tour.updatedAt ? new Date(tour.updatedAt).toISOString().split('T')[0] : currentDate;
            xml += `  <url>
    <loc>${baseUrl}/tour/${tour.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        }
        for (const post of blogPosts) {
            const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : currentDate;
            xml += `  <url>
    <loc>${baseUrl}/blog-details/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        }
        xml += `</urlset>`;
        return xml;
    }
};
exports.SitemapService = SitemapService;
exports.SitemapService = SitemapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SitemapService);
//# sourceMappingURL=sitemap.service.js.map