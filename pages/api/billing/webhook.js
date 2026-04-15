import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { buffer } from "micro";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  switch (event.type) {
    case "checkout.session.completed": {
      const { shop, planId } = session.metadata || {};
      if (shop && planId) {
        await supabase.from("merchants").update({
          plan: planId,
          plan_status: "active",
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          plan_started_at: new Date().toISOString(),
        }).eq("shop_domain", shop);
      }
      break;
    }
    case "customer.subscription.deleted": {
      // Subscription cancelled
      const subscriptionId = session.id;
      await supabase.from("merchants").update({
        plan: "free",
        plan_status: "cancelled",
        stripe_subscription_id: null,
      }).eq("stripe_subscription_id", subscriptionId);
      break;
    }
    case "invoice.payment_failed": {
      const subscriptionId = session.subscription;
      await supabase.from("merchants").update({
        plan_status: "past_due",
      }).eq("stripe_subscription_id", subscriptionId);
      break;
    }
    case "invoice.paid": {
      const subscriptionId = session.subscription;
      await supabase.from("merchants").update({
        plan_status: "active",
      }).eq("stripe_subscription_id", subscriptionId);
      break;
    }
  }

  return res.status(200).json({ received: true });
}
