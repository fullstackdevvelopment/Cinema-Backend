import { Router } from 'express';
import CategoryC from '../controllers/CategoryC.js';

const router = Router();

// ***** CATEGORY API *****
router.get('/list', CategoryC.getCategoryList);

export default router;
