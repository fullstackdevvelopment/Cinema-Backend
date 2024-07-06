import { Router } from 'express';
import CategoryC from '../controllers/CategoryC.js';

const router = Router();

router.get('/list', CategoryC.getCategoryList);

export default router;
