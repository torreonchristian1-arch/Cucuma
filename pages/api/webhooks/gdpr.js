// pages/api/webhooks/gdpr.js
// MANDATORY for Shopify App Store submission
// Handles all 3 required GDPR webhook endpoints

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const topic = req.headers["x-shopify-topic"];

  // All 3 GDPR webhooks must return 200 OK
  // Even if you don't store customer data, these endpoints must exist

  switch (topic) {
    case "customers/data_request":
      // Customer requests their data
      // If you store customer data, you'd email it here
      // Cucuma doesn't store PII beyond order data from Shopify
      console.log("GDPR: Customer data request received");
      return res.status(200).json({ message: "Data request received" });

    case "customers/redact":
      // Customer requests data deletion
      // Delete any stored customer PII here
      console.log("GDPR: Customer redact request received");
      return res.status(200).json({ message: "Redact request received" });

    case "shop/redact":
      // Shop owner uninstalled app — delete all their data
      // In production: delete from Supabase where shop_domain = shop
      const shop = req.body?.domain;
      console.log("GDPR: Shop redact request for", shop);
      return res.status(200).json({ message: "Shop data redact request received" });

    default:
      return res.status(200).json({ message: "Webhook received" });
  }
}