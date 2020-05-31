import express from 'express';
import * as DBService from '../../../services/DBService';
import * as FSService from '../../../services/FSService';
import { upload } from '../../../middleware/storage';

const router = express.Router();

const guitarColorImageNames = ['tabImage', 'dotImage', 'guitarImage'];
const gcUpload = upload.fields(guitarColorImageNames.map(gcin => ({ name: gcin, maxCount: 1 })));

router.put('/guitar-color', gcUpload, async (req, res) => {
  try {
    const { guitarId, order, name } = req.body;
    const { files } = req;
    const filenames = guitarColorImageNames.map(imageName => files[imageName][0].filename);
    const imageMetaDatas = await Promise.all(filenames.map(filename => DBService.saveImageMetaData(filename)));
    const imageIds = imageMetaDatas.map(imd => imd.id);
    await DBService.putGuitarColor(guitarId, order, name, ...imageIds);
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.delete('/guitar-color', async (req, res) => {
  try {
    const { id } = req.body;
    const guitarColor = await DBService.getGuitarColor(id);
    const imagesInfo = guitarColorImageNames
      .map(name => ({
        id: guitarColor[name].id,
        filename: guitarColor[name].name,
      }));
    await DBService.deleteGuitarColor(id);
    await Promise.all(imagesInfo.map(image => DBService.deleteImage(image.id)));
    await Promise.all(imagesInfo.map(image => FSService.removeFileFromUploads(image.filename)));
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

export default router;