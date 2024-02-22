import HttpError from 'http-errors';
import fs from 'fs';
import path from 'path';
import { v4 as idV4 } from 'uuid';
import {
  Actors,
  Bookings, Categories, Comments, Movies, Photos, Trailers, Users,
} from '../models/index.js';

class AdminController {
  // ***** TICKET LIST API ONLY FOR ADMIN *****
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

  // ***** CREATE MOVIE API ONLY FOR ADMIN
  static async createMovieList(req, res, next) {
    try {
      const {
        title, details, language, releaseDate, director, storyLine,
        rating, actorName1, actorName2, actorName3, actorName4, actorName5, actorName6, actorName7,
        duration, voters, categoryNames,
      } = req.body;

      const {
        moviePhoto, actorPhoto1, actorPhoto2,
        actorPhoto3, actorPhoto4, actorPhoto5,
        actorPhoto6, actorPhoto7, trailer,
      } = req.files;

      let photoUrl;
      let actorPhotoUrl1;
      let actorPhotoUrl2;
      let actorPhotoUrl3;
      let actorPhotoUrl4;
      let actorPhotoUrl5;
      let actorPhotoUrl6;
      let actorPhotoUrl7;
      let trailerUrl;

      if (moviePhoto) {
        photoUrl = moviePhoto[0].filename;
        fs.renameSync(moviePhoto[0].path, path.resolve('public/moviePhotos', moviePhoto[0].filename));
      }

      if (actorPhoto1) {
        actorPhotoUrl1 = '';
        actorPhoto1.forEach((file) => {
          const filename = `${idV4()}-${file.originalname}`;
          actorPhotoUrl1 = filename;
          fs.renameSync(file.path, path.resolve('public/actorPhotos', filename));
        });
      }

      if (actorPhoto2) {
        actorPhotoUrl2 = '';
        actorPhoto2.forEach((file) => {
          const filename = `${idV4()}-${file.originalname}`;
          actorPhotoUrl2 = filename;
          fs.renameSync(file.path, path.resolve('public/actorPhotos', filename));
        });
      }

      if (actorPhoto3) {
        actorPhotoUrl3 = '';
        actorPhoto3.forEach((file) => {
          const filename = `${idV4()}-${file.originalname}`;
          actorPhotoUrl3 = filename;
          fs.renameSync(file.path, path.resolve('public/actorPhotos', filename));
        });
      }

      if (actorPhoto4) {
        actorPhotoUrl4 = '';
        actorPhoto4.forEach((file) => {
          const filename = `${idV4()}-${file.originalname}`;
          actorPhotoUrl4 = filename;
          fs.renameSync(file.path, path.resolve('public/actorPhotos', filename));
        });
      }

      if (actorPhoto5) {
        actorPhotoUrl5 = '';
        actorPhoto5.forEach((file) => {
          const filename = `${idV4()}-${file.originalname}`;
          actorPhotoUrl5 = filename;
          fs.renameSync(file.path, path.resolve('public/actorPhotos', filename));
        });
      }

      if (actorPhoto6) {
        actorPhotoUrl6 = '';
        actorPhoto6.forEach((file) => {
          const filename = `${idV4()}-${file.originalname}`;
          actorPhotoUrl6 = filename;
          fs.renameSync(file.path, path.resolve('public/actorPhotos', filename));
        });
      }

      if (actorPhoto7) {
        actorPhotoUrl7 = '';
        actorPhoto7.forEach((file) => {
          const filename = `${idV4()}-${file.originalname}`;
          actorPhotoUrl7 = filename;
          fs.renameSync(file.path, path.resolve('public/actorPhotos', filename));
        });
      }

      if (trailer) {
        trailerUrl = trailer[0].filename;
        fs.renameSync(trailer[0].path, path.resolve('public/trailers', trailer[0].filename));
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
        actorName1,
        actorName2,
        actorName3,
        actorName4,
        actorName5,
        actorName6,
        actorName7,
        duration,
        voters,
      });

      const newPhotos = await Photos.create({
        moviePhoto: photoUrl,
        movieId: newMovie.id,
      });

      const newCategories = await Categories.create({
        name: categoryNames,
        movieId: newMovie.id,
      });

      const newTrailer = await Trailers.create({
        trailer: trailerUrl,
        movieId: newMovie.id,
      });

      const newActors = await Actors.create({
        name1: actorName1,
        name2: actorName2,
        name3: actorName3,
        name4: actorName4,
        name5: actorName5,
        name6: actorName6,
        name7: actorName7,
        actorPhoto1: actorPhotoUrl1,
        actorPhoto2: actorPhotoUrl2,
        actorPhoto3: actorPhotoUrl3,
        actorPhoto4: actorPhotoUrl4,
        actorPhoto5: actorPhotoUrl5,
        actorPhoto6: actorPhotoUrl6,
        actorPhoto7: actorPhotoUrl7,
        movieId: newMovie.id,
      });

      res.json({
        newMovie,
        newPhotos,
        newCategories,
        newTrailer,
        newActors,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** GET MOVIE LIST API ONLY FOR ADMIN *****
  static async getMovieList(req, res, next) {
    try {
      const { isAdmin } = req;

      const allMovies = await Movies.findAll({
        include: [
          {
            model: Photos,
            as: 'photos',
          },
          {
            model: Categories,
            as: 'categories',
          },
          {
            model: Trailers,
            as: 'trailers',
          },
          {
            model: Actors,
            as: 'actors',
          },
        ],
      });

      if (typeof isAdmin === 'undefined') {
        throw Error('isAdmin is not defined in req');
      }

      if (!isAdmin) {
        throw HttpError(403, 'Forbidden');
      }

      res.json({
        movies: allMovies,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** GET REVIEW LIST API ONLY FOR ADMIN *****
  static async getReviewList(req, res, next) {
    try {
      const { isAdmin } = req;

      const allReview = await Comments.findAll({
        include: [
          {
            model: Movies,
            as: 'movies',
          },
          {
            model: Users,
            as: 'users',
          },
        ],
      });

      if (typeof isAdmin === 'undefined') {
        throw Error('isAdmin is not defined in req');
      }

      if (!isAdmin) {
        throw HttpError(403, 'Forbidden');
      }

      res.json({
        review: allReview,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default AdminController;
