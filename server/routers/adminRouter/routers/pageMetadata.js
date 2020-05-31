import express from 'express';
import * as DBService from '../../../services/DBService';
import { wrapAsync } from '../../../middleware/errorHandling';

const router = express.Router();

router.get('/pages-metadata', wrapAsync(async (req, res) => {
  const pages = await DBService.getAllPagesMetadata();
  res.send(pages);
}));

router.put('/page-metadata', wrapAsync(async (req, res) => {
  const {
    uri,
    title,
    isBasePage,
    metaKeywords,
    metaDescription,
    priority,
    changefreq,
  } = req.body;
  await DBService.putPageMetadata(
    uri,
    title,
    isBasePage,
    metaKeywords,
    metaDescription,
    priority,
    changefreq,
  );
  res.status(200).send();
}));

router.post('/page-metadata', wrapAsync(async (req, res) => {
  const {
    id,
    uri,
    title,
    isBasePage,
    metaKeywords,
    metaDescription,
    priority,
    changefreq,
  } = req.body;
  await DBService.editPageMetadata(
    id,
    uri,
    title,
    isBasePage,
    metaKeywords,
    metaDescription,
    priority,
    changefreq,
  );
  res.status(200).send();
}));

router.delete('/page-metadata', wrapAsync(async (req, res) => {
  const { id } = req.body;
  await DBService.deletePageMetadata(id);
  res.status(200).send();
}));

export default router;