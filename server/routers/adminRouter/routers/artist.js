import express from 'express';
import * as DBService from '../../../services/DBService';
import * as FSService from '../../../services/FSService';
import { upload } from '../../../middleware/storage';
import { watermarkUploadedImage } from '../../../middleware/watermarkUploadedImage';
import { wrapAsync } from '../../../middleware/errorHandling';

const router = express.Router();

router.get('/artists', wrapAsync(async (req, res) => {
  const artists = await DBService.getAllArtists();
  res.send(artists);
}));

router.put(
  '/artist',
  upload.single('photo'),
  watermarkUploadedImage(),
  wrapAsync(async (req, res) => {
    const { file, body } = req;
    const {
      order,
      name,
      uri,
      description,
      metaKeywords,
      metaDescription,
    } = body;
    const image = await DBService.saveImageMetaData(file.filename);
    await DBService.putArtist(
      order,
      name,
      uri,
      description,
      image.id,
      metaKeywords,
      metaDescription,
    );
    res.status(200).send();
  }));

router.post('/artist', wrapAsync(async (req, res) => {
  const {
    id,
    order,
    name,
    uri,
    description,
    metaKeywords,
    metaDescription,
  } = req.body;
  await DBService.editArtist(
    id,
    order,
    name,
    uri,
    description,
    metaKeywords,
    metaDescription,
  );
  res.status(200).send();
}));

router.delete('/artist', wrapAsync(async (req, res) => {
  const { id } = req.body;
  const artist = await DBService.getArtist(id);
  await DBService.deleteArtist(id);
  await DBService.deleteImage(artist.photo.id);
  await FSService.removeFileFromUploads(artist.photo.name);
  res.status(200).send();
}));

export default router;