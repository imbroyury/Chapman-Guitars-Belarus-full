import express from 'express';
import * as DBService from './DBService';

const router = express.Router();

router.get('/', async (req, res) => {
  const images = await DBService.getMainGalleryImages();
  const vm = images.map(image => ({
    src: image.image.name,
  }));
  res.render('home', { images: vm });
});

const mapGuitarColorToViewModel = (gc) => ({
  name: gc.name,
  guitar_image: gc.guitar_image.name,
  tab_image: gc.tab_image.name,
  dot_image: gc.dot_image.name,
});

router.get('/guitars', async (req, res) => {
  const guitarSeries = await DBService.getAllGuitarsGroupedBySeries();

  const vm = guitarSeries.map(series => ({
    name: series.name.toUpperCase(),
    uri: series.uri,
    guitars: series.guitars.map(guitar => ({
      name: guitar.name.toUpperCase(),
      uri: guitar.uri,
      colors: guitar.guitar_colors.map(mapGuitarColorToViewModel),
    })),
  }));

  res.render('guitars', { guitarSeries: vm });
});

router.get('/guitars/:series/:model', async (req, res) => {
  const { model } = req.params;
  const guitar = await DBService.getGuitarByUri(model);

  if (guitar === null) res.status(404).send('Nothing found');

  const vm = {
    name: guitar.name,
    colors: guitar.guitar_colors.map(mapGuitarColorToViewModel),
  };
  res.render('guitar', { guitar: vm });
});

router.get('/artists', async (req, res) => {
  res.render('artists');
});

export default router;