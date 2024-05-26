import { Router } from 'express';
import users from './users.js';
import admins from './admins.js';
import movies from './movies.js';

const router = Router();

router.use('/users', users);
router.use('/admins', admins);
router.use('/movies', movies);

export default router;
