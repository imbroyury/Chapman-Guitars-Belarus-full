import express from 'express';

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
    res.status(401).send();
  }
});

router.post('/logout', async (req, res) => {
  TOKEN = null;
  res.status(200).send();
});

router.post('/check-token', async (req, res) => {
  const { login, token } = req.body;
  if (login == ADMIN_USER && token === TOKEN) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

export default router;