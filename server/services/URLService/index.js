import async from 'async';
import _ from 'lodash';
import * as DBService from '../DBService';

const HOST = 'http://localhost:8280';

const getAbsoluteUrl = (relativeUrl) => HOST + relativeUrl;

// hardcoded to reference a function to fetch items
const dynamicUrlDeclarations = [
  {
    uri: '/guitar',
    itemUrisFetcher: DBService.getAllGuitarUris,
  },
  {
    uri: '/artist',
    itemUrisFetcher: DBService.getAllArtistUris,
  }
];

export const getAllUrls = async () => {
  const pagesMetadata = await DBService.getAllPagesMetadata();
  const [dynamicPages, staticPages] = _.partition(pagesMetadata, (page) => page.isBasePage);

  const staticUrls = staticPages.map(page => page.uri);

  const dynamicPageDeclarationsToProcess = _.intersectionBy(
    dynamicUrlDeclarations,
    dynamicPages,
    'uri',
  );
  const dynamicPageBaseUrls = dynamicPageDeclarationsToProcess.map(urlWithItem => urlWithItem.uri);
  const itemUrisOfDynamicPages = await async.series(
    dynamicPageDeclarationsToProcess.map(declaration => declaration.itemUrisFetcher)
  );

  const zipper = (baseUrl, itemUri) => itemUri.map(itemUri => baseUrl + '/' + itemUri);
  const calculatedUrls = _.flatten(_.zipWith(dynamicPageBaseUrls, itemUrisOfDynamicPages, zipper));

  const allUrls = [
    ...staticUrls,
    ...calculatedUrls
  ].map(url => ({ absolute: getAbsoluteUrl(url), relative: url }));

  return allUrls;
};