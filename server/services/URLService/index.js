import { getAllGuitarUris, getAllArtistUris } from '../DBService';
import { flatten, zipWith } from 'lodash';
import series from 'async/series';

const HOST = 'http://localhost:8280';

const getAbsoluteUrl = (relativeUrl) => HOST + relativeUrl;

const staticUrls = [
  '/guitars',
  '/artists',
  '/purchase',
  '/contact',
];

const URI_PLACEHOLDER = '{{uri}}';

const dynamicUrlDeclarations = [
  {
    url: `/guitars/${URI_PLACEHOLDER}`,
    itemUrisFetcher: getAllGuitarUris,
  },
  {
    url: `/artists/${URI_PLACEHOLDER}`,
    itemUrisFetcher: getAllArtistUris,
  }
];

export const getAllUrls = async () => {
  const dynamicUrls = dynamicUrlDeclarations.map(urlWithItem => urlWithItem.url);
  const itemUrisOfUrls = await series(dynamicUrlDeclarations.map(urlDeclaration => urlDeclaration.itemUrisFetcher));
  const zipper = (url, uris) => uris.map(uri => url.replace(URI_PLACEHOLDER, uri));
  const calculatedUrls = flatten(zipWith(dynamicUrls, itemUrisOfUrls, zipper));
  const allUrls = [...staticUrls, ...calculatedUrls].map(url => ({ absolute: getAbsoluteUrl(url), relative: url }));
  return allUrls;
};