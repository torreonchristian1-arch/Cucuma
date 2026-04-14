import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const METRICS = [
  { label: "Total Revenue", value: "₱284,910", delta: "+18.4%", up: true },
  { label: "Active Products", value: "142", delta: "+6 this week", up: true },
  { label: "Pending Orders", value: "38", delta: "-4 today", up: false },
  { label: "Fulfillment Rate", value: "97.2%", delta: "+0.8%", up: true },
];

const ORDERS = [
  { id: "#CUC-4821", product: "Rose Glow Serum", status: "fulfilled", amount: "₱1,290", time: "2m ago" },
  { id: "#CUC-4820", product: "Moisture Shield SPF50", status: "processing", amount: "₱890", time: "14m ago" },
  { id: "#CUC-4819", product: "Keratin Repair Mask", status: "pending", amount: "₱2,100", time: "1h ago" },
  { id: "#CUC-4818", product: "Matte Lip Studio Kit", status: "fulfilled", amount: "₱760", time: "3h ago" },
  { id: "#CUC-4817", product: "Vitamin C Brightener", status: "fulfilled", amount: "₱1,450", time: "5h ago" },
];

const STATUS_STYLE = {
  fulfilled: { bg: "#0d2b1a", color: "#4ade80", label: "Fulfilled" },
  processing: { bg: "#1a1a0d", color: "#facc15", label: "Processing" },
  pending: { bg: "#1a0d0d", color: "#f87171", label: "Pending" },
};

export default function Dashboard() {
  const router = useRouter();
  const { shop } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) return;
    async function fetchMerchant() {
      const { data, error } = await supabase
        .from("merchants")
        .select("shop_domain, scopes, installed_at")
        .eq("shop_domain", shop)
        .single();
      if (!error) setMerchant(data);
      setLoading(false);
    }
    fetchMerchant();
  }, [shop]);

  if (loading) {
    return (
      <div style={{ height: "100vh", background: "#080a0c", display: "flex", alignItems: "center", justifyContent: "center", color: "#d4b68e", fontFamily: "serif", fontSize: 18 }}>
        Loading Cucuma...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080a0c", color: "#e8e0d4", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2620; border-radius: 2px; }
        .metric-card:hover { transform: translateY(-2px); }
        .order-row:hover { background: rgba(212,182,142,0.04) !important; cursor: pointer; }
      `}</style>

      <SideNav active="dashboard" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header style={{ padding: "20px 32px", borderBottom: "1px solid #1a1c1f", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#080a0c", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "1px solid #1a1c1f", borderRadius: 6, color: "#6b6560", cursor: "pointer", padding: "6px 8px", fontSize: 14 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#e8e0d4" }}>Welcome to Cucuma ✦</div>
              <div style={{ fontSize: 12, color: "#4b4540", marginTop: 2 }}>{merchant ? "Managing " + merchant.shop_domain : "Loading..."}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => router.push("/catalogue?shop=" + shop)} style={{ background: "transparent", border: "1px solid #2a2620", borderRadius: 8, padding: "9px 18px", color: "#a09080", fontSize: 13, cursor: "pointer" }}>+ Add Product</button>
            <button onClick={() => router.push("/catalogue?shop=" + shop)} style={{ background: "#d4b68e", border: "none", borderRadius: 8, padding: "9px 20px", color: "#1a0e04", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Publish to Store</button>
          </div>
        </header>

        <div style={{ padding: "28px 32px" }}>
          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            {METRICS.map((m, i) => (
              <div key={i} className="metric-card" style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: "22px 24px", transition: "transform 0.2s" }}>
                <div style={{ fontSize: 11, color: "#4b4540", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{m.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: "#e8e0d4", marginBottom: 8 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: m.up ? "#4ade80" : "#f87171", fontWeight: 600 }}>{m.up ? "↑" : "↓"} {m.delta}</div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
            {/* Orders Table */}
            <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1c1f" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#e8e0d4" }}>Recent Orders</div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0a0c0f" }}>
                    {["Order", "Product", "Status", "Amount", "Time"].map(h => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, color: "#3a3530", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map((o, i) => {
                    const s = STATUS_STYLE[o.status];
                    return (
                      <tr key={i} className="order-row" style={{ borderBottom: "1px solid #111316" }}>
                        <td style={{ padding: "14px 20px", fontSize: 12.5, color: "#d4b68e", fontWeight: 600 }}>{o.id}</td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#c0b8ac" }}>{o.product}</td>
                        <td style={{ padding: "14px 20px" }}><span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{s.label}</span></td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#e8e0d4", fontWeight: 500 }}>{o.amount}</td>
                        <td style={{ padding: "14px 20px", fontSize: 11.5, color: "#3a3530" }}>{o.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Right Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Brand Preview */}
              <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 14 }}>Brand Preview</div>
                <div style={{ background: "linear-gradient(135deg, #1a1208, #0d1a14)", borderRadius: 10, padding: 20, textAlign: "center", border: "1px solid #2a2215" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #d4b68e, #8b5e3c)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✦</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#e8e0d4" }}>Your Brand</div>
                  <div style={{ fontSize: 11, color: "#6b6560", marginTop: 4 }}>Label preview renders here</div>
                </div>
                <button onClick={() => router.push("/branding?shop=" + shop)} style={{ width: "100%", marginTop: 12, background: "transparent", border: "1px dashed #2a2620", borderRadius: 8, padding: "10px", color: "#6b6560", fontSize: 12.5, cursor: "pointer" }}>✎ Edit Branding</button>
              </div>

              {/* Fulfillment */}
              <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 14 }}>Fulfillment Pipeline</div>
                {[{ label: "Awaiting Pickup", count: 12, color: "#facc15" }, { label: "In Transit", count: 24, color: "#60a5fa" }, { label: "Delivered Today", count: 18, color: "#4ade80" }].map((f, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12.5, color: "#8a8076" }}>{f.label}</span>
                      <span style={{ fontSize: 12.5, color: f.color, fontWeight: 600 }}>{f.count}</span>
                    </div>
                    <div style={{ height: 4, background: "#1a1c1f", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: ((f.count / 54) * 100) + "%", background: f.color, borderRadius: 2, opacity: 0.7 }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Webhooks */}
              <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 12 }}>Webhook Events</div>
                {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((w, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid #111316" : "none" }}>
                    <span style={{ fontSize: 11.5, color: "#6b6560", fontFamily: "monospace" }}>{w}</span>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}