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

router.get('/upload', async (req, res) => {
  res.status(200).send(`
      <form action="/upload-image" method="post" enctype="multipart/form-data">
        <input type='file' name="image" id="image"/>
        <input type='submit' value="upload"/>
      </form>
    `);
});

router.post('/upload-image',
  upload.single('image'),
  async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    await DBService.saveImageMetaData(req.file.filename);
    res.send('OK');
  });

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
    res.send(e).status(500);
  }
});

router.delete('/gallery-image', async (req, res) => {
  try {
    const { id } = req.body;
    const galleryImage = await DBService.getMainGalleryImage(id);
    await FSService.removeFileFromUploads(galleryImage.Image.name);
    await DBService.deleteMainGalleryImage(id);
    // TODO: delete associated Image, not just GalleryImage entry
    res.status(200).send();
  } catch(e) {
    res.send(e).status(500);
  }
});

router.post('/gallery-image-order', async (req, res) => {
  try {
    const { id, order } = req.body;
    const result = await DBService.changeMainGalleryImageOrder(id, order);
    res.send(result);
  } catch(e) {
    res.send(e).status(500);
  }
});

const ADMIN_INTERFACE_BUILD = path.join(__dirname, '..', 'admin-interface', 'build');
// For everything else, serve index file
router.get('*', (req, res) => {
  res.sendFile(path.join(ADMIN_INTERFACE_BUILD, 'index.html'));
});

export default router;