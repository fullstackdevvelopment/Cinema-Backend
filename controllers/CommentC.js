import HttpError from 'http-errors';
import {
  Comments, Movies, Photos, Users,
} from '../models/index.js';

class CommentC {
  // ***** API FOR GET CREATE COMMENT *****
  static async createComments(req, res, next) {
    try {
      const { userId, movieId } = req.params;
      const { commentText, rating } = req.body;

      if (!commentText && !rating && !userId && !movieId) {
        throw HttpError(400, 'Missing required fields');
      }

      const user = await Users.findByPk(userId);
      const movies = await Movies.findByPk(movieId);

      if (!user) {
        throw HttpError(404, 'User not found');
      }

      if (!movies) {
        throw HttpError(404, 'Movie not found');
      }

      const newComment = await Comments.create({
        commentText,
        rating,
        userId,
        movieId,
      });

      res.json({
        status: 'Success',
        newComment,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  // ***** API FOR GET LIST COMMENT *****
  static async getCommentList(req, res, next) {
    try {
      const { page = 1, limit = 4 } = req.query;
      const count = await Comments.count();

      const list = await Comments.findAll({
        include: [
          {
            model: Users,
            as: 'users',
            attributes: ['id', 'firstName', 'lastName', 'userName', 'email', 'photo'],
          },
          {
            model: Movies,
            as: 'movies',
            attributes: ['id', 'title'],
            include: {
              model: Photos,
              as: 'photos',
            },
          },
        ],
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        status: 'ok',
        list,
        limit,
        page,
        totalPages,
        count,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** API FOR DELETE COMMENT *****
  static async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const comment = await Comments.findByPk(commentId);

      await comment.destroy();

      res.json({
        message: 'Comment successfully deleted',
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** API FOR GET SINGLE MOVIE COMMENTS *****
  static async getCommentsMovie(req, res, next) {
    try {
      const { movieId } = req.params;
      console.log(movieId);

      const list = await Comments.findAll({
        where: {
          movieId,
        },
        include: [
          {
            model: Users,
            as: 'users',
            attributes: ['id', 'firstName', 'lastName', 'userName', 'email', 'photo'],
          },
          {
            model: Movies,
            as: 'movies',
            attributes: ['id', 'voters'],
          },
        ],
      });
      res.json({
        status: 'ok',
        list,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default CommentC;
