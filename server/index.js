import path from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import multer from 'multer';
import mime from 'mime-types';
import uuid from 'uuid/v1';
import * as DBService from './DBService';
import { HTTP_PORT } from '../admin-interface/src/shared/hosts';
// import { encryptPassword, generateToken } from './crypto';
// mport errors from '../admin-interface/src/shared/errors';
// mport headers from '../admin-interface/src/shared/headers';
import clientRouter from './clientRouter';

const server = express();

server.engine('handlebars', exphbs());
server.set('view engine', 'handlebars');

server.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: 'static/uploads',
  filename: function (req, file, cb) {
    cb(null, uuid() + '.' + mime.extension(file.mimetype));
  }
});
const upload = multer({ storage });

// const BUILD_FOLDER = path.join(__dirname, '..', 'admin-interface', 'build');
// server.use(express.static(BUILD_FOLDER));
server.use(express.static(path.join(__dirname, '..', 'static', 'uploads')));
server.use('/static', express.static(path.join(__dirname, '..', 'static')));

DBService.init();

server.get('/upload', async (req, res) => {
  res.status(200).send(`
    <form action="/upload-image" method="post" enctype="multipart/form-data">
      <input type='file' name="image" id="image"/>
      <input type='submit' value="upload"/>
    </form>
  `);
});

server.post('/upload-image',
  upload.single('image'),
  async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    await DBService.saveImageMetaData(req.file.filename);
    res.send('OK');
  });

server.post('/login', async (req, res) => {
  res.status(500).send();
});

// For everything else, serve index file
// server.get('*', (req, res) => {
//   res.sendFile(path.join(BUILD_FOLDER, 'index.html'));
// });

server.listen(HTTP_PORT, () => {
  console.log(`🎸 Chapman Guitars 🎸 is listening on port ${HTTP_PORT}!`);
});

server.use('/', clientRouter);