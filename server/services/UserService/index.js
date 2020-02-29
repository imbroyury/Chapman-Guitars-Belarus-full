import * as DBService from '../DBService';
import { encryptPassword, generateToken } from './crypto';

const seconds = (n = 1) => n * 1000;
const minutes = (n = 1) => n * seconds(60);

const TOKEN_VALIDITY = minutes(10);

export const createUser = async (login, password) => {
  const encryptedPassword = await encryptPassword(password);
  await DBService.putUser(login, encryptedPassword);
};

export const getUserByLoginAndPassword = async (login, password) => {
  const encryptedPassword = await encryptPassword(password);
  const user = await DBService.getUserByLoginAndPassword(login, encryptedPassword);
  return user;
};

export const createSession = async (userId) => {
  const token = await generateToken();
  const session = await DBService.putSession(userId, token);
  return session.token;
};

export const touchSession = async (token) => {
  await DBService.touchSession(token);
};

export const deleteSession = async (token) => {
  await DBService.deleteSession(token);
};

export const getIsSessionValid = async (token) => {
  const session = await DBService.getSessionByToken(token);
  if (session === null) return false;
  const now = Date.now();
  const updatedAt = new Date(session.updatedAt).getTime();
  const diff = now - updatedAt;
  return diff <= TOKEN_VALIDITY;
};