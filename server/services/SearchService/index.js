import axios from 'axios';
import jsdom from 'jsdom';
import series from 'async/series';
import { zipWith } from 'lodash';
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
  const urls = await getAllUrls();
  const absoluteUrls = urls.map(url => url.absolute);
  const relativeUrls = urls.map(url => url.relative);
  const urlContetFetchers = absoluteUrls.map(url => async () => getUrlContent(url));
  const urlContents = await series(urlContetFetchers);
  const contents = zipWith(relativeUrls, urlContents, (url, content) => ({ url, content }));
  return contents;
};