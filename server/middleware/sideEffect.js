import * as IndexingService from '../services/IndexingService';
import * as SitemapService from '../services/SitemapService';
import * as LoggerService from '../services/LoggerService';
import async from 'async';

// setup queue to manage indexing and sitemap process
const sideEffectQueue = async.queue(async (_, callback) => {
  try {
    await IndexingService.runIndexingProcess();
  } catch(e) {
    LoggerService.log(`[ERRI] - <${new Date().toISOString()}> - ${JSON.stringify(serializeError(e))}`);
  }

  try {
    await SitemapService.generateSitemap();
  } catch(e) {
    LoggerService.log(`[ERRS] - <${new Date().toISOString()}> - ${JSON.stringify(serializeError(e))}`);
  }
  callback();
}, 1);

const modifyingMethods = ['POST', 'PUT', 'DELETE'];
const getIsNotModifyingMethod = method => !modifyingMethods.includes(method);
const getIsQueueNotEmpty = () => sideEffectQueue.length() >= 1;

const sideEffectMiddleware = (req, res, next) => {
  if (getIsNotModifyingMethod(req.method)) {
    return next();
  }

  res.on('finish', () => {
    if (getIsQueueNotEmpty()) return;

    sideEffectQueue.push();
  });
  next();
};

export default sideEffectMiddleware;
