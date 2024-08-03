import { Router } from 'express';
import validateM from '../middlewares/validateM.js';
import schema from '../schemas/schema.js';
import MovieC from '../controllers/MovieC.js';
import isAdminM from '../middlewares/isAdminM.js';
import BookingC from '../controllers/BookingC.js';
import CategoryC from '../controllers/CategoryC.js';
import CommentC from '../controllers/CommentC.js';
import UserC from '../controllers/UserC.js';
import upload from '../middlewares/multerM.js';
import ScheduleC from '../controllers/ScheduleC.js';

const router = Router();

// ***** LOGIN API FOR ADMIN *****
router.post('/login', UserC.loginAdmin);
router.get('/data', isAdminM, UserC.adminData);

router.get('/schedule/list', isAdminM, ScheduleC.scheduleList);
router.post('/schedule/create', isAdminM, validateM(schema.createSchedule), ScheduleC.createSchedule);
router.put('/schedule/delete/:scheduleId', isAdminM, ScheduleC.deleteSchedule);

// ***** DASHBOARD API ***** // ***** USERS LIST API *****
router.get('/booking/list', isAdminM, BookingC.getBookingList);
router.get('/tickets/list', isAdminM, BookingC.getTicketList);
router.get('/user/list', isAdminM, UserC.userList);

// ***** MOVIE LIST API *****
router.post('/upload/file', isAdminM, upload.single('file'), MovieC.uploadActorFiles);
router.post('/upload/stills', isAdminM, upload.single('file'), MovieC.uploadStillsFiles);
router.post('/upload/photo', isAdminM, upload.single('file'), MovieC.uploadPhotoFiles);
router.post('/upload/trailer', isAdminM, upload.single('file'), MovieC.uploadTrailerFiles);

router.post('/movie/create', isAdminM, validateM(schema.movieCreateAndUpdate), MovieC.createMovie);
router.get('/movie/list', MovieC.getMovieList);
router.put('/movie/change/:movieId', isAdminM, validateM(schema.movieCreateAndUpdate), MovieC.changeMovie);
router.get('/movie/single/:movieId', isAdminM, MovieC.getSingleMovieData);
router.put('/movie/delete/:movieId', isAdminM, MovieC.deleteMovie);

router.post('/category/create', isAdminM, CategoryC.createCategory);
router.put('/category/delete/:categoryId', isAdminM, CategoryC.deleteCategory);
router.get('/category/list', isAdminM, CategoryC.getCategoryList);

// ***** API FOR REVIEW LIST *****
router.get('/review/list', isAdminM, CommentC.getCommentList);
router.put('/review/delete/:commentId', isAdminM, CommentC.deleteComment);

export default router;
