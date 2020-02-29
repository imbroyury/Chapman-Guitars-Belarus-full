import express from 'express';
import * as DBService from '../../services/DBService';

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
  res.render('home', {
    title: 'Chapman Guitars 🎸 Беларусь',
    images: vm,
    ...getActiveMenuItemConfig(null)
  });
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
  ],
});

router.get('/guitars', async (req, res) => {
  const guitarSeries = await DBService.getAllGuitarsGroupedBySeries();

  const vm = guitarSeries.map(series => ({
    name: series.name.toUpperCase(),
    guitars: series.Guitars.map(mapGuitarToViewModel),
  }));

  res.render('guitars', {
    title: 'Chapman Guitars - Гитары',
    guitarSeries: vm,
    ...getActiveMenuItemConfig('guitars') });
});

router.get('/guitar/:modelUri', async (req, res) => {
  const { modelUri } = req.params;
  const guitar = await DBService.getGuitarByUri(modelUri);

  if (guitar === null) return res.render('404');

  const vm = mapGuitarToViewModel(guitar);
  res.render('guitar', {
    title: `Chapman Guitars - Гитары - ${guitar.name}`,
    metaKeywords: guitar.metaKeywords,
    metaDescription: guitar.metaDescription,
    guitar: vm,
    ...getActiveMenuItemConfig('guitars')
  });
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
  res.render('artists', {
    title: 'Chapman Guitars - Артисты',
    artists: vm,
    ...getActiveMenuItemConfig('artists')
  });
});

router.get('/artist/:artistUri', async (req, res) => {
  const { artistUri } = req.params;
  const artist = await DBService.getArtistByUri(artistUri);

  if (artist === null) return res.render('404');

  const vm = mapArtistToViewModel(artist);
  res.render('artist', {
    title: `Chapman Guitars - Артисты - ${artist.name}`,
    metaKeywords: artist.metaKeywords,
    metaDescription: artist.metaDescription,
    artist: vm,
    ...getActiveMenuItemConfig('artists')
  });
});

router.get('/purchase', async (req, res) => {
  res.render('purchase', {
    title: 'Chapman Guitars - Как купить',
    ...getActiveMenuItemConfig('purchase')
  });
});

router.get('/contact', async (req, res) => {
  res.render('contact', {
    title: 'Chapman Guitars - Связаться с нами',
    ...getActiveMenuItemConfig('contact')
  });
});

router.get('/search', express.urlencoded({ extended: true }), async (req, res) => {
  const { query } = req.query;

  if (query === undefined) {
    return res.render('search', {
      title: 'Chapman Guitars - Поиск',
      query: '',
      results: [],
      ...getActiveMenuItemConfig('search')
    });
  }

  const hits = await DBService.getSearchablePageHitsByQuery(query);
  const vm = hits.map((hit, index) => ({
    index: index + 1,
    url: hit.url,
    snippet: hit.content.length < 150 ? hit.content : hit.content.slice(0, 150) + '...'
  }));

  res.render('search', {
    title: 'Chapman Guitars - Поиск',
    query,
    results: vm,
    ...getActiveMenuItemConfig('search')
  });
});

router.get('*', async (req, res) => {
  res.render('404');
});


export default router;