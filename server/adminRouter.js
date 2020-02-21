import path from 'path';
import express from 'express';
import * as DBService from './DBService';
import * as FSService from './FSService';
import multer from 'multer';
import mime from 'mime-types';
import uuid from 'uuid/v1';

const storage = multer.diskStorage({
  destination: 'static/uploads',
  filename: function (req, file, cb) {
    cb(null, uuid() + '.' + mime.extension(file.mimetype));
  }
});

const upload = multer({ storage });

const router = express.Router();


router.post('/login', async (req, res) => {
  res.status(500).send();
});

router.get('/gallery-images', async (req, res) => {
  const images = await DBService.getMainGalleryImages();
  res.send(images);
});

router.put('/gallery-image', upload.single('image'), async (req, res) => {
  try {
    const { file, body } = req;
    const image = await DBService.saveImageMetaData(file.filename);
    const galleryImage = await DBService.putMainGalleryImage(image.id, body.order);
    res.send(galleryImage);
  } catch(e) {
    res.status(500).send(e);
  }
});

router.delete('/gallery-image', async (req, res) => {
  try {
    const { id } = req.body;
    const galleryImage = await DBService.getMainGalleryImage(id);
    await DBService.deleteMainGalleryImage(id);
    await DBService.deleteImage(galleryImage.Image.id);
    await FSService.removeFileFromUploads(galleryImage.Image.name);
    res.status(200).send();
  } catch(e) {
    res.status(500).send(e);
  }
});

router.post('/gallery-image', async (req, res) => {
  try {
    const { id, order } = req.body;
    const result = await DBService.editMainGalleryImage(id, order);
    res.send(result);
  } catch(e) {
    res.status(500).send(e);
  }
});

router.get('/artists', async (req, res) => {
  const artists = await DBService.getAllArtists();
  res.send(artists);
});

router.put('/artist', upload.single('photo'), async (req, res) => {
  try {
    const { file, body } = req;
    const { order, name, description } = body;
    const image = await DBService.saveImageMetaData(file.filename);
    await DBService.putArtist(order, name, description, image.id);
    res.status(200).send();
  } catch(e) {
    res.status(500).send(e);
  }
});

router.post('/artist', async (req, res) => {
  try {
    const { id, order, name, description } = req.body;
    await DBService.editArtist(id, order, name, description);
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

router.get('/all-guitar-series', async (req, res) => {
  try {
    const guitarSeries = await DBService.getAllGuitarSeries();
    res.send(guitarSeries);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.put('/guitar-series', async (req, res) => {
  try {
    const { name, uri, order } = req.body;
    await DBService.putGuitarSeries(name, uri, order);
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post('/guitar-series', async (req, res) => {
  try {
    const { id, name, uri, order } = req.body;
    await DBService.editGuitarSeries(id, name, uri, order);
    res.status(200).send();
  } catch(e) {
    res.status(500).send(e);
  }
});

router.delete('/guitar-series', async (req, res) => {
  try {
    const { id } = req.body;
    await DBService.deleteGuitarSeries(id);
    res.send(200);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get('/guitars', async (req, res) => {
  try {
    const guitars = await DBService.getAllGuitarsGroupedBySeries();
    res.send(guitars);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.put('/guitar', async (req, res) => {
  try {
    // FIXME: actual properties
    const {
      name,
      uri,
      seriesId,
      order,
      tuners,
      neck,
      fretboard,
      frets,
      scaleLength,
      body,
      neckPickup,
      bridgePickup,
      bridge,
      weight,
    } = req.body;

    await DBService.putGuitar(
      name,
      uri,
      seriesId,
      order,
      tuners,
      neck,
      fretboard,
      frets,
      scaleLength,
      body,
      neckPickup,
      bridgePickup,
      bridge,
      weight,
    );
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post('/guitar', async (req, res) => {
  try {
    const {
      id,
      name,
      uri,
      seriesId,
      order,
      tuners,
      neck,
      fretboard,
      frets,
      scaleLength,
      body,
      neckPickup,
      bridgePickup,
      bridge,
      weight,
    } = req.body;
    await DBService.editGuitar(
      id,
      name,
      uri,
      seriesId,
      order,
      tuners,
      neck,
      fretboard,
      frets,
      scaleLength,
      body,
      neckPickup,
      bridgePickup,
      bridge,
      weight,
    );
    res.status(200).send();
  } catch(e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.delete('/guitar', async (req, res) => {
  try {
    const { id } = req.body;
    await DBService.deleteGuitar(id);
    res.send(200);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

const ADMIN_INTERFACE_BUILD = path.join(__dirname, '..', 'admin-interface', 'build');
// For everything else, serve index file
router.get('*', (req, res) => {
  res.sendFile(path.join(ADMIN_INTERFACE_BUILD, 'index.html'));
});

export default router;