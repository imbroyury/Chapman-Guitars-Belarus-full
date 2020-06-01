import fs from 'fs';
import util from 'util';
import path from 'path';
import async from 'async';
import os from 'os';

const appendFile = util.promisify(fs.appendFile);

const PATH_TO_LOG_FILE = path.join(__dirname, '..', '..', 'server-log.log');

// setup queue to manage writing to file
const logLineQueue = async.queue(async (line, callback) => {
  try {
    await appendFile(PATH_TO_LOG_FILE, line + os.EOL);
  } catch(e) {
    console.error('Encoutered an error attempting to write to log file');
    console.error(e);
  }
  callback();
}, 1);

export const log = async (line) => {
  logLineQueue.push(line);
};
