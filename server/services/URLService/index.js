import async from 'async';
import _ from 'lodash';
import * as DBService from '../DBService';

const HOST = 'http://localhost:8280';

const getAbsoluteUrl = (relativeUrl) => HOST + relativeUrl;

const staticUrls = [
  '/',
  '/guitars',
  '/artists',
  '/purchase',
  '/contact',
];

const URI_PLACEHOLDER = '{{uri}}';

const dynamicUrlDeclarations = [
  {
    url: `/guitar/${URI_PLACEHOLDER}`,
    itemUrisFetcher: DBService.getAllGuitarUris,
  },
  {
    url: `/artist/${URI_PLACEHOLDER}`,
    itemUrisFetcher: DBService.getAllArtistUris,
  }
];

export const getAllUrls = async () => {
  const dynamicUrls = dynamicUrlDeclarations.map(urlWithItem => urlWithItem.url);
  const itemUrisOfUrls = await async.series(dynamicUrlDeclarations.map(urlDeclaration => urlDeclaration.itemUrisFetcher));
  const zipper = (url, uris) => uris.map(uri => url.replace(URI_PLACEHOLDER, uri));
  const calculatedUrls = _.flatten(_.zipWith(dynamicUrls, itemUrisOfUrls, zipper));
  const allUrls = [...staticUrls, ...calculatedUrls].map(url => ({ absolute: getAbsoluteUrl(url), relative: url }));
  return allUrls;
};