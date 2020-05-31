import { SitemapStream, streamToPromise } from 'sitemap';
import * as PageService from '../PageService';
import * as FSService from '../FSService';
import { HTTP_URL } from '../../../admin-interface/src/shared/hosts';

export const generateSitemap = async () => {
  const allPages = await PageService.getAllPages();
  // Creates a sitemap object given the input configuration with URLs
  const sitemapStream = new SitemapStream({ hostname: HTTP_URL });

  allPages.forEach(page => sitemapStream.write({
    url: page.relativeUrl,
    changefreq: page.changefreq,
    priority: page.priority,
    lastmod: new Date().toISOString(),
  }));

  sitemapStream.end();

  const sitemap = await streamToPromise(sitemapStream);

  await FSService.saveSitemapToFile(sitemap.toString());
};