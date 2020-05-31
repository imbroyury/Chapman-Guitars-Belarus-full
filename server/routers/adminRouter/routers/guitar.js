import express from 'express';
import * as DBService from '../../../services/DBService';
import { wrapAsync } from '../../../middleware/errorHandling';

const router = express.Router();

router.get('/guitars', wrapAsync(async (req, res) => {
  const guitars = await DBService.getAllGuitarsGroupedBySeries();
  res.send(guitars);
}));

router.put('/guitar', wrapAsync(async (req, res) => {
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
    metaKeywords,
    metaDescription,
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
    metaKeywords,
    metaDescription,
  );
  res.status(200).send();
}));

router.post('/guitar', wrapAsync(async (req, res) => {
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
    metaKeywords,
    metaDescription,
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
    metaKeywords,
    metaDescription,
  );
  res.status(200).send();
}));

router.delete('/guitar', wrapAsync(async (req, res) => {
  const { id } = req.body;
  await DBService.deleteGuitar(id);
  res.send(200);
}));

export default router;