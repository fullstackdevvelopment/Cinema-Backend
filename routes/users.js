import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import validate from '../middlewares/validate.js';
import schema from '../schemas/userSchema.js';

const router = Router();

router.post('/create', validate(schema.create), UserController.create);

export default router;
