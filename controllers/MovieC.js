import HttpError from 'http-errors';
import {
  Actors, Categories, MovieCategories, Movies, MovieStills, Photos, Trailers,
} from '../models/index.js';

const createMovieCategories = async (movieId, categoryIds) => {
  const movieCategoryData = categoryIds.map((categoryId) => ({
    movieId,
    categoryId,
  }));
  return MovieCategories.bulkCreate(movieCategoryData);
};

class MovieC {
  // ***** CREATE MOVIE API ONLY FOR ADMIN
  static async createMovie(req, res, next) {
    try {
      const {
        title, details, language, releaseDate, director, storyLine,
        rating, duration, voters, categories, actors, stills, files,
      } = req.body;

      if (!title || !details || !language || !releaseDate || !director || !storyLine
        || rating == null || !duration || !voters || !categories || !actors || !stills || !files) {
        let errorMessage = 'Missing required fields: ';
        if (!title) errorMessage += 'Title, ';
        if (!details) errorMessage += 'Details, ';
        if (!language) errorMessage += 'Language, ';
        if (!releaseDate) errorMessage += 'Release Date, ';
        if (!director) errorMessage += 'Director, ';
        if (!storyLine) errorMessage += 'Story Line, ';
        if (rating == null) errorMessage += 'Rating, ';
        if (!duration) errorMessage += 'Duration, ';
        if (!voters) errorMessage += 'Voters, ';
        if (!categories) errorMessage += 'Categories, ';
        if (!actors) errorMessage += 'Actors, ';
        if (!stills) errorMessage += 'Stills, ';
        if (!files) errorMessage += 'Files, ';

        errorMessage = errorMessage.slice(0, -2);

        next({
          status: 400,
          message: errorMessage,
        });
      }

      const actorArray = JSON.parse(actors);
      const stillArray = JSON.parse(stills);
      const filesArray = JSON.parse(files);
      const categoriesArray = JSON.parse(categories);

      const photoFile = filesArray.find((file) => file.photo?.endsWith('.webp'))
        || filesArray.find((file) => file.photo?.endsWith('.png'))
        || filesArray.find((file) => file.photo?.endsWith('.jpg'));
      const trailerFile = filesArray.find((file) => file.trailer?.endsWith('.mp4'));

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
        moviePhoto: photoFile.photo,
        movieId: newMovie.id,
      });

      const newTrailer = await Trailers.create({
        trailer: trailerFile.trailer,
        movieId: newMovie.id,
      });

      const newCategory = await createMovieCategories(newMovie.id, categoriesArray);

      const actorPromises = actorArray.map(async (actor) => Actors.create({
        name: actor.name,
        photo: actor.photo,
        movieId: newMovie.id,
      }));
      const newActors = await Promise.all(actorPromises);

      const stillPromises = stillArray.map(async (still) => MovieStills.create({
        stillPath: still.photo,
        movieId: newMovie.id,
      }));
      const newStills = await Promise.all(stillPromises);

      res.json({
        newMovie,
        newPhotos,
        newTrailer,
        newCategory,
        newActors,
        newStills,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  // ***** GET MOVIE LIST API ONLY FOR ADMIN *****
  static async getMovieList(req, res, next) {
    try {
      const { page = 1, limit = 6 } = req.query;

      const count = await Movies.count();

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
          {
            model: MovieStills,
            as: 'stills',
          },
        ],
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        list,
        limit,
        page,
        totalPages,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** GET MOVIE LIST API ONLY FOR ADMIN *****
  static async changeMovie(req, res, next) {
    try {
      const {
        title, details, language, releaseDate, director, storyLine,
        rating, duration, voters, categories, actors, stills, files,
      } = req.body;

      if (!title || !details || !language || !releaseDate || !director || !storyLine
        || rating == null || !duration || !voters || !categories || !actors || !stills || !files) {
        let errorMessage = 'Missing required fields: ';
        if (!title) errorMessage += 'Title, ';
        if (!details) errorMessage += 'Details, ';
        if (!language) errorMessage += 'Language, ';
        if (!releaseDate) errorMessage += 'Release Date, ';
        if (!director) errorMessage += 'Director, ';
        if (!storyLine) errorMessage += 'Story Line, ';
        if (rating == null) errorMessage += 'Rating, ';
        if (!duration) errorMessage += 'Duration, ';
        if (!voters) errorMessage += 'Voters, ';
        if (!categories) errorMessage += 'Categories, ';
        if (!actors) errorMessage += 'Actors, ';
        if (!stills) errorMessage += 'Stills, ';
        if (!files) errorMessage += 'Files, ';

        errorMessage = errorMessage.slice(0, -2);

        next({
          status: 400,
          message: errorMessage,
        });
      }

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

      if (!movie) {
        throw HttpError(404, 'Movie not found');
      }

      const actorArray = JSON.parse(actors);
      const stillArray = JSON.parse(stills);
      const filesArray = JSON.parse(files);
      const categoriesArray = JSON.parse(categories);

      const photoFile = filesArray.find((file) => file && file.mimetype && file.mimetype.startsWith('image/'))
        || filesArray.find((file) => file && file.moviePhoto && (file.moviePhoto.endsWith('.png')
        || file.moviePhoto.endsWith('.webp') || file.moviePhoto.endsWith('.jpg')));

      const trailerFile = filesArray.find((file) => file && file.mimetype && file.mimetype.startsWith('video/'))
        || filesArray.find((file) => file && file.type && file.type.startsWith('video/'))
        || filesArray.find((file) => file && file.trailer && file.trailer.endsWith('.mp4'))
      || filesArray.find((file) => file && file.name && file.name.endsWith('.mp4'));

      await Photos.destroy({ where: { movieId } });
      await Trailers.destroy({ where: { movieId } });
      await Actors.destroy({ where: { movieId } });
      await MovieCategories.destroy({ where: { movieId } });
      await MovieStills.destroy({ where: { movieId } });

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
      const newPhotos = await Photos.create({
        moviePhoto: photoFile.filename || photoFile.moviePhoto,
        movieId,
      });

      const newTrailer = await Trailers.create({
        trailer: trailerFile.name || trailerFile.trailer,
        movieId,
      });
      const newCategory = await createMovieCategories(movieId, categoriesArray);

      const actorPromises = actorArray.map(async (actor) => Actors.create({
        name: actor.name,
        photo: actor.photo,
        movieId,
      }));
      const newActors = await Promise.all(actorPromises);

      const stillPromises = stillArray.map(async (still) => MovieStills.create({
        stillPath: still.stillPath,
        movieId,
      }));
      const newStills = await Promise.all(stillPromises);

      res.json({
        message: 'Movie Data Updated Successfully!',
        newMovie: movie,
        newPhotos,
        newTrailer,
        newCategory,
        newActors,
        newStills,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  // ***** API FOR UPLOAD ACTOR FILES *****
  static async uploadActorFiles(req, res, next) {
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

  // ***** API FOR UPLOAD STILLS FILES *****
  static async uploadStillsFiles(req, res, next) {
    try {
      const { file } = req;
      const stills = {
        photo: file.filename,
      };
      res.json({
        stills,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  // ***** API FOR UPLOAD TRAILER FILES *****
  static async uploadTrailerFiles(req, res, next) {
    try {
      const { file } = req;
      const trailer = {
        trailer: file.filename,
      };
      res.json({
        trailer,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  // ***** API FOR UPLOAD PHOTO FILES *****
  static async uploadPhotoFiles(req, res, next) {
    try {
      const { file } = req;
      const photo = {
        photo: file.filename,
      };
      res.json({
        photo,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  // ***** API FOR SINGLE MOVIE DATA *****
  static async getSingleMovieData(req, res, next) {
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
          {
            model: MovieStills,
            as: 'stills',
          },
        ],
      });
      res.json({
        movie,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  // ***** API FOR GET MOVIE COUNTRIES *****
  static async getMovieCountries(req, res, next) {
    try {
      const movies = await Movies.findAll();

      const countrySet = new Set();

      movies.forEach((movie) => {
        const countries = movie.details.split(',').map((country) => country.trim());
        countries.forEach((country) => {
          countrySet.add(country);
        });
      });

      const list = Array.from(countrySet);

      res.json({
        list,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

export default MovieC;
