import { Router } from 'express';
import CommentC from '../controllers/CommentC.js';
import validateM from '../middlewares/validateM.js';
import schema from '../schemas/schema.js';

const router = Router();

// ***** REVIEW API *****
router.get('/list/:movieId', CommentC.getCommentsMovie);
router.post('/create/:userId/:movieId', validateM(schema.createComment), CommentC.createComments);

export default router;
