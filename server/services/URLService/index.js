import async from 'async';
import _ from 'lodash';
import * as DBService from '../DBService';

const HOST = 'http://localhost:8280';

const getAbsoluteUrl = (relativeUrl) => HOST + relativeUrl;

// hardcoded to reference a function to fetch items
const dynamicPageDeclarations = [
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
    dynamicPageDeclarations,
    dynamicPages,
    'uri',
  );
  const dynamicPageBaseUris = dynamicPageDeclarationsToProcess.map(declaration => declaration.uri);
  const itemUrisOfDynamicPages = await async.series(
    dynamicPageDeclarationsToProcess.map(declaration => declaration.itemUrisFetcher)
  );

  const zipper = (baseUri, itemUri) => itemUri.map(itemUri => baseUri + '/' + itemUri);
  const dynamicUrls = _.flatten(_.zipWith(dynamicPageBaseUris, itemUrisOfDynamicPages, zipper));

  const allUrls = [
    ...staticUrls,
    ...dynamicUrls,
  ].map(url => ({ absolute: getAbsoluteUrl(url), relative: url }));

  return allUrls;
};