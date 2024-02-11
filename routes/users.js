import { Router } from 'express';
import multer from 'multer';
import HttpError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import UserController from '../controllers/UserController.js';
import validate from '../middlewares/validate.js';
import schema from '../schemas/userSchema.js';

const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const fileName = `${uuidv4()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(HttpError('Invalid File Type'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.post(
  '/create',
  upload.single('photo'),
  validate(schema.create),
  UserController.create,
);

export default router;
