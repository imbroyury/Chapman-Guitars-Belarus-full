import fs from 'fs';
import util from 'util';
import path from 'path';
const unlink = util.promisify(fs.unlink);

const PATH_TO_UPLOADS = path.join(__dirname, '..', '..', 'static', 'uploads');

export const removeFileFromUploads = async (filename) => {
  const pathToFile = path.join(PATH_TO_UPLOADS, filename);
  await unlink(pathToFile);
};
