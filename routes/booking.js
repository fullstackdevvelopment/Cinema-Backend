import { Router } from 'express';
import BookingC from '../controllers/BookingC.js';
import TicketPDFC from '../controllers/TicketPDFC.js';

const router = Router();

router.post('/create', BookingC.createBooking);
router.post('/finalize', TicketPDFC.finalizeBooking);

export default router;
