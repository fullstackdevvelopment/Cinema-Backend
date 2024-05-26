import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import Users from '../models/Users.js';

const { USER_JWT_SECRET } = process.env;

const isAdminM = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw HttpError(401, 'Unauthorized');
    }

    const decodedToken = jwt.verify(token, USER_JWT_SECRET);
    const { userId } = decodedToken;
    if (!userId) {
      throw HttpError(401, 'Unauthorized');
    }

    const user = await Users.findByPk(userId);

    if (!user.isAdmin) {
      throw HttpError(403, 'You are not an Administrator');
    }

    next();
  } catch (e) {
    next(e);
  }
};

export default isAdminM;
