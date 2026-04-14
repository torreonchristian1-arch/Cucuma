import crypto from "crypto";

export default function handler(req, res) {
  const { shop } = req.query;

  if (!shop || !shop.endsWith(".myshopify.com")) {
    return res.status(400).json({ error: "Missing or invalid shop parameter." });
  }

  const state = crypto.randomBytes(16).toString("hex");

  const scopes = [
    "read_products",
    "write_products",
    "read_orders",
    "write_orders",
    "read_fulfillments",
    "write_fulfillments",
  ].join(",");

  const redirectUri = `${process.env.HOST}/api/auth/callback`;

  const installUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${process.env.SHOPIFY_API_KEY}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`;

  res.setHeader(
    "Set-Cookie",
    `shopify_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  res.redirect(installUrl);
}