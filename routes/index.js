import { Router } from 'express';
import users from './users.js';
import admins from './admins.js';
import movie from './movie.js';
import category from './category.js';
import schedule from './schedule.js';

const router = Router();

router.use('/users', users);
router.use('/admins', admins);
router.use('/movie', movie);
router.use('/category', category);
router.use('/schedule', schedule);

export default router;
