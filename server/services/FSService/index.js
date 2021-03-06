import fs from 'fs';
import util from 'util';
import path from 'path';
const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

const PATH_TO_UPLOADS = path.join(__dirname, '..', '..', '..', 'static', 'uploads');
const PATH_TO_SITEMAP = path.join(__dirname, '..', '..', '..', 'static', 'sitemap.xml');

export const removeFileFromUploads = async (filename) => {
  const pathToFile = path.join(PATH_TO_UPLOADS, filename);
  await unlink(pathToFile);
};

export const saveSitemapToFile = async (sitemapContents) => {
  await writeFile(PATH_TO_SITEMAP, sitemapContents);
};
