import {
  Movies, Photos, Schedule, Seats,
} from '../models/index.js';
// import sequelize from '../services/sequelize.js';
import seats from '../helpers/seats.js';
import Rows from '../models/Rows.js';

class ScheduleC {
  static async createSchedule(req, res, next) {
    try {
      const { movieId, showTime } = req.body;

      const movie = await Movies.findByPk(movieId);
      if (!movie) {
        throw new Error('Movie not found');
      }

      const newSchedule = await Schedule.create({ movieId, showTime });

      const newRows = await Promise.all(seats.map(async (seat) => {
        const newRow = await Rows.create({
          scheduleId: newSchedule.id,
          rowName: seat.seatName.charAt(0),
          seatCount: seat.seatName.substring(1),
        });
        return newRow.id;
      }));

      const createdSeats = await Promise.all(seats.map(async (seat, index) => {
        const newSeat = await Seats.create({
          rowId: newRows[index],
          seatNumber: seat.seatName,
          status: seat.status,
          price: Math.floor(Math.random() * 100 + 15),
        });
        return newSeat;
      }));

      res.json({
        message: 'Schedule and Seats Created Successfully!',
        newSchedule,
        newRows,
        createdSeats,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  static async scheduleList(req, res, next) {
    try {
      const schedule = await Schedule.findAll({
        include: [
          {
            model: Movies,
            as: 'movie',
            attributes: ['id', 'title', 'duration'],
            include: [
              {
                model: Photos,
                as: 'photos',
                attributes: ['moviePhoto'],
              },
            ],
          },
          {
            model: Rows,
            as: 'rows',
            include: [
              {
                model: Seats,
                as: 'seats',
              },
            ],
          },
        ],
      });

      const formattedSchedule = [];
      schedule.forEach((item) => {
        const { showTime, movie, rows } = item;
        const date = new Date(showTime).toISOString().split('T')[0];
        const time = new Date(showTime).toISOString().split('T')[1];

        const existingEntry = formattedSchedule.find(
          (entry) => entry.movie.id === movie.id && entry.date === date,
        );

        if (existingEntry) {
          existingEntry.schedules[0].times.push(time);
          existingEntry.schedules[0].times.sort();
        } else {
          formattedSchedule.push({
            id: item.id,
            movie: {
              id: movie.id,
              title: movie.title,
              duration: movie.duration,
              photos: movie.photos.map((photo) => ({ moviePhoto: photo.moviePhoto })),
            },
            date,
            schedules: [{
              date,
              times: [time],
            }],
            rows: rows.map((row) => ({
              id: row.id,
              rowName: row.rowName,
              seatCount: row.seatCount,
              scheduleId: row.scheduleId,
              seats: row.seats.map((seat) => ({
                id: seat.id,
                seatNumber: seat.seatNumber,
                status: seat.status,
                price: seat.price,
                rowId: seat.rowId,
              })),
            })),
          });
        }
      });

      res.json({
        list: formattedSchedule,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async deleteSchedule(req, res, next) {
    try {
      const { scheduleId } = req.params;

      const schedule = await Schedule.findByPk(scheduleId);

      if (schedule) {
        await schedule.destroy();
        res.json({
          status: 'success',
          message: 'Schedule deleted successfully',
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: 'Schedule not found',
        });
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

export default ScheduleC;
