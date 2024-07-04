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

// ***** PRIVATE ROUTES ***** NEED TOKEN *****
router.put('/update', UserC.userUpdate);

export default router;
