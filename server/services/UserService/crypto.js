import crypto from 'crypto';
import util from 'util';
import { users } from '../../configuration.json';

const scrypt = util.promisify(crypto.scrypt);
const randomBytes = util.promisify(crypto.randomBytes);

const SALT = users.passwordSalt;
const KEYLEN = 64;
const TOKENLEN = 32;

export const encryptPassword = async (password) => {
  const derivedKey = await scrypt(password, SALT, KEYLEN);
  return derivedKey.toString('hex');
};

export const generateToken = async () => {
  const buffer = await randomBytes(TOKENLEN);
  return buffer.toString('hex');
};
