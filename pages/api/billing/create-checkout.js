import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
  starter_yearly: process.env.STRIPE_PRICE_STARTER_YEARLY,
  growth_monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY,
  growth_yearly: process.env.STRIPE_PRICE_GROWTH_YEARLY,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { shop, planId, period = "monthly" } = req.body;

  if (!shop || !planId) {
    return res.status(400).json({ error: "Missing shop or planId" });
  }

  const priceKey = `${planId}_${period}`;
  const priceId = PRICE_IDS[priceKey];

  if (!priceId) {
    return res.status(400).json({ error: "Invalid plan or period" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.HOST}/dashboard?shop=${shop}&billing=success`,
      cancel_url: `${process.env.HOST}/billing?shop=${shop}&billing=cancelled`,
      metadata: { shop, planId, period },
      subscription_data: {
        metadata: { shop, planId },
        trial_period_days: 14,
      },
      customer_email: undefined, // Optionally pre-fill from merchant data
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: err.message });
  }
}
