import express from 'express';
import * as DBService from '../../services/DBService';
import { pageMetadataMiddleware } from '../../middleware/pageMetadata';
import { wrapAsync, errorHandlingMiddleware, ERROR_HANDLING_TYPE } from '../../middleware/errorHandling';

const getActiveMenuItemConfig = (activeItem) => {
  if (activeItem === null) return { activeMenuItem: {} };
  return { activeMenuItem: { [activeItem]: true } };
};

const concatMetadataForItemPage = (base, item) => ({
  title: base.title + ' ' + item.name,
  metaKeywords: base.metaKeywords + ', ' + item.metaKeywords,
  metaDescription: base.metaDescription + ' ' + item.metaDescription,
});

const router = express.Router();

router.use(pageMetadataMiddleware);

router.get('/', wrapAsync(async (req, res) => {
  const images = await DBService.getMainGalleryImages();
  const vm = images.map(image => ({
    src: image.Image.name,
  }));

  res.render('home', {
    images: vm,
    ...req.pageMetadata,
    ...getActiveMenuItemConfig(null)
  });
}));

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

router.get('/guitars', wrapAsync(async (req, res) => {
  const guitarSeries = await DBService.getAllGuitarsGroupedBySeries();

  const vm = guitarSeries.map(series => ({
    name: series.name.toUpperCase(),
    guitars: series.Guitars.map(mapGuitarToViewModel),
  }));

  res.render('guitars', {
    guitarSeries: vm,
    ...req.pageMetadata,
    ...getActiveMenuItemConfig('guitars') });
}));

router.get('/guitar/:modelUri', wrapAsync(async (req, res) => {
  const { modelUri } = req.params;
  const guitar = await DBService.getGuitarByUri(modelUri);

  if (guitar === null) return res.render('error', {
    ...req.pageMetadata,
    e404: true,
  });

  const vm = mapGuitarToViewModel(guitar);
  res.render('guitar', {
    guitar: vm,
    ...concatMetadataForItemPage(req.pageMetadata, guitar),
    ...getActiveMenuItemConfig('guitars')
  });
}));

const mapArtistToViewModel = artist => ({
  name: artist.name,
  description: artist.description,
  uri: artist.uri,
  photo: artist.photo.name,
});

router.get('/artists', wrapAsync(async (req, res) => {
  const artists = await DBService.getAllArtists();
  const vm = artists.map(mapArtistToViewModel);

  res.render('artists', {
    artists: vm,
    ...req.pageMetadata,
    ...getActiveMenuItemConfig('artists')
  });
}));

router.get('/artist/:artistUri', wrapAsync(async (req, res) => {
  const { artistUri } = req.params;
  const artist = await DBService.getArtistByUri(artistUri);

  if (artist === null) return res.render('error', {
    ...req.pageMetadata,
    e404: true,
  });

  const vm = mapArtistToViewModel(artist);
  res.render('artist', {
    artist: vm,
    ...concatMetadataForItemPage(req.pageMetadata, artist),
    ...getActiveMenuItemConfig('artists')
  });
}));

router.get('/purchase', wrapAsync(async (req, res) => {
  res.render('purchase', {
    ...req.pageMetadata,
    ...getActiveMenuItemConfig('purchase')
  });
}));

router.get('/contact', wrapAsync(async (req, res) => {
  res.render('contact', {
    ...req.pageMetadata,
    ...getActiveMenuItemConfig('contact')
  });
}));

router.get('/search', express.urlencoded({ extended: true }), wrapAsync(async (req, res) => {
  const { query } = req.query;

  if (query === undefined) {
    return res.render('search', {
      query: '',
      results: [],
      ...req.pageMetadata,
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
    query,
    results: vm,
    ...req.pageMetadata,
    ...getActiveMenuItemConfig('search')
  });
}));

router.get('*', wrapAsync(async (req, res) => {
  res.render('error', {
    ...req.pageMetadata,
    e404: true,
  });
}));

router.use(errorHandlingMiddleware(ERROR_HANDLING_TYPE.CLIENT));

export default router;