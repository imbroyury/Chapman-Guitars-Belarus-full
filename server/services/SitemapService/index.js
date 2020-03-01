import { SitemapStream, streamToPromise } from 'sitemap';
import * as PageService from '../PageService';
import * as FSService from '../FSService';

// TODO: import from shared admin interface
const HOST = 'http://localhost:8280';

export const generateSitemap = async () => {
  const allPages = await PageService.getAllPages();
  // Creates a sitemap object given the input configuration with URLs
  const sitemapStream = new SitemapStream({ hostname: HOST });

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