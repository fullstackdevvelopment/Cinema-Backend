import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';

const EXCLUDE = [
  'POST:/users/register',
  'GET:/users/list',
  'POST:/users/login',
  'POST:/users/forgot',
];

const { USER_JWT_SECRET } = process.env;

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

    const decoded = jwt.verify(token, USER_JWT_SECRET);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (e) {
    next(e);
  }
}

export default authorizationMiddleware;
