import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { shop, hmac, code, state } = req.query;

  // Validate HMAC
  const params = { ...req.query };
  delete params.hmac;
  delete params.signature;

  const message = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join("&");
  const generatedHmac = crypto.createHmac("sha256", process.env.SHOPIFY_API_SECRET).update(message).digest("hex");

  if (generatedHmac !== hmac) {
    return res.status(403).send("Invalid HMAC");
  }

  // Exchange code for access token
  let accessToken;
  try {
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: process.env.SHOPIFY_API_KEY, client_secret: process.env.SHOPIFY_API_SECRET, code }),
    });
    const tokenData = await tokenRes.json();
    accessToken = tokenData.access_token;
  } catch (err) {
    return res.status(500).send("Token exchange failed");
  }

  if (!accessToken) return res.status(400).send("No access token");

  // Check if new merchant
  const { data: existing } = await supabase.from("merchants").select("shop_domain, onboarding_completed").eq("shop_domain", shop).single();
  const isNewMerchant = !existing;

  // Save merchant
  await supabase.from("merchants").upsert({
    shop_domain: shop,
    access_token: accessToken,
    scopes: "read_products,write_products,read_orders,write_orders",
    installed_at: new Date().toISOString(),
    onboarding_completed: existing?.onboarding_completed || false,
  }, { onConflict: "shop_domain" });

  // Register webhooks (including GDPR)
  const webhooks = [
    "orders/create", "orders/fulfilled", "orders/cancelled",
    "customers/data_request", "customers/redact", "shop/redact"
  ];
  for (const topic of webhooks) {
    const path = topic.includes("customers") || topic.includes("shop/redact")
      ? "gdpr" : `orders-${topic.split("/")[1]}`;
    try {
      await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
        body: JSON.stringify({ webhook: { topic, address: `${process.env.HOST}/api/webhooks/${path}`, format: "json" } }),
      });
    } catch {}
  }

  // New merchants → onboarding, existing → dashboard
  const dest = isNewMerchant ? `/onboarding?shop=${shop}` : `/dashboard?shop=${shop}`;
  return res.redirect(302, dest);
} 