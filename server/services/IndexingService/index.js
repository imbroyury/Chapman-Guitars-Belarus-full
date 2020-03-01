import axios from 'axios';
import jsdom from 'jsdom';
import async from 'async';
import _ from 'lodash';
const { JSDOM } = jsdom;
import * as PageService from '../PageService';
import * as DBService from '../DBService';

const disregardedElementSelectors = ['.footer', '.side-menu'];

const removeUnusedElements = (source, selectors) => {
  selectors.forEach(selector => {
    const element = source.querySelector(selector);
    if (element) element.remove();
  });
};

const getUrlContent = async (url) => {
  const { data: html } = await axios.get(url);

  const { document } = new JSDOM(html).window;
  const body = document.querySelector('body');
  removeUnusedElements(body, disregardedElementSelectors);
  const textContent = body.textContent.replace(/\s+/g,' ').trim();

  return textContent;
};

const getAllUrlsContent = async () => {
  const allPages = await PageService.getAllPages();
  const absoluteUrls = allPages.map(page => page.absoluteUrl);
  const relativeUrls = allPages.map(page => page.relativeUrl);
  const urlContentFetchers = absoluteUrls.map(url => async () => getUrlContent(url));
  const urlContents = await async.series(urlContentFetchers);
  const contents = _.zipWith(
    relativeUrls,
    urlContents,
    (url, content) => ({ url, content })
  );
  return contents;
};

export const runIndexingProcess = async () => {
  console.log('*** RUN VERY LONG INDEXING PROCESS START ***');

  const latestPageContents = await getAllUrlsContent();
  const latestPagesUrls = latestPageContents.map(content => content.url);

  const indexedPageUrls = await DBService.getAllSearchablePagesUrls();

  const toDelete = _.difference(indexedPageUrls, latestPagesUrls); // in db, but not in latest response
  const toPut = _.difference(latestPagesUrls, indexedPageUrls); // in latest response, but not in db
  const toEdit = _.intersection(latestPagesUrls, indexedPageUrls); // both in response and in db

  console.log(toDelete);
  console.log(toPut);
  console.log(toEdit);

  if (toPut.length > 0) {
    const contentToAppend = latestPageContents.filter(content => toPut.includes(content.url));
    await DBService.bulkPutSearchablePagesByUrls(contentToAppend);
  }

  if (toDelete.length > 0) {
    await DBService.bulkDeleteSearchablePagesByUrls(toDelete);
  }

  if (toEdit.length > 0) {
    const toEditContents = latestPageContents.filter(content => toEdit.includes(content.url));
    await async.series(toEditContents.map(page => async () => DBService.editSearchablePage(page.url, page.content)));
  }

  console.log('*** RUN VERY LONG INDEXING PROCESS DONE ***');
};