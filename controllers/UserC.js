import md5 from 'md5';
import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import {
  Users, Cards, Bookings, PendingUsers, PendingPassword,
} from '../models/index.js';
import EmailC from './EmailC.js';

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
      const expirationDate = `${selectedMonth}/${selectedYear}`;

      const verificationCode = randomBytes(6).toString('hex').slice(0, 6);

      const user = await PendingUsers.create({
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
        status: 'pending',
        verificationCode,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        cardNumber,
        expirationDate,
        cvv,
        cardHolderName,
      });

      const message = await EmailC.emailVerification(email, verificationCode);

      res.json({
        status: 'ok',
        user,
        message,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async userVerification(req, res, next) {
    try {
      const { verificationCode } = req.body;
      const pendingUser = await PendingUsers.findOne({ where: { verificationCode } });

      if (!pendingUser || new Date() > new Date(pendingUser.expiresAt)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid or expired verification code',
        });
      }

      const user = await Users.create({
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        userName: pendingUser.userName,
        email: pendingUser.email,
        password: pendingUser.password,
        city: pendingUser.city,
        country: pendingUser.country,
        address: pendingUser.address,
        phone: pendingUser.phone,
        photo: pendingUser.photo,
        status: 'active',
      });

      const userCard = await Cards.create({
        cardNumber: pendingUser.cardNumber,
        expirationDate: pendingUser.expirationDate,
        cvv: pendingUser.cvv,
        cardHolderName: pendingUser.cardHolderName,
        userId: user.id,
        balance: 50000,
      });

      await PendingUsers.destroy({ where: { verificationCode } });

      res.json({
        status: 'success',
        message: 'Email verified and user registered successfully',
        user,
        userCard,
      });
    } catch (e) {
      next(e);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { email } = req.body;

      const user = await Users.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        res.status(400).json({
          status: 'error',
          message: 'User not found',
        });
      }
      const verificationCode = randomBytes(6).toString('hex').slice(0, 6);

      await EmailC.resetPassword(email, verificationCode);

      await PendingPassword.create({
        email,
        verificationCode,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      res.json({
        status: 'ok',
      });
    } catch (e) {
      next(e);
    }
  }

  static async resetPasswordFinished(req, res, next) {
    try {
      const { password } = req.body;
      const { verificationCode } = req.params;
      console.log(verificationCode);
      console.log(password);

      const pendingCode = await PendingPassword.findOne({ where: { verificationCode } });

      if (!pendingCode || new Date() > new Date(pendingCode.expiresAt)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid or expired verification code',
        });
      }

      const user = await Users.findOne({
        where: {
          email: pendingCode.email,
        },
      });
      const passwordHash = md5(md5(password) + USER_PASSWORD_HASH);

      await user.update({ password: passwordHash });
      res.json({
        status: 'success',
      });
    } catch (e) {
      next(e);
    }
  }

  static async ticketPdfUpload(req, res, next) {
    try {
      const { email } = req.body;
      const { file } = req;
      if (!file) {
        res.status(400).json({
          status: 'error',
          message: 'No file uploaded',
        });
      }

      console.log(email);

      await EmailC.sendPdfTicket(email, file);

      res.json({
        status: 'ok',
      });
    } catch (e) {
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

  // ***** ADMIN LOGIN API *****
  static async loginAdmin(req, res, next) {
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

      if (!fullUser.isAdmin) {
        throw HttpError(403, 'Invalid Username or Password');
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

  // ***** USER SINGLE DATA *****
  static async userData(req, res, next) {
    try {
      const token = Object.keys(req.body)[0];
      const decodedToken = jwt.verify(token, USER_JWT_SECRET);
      const { userId } = decodedToken;

      const user = await Users.findByPk(userId, {
        include: {
          model: Cards,
          as: 'cards',
        },
      });

      if (!user) {
        throw new HttpError(404, 'User Not Found');
      }

      res.json({
        user,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** USER SINGLE DATA *****
  static async adminData(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, USER_JWT_SECRET);
      const { userId } = decodedToken;

      const user = await Users.findByPk(userId, {
        attributes: {
          exclude: ['password', 'isAdmin'],
        },
        include: {
          model: Cards,
          as: 'cards',
        },
      });

      if (!user) {
        throw new HttpError(404, 'User Not Found');
      }

      res.json({
        user,
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
        city,
        country,
        address,
        phone,
      } = req.body;

      const { file, userId } = req;

      const photoUrl = file?.filename;

      const user = await Users.findByPk(userId);
      if (user) {
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.city = city || user.city;
        user.country = country || user.country;
        user.address = address || user.address;
        user.phone = phone || user.phone;
        user.photo = photoUrl || user.photo;
        user.updatedAt = new Date();

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
