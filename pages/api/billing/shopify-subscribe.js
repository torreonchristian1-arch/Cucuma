// pages/api/billing/shopify-subscribe.js
// Uses Shopify's native Billing API - required for App Store approval

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PLANS = {
  starter: {
    name: "Cucuma Starter",
    price: "17.99",
    interval: "EVERY_30_DAYS",
    trialDays: 14,
  },
  growth: {
    name: "Cucuma Growth",
    price: "44.99",
    interval: "EVERY_30_DAYS",
    trialDays: 14,
  },
  starter_yearly: {
    name: "Cucuma Starter (Yearly)",
    price: "172.70",
    interval: "ANNUAL",
    trialDays: 14,
  },
  growth_yearly: {
    name: "Cucuma Growth (Yearly)",
    price: "431.90",
    interval: "ANNUAL",
    trialDays: 14,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { shop, planId } = req.body;

  if (!shop || !planId) {
    return res.status(400).json({ error: "Missing shop or planId" });
  }

  const plan = PLANS[planId];
  if (!plan) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  // Get merchant access token
  const { data: merchant } = await supabase
    .from("merchants")
    .select("access_token")
    .eq("shop_domain", shop)
    .single();

  if (!merchant?.access_token) {
    return res.status(401).json({ error: "Merchant not found or not authorized" });
  }

  // Create recurring charge via Shopify GraphQL
  const returnUrl = `${process.env.HOST}/api/billing/shopify-callback?shop=${shop}&plan=${planId}`;

  const mutation = `
    mutation appSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int, $test: Boolean) {
      appSubscriptionCreate(name: $name, lineItems: $lineItems, returnUrl: $returnUrl, trialDays: $trialDays, test: $test) {
        appSubscription {
          id
          status
        }
        confirmationUrl
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    name: plan.name,
    returnUrl,
    trialDays: plan.trialDays,
    test: process.env.NODE_ENV !== "production", // test mode in dev
    lineItems: [
      {
        plan: {
          appRecurringPricingDetails: {
            price: { amount: plan.price, currencyCode: "USD" },
            interval: plan.interval,
          },
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://${shop}/admin/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": merchant.access_token,
        },
        body: JSON.stringify({ query: mutation, variables }),
      }
    );

    const data = await response.json();
    const result = data?.data?.appSubscriptionCreate;

    if (result?.userErrors?.length > 0) {
      return res.status(400).json({ error: result.userErrors[0].message });
    }

    if (!result?.confirmationUrl) {
      return res.status(500).json({ error: "No confirmation URL returned" });
    }

    // Save pending subscription
    await supabase.from("merchants").update({
      plan: planId,
      plan_status: "pending",
      shopify_subscription_id: result.appSubscription?.id,
    }).eq("shop_domain", shop);

    return res.status(200).json({
      confirmationUrl: result.confirmationUrl,
      subscriptionId: result.appSubscription?.id,
    });

  } catch (err) {
    console.error("Shopify billing error:", err);
    return res.status(500).json({ error: "Failed to create subscription" });
  }
}