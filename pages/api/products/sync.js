// ─────────────────────────────────────────────────────────────────
// FILE 1: pages/api/products/sync.js
//
// WHAT THIS DOES:
// This is a server-side API route that fetches all products
// from the merchant's Shopify store using their saved access token.
// It reads the shop domain from the request, looks up the token
// in Supabase, then calls the Shopify Products API.
// ─────────────────────────────────────────────────────────────────

// ============================================================
// FILE 1 — pages/api/products/sync.js
// ============================================================

/*
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { shop } = req.query;

  if (!shop) {
    return res.status(400).json({ error: "Missing shop parameter" });
  }

  // 1. Get the merchant's access token from Supabase
  const { data: merchant, error } = await supabase
    .from("merchants")
    .select("access_token")
    .eq("shop_domain", shop)
    .single();

  if (error || !merchant) {
    return res.status(404).json({ error: "Merchant not found" });
  }

  // 2. Fetch products from Shopify
  try {
    const response = await fetch(
      `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/products.json?limit=50`,
      {
        headers: {
          "X-Shopify-Access-Token": merchant.access_token,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.products) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    // 3. Return the products to the frontend
    return res.status(200).json({ products: data.products });

  } catch (err) {
    console.error("Shopify products fetch error:", err);
    return res.status(500).json({ error: "Network error fetching products" });
  }
}
*/


// ============================================================
// FILE 2 — pages/catalogue.js
// ============================================================
// Copy everything below this line into pages/catalogue.js
// ============================================================