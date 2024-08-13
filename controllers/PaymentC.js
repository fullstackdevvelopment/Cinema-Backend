import HttpError from 'http-errors';
import PaymentService from '../services/paymentService.js';

class PaymentController {
  static async createPaymentIntent(req, res, next) {
    try {
      const { amount, currency } = req.body;
      const { userId } = req.user;

      if (!userId) {
        throw new HttpError(400, 'User ID is required');
      }

      const {
        clientSecret,
        payment,
      } = await PaymentService.createPaymentIntent(amount, currency, userId);

      res.json({ clientSecret, payment });
    } catch (error) {
      next(error);
    }
  }

  static async createCheckoutSession(req, res, next) {
    try {
      const { amount, currency } = req.body;
      const { userId } = req.user;

      if (!userId) {
        throw new HttpError(400, 'User ID is required');
      }

      const { sessionId } = await PaymentService.createCheckoutSession(amount, currency, userId);

      res.json({ sessionId });
    } catch (error) {
      next(error);
    }
  }

  static async updatePaymentStatus(req, res, next) {
    try {
      const { stripePaymentId, status } = req.body;

      const payment = await PaymentService.updatePaymentStatus(stripePaymentId, status);

      res.json({ payment });
    } catch (error) {
      next(error);
    }
  }

  static async handleWebhook(req, res, next) {
    try {
      const sig = req.headers['stripe-signature'];
      const event = PaymentService.constructEvent(req.body, sig);

      await PaymentService.handleStripeWebhook(event);

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}

export default PaymentController;
