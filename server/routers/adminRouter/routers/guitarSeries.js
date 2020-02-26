import express from 'express';
import * as DBService from '../../../services/DBService';

const router = express.Router();

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

export default router;