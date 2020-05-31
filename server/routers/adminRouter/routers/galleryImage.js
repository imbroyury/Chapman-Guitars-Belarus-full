import express from 'express';
import * as DBService from '../../../services/DBService';
import * as FSService from '../../../services/FSService';
import { upload } from '../../../middleware/storage';
import { watermarkUploadedImage } from '../../../middleware/watermarkUploadedImage';

const router = express.Router();

router.get('/gallery-images', async (req, res) => {
  const images = await DBService.getMainGalleryImages();
  res.send(images);
});

router.put(
  '/gallery-image',
  upload.single('image'),
  watermarkUploadedImage(true, 2400),
  async (req, res) => {
    try {
      const { file, body } = req;
      const image = await DBService.saveImageMetaData(file.filename);
      const galleryImage = await DBService.putMainGalleryImage(image.id, body.order);
      res.send(galleryImage);
    }
    catch (e) {
      res.status(500).send(e);
    }
  }
);

router.delete('/gallery-image', async (req, res) => {
  try {
    const { id } = req.body;
    const galleryImage = await DBService.getMainGalleryImage(id);
    await DBService.deleteMainGalleryImage(id);
    await DBService.deleteImage(galleryImage.Image.id);
    await FSService.removeFileFromUploads(galleryImage.Image.name);
    res.status(200).send();
  }
  catch (e) {
    res.status(500).send(e);
  }
});

router.post('/gallery-image', async (req, res) => {
  try {
    const { id, order } = req.body;
    const result = await DBService.editMainGalleryImage(id, order);
    res.send(result);
  }
  catch (e) {
    res.status(500).send(e);
  }
});

export default router;