import path from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as DBService from './services/DBService';
import * as SitemapService from './services/SitemapService';
import * as IndexingService from './services/IndexingService';
import { HTTP_PORT } from '../admin-interface/src/shared/hosts';
import clientRouter from './routers/clientRouter';
import adminRouter from './routers/adminRouter';
import { loggingMiddleware } from './middleware/logging';

const server = express();

// CORS middleware
server.use(cors());

// Handlebars
server.engine('handlebars', exphbs());
server.set('view engine', 'handlebars');

// Parse http body
server.use(bodyParser.json());

// Static files
// Only for admin interface, which bypasses NGINX
const STATIC = path.join(__dirname, '..', 'static');
server.use('/', express.static(STATIC));

server.use(loggingMiddleware);

// Routers
server.use('/admin', adminRouter);
server.use('/', clientRouter);

// Entry-point
(async() => {
  await DBService.init();

  server.listen(HTTP_PORT, async () => {
    console.log(`🎸 Chapman Guitars 🎸 is listening on port ${HTTP_PORT}!`);
    try {
      await IndexingService.runIndexingProcess();
      await SitemapService.generateSitemap();
    } catch(e) {
      console.log(e);
    }
  });
})();