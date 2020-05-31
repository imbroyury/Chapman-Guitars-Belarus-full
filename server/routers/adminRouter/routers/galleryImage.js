import express from 'express';
import * as DBService from '../../../services/DBService';
import * as FSService from '../../../services/FSService';
import { upload } from '../storage';
import path from 'path';
import Jimp from 'jimp';

const router = express.Router();

router.get('/gallery-images', async (req, res) => {
  const images = await DBService.getMainGalleryImages();
  res.send(images);
});

router.put(
  '/gallery-image',
  upload.single('image'),
  async (req, res, next) => {
    try {
      const { file } = req;
      const pathToOriginal = path.join('static', 'uploads', file.filename);
      const pathToWatermark = path.join('static', 'images', 'design', 'watermark.png');

      const image = await Jimp.read(pathToOriginal);
      const watermark = await Jimp.read(pathToWatermark);

      if (image.bitmap.width > 2400) {
        image.resize(2400, Jimp.AUTO);
      }

      image.composite(watermark, 50, image.bitmap.height - watermark.bitmap.height - 50);

      await image.writeAsync(pathToOriginal);

      next();
    } catch(e) {
      next(e);
    }
  },
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