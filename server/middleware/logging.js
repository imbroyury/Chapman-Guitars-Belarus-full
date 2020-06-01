import * as LoggerService from '../services/LoggerService';

export const loggingMiddleware = (req, res, next) => {
  LoggerService.log(`[INFO] - <${new Date().toISOString()}> - ${req.method} - ${req.originalUrl}`);
  next();
};
