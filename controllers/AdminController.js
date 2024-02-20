import HttpError from 'http-errors';
import fs from 'fs';
import path from 'path';
import { Bookings, Movies } from '../models/index.js';

class AdminController {
  static async getTicketList(req, res, next) {
    try {
      const { isAdmin } = req;
      if (typeof isAdmin === 'undefined') {
        throw new Error('isAdmin is not defined in req');
      }

      if (!isAdmin) {
        throw new HttpError(403, 'Forbidden');
      }

      const ticketList = await Bookings.findAll();

      res.json({
        ticketList,
      });
    } catch (e) {
      next(e);
    }
  }

  static async createMovieList(req, res, next) {
    try {
      const {
        title, details, language, releaseDate, director, storyLine,
        rating, actorName, duration, categories, voters, trailer,
      } = req.body;

      const { photo, actorPhoto } = req.files;

      let photoUrl;
      let actorPhotoUrl;

      if (photo) {
        photoUrl = req.files.photo[0].filename;
        fs.renameSync(req.files.photo[0].path, path.resolve('public/moviePhotos', req.files.photo[0].filename));
      }

      if (actorPhoto) {
        actorPhotoUrl = req.files.actorPhoto[0].filename;
        fs.renameSync(req.files.actorPhoto[0].path, path.resolve('public/actorPhotos', req.files.actorPhoto[0].filename));
      }

      const { isAdmin } = req;

      if (typeof isAdmin === 'undefined') {
        throw Error('isAdmin is not defined in req');
      }

      if (!isAdmin) {
        throw HttpError(403, 'Forbidden');
      }

      const newMovie = await Movies.create({
        title,
        details,
        language,
        releaseDate,
        director,
        storyLine,
        rating,
        actorName,
        duration,
        categories,
        voters,
        trailer,
        photo: photoUrl,
        actorPhoto: actorPhotoUrl,
      });

      res.json({
        newMovie,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default AdminController;
