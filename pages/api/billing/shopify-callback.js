// pages/api/billing/shopify-callback.js
// Called by Shopify after merchant approves or cancels subscription

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { shop, plan, charge_id } = req.query;

  if (!shop) return res.redirect(302, "/");

  if (!charge_id) {
    // Merchant cancelled
    await supabase.from("merchants").update({
      plan: "free",
      plan_status: "cancelled",
      shopify_subscription_id: null,
    }).eq("shop_domain", shop);

    return res.redirect(302, `/billing?shop=${shop}&status=cancelled`);
  }

  // Verify the charge with Shopify
  try {
    const { data: merchant } = await supabase
      .from("merchants")
      .select("access_token")
      .eq("shop_domain", shop)
      .single();

    if (merchant?.access_token) {
      const response = await fetch(
        `https://${shop}/admin/api/2024-01/recurring_application_charges/${charge_id}.json`,
        {
          headers: { "X-Shopify-Access-Token": merchant.access_token },
        }
      );
      const data = await response.json();
      const charge = data.recurring_application_charge;

      if (charge?.status === "active" || charge?.status === "accepted") {
        await supabase.from("merchants").update({
          plan: plan || "starter",
          plan_status: "active",
          shopify_charge_id: charge_id,
          plan_started_at: new Date().toISOString(),
        }).eq("shop_domain", shop);

        return res.redirect(302, `/dashboard?shop=${shop}&billing=success`);
      }
    }
  } catch (err) {
    console.error("Billing callback error:", err);
  }

  return res.redirect(302, `/billing?shop=${shop}&status=error`);
}