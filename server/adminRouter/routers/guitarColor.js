import express from 'express';
import * as DBService from '../../DBService';
import { upload } from '../storage';

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

export default router;