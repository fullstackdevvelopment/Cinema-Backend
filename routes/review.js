import { Router } from 'express';
import CommentC from '../controllers/CommentC.js';

const router = Router();

// ***** REVIEW API *****
router.get('/list/:movieId', CommentC.getCommentsMovie);
router.post('/create/:userId/:movieId', CommentC.createComments);

export default router;
