import express from 'express';
import * as DBService from './DBService';

const getActiveMenuItemConfig = (activeItem) => {
  if (activeItem === null) return { activeMenuItem: {} };
  return { activeMenuItem: { [activeItem]: true } };
};

const router = express.Router();

router.get('/', async (req, res) => {
  const images = await DBService.getMainGalleryImages();
  const vm = images.map(image => ({
    src: image.Image.name,
  }));
  res.render('home', { images: vm, ...getActiveMenuItemConfig(null) });
});

const mapGuitarColorToViewModel = (gc) => ({
  name: gc.name,
  guitarImage: gc.guitarImage.name,
  tabImage: gc.tabImage.name,
  dotImage: gc.dotImage.name,
});

router.get('/guitars', async (req, res) => {
  const guitarSeries = await DBService.getAllGuitarsGroupedBySeries();

  const vm = guitarSeries.map(series => ({
    name: series.name.toUpperCase(),
    uri: series.uri,
    guitars: series.Guitars.map(guitar => ({
      name: guitar.name.toUpperCase(),
      uri: guitar.uri,
      colors: guitar.GuitarColors.map(mapGuitarColorToViewModel),
    })),
  }));
  res.render('guitars', { guitarSeries: vm, ...getActiveMenuItemConfig('guitars') });
});

router.get('/guitars/:series/:model', async (req, res) => {
  const { model } = req.params;
  const guitar = await DBService.getGuitarByUri(model);

  if (guitar === null) res.status(404).send('Nothing found');

  const vm = {
    name: guitar.name,
    colors: guitar.GuitarColors.map(mapGuitarColorToViewModel),
  };
  res.render('guitar', { guitar: vm, ...getActiveMenuItemConfig('guitars') });
});

router.get('/artists', async (req, res) => {
  const artists = await DBService.getAllArtists();
  const vm = artists.map(artist => ({
    name: artist.name,
    description: artist.description,
    photo: artist.photo.name,
  }));
  res.render('artists', { artists: vm, ...getActiveMenuItemConfig('artists') });
});

router.get('/purchase', async (req, res) => {
  res.render('purchase', { ...getActiveMenuItemConfig('purchase') });
});

export default router;