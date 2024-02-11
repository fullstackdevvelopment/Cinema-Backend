import path from 'path';
import fs from 'fs';
import HttpError from 'http-errors';
import { Users } from '../models/index.js';

class UserController {
  static async create(req, res, next) {
    try {
      const {
        userName,
        city,
        country,
        email,
        password,
        passwordRepeat,
        phone,
        address,
        cardName,
        cardNumber,
      } = req.body;

      const { file } = req;

      let photoUrl;

      const errors = [];

      if (file) {
        photoUrl = file.filename;
        fs.renameSync(file.path, path.resolve('public', file.filename));
      }

      const existingUserByEmail = await Users.findOne({
        where: {
          email,
        },
      });

      const existingUserByPhone = await Users.findOne({
        where: {
          phone,
        },
      });

      const existingUserByCardNumber = await Users.findOne({
        where: {
          cardNumber,
        },
      });

      if (existingUserByEmail) {
        errors.push({
          field: 'email',
          message: 'Email already exists',
        });
      }

      if (existingUserByPhone) {
        errors.push({
          field: 'phone',
          message: 'Phone already exists',
        });
      }

      if (existingUserByCardNumber) {
        errors.push({
          field: 'cardNumber',
          message: 'Card Number already exists',
        });
      }

      if (errors.length > 0) {
        throw HttpError(422, { errors });
      }

      const user = await Users.create({
        userName,
        city,
        country,
        email,
        password,
        passwordRepeat,
        phone,
        address,
        photo: photoUrl,
        cardName,
        cardNumber,
      });

      res.json({
        status: 'ok',
        user,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default UserController;
