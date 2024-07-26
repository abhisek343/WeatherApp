import express, { Router, Request, Response } from "express";
import Payment, { IPayment } from "../models/payment";
import Stripe from "stripe";

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || "";
if (!stripeSecretKey) {
  console.error("🚫 STRIPE_SECRET_KEY is not defined in environment variables.");
  // Decide if to throw an error or let Stripe SDK handle it
  // process.exit(1); 
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20", // Specify a Stripe API version
});

const router: Router = express.Router();

interface PaymentRequestBody {
  amount: number; // Amount in smallest currency unit (e.g., paise for INR)
  paymentMethodId: string;
}

// Process a payment
router.post("/:orderId", async (req: Request<{ orderId: string }, any, PaymentRequestBody>, res: Response) => {
  const { orderId } = req.params;
  const { amount, paymentMethodId } = req.body;

  try {
    // Create a charge using Stripe
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: "inr", // Use lowercase 'inr'
      payment_method: paymentMethodId,
      confirm: true,
      // automatic_payment_methods: { enabled: true, allow_redirects: 'never' }, // Consider for SCA
      return_url: "http://localhost/payment-success", // Required for some payment methods when confirm:true
    };
    
    // Check if payment_method is of type card, if so, set setup_future_usage
    // This is a common pattern but might need adjustment based on exact paymentMethodId format/type
    if (paymentMethodId && paymentMethodId.startsWith("pm_card_")) {
        paymentIntentParams.setup_future_usage = 'off_session';
    }


    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    const paymentDoc: IPayment = new Payment({
      orderId,
      amount, // Store amount as passed, or convert if Stripe returns a different format
      status: paymentIntent.status, // e.g., "succeeded", "requires_action"
      paymentMethod: "stripe", // Or derive from paymentIntent.payment_method_types
      // paymentDate is defaulted by schema
    });

    await paymentDoc.save();

    res.status(201).json(paymentDoc);
  } catch (err: any) {
    console.error("Payment failed:", err);
    let errorMessage = "Payment failed";
    if (err instanceof Stripe.errors.StripeError) {
        errorMessage = err.message;
    }
    res.status(500).send(errorMessage);
  }
});

// Get payment by ID
router.get("/:paymentId", async (req: Request<{ paymentId: string }>, res: Response) => {
  const { paymentId } = req.params;

  try {
    const payment: IPayment | null = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ msg: "Payment not found" });

    res.json(payment);
  } catch (err: any) {
    console.error("Error fetching payment by ID:", err);
    res.status(500).send("Server error");
  }
});

// Get payments for an order
router.get("/order/:orderId", async (req: Request<{ orderId: string }>, res: Response) => {
  const { orderId } = req.params;

  try {
    const payments: IPayment[] = await Payment.find({ orderId });
    res.json(payments);
  } catch (err: any) {
    console.error("Error fetching payments for order:", err);
    res.status(500).send("Server error");
  }
});

export default router;
