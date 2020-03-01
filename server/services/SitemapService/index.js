import { SitemapStream, streamToPromise } from 'sitemap';
import * as URLService from '../URLService';

// TODO: import from shared admin interface
const HOST = 'http://localhost:8280';

export const generateSitemap = async () => {
  const allUrls = await URLService.getAllUrls();
  // Creates a sitemap object given the input configuration with URLs
  const sitemap = new SitemapStream({ hostname: HOST });

  allUrls.forEach(url => sitemap.write(url.relative));

  sitemap.end();

  try {

    const sm = await streamToPromise(sitemap);

    console.log(sm.toString());
  } catch(e) {
    console.log(e);
  }
};