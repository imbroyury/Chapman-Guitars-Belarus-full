import express from 'express';
import * as DBService from '../../../services/DBService';

const router = express.Router();

router.get('/pages-metadata', async (req, res) => {
  const pages = await DBService.getAllPagesMetadata();
  res.send(pages);
});

router.put('/page-metadata', async (req, res) => {
  try {
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
  } catch(e) {
    res.status(500).send(e);
  }
});

router.post('/page-metadata', async (req, res) => {
  try {
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
  } catch(e) {
    res.status(500).send(e);
  }
});

router.delete('/page-metadata', async (req, res) => {
  try {
    const { id } = req.body;
    await DBService.deletePageMetadata(id);
    res.status(200).send();
  } catch(e) {
    console.log(e);
    res.status(500).send(e);
  }
});

export default router;