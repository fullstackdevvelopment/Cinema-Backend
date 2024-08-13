import HttpError from 'http-errors';
import {
  Bookings, Movies, Photos, Users, Rows, Seats,
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

  // ***** BOOKING CREATE API *****
  static async createBooking(req, res, next) {
    try {
      const bookingData = req.body;

      if (!bookingData) {
        throw new HttpError(404, 'BookingData not found');
      }

      const newBookings = await Promise.all(
        bookingData.map((booking) => Bookings.create({
          userId: booking.userId,
          movieId: booking.movieId,
          bookingRow: booking.bookingRow,
          seatNumber: booking.seatNumber,
          status: booking.status,
          ticketPrice: booking.ticketPrice,
        })),
      );

      const rows = await Promise.all(
        bookingData.map((booking) => Rows.findAll({
          where: {
            scheduleId: booking.scheduleId,
            rowName: booking.bookingRow,
            seatCount: booking.seatNumber,
          },
        })),
      );

      const seats = await Promise.all(
        rows.flat().map((row) => Seats.findAll({
          where: {
            rowId: row.id,
            status: 'Available',
          },
        })),
      );

      await Promise.all(
        seats.flat().map((seat) => seat.update({
          status: 'Booked',
        })),
      );

      res.json({
        status: 'ok',
        newBookings,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

export default BookingC;
