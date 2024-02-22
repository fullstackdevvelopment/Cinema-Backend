import { Router } from 'express';
import multer from 'multer';
import { v4 as idV4 } from 'uuid';
import HttpError from 'http-errors';
import AdminController from '../controllers/AdminController.js';
import validate from '../middlewares/validate.js';
import schema from '../schemas/schema.js';

const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const fileName = `${idV4()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpeg', 'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(HttpError('Invalid File Type'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

// ***** ONLY ADMINS ROUTES ***** NEED ADMIN TOKEN *****
router.get('/ticket/list', AdminController.getTicketList);
router.post('/movie/create', upload.fields([
  { name: 'moviePhoto', maxCount: 1 },
  { name: 'actorPhoto1', maxCount: 1 },
  { name: 'actorPhoto2', maxCount: 1 },
  { name: 'actorPhoto3', maxCount: 1 },
  { name: 'actorPhoto4', maxCount: 1 },
  { name: 'actorPhoto5', maxCount: 1 },
  { name: 'actorPhoto6', maxCount: 1 },
  { name: 'actorPhoto7', maxCount: 1 },
  { name: 'trailer', maxCount: 1 },
]), validate(schema.createMovie), AdminController.createMovieList);

router.get('/movie/list', AdminController.getMovieList);
router.get('/review/list', AdminController.getReviewList);

export default router;
