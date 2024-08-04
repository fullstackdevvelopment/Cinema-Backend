import { Router } from 'express';
import UserC from '../controllers/UserC.js';
import validateM from '../middlewares/validateM.js';
import schema from '../schemas/schema.js';
import upload from '../middlewares/multerM.js';

const router = Router();

// ***** PUBLIC ROUTES *****

// ***** USER API *****
router.post('/register', upload.single('photo'), validateM(schema.createUser), UserC.register);
router.post('/login', validateM(schema.login), UserC.login);

// ***** USER VERIFICATION API *****
router.post('/verifications', UserC.userVerification);

// ***** USER PASSWORD API *****
router.post('/reset/password', validateM(schema.resetPassword), UserC.resetPassword);
router.post('/reset/password/:verificationCode', validateM(schema.resetPasswordFinished), UserC.resetPasswordFinished);

// ***** USER TICKET PDF UPLOAD API *****
router.post('/pdf/upload', upload.single('pdf'), UserC.ticketPdfUpload);

// ***** PRIVATE ROUTES ***** NEED TOKEN *****

// ***** USER DATA API *****
router.post('/single', UserC.userData);
router.put('/update', upload.single('photo'), validateM(schema.updateUser), UserC.userUpdate);

export default router;
