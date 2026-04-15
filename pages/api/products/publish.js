// ─────────────────────────────────────────────────────────────────
// FILE: pages/api/products/publish.js
//
// WHAT THIS FILE DOES (plain English):
// When a merchant clicks "Publish to Store" on a product,
// this API route runs on the SERVER.
//
// It does 4 things:
//   1. Gets the merchant's access token from Supabase
//   2. Gets their branding (brand name, colors) from Supabase
//   3. Creates the product in their Shopify store via the API
//   4. Saves the published product record to Supabase
//   5. Returns success or error back to the frontend
// ─────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { shop, product } = req.body;

  if (!shop || !product) {
    return res.status(400).json({ error: "Missing shop or product data" });
  }

  // ── STEP 1: Get merchant's access token ───────────────────────
  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("access_token")
    .eq("shop_domain", shop)
    .single();

  if (merchantError || !merchant) {
    return res.status(404).json({ error: "Merchant not found. Please reinstall the app." });
  }

  // ── STEP 2: Get merchant's branding ───────────────────────────
  const { data: branding } = await supabase
    .from("branding")
    .select("brand_name, primary_color, tagline")
    .eq("shop_domain", shop)
    .single();

  const brandName = branding?.brand_name || "Cucuma";
  const tagline = branding?.tagline || "Premium Beauty Collection";

  // ── STEP 3: Build the Shopify product payload ─────────────────
  // This is the data structure Shopify needs to create a product.
  // We combine the Cucuma product info with the merchant's branding.
  const shopifyProduct = {
    product: {
      title: `${brandName} — ${product.name}`,
      body_html: `
        <p>${product.desc}</p>
        <p>&nbsp;</p>
        <p><strong>Key Benefits:</strong></p>
        <ul>
          <li>Professional grade formula</li>
          <li>Cruelty-free and dermatologist tested</li>
          <li>Ships directly to your customers</li>
        </ul>
        <p>&nbsp;</p>
        <p><em>Fulfilled by ${brandName}</em></p>
      `,
      vendor: brandName,
      product_type: product.category,
      tags: `cucuma, private-label, ${product.category.toLowerCase()}, ${brandName.toLowerCase()}`,
      status: "active",
      variants: [
        {
          price: product.price.replace("₱", "").replace(",", ""),
          inventory_management: null, // No inventory tracking needed
          fulfillment_service: "manual",
          requires_shipping: true,
          taxable: true,
        },
      ],
      images: [],
    },
  };

  // ── STEP 4: Create the product in Shopify ─────────────────────
  try {
    const shopifyRes = await fetch(
      `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/products.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": merchant.access_token,
        },
        body: JSON.stringify(shopifyProduct),
      }
    );

    const shopifyData = await shopifyRes.json();

    // If Shopify returned an error
    if (shopifyData.errors || !shopifyData.product) {
      console.error("Shopify product creation error:", shopifyData.errors);
      return res.status(500).json({
        error: "Failed to create product in Shopify.",
        details: shopifyData.errors,
      });
    }

    const createdProduct = shopifyData.product;

    // ── STEP 5: Save record to Supabase ───────────────────────
    // Track which products each merchant has published
    await supabase.from("published_products").upsert({
      shop_domain: shop,
      cucuma_product_id: product.id,
      shopify_product_id: createdProduct.id.toString(),
      product_name: product.name,
      category: product.category,
      published_at: new Date().toISOString(),
    }, { onConflict: "shop_domain,cucuma_product_id" });

    // ── Return success ─────────────────────────────────────────
    return res.status(200).json({
      success: true,
      shopifyProductId: createdProduct.id,
      shopifyProductUrl: `https://${shop}/admin/products/${createdProduct.id}`,
      message: `"${product.name}" published successfully to your store!`,
    });

  } catch (err) {
    console.error("Publish error:", err);
    return res.status(500).json({ error: "Network error while publishing product." });
  }
}