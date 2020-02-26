import * as IndexingService from '../services/IndexingService';
import async from 'async';

// setup queue to manage indexing process
const indexingQueue = async.queue(async (_, callback) => {
  console.log('*** starting to process indexing task ***');
  try {
    await IndexingService.runIndexingProcess();
  } catch(e) {
    // ignore
  }
  callback();
}, 1);

indexingQueue.drain(() => console.log('*** all indexing requests have been processed ***'));

const modifyingMethods = ['POST', 'PUT', 'DELETE'];
const routes = ['artist', 'guitar', 'guitar-series'];

const indexingMiddleware = (req, res, next) => {
  res.on('finish', () => {
    if (!modifyingMethods.includes(req.method)) return;
    if (!routes.some(route => req.originalUrl.includes(route))) return;
    // if there's at least 1 queued indexing request, our changes will be included
    if (indexingQueue.length() >= 1) return;

    console.log('******* indexing PROCESS SCHEDULED FOR : *******');
    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    indexingQueue.push();
  });
  next();
};

export default indexingMiddleware;
