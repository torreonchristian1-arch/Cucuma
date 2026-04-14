import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const METRICS = [
  { label: "Total Revenue", value: "₱284,910", delta: "+18.4%", up: true, icon: "💰", color: "#f0fdf4", accent: "#16a34a" },
  { label: "Active Products", value: "142", delta: "+6 this week", up: true, icon: "✦", color: "#fefce8", accent: "#ca8a04" },
  { label: "Pending Orders", value: "38", delta: "-4 today", up: false, icon: "📦", color: "#fff7ed", accent: "#ea580c" },
  { label: "Fulfillment Rate", value: "97.2%", delta: "+0.8%", up: true, icon: "🚀", color: "#eff6ff", accent: "#2563eb" },
];

const ORDERS = [
  { id: "#CUC-4821", product: "Rose Glow Serum", status: "fulfilled", amount: "₱1,290", time: "2m ago" },
  { id: "#CUC-4820", product: "Moisture Shield SPF50", status: "processing", amount: "₱890", time: "14m ago" },
  { id: "#CUC-4819", product: "Keratin Repair Mask", status: "pending", amount: "₱2,100", time: "1h ago" },
  { id: "#CUC-4818", product: "Matte Lip Studio Kit", status: "fulfilled", amount: "₱760", time: "3h ago" },
  { id: "#CUC-4817", product: "Vitamin C Brightener", status: "fulfilled", amount: "₱1,450", time: "5h ago" },
];

const STATUS = {
  fulfilled: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Fulfilled" },
  processing: { bg: "#fefce8", color: "#ca8a04", border: "#fef08a", label: "Processing" },
  pending: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa", label: "Pending" },
};

export default function Dashboard() {
  const router = useRouter();
  const { shop } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) { setLoading(false); return; }
    async function fetchMerchant() {
      const { data } = await supabase.from("merchants").select("shop_domain, installed_at").eq("shop_domain", shop).single();
      if (data) setMerchant(data);
      setLoading(false);
    }
    fetchMerchant();
  }, [shop]);

  function goTo(href) {
    router.push(href + "?shop=" + (shop || ""));
  }

  if (loading) {
    return (
      <div style={{ height: "100vh", background: "#faf9f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "3px solid #f3e8d0", borderTopColor: "#c9963a", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }}></div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#c9963a" }}>Loading Cucuma...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!shop) {
    return (
      <div style={{ height: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "0 24px", textAlign: "center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');`}</style>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#1a0e04" }}>Welcome to Cucuma ✦</div>
        <p style={{ fontSize: 15, color: "#8a7060", maxWidth: 360 }}>Please install the app from your Shopify store first.</p>
        <a href="https://cucuma.vercel.app" style={{ background: "#c9963a", color: "white", padding: "12px 28px", borderRadius: 100, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Go to Homepage →</a>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#faf9f7", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e8ddd0; border-radius: 2px; }
        .metric-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .order-row:hover { background: #faf9f7 !important; }
        .btn:hover { opacity: 0.9; transform: translateY(-1px); }

        @media (max-width: 768px) {
          .metrics-grid { grid-template-columns: 1fr 1fr !important; }
          .content-grid { grid-template-columns: 1fr !important; }
          .header-actions .add-btn { display: none !important; }
          .main-content { padding: 16px !important; padding-top: 72px !important; }
          .page-header { padding: 12px 16px 12px 60px !important; }
          .order-table th:nth-child(4),
          .order-table td:nth-child(4) { display: none; }
        }
        @media (max-width: 480px) {
          .metrics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SideNav active="dashboard" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header className="page-header" style={{ padding: "16px 32px", background: "white", borderBottom: "1px solid #f0ebe3", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "1px solid #f0ebe3", borderRadius: 8, color: "#8a7060", cursor: "pointer", padding: "6px 10px", fontSize: 16, lineHeight: 1, display: "none" }} className="desktop-toggle">☰</button>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a0e04" }}>Good morning! 👋</div>
              <div style={{ fontSize: 12, color: "#a09080", marginTop: 1 }}>Here's what's happening with your store</div>
            </div>
          </div>
          <div className="header-actions" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="add-btn btn" onClick={() => goTo("/catalogue")}
              style={{ background: "white", border: "1px solid #e8ddd0", borderRadius: 10, padding: "8px 18px", color: "#6b5a4e", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
              + Add Product
            </button>
            <button className="btn" onClick={() => goTo("/catalogue")}
              style={{ background: "linear-gradient(135deg, #c9963a, #a07020)", border: "none", borderRadius: 10, padding: "9px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(201,150,58,0.3)", whiteSpace: "nowrap" }}>
              🚀 Publish
            </button>
          </div>
        </header>

        <div className="main-content" style={{ padding: "24px 32px", flex: 1 }}>
          {/* Metrics */}
          <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {METRICS.map((m, i) => (
              <div key={i} className="metric-card" style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: "18px 20px", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{m.icon}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: m.up ? "#16a34a" : "#ea580c", background: m.up ? "#f0fdf4" : "#fff7ed", padding: "3px 8px", borderRadius: 100 }}>
                    {m.up ? "↑" : "↓"} {m.delta}
                  </span>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a0e04", marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 12, color: "#a09080", fontWeight: 500 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
            {/* Orders */}
            <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0ebe3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1a0e04" }}>Recent Orders</div>
                  <div style={{ fontSize: 12, color: "#a09080", marginTop: 1 }}>Latest activity</div>
                </div>
                <button onClick={() => goTo("/orders")} style={{ fontSize: 12, color: "#c9963a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="order-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                  <thead>
                    <tr style={{ background: "#faf9f7" }}>
                      {["Order", "Product", "Status", "Amount", "Time"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#a09080", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ORDERS.map((o, i) => {
                      const s = STATUS[o.status];
                      return (
                        <tr key={i} className="order-row" style={{ borderBottom: "1px solid #f5f0e8" }}>
                          <td style={{ padding: "12px 16px", fontSize: 12, color: "#c9963a", fontWeight: 600 }}>{o.id}</td>
                          <td style={{ padding: "12px 16px", fontSize: 13, color: "#3a2a1a", fontWeight: 500 }}>{o.product}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 100, padding: "2px 9px", fontSize: 11, fontWeight: 600 }}>{s.label}</span>
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: 13, color: "#1a0e04", fontWeight: 600 }}>{o.amount}</td>
                          <td style={{ padding: "12px 16px", fontSize: 11, color: "#a09080" }}>{o.time}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Quick Actions */}
              <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 18 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a0e04", marginBottom: 12 }}>Quick Actions</div>
                {[
                  { label: "Browse Catalogue", icon: "✦", href: "/catalogue", color: "#fef3e2", text: "#c9963a" },
                  { label: "Edit Branding", icon: "◉", href: "/branding", color: "#fdf4ff", text: "#9333ea" },
                  { label: "View Orders", icon: "📦", href: "/orders", color: "#eff6ff", text: "#2563eb" },
                ].map(a => (
                  <button key={a.label} onClick={() => goTo(a.href)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: a.color, border: "none", borderRadius: 10, cursor: "pointer", width: "100%", marginBottom: 8, textAlign: "left" }}>
                    <span style={{ fontSize: 15 }}>{a.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: a.text }}>{a.label}</span>
                    <span style={{ marginLeft: "auto", color: a.text }}>→</span>
                  </button>
                ))}
              </div>

              {/* Fulfillment */}
              <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 18 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a0e04", marginBottom: 14 }}>Fulfillment</div>
                {[
                  { label: "Awaiting Pickup", count: 12, total: 54, color: "#f59e0b" },
                  { label: "In Transit", count: 24, total: 54, color: "#3b82f6" },
                  { label: "Delivered Today", count: 18, total: 54, color: "#10b981" },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "#6b5a4e", fontWeight: 500 }}>{f.label}</span>
                      <span style={{ fontSize: 12, color: f.color, fontWeight: 700 }}>{f.count}</span>
                    </div>
                    <div style={{ height: 6, background: "#f5f0e8", borderRadius: 100 }}>
                      <div style={{ height: "100%", width: `${(f.count / f.total) * 100}%`, background: f.color, borderRadius: 100 }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Webhooks */}
              <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a0e04" }}>Webhooks</div>
                  <span style={{ fontSize: 10, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 100, padding: "2px 8px", fontWeight: 600 }}>All Active</span>
                </div>
                {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((w, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < arr.length - 1 ? "1px solid #f5f0e8" : "none" }}>
                    <span style={{ fontSize: 11, color: "#6b5a4e", fontFamily: "monospace" }}>{w}</span>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }}></div>
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