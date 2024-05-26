import multer from 'multer';
import { v4 as idV4 } from 'uuid';
import HttpError from 'http-errors';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const fileName = `${idV4()}-${file.originalname}`;
      cb(null, fileName);
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(HttpError(400, 'Invalid File Type'));
      }
    },
    destination: path.resolve('./public'),
  }),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export default upload;
