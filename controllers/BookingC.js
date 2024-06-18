import {
  Bookings, Movies, Photos, Users,
} from '../models/index.js';

class BookingC {
  // ***** USERS LIST DASHBOARD ADMIN API *****
  static async getBookingList(req, res, next) {
    try {
      const { page = 1, limit = 4 } = req.query;

      const count = await Users.count({
        distinct: true,
        col: 'id',
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
      });

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
        distinct: true,
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        status: 'ok',
        list,
        limit,
        page,
        totalPages,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** TICKETS LIST ADMIN API *****
  static async getTicketList(req, res, next) {
    try {
      const { page = 1, limit = 6 } = req.query;

      const count = await Bookings.count();

      const list = await Bookings.findAll({
        include: [
          {
            model: Users,
            as: 'users',
            required: true,
            attributes: {
              exclude: ['password'],
            },
          },
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
        order: [['id', 'ASC']],
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        status: 'ok',
        list,
        limit,
        page,
        totalPages,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default BookingC;
