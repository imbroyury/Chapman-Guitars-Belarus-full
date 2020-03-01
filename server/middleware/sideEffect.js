import * as IndexingService from '../services/IndexingService';
import * as SitemapService from '../services/SitemapService';
import async from 'async';

// setup queue to manage indexing and sitemap process
const sideEffectQueue = async.queue(async (_, callback) => {
  console.log('*** starting to process indexing and sitemap task ***');
  try {
    await IndexingService.runIndexingProcess();
  } catch(e) {
    // log & ignore
  }

  try {
    await SitemapService.generateSitemap();
  } catch(e) {
    // log & ignore
  }
  callback();
}, 1);

sideEffectQueue.drain(() => console.log('*** all sideffect requests have been processed ***'));

const modifyingMethods = ['POST', 'PUT', 'DELETE'];

const sideEffectMiddleware = (req, res, next) => {
  res.on('finish', () => {
    // modifying methods can lead to content change
    if (!modifyingMethods.includes(req.method)) return;
    // if there's at least 1 queued request, our changes will be included, no need to schedule another one
    if (sideEffectQueue.length() >= 1) return;

    console.log('******* sideEffect PROCESS SCHEDULED FOR : *******');
    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    sideEffectQueue.push();
  });
  next();
};

export default sideEffectMiddleware;
