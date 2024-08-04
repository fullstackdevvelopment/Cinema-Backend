import { Router } from 'express';
import EmailC from '../controllers/EmailC.js';
import schema from '../schemas/schema.js';
import validateM from '../middlewares/validateM.js';

const router = Router();

// ***** EMAIL API *****
router.post('/send', validateM(schema.sendEmail), EmailC.sendEmail);

export default router;
