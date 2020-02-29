import express from 'express';
import * as DBService from '../../../services/DBService';
import * as FSService from '../../../services/FSService';
import { upload } from '../storage';

const router = express.Router();

router.get('/artists', async (req, res) => {
  const artists = await DBService.getAllArtists();
  res.send(artists);
});

router.put('/artist', upload.single('photo'), async (req, res) => {
  try {
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
  } catch(e) {
    res.status(500).send(e);
  }
});

router.post('/artist', async (req, res) => {
  try {
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
  } catch(e) {
    res.status(500).send(e);
  }
});

router.delete('/artist', async (req, res) => {
  try {
    const { id } = req.body;
    const artist = await DBService.getArtist(id);
    await DBService.deleteArtist(id);
    await DBService.deleteImage(artist.photo.id);
    await FSService.removeFileFromUploads(artist.photo.name);
    res.status(200).send();
  } catch(e) {
    console.log(e);
    res.status(500).send(e);
  }
});

export default router;