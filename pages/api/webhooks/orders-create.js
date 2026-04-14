// pages/api/webhooks/orders-create.js
//
// WHAT THIS DOES:
// Shopify calls this URL automatically every time a customer
// places a new order in any merchant's store.
//
// It does 3 things:
//   1. Verifies the request genuinely came from Shopify (HMAC)
//   2. Saves the order to Supabase
//   3. Returns 200 OK so Shopify knows we received it

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable Next.js body parsing — we need raw body for HMAC
export const config = { api: { bodyParser: false } };

// Read raw body from request
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await getRawBody(req);

  // ── Verify HMAC signature ──────────────────────────────────
  const hmacHeader = req.headers["x-shopify-hmac-sha256"];
  const generatedHmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");

  if (generatedHmac !== hmacHeader) {
    console.error("Webhook HMAC validation failed");
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ── Parse the order data ───────────────────────────────────
  let order;
  try {
    order = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const shopDomain = req.headers["x-shopify-shop-domain"];

  // ── Save order to Supabase ─────────────────────────────────
  const { error } = await supabase.from("orders").upsert({
    shop_domain: shopDomain,
    shopify_order_id: order.id.toString(),
    order_number: order.order_number || order.name,
    customer_name: order.customer
      ? `${order.customer.first_name || ""} ${order.customer.last_name || ""}`.trim()
      : "Guest",
    customer_email: order.email || "",
    total_price: order.total_price,
    currency: order.currency,
    financial_status: order.financial_status,
    fulfillment_status: order.fulfillment_status || "unfulfilled",
    line_items: JSON.stringify(order.line_items || []),
    shipping_address: JSON.stringify(order.shipping_address || {}),
    created_at: order.created_at,
    updated_at: new Date().toISOString(),
  }, { onConflict: "shopify_order_id" });

  if (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ error: "Database error" });
  }

  console.log(`✓ Order ${order.order_number} saved for ${shopDomain}`);
  return res.status(200).json({ success: true });
}
