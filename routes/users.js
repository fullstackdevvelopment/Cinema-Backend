import { Router } from 'express';
import multer from 'multer';
import HttpError from 'http-errors';
import { v4 as idV4 } from 'uuid';
import UserC from '../controllers/UserC.js';
import validateM from '../middlewares/validateM.js';
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
router.post('/register', upload.single('photo'), validateM(schema.createUser), UserC.register);
router.post('/login', UserC.login);

// ***** PRIVATE ROUTES ***** NEED TOKEN *****
router.put('/update', UserC.userUpdate);

export default router;
