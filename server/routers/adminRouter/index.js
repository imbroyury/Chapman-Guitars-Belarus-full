import path from 'path';
import express from 'express';
import async from 'async';
import _ from 'lodash';
import {
  galleryImageRouter,
  artistRouter,
  guitarSeriesRouter,
  guitarRouter,
  guitarColorRouter,
  authRouter,
} from './routers';
import authMiddleware from '../../middleware/auth';
import * as IndexingService from '../../services/IndexingService';
import * as DBService from '../../services/DBService';

const router = express.Router();

router.use('/indexing', async (req, res) => {
  const latestPageContents = await IndexingService.getAllUrlsContent();
  const latestPagesUrls = latestPageContents.map(content => content.url);

  const indexedPageUrls = await DBService.getAllSearchablePagesUrls();

  console.log(latestPagesUrls);
  console.log(indexedPageUrls);

  const toDelete = _.difference(indexedPageUrls, latestPagesUrls); // in db, but not in latest response
  const toPut = _.difference(latestPagesUrls, indexedPageUrls); // in latest response, but not in db
  const toEdit = _.intersection(latestPagesUrls, indexedPageUrls); // botn in response and in db

  console.log(toDelete);
  console.log(toPut);
  console.log(toEdit);

  if (toPut.length > 0) {
    const contentToAppend = latestPageContents.filter(content => toPut.includes(content.url));
    await DBService.bulkPutSearchablePagesByUrls(contentToAppend);
  }

  if (toDelete.length > 0) {
    await DBService.bulkDeleteSearchablePagesByUrls(toDelete);
  }

  if (toEdit.length > 0) {
    const toEditContents = latestPageContents.filter(content => toEdit.includes(content.url));
    await async.series(toEditContents.map(page => async () => DBService.editSearchablePage(page.url, page.content)));
  }

  res.send(latestPageContents);
});

router.use('/', authRouter);
router.use(authMiddleware);
router.use('/', artistRouter);
router.use('/', galleryImageRouter);
router.use('/', guitarSeriesRouter);
router.use('/', guitarRouter);
router.use('/', guitarColorRouter);

const ADMIN_INTERFACE_BUILD = path.join(__dirname, '..', 'admin-interface', 'build');
// For everything else, serve index file
router.get('*', (req, res) => res.sendFile(path.join(ADMIN_INTERFACE_BUILD, 'index.html')));

export default router;