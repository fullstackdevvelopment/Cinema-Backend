import fs from 'fs';
import path from 'path';
import {
  Actors, Categories, MovieCategories, Movies, Photos, Trailers,
} from '../models/index.js';

const createActors = async (movieId, actors, actorPhotoUrls) => {
  const actorData = actors.map((actorName, index) => ({
    name: actorName,
    photo: actorPhotoUrls[index],
    movieId,
  }));
  return Actors.bulkCreate(actorData);
};
const createMovieCategories = async (movieId, categoryIds) => {
  const movieCategoryData = categoryIds.map((categoryId) => ({
    movieId,
    categoryId,
  }));
  return MovieCategories.bulkCreate(movieCategoryData);
};
const sortFiles = (files) => {
  const photos = [];
  const videos = [];
  const actorPhotos = [];

  files.forEach((file) => {
    const mimeType = file.mimetype.split('/')[0];
    if (mimeType === 'image') {
      if (file.originalname.startsWith('moviePhoto')) {
        photos.push(file);
      } else if (file.originalname.startsWith('actorPhoto')) {
        actorPhotos.push(file);
      }
    } else if (mimeType === 'video') {
      if (file.originalname.startsWith('trailer')) {
        videos.push(file);
      }
    }
  });

  return { photos, videos, actorPhotos };
};

class MovieC {
  // ***** CREATE MOVIE API ONLY FOR ADMIN
  static async createMovie(req, res, next) {
    try {
      const {
        title, details, language, releaseDate, director, storyLine,
        rating, duration, voters, categories, actors,
      } = req.body;
      const { files } = req.files;
      const actorArray = JSON.parse(actors);

      const photoFile = files.find((file) => file.mimetype.startsWith('image/'));
      const trailerFile = files.find((file) => file.mimetype.startsWith('video/'));

      const newMovie = await Movies.create({
        title,
        details,
        language,
        releaseDate,
        director,
        storyLine,
        rating,
        duration,
        voters,
      });

      const newPhotos = await Photos.create({
        moviePhoto: photoFile.filename,
        movieId: newMovie.id,
      });

      const newTrailer = await Trailers.create({
        trailer: trailerFile.filename,
        movieId: newMovie.id,
      });

      const newCategory = await createMovieCategories(newMovie.id, categories);

      const actorPromises = actorArray.map(async (actor) => Actors.create({
        name: actor.name,
        photo: actor.photo,
        movieId: newMovie.id,
      }));
      const newActors = await Promise.all(actorPromises);

      res.json({
        newMovie,
        newPhotos,
        newTrailer,
        newCategory,
        newActors,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  // ***** GET MOVIE LIST API ONLY FOR ADMIN *****
  static async getMovieList(req, res, next) {
    try {
      const { page = 1, limit = 6 } = req.query;
      const offset = (page - 1) * limit;

      const list = await Movies.findAll({
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
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      });

      res.json({
        list,
        limit,
        page,
        offset,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** GET MOVIE LIST API ONLY FOR ADMIN *****
  static async changeMovie(req, res, next) {
    try {
      const { movieId } = req.params;

      const movie = await Movies.findByPk(movieId, {
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

      await Photos.destroy({ where: { movieId } });
      await Trailers.destroy({ where: { movieId } });
      await Actors.destroy({ where: { movieId } });
      await MovieCategories.destroy({ where: { movieId } });

      const {
        title, details, language, releaseDate, director, storyLine,
        rating, duration, voters, categories, actors,
      } = req.body;

      const { photos, videos, actorPhotos } = sortFiles(req.files);
      let photoUrl;
      let trailerUrl;
      const actorPhotoUrls = [];

      if (photos.length > 0) {
        const photoPath = path.resolve('public/moviePhotos', movie.photos[0].moviePhoto);
        fs.unlinkSync(photoPath);
        photoUrl = photos[0].filename;
        fs.renameSync(photos[0].path, path.resolve('public/moviePhotos', photos[0].filename));
      }

      if (videos.length > 0) {
        const videoPath = path.resolve('public/trailers', movie.trailers[0].trailer);
        fs.unlinkSync(videoPath);
        trailerUrl = videos[0].filename;
        fs.renameSync(videos[0].path, path.resolve('public/trailers', videos[0].filename));
      }

      if (actorPhotos.length > 0) {
        movie.actors.forEach((i) => {
          const actorPhoto = path.resolve('public/actorPhotos', i.dataValues.photo);
          fs.unlinkSync(actorPhoto);
        });
        actorPhotos.forEach((actorPhoto) => {
          const actorPhotoUrl = actorPhoto.filename;
          actorPhotoUrls.push(actorPhotoUrl);
          fs.renameSync(actorPhoto.path, path.resolve('public/actorPhotos', actorPhoto.filename));
        });
      }

      await Photos.create({
        moviePhoto: photoUrl,
        movieId,
      });
      await Trailers.create({
        trailer: trailerUrl,
        movieId,
      });
      await createMovieCategories(movieId, categories);
      await createActors(movieId, actors, actorPhotoUrls);
      await movie.update({
        title,
        details,
        language,
        releaseDate,
        director,
        storyLine,
        rating,
        duration,
        voters,
      });

      res.json({
        message: 'Movie Data Updated Successfully!',
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** API FOR UPLOAD FILES *****
  static async uploadFiles(req, res, next) {
    try {
      const { name } = req.body;
      const { file } = req;
      const actor = {
        name,
        photo: file.filename,
      };
      res.json({
        actor,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

export default MovieC;
