import * as DBService from '../services/DBService';

export const pageMetadataMiddleware = async (req, res, next) => {
  if (req.originalUrl === '/favicon.ico') return next();

  const parts = req.originalUrl.split(/(?=\/)/);
  const root = parts[0];

  // try to fetch page meta data by root part
  const page = await DBService.getPageMetadataByUri(root);

  // likely a 404, add default values
  if (page === null) {
    req.pageMetadata = {
      title: 'Chapman Guitars',
      metaKeywords: '',
      metaDescription: '',
    };
    return next();
  }

  req.pageMetadata = {
    title: page.title,
    metaKeywords: page.metaKeywords,
    metaDescription: page.metaDescription,
  };

  next();
};
