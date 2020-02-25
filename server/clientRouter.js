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

const mapGuitarToViewModel = (guitar) => ({
  name: guitar.name,
  uri: guitar.uri,
  colors: guitar.GuitarColors.map(mapGuitarColorToViewModel),
  specs: [
    { key: 'Колки', value: guitar.tuners },
    { key: 'Гриф', value: guitar.neck },
    { key: 'Накладка', value: guitar.fretboard },
    { key: 'Лады', value: guitar.frets },
    { key: 'Мензура, мм', value: guitar.scaleLength },
    { key: 'Дека', value: guitar.body },
    { key: 'Нековый звукосниматель', value: guitar.neckPickup },
    { key: 'Бриджевый звукосниматель', value: guitar.bridgePickup },
    { key: 'Бридж', value: guitar.bridge },
    { key: 'Вес, г', value: guitar.weight },
  ]
});

router.get('/guitars', async (req, res) => {
  const guitarSeries = await DBService.getAllGuitarsGroupedBySeries();

  const vm = guitarSeries.map(series => ({
    name: series.name.toUpperCase(),
    uri: series.uri,
    guitars: series.Guitars.map(mapGuitarToViewModel),
  }));
  res.render('guitars', { guitarSeries: vm, ...getActiveMenuItemConfig('guitars') });
});

router.get('/guitars/:modelUri', async (req, res) => {
  const { modelUri } = req.params;
  const guitar = await DBService.getGuitarByUri(modelUri);

  if (guitar === null) return res.render('404');

  const vm = mapGuitarToViewModel(guitar);
  res.render('guitar', { guitar: vm, ...getActiveMenuItemConfig('guitars') });
});

const mapArtistToViewModel = artist => ({
  name: artist.name,
  description: artist.description,
  uri: artist.uri,
  photo: artist.photo.name,
});

router.get('/artists', async (req, res) => {
  const artists = await DBService.getAllArtists();
  const vm = artists.map(mapArtistToViewModel);
  res.render('artists', { artists: vm, ...getActiveMenuItemConfig('artists') });
});

router.get('/artists/:artistUri', async (req, res) => {
  const { artistUri } = req.params;
  const artist = await DBService.getArtistByUri(artistUri);

  if (artist === null) return res.render('404');

  const vm = mapArtistToViewModel(artist);
  res.render('artist', { artist: vm, ...getActiveMenuItemConfig('artists') });
});

router.get('/purchase', async (req, res) => {
  res.render('purchase', { ...getActiveMenuItemConfig('purchase') });
});

router.get('/contact', async (req, res) => {
  res.render('contact', { ...getActiveMenuItemConfig('contact') });
});

router.get('*', async (req, res) => {
  res.render('404');
});

export default router;