import express from 'express';
import * as DBService from '../../../services/DBService';
import { wrapAsync } from '../../../middleware/errorHandling';

const router = express.Router();

router.get('/all-guitar-series', wrapAsync(async (req, res) => {
  const guitarSeries = await DBService.getAllGuitarSeries();
  res.send(guitarSeries);
}));

router.put('/guitar-series', wrapAsync(async (req, res) => {
  const { name, uri, order } = req.body;
  await DBService.putGuitarSeries(name, uri, order);
  res.status(200).send();
}));

router.post('/guitar-series', wrapAsync(async (req, res) => {
  const { id, name, uri, order } = req.body;
  await DBService.editGuitarSeries(id, name, uri, order);
  res.status(200).send();
}));

router.delete('/guitar-series', wrapAsync(async (req, res) => {
  const { id } = req.body;
  await DBService.deleteGuitarSeries(id);
  res.send(200);
}));

export default router;