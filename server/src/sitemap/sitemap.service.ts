import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SitemapService {
  constructor(private prisma: PrismaService) {}

  async generateSitemap(): Promise<string> {
    const baseUrl = 'https://lexorholiday.com';
    const currentDate = new Date().toISOString().split('T')[0];

    // Get all published tours
    const tours = await this.prisma.tour.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Get all published blog posts
    const blogPosts = await this.prisma.blogPost.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/tours', priority: '0.9', changefreq: 'weekly' },
      { url: '/blog', priority: '0.8', changefreq: 'weekly' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    ];

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add tour pages
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

    // Add blog post pages
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
}

