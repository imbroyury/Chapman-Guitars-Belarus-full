import express from 'express';
import * as DBService from '../../../services/DBService';

const router = express.Router();

router.get('/pages', async (req, res) => {
  const pages = await DBService.getAllPages();
  res.send(pages);
});

router.put('/page', async (req, res) => {
  try {
    const {
      uri,
      title,
      isBasePage,
      metaKeywords,
      metaDescription,
    } = req.body;
    await DBService.putPage(
      uri,
      title,
      isBasePage,
      metaKeywords,
      metaDescription,
    );
    res.status(200).send();
  } catch(e) {
    res.status(500).send(e);
  }
});

router.post('/page', async (req, res) => {
  try {
    const {
      id,
      uri,
      title,
      isBasePage,
      metaKeywords,
      metaDescription,
    } = req.body;
    await DBService.editPage(
      id,
      uri,
      title,
      isBasePage,
      metaKeywords,
      metaDescription,
    );
    res.status(200).send();
  } catch(e) {
    res.status(500).send(e);
  }
});

router.delete('/page', async (req, res) => {
  try {
    const { id } = req.body;
    await DBService.deletePage(id);
    res.status(200).send();
  } catch(e) {
    console.log(e);
    res.status(500).send(e);
  }
});

export default router;