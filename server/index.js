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

const server = express();

server.engine('handlebars', exphbs());
server.set('view engine', 'handlebars');

server.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: 'server/images/',
  filename: function (req, file, cb) {
    cb(null, uuid() + '.' + mime.extension(file.mimetype));
  }
});
const upload = multer({ storage });

// const BUILD_FOLDER = path.join(__dirname, '..', 'admin-interface', 'build');
// server.use(express.static(BUILD_FOLDER));
server.use(express.static(path.join(__dirname, 'images')));
server.use('/static', express.static(path.join(__dirname, '..', 'client')));

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

server.get('/guitar-gallery', async (req, res) => {
  const guitars = await DBService.getAllGuitars();
  const vm = guitars.map(guitar => {
    return {
      name: guitar.get('name'),
      colors: guitar.get('guitar_colors').map((gc) => ({
        name: gc.get('name'),
        guitar_image: gc.get('guitar_image').get('name'),
        tab_image: gc.get('tab_image').get('name'),
        dot_image: gc.get('dot_image').get('name'),
      }))
    };
  });
  console.log(vm);
  vm.forEach(v => console.log(v.colors));
  res.render('guitar-gallery', { guitars: vm });
});

// For everything else, serve index file
// server.get('*', (req, res) => {
//   res.sendFile(path.join(BUILD_FOLDER, 'index.html'));
// });

server.listen(HTTP_PORT, () => {
  console.log(`🎸 Chapman Guitars 🎸 is listening on port ${HTTP_PORT}!`);
});
