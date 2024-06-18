import { Comments, Movies, Users } from '../models/index.js';

class CommentC {
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
}

export default CommentC;
