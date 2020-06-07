import async from 'async';
import _ from 'lodash';
import * as DBService from '../DBService';
import { URLS, SERVER_TYPE_ENUM } from '../../../admin-interface/src/shared/hosts';

const getAbsoluteUrl = (relativeUrl) => URLS[SERVER_TYPE_ENUM.express] + relativeUrl;

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

export const getAllPages = async () => {
  const pagesMetadata = await DBService.getAllPagesMetadata();
  const [dynamicPagesMeta, staticPagesMeta] = _.partition(pagesMetadata, (page) => page.isBasePage);

  const staticPages = staticPagesMeta.map(page => ({
    uri: page.uri,
    priority: page.priority,
    changefreq: page.changefreq
  }));

  const dynamicPagesMetaToProcess = _.intersectionBy(
    dynamicPagesMeta,
    dynamicPageDeclarations,
    'uri',
  );

  const dynamicPageMetaWithFetchersToProcess = dynamicPagesMetaToProcess.map(page => ({
    uri: page.uri,
    priority: page.priority,
    changefreq: page.changefreq,
    itemUrisFetcher: dynamicPageDeclarations
      .find(declaration => declaration.uri === page.uri).itemUrisFetcher
  }));

  const itemUrisOfDynamicPages = await async.series(
    dynamicPageMetaWithFetchersToProcess.map(page => page.itemUrisFetcher)
  );

  const dynamicPageUrisLists = _.zipWith(
    dynamicPageMetaWithFetchersToProcess,
    itemUrisOfDynamicPages,
    (dynamicPage, itemUri) => itemUri.map(itemUri => dynamicPage.uri + '/' + itemUri)
  );

  const dynamicPages = _.flatten(
    _.zipWith(
      dynamicPagesMetaToProcess,
      dynamicPageUrisLists,
      (dynamicPageMeta, dynamicPageUrlList) => dynamicPageUrlList.map(uri => ({
        priority: dynamicPageMeta.priority,
        changefreq: dynamicPageMeta.changefreq,
        uri
      }))
    )
  );

  const allPages = [
    ...staticPages,
    ...dynamicPages,
  ].map(page => ({
    absoluteUrl: getAbsoluteUrl(page.uri),
    relativeUrl: page.uri,
    priority: page.priority,
    changefreq: page.changefreq
  }));

  return allPages;
};