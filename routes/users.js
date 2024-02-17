import { Router } from 'express';
import multer from 'multer';
import HttpError from 'http-errors';
import { v4 as idV4 } from 'uuid';
import UserController from '../controllers/UserController.js';
import validate from '../middlewares/validate.js';
import schema from '../schemas/userSchema.js';

const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const fileName = `${idV4()}-${file.originalname}`;
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

// ***** PUBLIC ROUTES *****
router.post('/register', upload.single('photo'), validate(schema.create), UserController.register);
router.get('/list', UserController.userList);
router.post('/login', UserController.login);

// ***** PRIVATE ROUTES ***** NEED TOKEN *****
router.put('/update', UserController.userUpdate);
router.delete('/delete', UserController.userDelete);
router.put('/password', UserController.userChangePassword);
router.post('/forgot', UserController.userForgotPassword);

export default router;
