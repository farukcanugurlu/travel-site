import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { SitemapService } from './sitemap.service';

@Controller()
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml')
  async getSitemap(@Res() res: Response): Promise<void> {
    const xml = await this.sitemapService.generateSitemap();
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  }
}

