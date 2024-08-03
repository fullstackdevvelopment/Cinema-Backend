import { Router } from 'express';
import UserC from '../controllers/UserC.js';
import validateM from '../middlewares/validateM.js';
import schema from '../schemas/schema.js';
import upload from '../middlewares/multerM.js';

const router = Router();

// ***** PUBLIC ROUTES *****
router.post('/register', upload.single('photo'), validateM(schema.createUser), UserC.register);
router.post('/login', validateM(schema.login), UserC.login);
router.post('/single', UserC.userData);
router.post('/verifications', UserC.userVerification);
router.post('/reset/password', validateM(schema.resetPassword), UserC.resetPassword);
router.post('/reset/password/:verificationCode', validateM(schema.resetPasswordFinished), UserC.resetPasswordFinished);
router.post('/pdf/upload', upload.single('pdf'), UserC.ticketPdfUpload);

// ***** PRIVATE ROUTES ***** NEED TOKEN *****
router.put('/update', upload.single('photo'), validateM(schema.updateUser), UserC.userUpdate);

export default router;
