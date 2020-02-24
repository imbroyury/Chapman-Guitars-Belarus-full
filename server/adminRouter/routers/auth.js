import express from 'express';
import errors from '../../../admin-interface/src/shared/errors';
import * as UserService from '../../UserService';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  const user = await UserService.getUserByLoginAndPassword(login, password);
  if (user === null) {
    return res.status(401).send({ errorMessage: errors.invalidCredentials });
  }

  const token = await UserService.createSession(user.id);
  res.status(200).send({ token });
});

router.post('/logout', async (req, res) => {
  const { token } = req.body;
  try {
    await UserService.deleteSession(token);
  } catch (e) {
    // ignore
  }
  res.status(200).send();
});

router.post('/check-token', async (req, res) => {
  try {
    await new Promise(resolve => setTimeout(resolve,300));
    const { token } = req.body;
    const isTokenValid = await UserService.getIsSessionValid(token);
    if (isTokenValid) {
      await UserService.touchSession(token);
      return res.status(200).send();
    } else {
      return res.status(401).send({ errorMessage: errors.invalidToken });
    }
  } catch (e) {
    return res.status(500).send({ errorMessage: errors.somethingWentWrong });
  }
});

export default router;