import express from 'express';
import * as DBService from '../../../services/DBService';

const router = express.Router();

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

export default router;