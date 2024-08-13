// eslint-disable-next-line import/no-extraneous-dependencies
import Stripe from 'stripe';
import Payment from '../models/Payment.js';

const {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY);

class PaymentService {
  static async createPaymentIntent(amount, currency, userId) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
      });

      const payment = await Payment.create({
        amount,
        currency,
        stripePaymentId: paymentIntent.id,
        status: 'pending',
        userId,
      });

      return { clientSecret: paymentIntent.client_secret, payment };
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  static async createCheckoutSession(amount, currency, userId) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency,
            product_data: {
              name: 'Your Product Name',
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.CLIENT_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/cancel`,
        metadata: { userId },
      });

      return { sessionId: session.id };
    } catch (error) {
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  static async updatePaymentStatus(stripePaymentId, status) {
    try {
      const payment = await Payment.findOne({ where: { stripePaymentId } });
      if (!payment) {
        throw new Error('Payment not found');
      }

      payment.status = status;
      await payment.save();

      return payment;
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }

  static async handleStripeWebhook(event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          // eslint-disable-next-line no-case-declarations
          const session = event.data.object;
          await this.updatePaymentStatus(session.id, 'succeeded');
          break;
        case 'payment_intent.succeeded':
          // eslint-disable-next-line no-case-declarations
          const paymentIntent = event.data.object;
          await this.updatePaymentStatus(paymentIntent.id, 'succeeded');
          break;
        case 'payment_intent.payment_failed':
          // eslint-disable-next-line no-case-declarations
          const failedPaymentIntent = event.data.object;
          await this.updatePaymentStatus(failedPaymentIntent.id, 'failed');
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      throw new Error(`Failed to handle Stripe webhook: ${error.message}`);
    }
  }

  static constructEvent(payload, sig) {
    try {
      return stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      throw new Error(`Failed to construct Stripe event: ${error.message}`);
    }
  }
}

export default PaymentService;
