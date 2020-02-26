import path from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import * as DBService from './services/DBService';
import { HTTP_PORT } from '../admin-interface/src/shared/hosts';
import clientRouter from './routers/clientRouter';
import adminRouter from './routers/adminRouter';

const server = express();

// Handlebars
server.engine('handlebars', exphbs());
server.set('view engine', 'handlebars');

// Parse http body
server.use(bodyParser.json());

// Static files
const ADMIN_INTERFACE_BUILD = path.join(__dirname, '..', 'admin-interface', 'build');
const STATIC = path.join(__dirname, '..', 'static');
const UPLOADS = path.join(__dirname, '..', 'static', 'uploads');

server.use('/admin', express.static(ADMIN_INTERFACE_BUILD));
server.use('/uploads', express.static(UPLOADS));
server.use('/static', express.static(STATIC));

// Routers
server.use('/admin', adminRouter);
server.use('/', clientRouter);

// Entry-point
(async() => {
  await DBService.init();

  server.listen(HTTP_PORT, () => console.log(`🎸 Chapman Guitars 🎸 is listening on port ${HTTP_PORT}!`));
})();