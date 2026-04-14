import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { shop, code, state, hmac } = req.query;

  const stateCookie = req.cookies?.shopify_oauth_state;
  if (!state || state !== stateCookie) {
    return res.status(403).json({ error: "State mismatch." });
  }

  const params = { ...req.query };
  delete params.hmac;

  const message = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const generatedHash = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(message)
    .digest("hex");

  if (generatedHash !== hmac) {
    return res.status(401).json({ error: "HMAC validation failed." });
  }

  let access_token, scope;

  try {
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: process.env.SHOPIFY_API_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      return res.status(500).json({ error: "Failed to get access token." });
    }

    access_token = tokenData.access_token;
    scope = tokenData.scope;

  } catch (err) {
    return res.status(500).json({ error: "Network error during token exchange." });
  }

  const { error: dbError } = await supabase
    .from("merchants")
    .upsert(
      {
        shop_domain: shop,
        access_token,
        scopes: scope,
        installed_at: new Date().toISOString(),
      },
      { onConflict: "shop_domain" }
    );

  if (dbError) {
    return res.status(500).json({ error: "Could not save merchant to database." });
  }

  await registerWebhooks(shop, access_token);

  return res.redirect(`/dashboard?shop=${shop}`);
}

async function registerWebhooks(shop, accessToken) {
  const webhookTopics = [
    "orders/create",
    "orders/fulfilled",
    "orders/cancelled",
    "products/update",
  ];

  for (const topic of webhookTopics) {
    const urlSafeTopic = topic.replace("/", "-");
    try {
      await fetch(
        `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/webhooks.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
          },
          body: JSON.stringify({
            webhook: {
              topic,
              address: `${process.env.HOST}/api/webhooks/${urlSafeTopic}`,
              format: "json",
            },
          }),
        }
      );
    } catch (err) {
      console.error(`Webhook error for ${topic}:`, err);
    }
  }
}