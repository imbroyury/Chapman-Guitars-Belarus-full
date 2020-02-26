import axios from 'axios';
import jsdom from 'jsdom';
import series from 'async/series';
import _ from 'lodash';
const { JSDOM } = jsdom;
import { getAllUrls } from '../URLService';

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

export const getAllUrlsContent = async () => {
  const allUrls = await getAllUrls();
  const absoluteUrls = allUrls.map(url => url.absolute);
  const relativeUrls = allUrls.map(url => url.relative);
  const urlContentFetchers = absoluteUrls.map(url => async () => getUrlContent(url));
  const urlContents = await series(urlContentFetchers);
  const contents = _.zipWith(relativeUrls, urlContents, (url, content) => ({ url, content }));
  return contents;
};