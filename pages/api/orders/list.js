// pages/api/orders/list.js
// Fetches all orders for a merchant from Supabase

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { shop } = req.query;

  if (!shop) return res.status(400).json({ error: "Missing shop" });

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("shop_domain", shop)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ orders: data || [] });
}
