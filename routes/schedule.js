import { Router } from 'express';
import ScheduleC from '../controllers/ScheduleC.js';

const router = Router();

router.get('/list', ScheduleC.scheduleList);

export default router;
