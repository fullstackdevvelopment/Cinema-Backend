import express, { Router } from 'express';
import PaymentController from '../controllers/PaymentC.js';
import authM from '../middlewares/authM.js';

const router = Router();

// ***** PAYMENT API *****
router.post('/create-payment-intent', authM, PaymentController.createPaymentIntent);
router.post('/create-checkout-session', authM, PaymentController.createCheckoutSession);
router.post('/update-payment-status', PaymentController.updatePaymentStatus);
router.post('/webhook', express.raw({ type: 'application/json' }), PaymentController.handleWebhook);

export default router;
