import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import {
  Users, Cards, Comments, Movies,
} from '../models/index.js';

const {
  USER_PASSWORD_HASH,
  USER_JWT_SECRET,
} = process.env;

class UserController {
  // ***** USER REGISTER API *****
  static async register(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        userName,
        email,
        password,
        city,
        country,
        address,
        phone,
        isAdmin,
        cardNumber,
        selectedMonth,
        selectedYear,
        cvv,
        cardHolderName,
      } = req.body;

      const { file } = req;

      let photoUrl;

      const errors = [];

      if (file) {
        photoUrl = file.filename;
        fs.renameSync(file.path, path.resolve('public/userPhoto', file.filename));
      }

      const existingUserByUserName = await Users.findOne({ where: { userName } });
      const existingUserByEmail = await Users.findOne({ where: { email } });
      const existingUserByPhone = await Users.findOne({ where: { phone } });

      if (existingUserByUserName) {
        errors.push({
          field: 'userName',
          message: 'UserName already exists',
        });
      }

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

      if (errors.length > 0) {
        throw HttpError(422, { errors });
      }

      const passwordHash = md5(md5(password) + USER_PASSWORD_HASH);

      const user = await Users.create({
        firstName,
        lastName,
        userName,
        email,
        password: passwordHash,
        city,
        country,
        address,
        phone,
        photo: photoUrl,
        isAdmin,
      });

      const expirationDate = `${selectedMonth}/${selectedYear}`;

      const card = await Cards.create({
        cardNumber,
        expirationDate,
        cvv,
        cardHolderName,
        userId: user.id,
      });

      res.json({
        status: 'ok',
        user,
        card,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** GET USERS LIST API *****
  static async userList(req, res, next) {
    try {
      const users = await Users.findAll({
        include: [{
          model: Cards,
          as: 'cards',
        }],
      });

      res.json({
        users,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** USER LOGIN API *****
  static async login(req, res, next) {
    const {
      userName,
      password,
    } = req.body;

    let token;

    try {
      const user = await Users.findOne(
        {
          where: { userName },
        },
      );

      if (!user) {
        throw HttpError(404);
      }

      if (!user || user.password !== md5(md5(password) + USER_PASSWORD_HASH)) {
        throw HttpError(422, 'Invalid email or password');
      }

      if (user.isAdmin === true) {
        token = jwt.sign({ isAdmin: user.isAdmin }, USER_JWT_SECRET, {
          expiresIn: '1d',
        });
      } else {
        token = jwt.sign({ userId: user.id }, USER_JWT_SECRET, {
          expiresIn: '1d',
        });
      }

      res.json({
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** USER UPDATE API *****
  static async userUpdate(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        city,
        country,
        address,
        phone,
      } = req.body;

      const { userId } = req; // token

      const user = await Users.findByPk(userId);
      if (user) {
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.password = password || user.password;
        user.city = city || user.city;
        user.country = country || user.country;
        user.address = address || user.address;
        user.phone = phone || user.phone;

        const updatedUser = await user.save();
        res.json({
          message: 'User data updated successfully',
          updatedUser,
        });
      } else {
        throw HttpError(404, 'User not found');
      }
    } catch (e) {
      next(e);
    }
  }

  // ***** USER PROFILE DELETE API *****
  static async userDelete(req, res, next) {
    try {
      const { userId } = req;
      const user = await Users.findByPk(userId);

      if (!user) {
        res.status(404);
        throw HttpError(404, 'User not found');
      }

      if (user.isAdmin) {
        res.status(403);
        throw HttpError(403, 'Can\'t delete admin user');
      }

      await user.destroy();

      res.json({
        status: 'User deleted successfully',
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** USER CHANGE PASSWORD *****
  static async userChangePassword(req, res, next) {
    try {
      const {
        oldPassword,
        newPassword,
      } = req.body;
      const { userId } = req;

      const user = await Users.findByPk(userId);

      if (!user) {
        res.status(404);
        throw HttpError(404, 'User not found');
      }

      if (user.password !== md5(md5(oldPassword) + USER_PASSWORD_HASH)) {
        res.status(422);
        throw HttpError(422, 'Old password is incorrect');
      }

      user.password = md5(md5(newPassword) + USER_PASSWORD_HASH);
      await user.save();

      res.json({
        message: 'Password changed successfully',
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** USER CREATE COMMENT *****
  static async createMovieComment(req, res, next) {
    try {
      const { movieId } = req.params;
      const { commentText, rating } = req.body;
      const { userId } = req;

      const user = await Users.findByPk(userId);
      const movie = await Movies.findByPk(movieId);

      if (!user) {
        throw HttpError('User Not Found');
      }

      if (!movie) {
        throw HttpError('Movie Not Found');
      }

      const newComments = await Comments.create({
        commentText,
        rating,
        movieId: movie.id,
        userId: user.id,
      });

      res.json({
        newComments,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default UserController;
