// pages/api/webhooks/orders-fulfilled.js
//
// WHAT THIS DOES:
// Shopify calls this when an order is marked as fulfilled/shipped.
// We update the order status in Supabase to "fulfilled".

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = { api: { bodyParser: false } };

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

  const hmacHeader = req.headers["x-shopify-hmac-sha256"];
  const generatedHmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");

  if (generatedHmac !== hmacHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let order;
  try { order = JSON.parse(rawBody); }
  catch { return res.status(400).json({ error: "Invalid JSON" }); }

  const { error } = await supabase
    .from("orders")
    .update({
      fulfillment_status: "fulfilled",
      financial_status: order.financial_status,
      updated_at: new Date().toISOString(),
    })
    .eq("shopify_order_id", order.id.toString());

  if (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: "Database error" });
  }

  console.log(`✓ Order ${order.order_number} marked fulfilled`);
  return res.status(200).json({ success: true });
}
