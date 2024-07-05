import { Router } from 'express';
import users from './users.js';
import admins from './admins.js';
import movie from './movie.js';

const router = Router();

router.use('/users', users);
router.use('/admins', admins);
router.use('/movie', movie);

export default router;
