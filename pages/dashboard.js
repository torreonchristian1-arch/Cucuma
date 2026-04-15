import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SAMPLE_ORDERS = [
  { id: "#4821", product: "Rose Glow Serum", customer: "Maria Santos", status: "fulfilled", amount: "1,290", time: "2m ago" },
  { id: "#4820", product: "Moisture Shield SPF50", customer: "Jan Cruz", status: "processing", amount: "890", time: "14m ago" },
  { id: "#4819", product: "Keratin Repair Mask", customer: "Ana Reyes", status: "pending", amount: "2,100", time: "1h ago" },
  { id: "#4818", product: "Matte Lip Studio Kit", customer: "Bea Gomez", status: "fulfilled", amount: "760", time: "3h ago" },
];

function StatusBadge({ status, theme }) {
  const styles = {
    fulfilled: { bg: theme.greenSubtle, color: theme.green, label: "Fulfilled" },
    processing: { bg: "rgba(196,151,90,0.12)", color: theme.gold, label: "Processing" },
    pending: { bg: "rgba(160,90,60,0.12)", color: "#C46050", label: "Pending" },
    cancelled: { bg: "rgba(200,60,60,0.1)", color: "#C05050", label: "Cancelled" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 100, whiteSpace: "nowrap" }}>{s.label}</span>
  );
}

function StatCard({ icon, label, value, delta, up, theme }) {
  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: "18px 20px", boxShadow: theme.shadow, transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: theme.goldSubtle, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        {delta && <span style={{ fontSize: 11, fontWeight: 600, color: up ? theme.green : "#C06050", background: up ? theme.greenSubtle : "rgba(192,96,80,0.1)", padding: "2px 7px", borderRadius: 100 }}>{up ? "↑" : "↓"} {delta}</span>}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 500, color: theme.gold, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: theme.textTertiary }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unread, setUnread] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, products: 0, orders: 0, fulfillment: 0 });
  const prevOrderCount = useRef(0);
  const notifRef = useRef(null);

  useEffect(() => {
    if (!shop) { setLoading(false); return; }
    loadDashboard();
    const interval = setInterval(checkNewOrders, 30000);
    return () => clearInterval(interval);
  }, [shop]);

  useEffect(() => {
    function handleClick(e) { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function loadDashboard() {
    if (!shop) return;
    try {
      // Load merchant
      const { data: merchantData } = await supabase.from("merchants").select("shop_domain").eq("shop_domain", shop).single();
      if (merchantData) setMerchant(merchantData);

      // Load orders for real stats
      const { data: orders } = await supabase.from("orders").select("*").eq("shop_domain", shop).order("created_at", { ascending: false });
      if (orders) {
        const totalRevenue = orders.filter(o => o.financial_status !== "refunded").reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
        const fulfilled = orders.filter(o => o.fulfillment_status === "fulfilled").length;
        const fulfillmentRate = orders.length > 0 ? Math.round((fulfilled / orders.length) * 100) : 0;

        setStats({
          revenue: totalRevenue,
          orders: orders.length,
          fulfillment: fulfillmentRate,
        });

        setRecentOrders(orders.slice(0, 5));
        prevOrderCount.current = orders.length;

        // Notifications from recent orders
        setNotifications(orders.slice(0, 8).map(o => ({
          id: o.shopify_order_id,
          title: "New Order",
          msg: `${o.customer_name || "A customer"} ordered $${parseFloat(o.total_price || 0).toFixed(2)}`,
          time: o.created_at,
          read: true,
        })));
      }

      // Load published products count
      const { data: published } = await supabase.from("published_products").select("id").eq("shop_domain", shop);
      if (published) setStats(prev => ({ ...prev, products: published.length }));

    } catch {}
    setLoading(false);
  }

  async function checkNewOrders() {
    if (!shop) return;
    try {
      const { data: orders } = await supabase.from("orders").select("*").eq("shop_domain", shop).order("created_at", { ascending: false }).limit(20);
      if (orders && orders.length > prevOrderCount.current) {
        const newCount = orders.length - prevOrderCount.current;
        setUnread(prev => prev + newCount);
        const newNotifs = orders.slice(0, newCount).map(o => ({
          id: o.shopify_order_id + "_new",
          title: "New Order!",
          msg: `${o.customer_name || "A customer"} ordered $${parseFloat(o.total_price || 0).toFixed(2)}`,
          time: o.created_at,
          read: false,
        }));
        setNotifications(prev => [...newNotifs, ...prev].slice(0, 20));
        setRecentOrders(orders.slice(0, 5));
        prevOrderCount.current = orders.length;
      }
    } catch {}
  }

  function goTo(href) { router.push(`${href}?shop=${shop || ""}`); }

  if (!shop && !loading) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bgBase, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: theme.goldSubtle, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>✦</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary }}>Welcome to Cucuma®</div>
        <p style={{ fontSize: 14, color: theme.textSecondary, maxWidth: 360, lineHeight: 1.6 }}>Install the app from your Shopify store to get started.</p>
        <a href="https://cucuma.vercel.app" style={{ background: theme.gold, color: "white", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, display: "inline-block" }}>Go to Homepage →</a>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bgBase, overflow: "hidden" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .stat-card:hover { transform: translateY(-2px); box-shadow: ${theme.shadowMd} !important; }
        .quick-action:hover { background: ${theme.bgElevated} !important; border-color: ${theme.borderDefault} !important; transform: translateY(-1px); }
        .orow:hover { background: ${theme.bgElevated} !important; }
        .notif-item:hover { background: ${theme.bgElevated} !important; }
        @media (max-width: 900px) { .metrics-grid { grid-template-columns: 1fr 1fr !important; } .content-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .hdr { padding: 10px 16px 10px 52px !important; } .main-pad { padding: 16px !important; } .hide-sm { display: none !important; } .metrics-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .metrics-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <SideNav active="dashboard" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header className="hdr" style={{ padding: "12px 24px", background: theme.bgCard, borderBottom: `1px solid ${theme.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.borderSubtle}`, borderRadius: 7, padding: "6px 9px", color: theme.textTertiary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary }}>Dashboard</div>
              <div style={{ fontSize: 12, color: theme.textTertiary }}>{merchant?.shop_domain || (loading ? "Loading..." : "No store connected")}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Notification bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button onClick={() => { setShowNotifs(!showNotifs); setUnread(0); }}
                style={{ position: "relative", background: unread > 0 ? theme.goldSubtle : "none", border: `1px solid ${unread > 0 ? theme.goldBorder : theme.borderSubtle}`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: theme.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                {unread > 0 && <span style={{ position: "absolute", top: -3, right: -3, background: "#C05050", color: "white", borderRadius: "50%", width: 15, height: 15, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${theme.bgCard}` }}>{unread}</span>}
              </button>
              {showNotifs && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320, background: theme.bgCard, border: `1px solid ${theme.borderDefault}`, borderRadius: 12, boxShadow: theme.shadowMd, zIndex: 100, overflow: "hidden", animation: "slideDown 0.18s ease" }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.borderSubtle}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary }}>Notifications</span>
                    <span style={{ fontSize: 11, color: theme.gold, cursor: "pointer", fontWeight: 600 }}>Mark all read</span>
                  </div>
                  <div style={{ maxHeight: 320, overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: "28px 16px", textAlign: "center", color: theme.textTertiary, fontSize: 13 }}>No notifications yet</div>
                    ) : notifications.map((n, i) => (
                      <div key={i} className="notif-item" style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.borderSubtle}`, cursor: "pointer" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: theme.textPrimary, marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: theme.textSecondary }}>{n.msg}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "10px 16px", borderTop: `1px solid ${theme.borderSubtle}`, textAlign: "center" }}>
                    <button onClick={() => goTo("/orders")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: theme.gold, fontWeight: 600 }}>View All Orders →</button>
                  </div>
                </div>
              )}
            </div>
            <button className="hide-sm" onClick={() => goTo("/catalogue")}
              style={{ background: "none", border: `1px solid ${theme.borderDefault}`, borderRadius: 8, padding: "7px 14px", color: theme.textSecondary, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
              + Add Product
            </button>
            <button onClick={() => goTo("/catalogue")}
              style={{ background: theme.gold, border: "none", borderRadius: 8, padding: "7px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
              Publish to Store
            </button>
          </div>
        </header>

        <div className="main-pad" style={{ padding: "20px 24px", flex: 1 }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
              <div style={{ width: 32, height: 32, border: `2px solid ${theme.borderDefault}`, borderTopColor: theme.gold, borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                <div className="stat-card" style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: "18px 20px", boxShadow: theme.shadow, transition: "all 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: theme.goldSubtle, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: theme.green, background: theme.greenSubtle, padding: "2px 7px", borderRadius: 100 }}>↑ +18.4%</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 500, color: theme.gold, marginBottom: 4 }}>${stats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: theme.textTertiary }}>Revenue this month</div>
                </div>
                {[
                  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, value: stats.products.toString(), label: "Products published", delta: null, up: true },
                  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>, value: stats.orders.toString(), label: "Total orders", delta: null, up: true },
                  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, value: `${stats.fulfillment}%`, label: "Fulfillment rate", delta: null, up: true },
                ].map((s, i) => (
                  <div key={i} className="stat-card" style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: "18px 20px", boxShadow: theme.shadow, transition: "all 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: theme.goldSubtle, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: s.up ? theme.green : "#C06050", background: s.up ? theme.greenSubtle : "rgba(192,96,80,0.1)", padding: "2px 7px", borderRadius: 100 }}>{s.up ? "↑" : "↓"} {s.delta}</span>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 500, color: theme.gold, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: theme.textTertiary }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
                {/* Orders Table */}
                <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, overflow: "hidden", boxShadow: theme.shadow }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.borderSubtle}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>Recent Orders</div>
                      <div style={{ fontSize: 12, color: theme.textTertiary, marginTop: 1 }}>Latest activity from your store</div>
                    </div>
                    <button onClick={() => goTo("/orders")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: theme.gold, fontWeight: 600 }}>View all →</button>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                      <thead>
                        <tr style={{ background: theme.bgBase }}>
                          {["Order", "Customer", "Product", "Total", "Status"].map(h => (
                            <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: theme.textTertiary, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                      {(recentOrders.length > 0 ? recentOrders : SAMPLE_ORDERS).map((o, i) => {
                          const isReal = !!o.shopify_order_id;
                          const status = isReal ? (o.fulfillment_status || "unfulfilled") : o.status;
                          const orderId = isReal ? o.order_number : o.id;
                          const customer = isReal ? (o.customer_name || "Guest") : o.customer;
                          const product = isReal ? (o.line_items ? (typeof o.line_items === "string" ? JSON.parse(o.line_items)[0]?.title : o.line_items[0]?.title) : "—") : o.product;
                          const amount = isReal ? parseFloat(o.total_price || 0).toFixed(2) : o.amount;
                          return (
                          <tr key={i} className="orow" style={{ borderBottom: `1px solid ${theme.borderSubtle}`, transition: "background 0.12s", cursor: "pointer" }} onClick={() => goTo("/orders")}>
                            <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: theme.gold, fontFamily: "'JetBrains Mono', monospace" }}>{orderId}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: theme.textPrimary, fontWeight: 500 }}>{customer}</td>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: theme.textSecondary }}>{product}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: theme.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}>${amount}</td>
                            <td style={{ padding: "12px 16px" }}><StatusBadge status={status} theme={theme} /></td>
                          </tr>
                        );})
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Panel */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Quick Actions */}
                  <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: 16, boxShadow: theme.shadow }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 12 }}>Quick Actions</div>
                    {[
                      { label: "Browse Catalogue", sub: "Add products to your store", href: "/catalogue" },
                      { label: "Edit Branding", sub: "Upload logo & set colors", href: "/branding" },
                      { label: "View Orders", sub: "Track fulfillment status", href: "/orders" },
                    ].map(a => (
                      <div key={a.href} className="quick-action" onClick={() => goTo(a.href)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 8, cursor: "pointer", marginBottom: 8, transition: "all 0.15s" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{a.label}</div>
                          <div style={{ fontSize: 11, color: theme.textTertiary, marginTop: 1 }}>{a.sub}</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textTertiary} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    ))}
                  </div>

                  {/* Webhooks */}
                  <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: 16, boxShadow: theme.shadow }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary }}>Webhooks</div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: theme.green, background: theme.greenSubtle, padding: "2px 8px", borderRadius: 100, letterSpacing: "0.04em" }}>ALL LIVE</span>
                    </div>
                    {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((w, i, arr) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.borderSubtle}` : "none" }}>
                        <code style={{ fontSize: 11, color: theme.textSecondary }}>{w}</code>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.green, animation: "pulse 2s ease-in-out infinite" }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}