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
const getIsNotModifyingMethod = method => !modifyingMethods.includes(method);
const getIsQueueNotEmpty = () => sideEffectQueue.length() >= 1;

const sideEffectMiddleware = (req, res, next) => {
  if (getIsNotModifyingMethod(req.method)) {
    console.log('\n*** handler won`t be attached ***\n');
    return next();
  }

  res.on('finish', () => {
    if (getIsQueueNotEmpty()) return;

    console.log('******* sideEffect PROCESS SCHEDULED FOR : *******');
    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    sideEffectQueue.push();
  });
  next();
};

export default sideEffectMiddleware;
