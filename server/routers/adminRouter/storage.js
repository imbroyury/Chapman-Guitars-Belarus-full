import multer from 'multer';
import mime from 'mime-types';
import uuid from 'uuid/v1';

const storage = multer.diskStorage({
  destination: 'static/uploads',
  filename: function (req, file, cb) {
    cb(null, uuid() + '.' + mime.extension(file.mimetype));
  }
});

export const upload = multer({ storage });
