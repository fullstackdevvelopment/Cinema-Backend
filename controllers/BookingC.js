import {
  Bookings, Movies, Photos, Users,
} from '../models/index.js';

class BookingC {
  // ***** USERS LIST DASHBOARD ADMIN API *****
  static async getBookingList(req, res, next) {
    try {
      const { page = 1, limit = 5 } = req.query;
      const offset = (page - 1) * limit;

      const list = await Users.findAll({
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: Bookings,
            as: 'bookings',
            required: true,
            include: [
              {
                model: Movies,
                as: 'movies',
                include: [
                  {
                    model: Photos,
                    as: 'photos',
                  },
                ],
              },
            ],
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
