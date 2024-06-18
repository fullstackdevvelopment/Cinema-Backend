import md5 from 'md5';
import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import {
  Users, Cards, Bookings,
} from '../models/index.js';

const {
  USER_PASSWORD_HASH,
  USER_JWT_SECRET,
} = process.env;

class UserC {
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

      const photoUrl = file.filename;

      const errors = [];

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
      console.log(e);
      next(e);
    }
  }

  // ***** USER LOGIN API *****
  static async login(req, res, next) {
    try {
      const {
        userName,
        password,
      } = req.body;

      const user = await Users.findOne({
        where: { userName },
        attributes: {
          exclude: ['password'],
        },
      });

      if (!user) {
        throw HttpError(404);
      }

      const fullUser = await Users.findByPk(user.id);

      const hashedPassword = md5(md5(password) + USER_PASSWORD_HASH);
      if (fullUser.password !== hashedPassword) {
        throw HttpError(422, 'Invalid Username or Password');
      }

      const token = jwt.sign({ userId: user.id }, USER_JWT_SECRET, {
        expiresIn: '1d',
      });

      res.json({
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** USER LIST API FOR ADMIN *****
  static async userList(req, res, next) {
    try {
      const { page = 1, limit = 6 } = req.query;
      const count = await Users.count({
        where: {
          isAdmin: false,
        },
      });

      const list = await Users.findAll({
        where: {
          isAdmin: false,
        },
        attributes: {
          exclude: ['password'],
        },
        include: {
          model: Bookings,
          as: 'bookings',
        },
      });

      res.json({
        status: 'ok',
        list,
        limit,
        page,
        totalPages: Math.ceil(count / limit),
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
}

export default UserC;
