import { Bookings, Users } from '../models/index.js';

class BookingC {
  // ***** USERS LIST DASHBOARD ADMIN API *****
  static async getBookingLIst(req, res, next) {
    try {
      const { page = 1, limit = 5 } = req.query;
      const offset = (page - 1) * limit;

      const list = await Bookings.findAll({
        include: [
          {
            model: Users,
            as: 'users',
            attributes: {
              exclude: ['password'],
            },
          },
        ],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      });

      res.json({
        status: 'ok',
        list,
        limit,
        page,
        offset,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default BookingC;
