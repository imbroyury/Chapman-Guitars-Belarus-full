import crypto from 'crypto';
import util from 'util';

const scrypt = util.promisify(crypto.scrypt);
const randomBytes = util.promisify(crypto.randomBytes);

// TODO: hide it
const SALT = 'SecretSaltForCookingPasswords';
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
