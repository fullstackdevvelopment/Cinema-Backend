import { Users } from '../models/index.js';

class UserController {
  static async create(req, res, next) {
    try {
      const userData = req.body;

      const user = await Users.create(userData);

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
