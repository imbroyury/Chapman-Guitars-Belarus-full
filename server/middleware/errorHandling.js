import  { serializeError } from 'serialize-error';
import * as LoggerService from '../services/LoggerService';

export const ERROR_HANDLING_TYPE = {
  'ADMIN': 'ADMIN',
  'CLIENT': 'CLIENT',
};

export const wrapAsync = (asyncHandler) => (req, res, next) => asyncHandler(req, res, next).catch(next);

export const errorHandlingMiddleware =
  (type) =>
    (e, req, res, next) => { // eslint-disable-line no-unused-vars
      LoggerService.log(`[ERR ] - <${new Date().toISOString()}> - ${req.method} - ${req.originalUrl} - ${JSON.stringify(serializeError(e))}`);

      if (type === ERROR_HANDLING_TYPE.ADMIN) {
        return res.status(500).send(e);
      }

      if (type === ERROR_HANDLING_TYPE.CLIENT) {
        return res.render('error', {
          ...req.pageMetadata,
          e500: true,
        });
      }

      res.status(500).send(e);
    };
