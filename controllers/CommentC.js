import { Comments, Movies, Users } from '../models/index.js';

class CommentC {
  // ***** API FOR GET LIST COMMENT *****
  static async getCommentList(req, res, next) {
    try {
      const comments = await Comments.findAll({
        include: [
          {
            model: Users,
            as: 'user',
          },
          {
            model: Movies,
            as: 'movie',
          },
        ],
      });

      res.json({
        message: 'Ok',
        comments,
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
