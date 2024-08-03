import { Router } from 'express';
import users from './users.js';
import admins from './admins.js';
import movie from './movie.js';
import category from './category.js';
import schedule from './schedule.js';
import review from './review.js';
import payment from './payment.js';
import booking from './booking.js';
import email from './email.js';

const router = Router();

router.use('/users', users);
router.use('/admins', admins);
router.use('/movie', movie);
router.use('/category', category);
router.use('/schedule', schedule);
router.use('/review', review);
router.use('/payment', payment);
router.use('/booking', booking);
router.use('/email', email);

export default router;
