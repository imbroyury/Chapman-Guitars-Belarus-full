import express from 'express';
import * as DBService from '../../../services/DBService';
import * as FSService from '../../../services/FSService';
import { upload } from '../../../middleware/storage';
import { watermarkUploadedImage } from '../../../middleware/watermarkUploadedImage';
import { wrapAsync } from '../../../middleware/errorHandling';

const router = express.Router();

router.get('/gallery-images', wrapAsync(async (req, res) => {
  const images = await DBService.getMainGalleryImages();
  res.send(images);
}));

router.put(
  '/gallery-image',
  upload.single('image'),
  watermarkUploadedImage(true, 2400),
  wrapAsync(async (req, res) => {
    const { file, body } = req;
    const image = await DBService.saveImageMetaData(file.filename);
    const galleryImage = await DBService.putMainGalleryImage(image.id, body.order);
    res.send(galleryImage);
  })
);

router.delete('/gallery-image', wrapAsync(async (req, res) => {
  const { id } = req.body;
  const galleryImage = await DBService.getMainGalleryImage(id);
  await DBService.deleteMainGalleryImage(id);
  await DBService.deleteImage(galleryImage.Image.id);
  await FSService.removeFileFromUploads(galleryImage.Image.name);
  res.status(200).send();
}));

router.post('/gallery-image', wrapAsync(async (req, res) => {
  const { id, order } = req.body;
  const result = await DBService.editMainGalleryImage(id, order);
  res.send(result);
}));

export default router;