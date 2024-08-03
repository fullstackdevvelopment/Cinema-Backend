import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';

const EXCLUDE = [
  'POST:/users/register',
  'GET:/users/list',
  'POST:/users/login',
  'POST:/admins/login',
  'GET:/schedule/list',
  'GET:/movie/list',
  'GET:/movie/countries',
  'GET:/category/list',
  'GET:/schedule/list',
  /^GET:\/movie\/single\/\d+$/,
  /^GET:\/review\/list\/\d+$/,
  'POST:/email/send',
  'POST:/users/verifications',
  'POST:/users/reset/password',
  /^POST:\/users\/reset\/password\/[0-9a-fA-F]+$/,
  'GET:/',
];

const { USER_JWT_SECRET } = process.env;

function authorizationM(req, res, next) {
  try {
    const { method, path } = req;
    const authorization = req.headers.authorization || req.headers.Authorization;

    if (method === 'OPTIONS' || EXCLUDE.some((pattern) => (pattern instanceof RegExp ? pattern.test(`${method}:${path}`) : pattern === `${method}:${path}`))) {
      next();
      return;
    }

    if (!authorization) {
      throw HttpError(401, 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');

    if (!token) {
      throw HttpError(401, 'Token missing');
    }

    const decoded = jwt.verify(token, USER_JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    console.log(e, 'error');
    next(e);
  }
}

export default authorizationM;
