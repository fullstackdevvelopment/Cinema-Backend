import HttpError from 'http-errors';
import {
  Op, Sequelize,
} from 'sequelize';
import {
  Actors,
  Bookings,
  Categories,
  Comments,
  MovieCategories,
  Movies,
  MovieStills,
  Photos,
  Schedule,
  Trailers,
} from '../models/index.js';
import sequelize from '../services/sequelize.js';

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
        title,
        details,
        language,
        releaseDate,
        director,
        storyLine,
        duration,
        categories,
        actors,
        stills,
        files,
        status,
      } = req.body;

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
        rating: 0,
        duration,
        voters: 0,
        status,
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

  // ***** UPDATE MOVIE API ONLY FOR ADMIN *****
  static async changeMovie(req, res, next) {
    try {
      const {
        title,
        details,
        language,
        releaseDate,
        director,
        storyLine,
        duration,
        categories,
        actors,
        stills,
        files,
        status,
      } = req.body;

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
        duration,
        status,
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

  // ***** DELETE MOVIE API ONLY FOR ADMIN
  static async deleteMovie(req, res, next) {
    try {
      const { movieId } = req.params;

      if (!movieId) {
        throw HttpError(400, 'movieId not provided');
      }

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

      const transaction = await sequelize.transaction();

      try {
        await Movies.destroy({
          where: { id: movieId },
          transaction,
        });
        await Photos.destroy({
          where: { movieId },
          transaction,
        });
        await Trailers.destroy({
          where: { movieId },
          transaction,
        });
        await Actors.destroy({
          where: { movieId },
          transaction,
        });
        await MovieCategories.destroy({
          where: { movieId },
          transaction,
        });
        await MovieStills.destroy({
          where: { movieId },
          transaction,
        });
        await Bookings.destroy({
          where: { movieId },
          transaction,
        });
        await Comments.destroy({
          where: { movieId },
          transaction,
        });
        await Schedule.destroy({
          where: { movieId },
          transaction,
        });

        await transaction.commit();
        res.status(200)
          .json({
            message: 'Movie deleted successfully!',
          });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (e) {
      next(e);
    }
  }

  // ***** GET MOVIE LIST API ONLY FOR ADMIN *****
  static async getMovieList(req, res, next) {
    try {
      const movies = await Movies.findAll({
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
      const list = {};
      list.listFilterByLatest = movies.filter((item) => item.status === 'Latest');
      list.listFilterByComingSoon = movies.filter((item) => item.status === 'Coming Soon');
      list.listFilterByFeaturedMovies = movies.filter((item) => item.status === 'Featured movies');
      list.allMovies = movies;

      res.json({
        list,
        status: 'ok',
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async getFilteredMovieList(req, res, next) {
    try {
      const {
        limit = 9,
        s = '',
        filterBy = 'title',
        sortOrder = 'ASC',
        title = '',
        categoryIds = '',
        countries = '',
        years = '',
      } = req.query;
      let { page = 1 } = req.query;

      if (title || categoryIds || countries || years) {
        page = 1;
      }

      const categoryIdsArray = Array.isArray(categoryIds)
        ? categoryIds.map((id) => parseInt(id, 10)).filter((id) => !Number.isNaN(id))
        : [parseInt(categoryIds, 10)].filter((id) => !Number.isNaN(id));

      const countriesArray = Array.isArray(countries)
        ? countries.map((country) => country.trim()).filter(Boolean)
        : [countries.trim()].filter(Boolean);

      const yearsArray = Array.isArray(years)
        ? years.map((year) => parseInt(year, 10)).filter((year) => !Number.isNaN(year))
        : [parseInt(years, 10)].filter((year) => !Number.isNaN(year));

      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);
      const parsedSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      const where = {
        [Op.and]: [],
      };

      if (s) {
        where[Op.and].push({
          [Op.or]: [
            { title: { [Op.like]: `%${s}%` } },
            { releaseDate: { [Op.like]: `%${s}%` } },
            { details: { [Op.like]: `%${s}%` } },
          ],
        });
      }

      if (title) {
        where[Op.and].push({ title: { [Op.like]: `%${title}%` } });
      }

      if (countriesArray.length > 0) {
        where[Op.and].push({
          [Op.or]: countriesArray.map((country) => ({
            details: { [Op.like]: `%${country}%` },
          })),
        });
      }

      if (yearsArray.length > 0) {
        where[Op.and].push(
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('releaseDate')), {
            [Op.in]: yearsArray,
          }),
        );
      }

      const include = [];

      if (categoryIdsArray.length > 0) {
        include.push({
          model: Categories,
          as: 'categories',
          attributes: ['id', 'name'],
          where: { id: { [Op.in]: categoryIdsArray } },
        });
      }

      const list = await Movies.findAll({
        where,
        attributes: ['id', 'title', 'rating', 'voters', 'releaseDate'],
        include: [
          ...include,
          {
            model: Photos,
            as: 'photos',
            attributes: ['id', 'moviePhoto'],
          },
          {
            model: Categories,
            as: 'categories',
            attributes: ['id', 'name'],
          },
        ],
        order: [[filterBy, parsedSortOrder]],
        limit: parsedLimit,
        offset: (parsedPage - 1) * parsedLimit,
      });

      const count = await Movies.count({
        where,
        include,
      });

      const totalPages = Math.ceil(count / parsedLimit);

      list.forEach((movie) => {
        if (movie.stills) {
          movie.stills.sort((a, b) => a.id - b.id);
        }
      });

      res.json({
        list,
        limit: parsedLimit,
        page: parsedPage,
        totalPages,
      });
    } catch (e) {
      console.log(e);
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
        const countries = movie.details.split(',')
          .map((country) => country.trim());
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
