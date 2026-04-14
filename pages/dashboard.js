import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const METRICS = [
  { label: "Total Revenue", value: "₱284,910", delta: "+18.4%", up: true, icon: "💰" },
  { label: "Active Products", value: "142", delta: "+6 this week", up: true, icon: "✦" },
  { label: "Pending Orders", value: "38", delta: "-4 today", up: false, icon: "📦" },
  { label: "Fulfillment Rate", value: "97.2%", delta: "+0.8%", up: true, icon: "🚀" },
];

const ORDERS = [
  { id: "#CUC-4821", product: "Rose Glow Serum", status: "fulfilled", amount: "₱1,290", time: "2m ago" },
  { id: "#CUC-4820", product: "Moisture Shield SPF50", status: "processing", amount: "₱890", time: "14m ago" },
  { id: "#CUC-4819", product: "Keratin Repair Mask", status: "pending", amount: "₱2,100", time: "1h ago" },
  { id: "#CUC-4818", product: "Matte Lip Studio Kit", status: "fulfilled", amount: "₱760", time: "3h ago" },
  { id: "#CUC-4817", product: "Vitamin C Brightener", status: "fulfilled", amount: "₱1,450", time: "5h ago" },
];

export default function Dashboard() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) { setLoading(false); return; }
    async function fetchMerchant() {
      const { data } = await supabase.from("merchants").select("shop_domain").eq("shop_domain", shop).single();
      if (data) setMerchant(data);
      setLoading(false);
    }
    fetchMerchant();
  }, [shop]);

  function goTo(href) { router.push(href + "?shop=" + (shop || "")); }

  const statusStyle = {
    fulfilled: { bg: mode === "dark" ? "#0d2b1a" : "#f0fdf4", color: "#16a34a", border: mode === "dark" ? "#166534" : "#bbf7d0", label: "Fulfilled" },
    processing: { bg: mode === "dark" ? "#1a1a0d" : "#fefce8", color: "#ca8a04", border: mode === "dark" ? "#854d0e" : "#fef08a", label: "Processing" },
    pending: { bg: mode === "dark" ? "#1a0d0d" : "#fff7ed", color: "#ea580c", border: mode === "dark" ? "#9a3412" : "#fed7aa", label: "Pending" },
  };

  if (loading) return (
    <div style={{ height: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${theme.border}`, borderTopColor: theme.gold, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }}></div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: theme.gold }}>Loading Cucuma...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!shop) return (
    <div style={{ height: "100vh", background: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: theme.text }}>Welcome to Cucuma ✦</div>
      <p style={{ fontSize: 14, color: theme.textMuted, maxWidth: 360 }}>Please install the app from your Shopify store first.</p>
      <a href="https://cucuma.vercel.app" style={{ background: theme.gold, color: "white", padding: "11px 24px", borderRadius: 100, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Go to Homepage →</a>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden", transition: "background 0.2s" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .metric-card:hover { transform: translateY(-2px); }
        .order-row:hover { background: ${theme.surfaceAlt} !important; }
        @media (max-width: 768px) {
          .metrics-grid { grid-template-columns: 1fr 1fr !important; }
          .content-grid { grid-template-columns: 1fr !important; }
          .main-pad { padding: 16px !important; padding-top: 64px !important; }
          .page-header { padding: 12px 16px 12px 60px !important; }
        }
        @media (max-width: 480px) {
          .metrics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SideNav active="dashboard" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="page-header" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, transition: "background 0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.textMuted, cursor: "pointer", padding: "6px 10px", fontSize: 16 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: theme.text }}>Good morning! 👋</div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>Here's what's happening with your store</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => goTo("/catalogue")} style={{ background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 16px", color: theme.textSub, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>+ Add Product</button>
            <button onClick={() => goTo("/catalogue")} style={{ background: "linear-gradient(135deg, #c9963a, #a07020)", border: "none", borderRadius: 10, padding: "8px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(201,150,58,0.3)" }}>🚀 Publish</button>
          </div>
        </header>

        <div className="main-pad" style={{ padding: "24px 28px", flex: 1 }}>
          {/* Metrics */}
          <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
            {METRICS.map((m, i) => (
              <div key={i} className="metric-card" style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "18px 20px", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.goldLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{m.icon}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: m.up ? "#16a34a" : "#ea580c", background: m.up ? (mode === "dark" ? "#0d2b1a" : "#f0fdf4") : (mode === "dark" ? "#1a0d0d" : "#fff7ed"), padding: "3px 8px", borderRadius: 100 }}>
                    {m.up ? "↑" : "↓"} {m.delta}
                  </span>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
            {/* Orders */}
            <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden", transition: "background 0.2s" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: theme.text }}>Recent Orders</div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 1 }}>Latest activity from your store</div>
                </div>
                <button onClick={() => goTo("/orders")} style={{ fontSize: 12, color: theme.gold, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 380 }}>
                  <thead>
                    <tr style={{ background: theme.surfaceAlt }}>
                      {["Order", "Product", "Status", "Amount", "Time"].map(h => (
                        <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 10, color: theme.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ORDERS.map((o, i) => {
                      const s = statusStyle[o.status];
                      return (
                        <tr key={i} className="order-row" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <td style={{ padding: "12px 16px", fontSize: 12, color: theme.gold, fontWeight: 600 }}>{o.id}</td>
                          <td style={{ padding: "12px 16px", fontSize: 13, color: theme.text, fontWeight: 500 }}>{o.product}</td>
                          <td style={{ padding: "12px 16px" }}><span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 100, padding: "2px 9px", fontSize: 11, fontWeight: 600 }}>{s.label}</span></td>
                          <td style={{ padding: "12px 16px", fontSize: 13, color: theme.text, fontWeight: 600 }}>{o.amount}</td>
                          <td style={{ padding: "12px 16px", fontSize: 11, color: theme.textMuted }}>{o.time}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Quick Actions */}
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 16 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Quick Actions</div>
                {[
                  { label: "Browse Catalogue", icon: "✦", href: "/catalogue" },
                  { label: "Edit Branding", icon: "◉", href: "/branding" },
                  { label: "View Orders", icon: "📦", href: "/orders" },
                ].map(a => (
                  <button key={a.label} onClick={() => goTo(a.href)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: theme.goldLight, border: `1px solid ${theme.goldBorder}`, borderRadius: 10, cursor: "pointer", width: "100%", marginBottom: 8, textAlign: "left" }}>
                    <span style={{ fontSize: 14 }}>{a.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.gold }}>{a.label}</span>
                    <span style={{ marginLeft: "auto", color: theme.gold }}>→</span>
                  </button>
                ))}
              </div>

              {/* Fulfillment */}
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 16 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Fulfillment</div>
                {[{ label: "Awaiting Pickup", count: 12, total: 54, color: "#f59e0b" }, { label: "In Transit", count: 24, total: 54, color: "#3b82f6" }, { label: "Delivered Today", count: 18, total: 54, color: "#10b981" }].map((f, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: theme.textSub, fontWeight: 500 }}>{f.label}</span>
                      <span style={{ fontSize: 12, color: f.color, fontWeight: 700 }}>{f.count}</span>
                    </div>
                    <div style={{ height: 5, background: theme.border, borderRadius: 100 }}>
                      <div style={{ height: "100%", width: `${(f.count / f.total) * 100}%`, background: f.color, borderRadius: 100 }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Webhooks */}
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: theme.text }}>Webhooks</div>
                  <span style={{ fontSize: 10, background: theme.tagBg, color: theme.tagText, border: `1px solid ${theme.tagBorder}`, borderRadius: 100, padding: "2px 8px", fontWeight: 600 }}>All Active</span>
                </div>
                {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((w, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                    <span style={{ fontSize: 11, color: theme.textSub, fontFamily: "monospace" }}>{w}</span>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></div>
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