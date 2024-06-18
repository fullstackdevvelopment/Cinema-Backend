import { Router } from 'express';
import users from './users.js';
import admins from './admins.js';

const router = Router();

router.use('/users', users);
router.use('/admins', admins);

export default router;
