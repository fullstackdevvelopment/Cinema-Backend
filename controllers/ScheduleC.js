import HttpError from 'http-errors';
import { Movies, Photos, Schedule } from '../models/index.js';

class ScheduleC {
  static async createSchedule(req, res, next) {
    try {
      const { movieId, showTime } = req.body;
      const movie = await Movies.findByPk(movieId);

      if (!movie) {
        throw HttpError(404, 'Movie not found');
      }

      const newSchedule = await Schedule.create({ movieId, showTime });

      res.json({
        message: 'Schedule Created Successfully!',
        newSchedule,
      });
    } catch (e) {
      console.log(e);
      next(e);
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
        ],
      });

      const formattedSchedule = [];

      schedule.forEach((item, index) => {
        const { showTime, movie } = item;
        const date = new Date(showTime).toISOString().split('T')[0];
        const time = new Date(showTime).toISOString().split('T')[1];

        const existingEntry = formattedSchedule.find(
          (entry) => entry.movie.id === movie.id && entry.date === date,
        );

        if (existingEntry) {
          // Add time to existing schedules
          existingEntry.schedules[0].times.push(time);
          // Sort times in ascending order
          existingEntry.schedules[0].times.sort();
        } else {
          formattedSchedule.push({
            id: index + 1,
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
}

export default ScheduleC;
