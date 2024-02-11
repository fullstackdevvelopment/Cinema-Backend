import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';

const EXCLUDE = [
  'POST:/users/create',
];

const { PERSON_JWT_SECRET } = process.env;

function authorizationMiddleware(req, res, next) {
  try {
    const { method, path } = req;
    const { authorization = '' } = req.headers;

    if (method === 'OPTIONS' || EXCLUDE.includes(`${method}:${path}`)) {
      next();
      return;
    }

    const token = authorization.replace('Bearer ', '');

    if (!token) {
      throw HttpError(401);
    }

    const decoded = jwt.verify(token, PERSON_JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    next(e);
  }
}

export default authorizationMiddleware;
