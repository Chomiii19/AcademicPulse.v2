import Stripe from "stripe";
import { Request } from "express";

class CheckoutService {
  async stripeConfig(email: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url:
        "https://academicpulse.onrender.com/app/checkout-full-access/success",
      cancel_url: "https://academicpulse.onrender.com/app",
      customer_email: email,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: "AcademicPulse Full Feature Access",
              description:
                "Get access to your own server with its own database. Allow up to 1000 requests per hour.",
            },
            unit_amount: 49900,
          },
          quantity: 1,
        },
      ],
    });

    return session;
  }
}

export default new CheckoutService();
