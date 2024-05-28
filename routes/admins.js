import { Router } from 'express';
import validateM from '../middlewares/validateM.js';
import schema from '../schemas/schema.js';
import MovieC from '../controllers/MovieC.js';
import isAdminM from '../middlewares/isAdminM.js';
import BookingC from '../controllers/BookingC.js';
import CategoryC from '../controllers/CategoryC.js';
import CommentC from '../controllers/CommentC.js';
import UserC from '../controllers/UserC.js';
import corsM from '../middlewares/corsM.js';
import upload from '../middlewares/multerM.js';

const router = Router();

router.use('/movie/create', corsM);
// ***** LOGIN API FOR ADMIN *****
router.post('/login', UserC.login);

// ***** DASHBOARD API ***** // ***** USERS LIST API *****
router.get('/booking/list', isAdminM, BookingC.getBookingList);
router.get('/user/list', isAdminM, UserC.userList);

// ***** MOVIE LIST API *****
router.post('/upload/file', isAdminM, upload.single('file'), MovieC.uploadFiles);
router.post('/movie/create', upload.fields([
  { name: 'files', maxCount: 10 },
]), MovieC.createMovie);
router.get('/movie/list', MovieC.getMovieList);
router.put('/movie/change/:movieId', isAdminM, upload.array('files', 20), validateM(schema.createMovie), MovieC.changeMovie);
router.post('/category/create', isAdminM, CategoryC.createCategory);
router.put('/category/delete/:categoryId', isAdminM, CategoryC.deleteCategory);
router.get('/category/list', isAdminM, CategoryC.getCategoryList);

// ***** API FOR REVIEW LIST *****
router.get('/review/list', isAdminM, CommentC.getCommentList);
router.put('/review/delete/:commentId', isAdminM, CommentC.deleteComment);

export default router;
