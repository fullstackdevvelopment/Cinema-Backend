import { Router } from 'express';
import ScheduleC from '../controllers/ScheduleC.js';
import validateM from '../middlewares/validateM.js';
import schema from '../schemas/schema.js';

const router = Router();

router.post('/create', validateM(schema.createSchedule), ScheduleC.createSchedule);
router.get('/list', ScheduleC.scheduleList);

export default router;
