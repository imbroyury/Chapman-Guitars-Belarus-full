import express from 'express';
import errors from '../../../admin-interface/src/shared/errors';

const router = express.Router();

let TOKEN = null;
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'admin11';

const generateToken = () => `${Math.random()}-${Math.random()}-${Math.random()}`;

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  if (login == ADMIN_USER && password === ADMIN_PASSWORD) {
    TOKEN = generateToken();
    res.status(200).send({ token: TOKEN });
  } else {
    res.status(401).send({ errorMessage: errors.invalidCredentials });
  }
});

router.post('/logout', async (req, res) => {
  const { login, token } = req.body;
  console.log(login, token);
  TOKEN = null;
  res.status(200).send('Logged out');
});

router.post('/check-token', async (req, res) => {
  await new Promise(resolve => setTimeout(resolve,2000));
  const { login, token } = req.body;
  if (login == ADMIN_USER && token === TOKEN) {
    return res.status(200).send('Authenticated');
  } else {
    return res.status(401).send({ errorMessage: errors.sessionExpired });
  }
  return res.status(500).send({ errorMessage: errors.somethingWentWrong });
});

export default router;