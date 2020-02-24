import * as UserService from '../UserService';
import errors from '../../admin-interface/src/shared/errors';
import headers from '../../admin-interface/src/shared/headers';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers[headers.userToken];
    if (!token) {
      return res.status(401).send({ errorMessage: errors.invalidToken });
    }
    const isTokenValid = await UserService.getIsSessionValid(token);
    if (isTokenValid) {
      await UserService.touchSession(token);
      return next();
    }
    else {
      return res.status(401).send({ errorMessage: errors.invalidToken });
    }
  } catch (e) {
    return res.status(500).send({ errorMessage: errors.somethingWentWrong });
  }
};

export default authMiddleware;