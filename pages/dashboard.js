import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const METRICS = [
  { label: "Total Revenue", value: "₱284,910", delta: "+18.4%", up: true, icon: "💰", sub: "This month" },
  { label: "Active Products", value: "142", delta: "+6", up: true, icon: "✦", sub: "This week" },
  { label: "Pending Orders", value: "38", delta: "-4", up: false, icon: "⏳", sub: "Today" },
  { label: "Fulfillment Rate", value: "97.2%", delta: "+0.8%", up: true, icon: "🚀", sub: "Last 30 days" },
];

const SAMPLE_ORDERS = [
  { id: "#4821", product: "Rose Glow Serum", customer: "Maria Santos", status: "fulfilled", amount: "₱1,290", time: "2m ago" },
  { id: "#4820", product: "Moisture Shield SPF50", customer: "Jan Cruz", status: "processing", amount: "₱890", time: "14m ago" },
  { id: "#4819", product: "Keratin Repair Mask", customer: "Ana Reyes", status: "pending", amount: "₱2,100", time: "1h ago" },
  { id: "#4818", product: "Matte Lip Studio Kit", customer: "Bea Gomez", status: "fulfilled", amount: "₱760", time: "3h ago" },
];

export default function Dashboard() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const prevOrderCount = useRef(0);

  useEffect(() => {
    if (!shop) { setLoading(false); return; }
    supabase.from("merchants").select("shop_domain").eq("shop_domain", shop).single()
      .then(({ data }) => { if (data) setMerchant(data); setLoading(false); });

    // Load initial orders and set up real-time polling
    loadOrders();
    const interval = setInterval(checkNewOrders, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [shop]);

  // Close notif panel on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function loadOrders() {
    if (!shop) return;
    try {
      const { data } = await supabase.from("orders").select("*").eq("shop_domain", shop).order("created_at", { ascending: false }).limit(20);
      if (data) {
        prevOrderCount.current = data.length;
        // Create notifications from recent orders
        const notifs = data.slice(0, 5).map(o => ({
          id: o.shopify_order_id,
          type: "order",
          title: "New Order Received",
          message: `${o.customer_name || "A customer"} ordered ${fp(parseFloat(o.total_price || 0))}`,
          time: o.created_at,
          read: true,
          icon: "📦",
        }));
        setNotifications(notifs);
      }
    } catch {}
  }

  async function checkNewOrders() {
    if (!shop) return;
    try {
      const { data } = await supabase.from("orders").select("*").eq("shop_domain", shop).order("created_at", { ascending: false }).limit(20);
      if (data && data.length > prevOrderCount.current) {
        const newOrders = data.slice(0, data.length - prevOrderCount.current);
        const newNotifs = newOrders.map(o => ({
          id: o.shopify_order_id + "_new",
          type: "order",
          title: "🎉 New Order!",
          message: `${o.customer_name || "A customer"} just ordered ${fp(parseFloat(o.total_price || 0))}`,
          time: o.created_at,
          read: false,
          icon: "🎉",
        }));
        setNotifications(prev => [...newNotifs, ...prev].slice(0, 20));
        setUnreadCount(prev => prev + newOrders.length);

        // Browser notification if permission granted
        if (Notification.permission === "granted") {
          newOrders.forEach(o => {
            new Notification("New Cucuma Order! 🎉", {
              body: `${o.customer_name || "A customer"} ordered ₱${parseFloat(o.total_price || 0).toLocaleString()}`,
              icon: "/favicon.ico",
            });
          });
        }
        prevOrderCount.current = data.length;
      }
    } catch {}
  }

  function fp(amount) {
    return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 0 })}`;
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  function requestNotifPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  function fmtTime(dateStr) {
    if (!dateStr) return "Just now";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
  }

  function goTo(href) { router.push(`${href}?shop=${shop || ""}`); }

  const statusConfig = {
    fulfilled: { label: "Fulfilled", color: theme.green, bg: theme.greenBg, border: theme.greenBorder },
    processing: { label: "Processing", color: "#ca8a04", bg: mode === "dark" ? "#1a1500" : "#fefce8", border: mode === "dark" ? "#854d0e" : "#fde68a" },
    pending: { label: "Pending", color: theme.orange, bg: theme.orangeBg, border: theme.orangeBorder },
  };

  if (!shop && !loading) return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, color: theme.text }}>Welcome to Cucuma®</div>
      <p style={{ fontSize: 15, color: theme.textMuted, maxWidth: 360 }}>Please install the app from your Shopify store first.</p>
      <a href="https://cucuma.vercel.app" style={{ background: theme.gold, color: "white", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700 }}>Go to Homepage →</a>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, overflow: "hidden", transition: "background 0.25s" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes notifPop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes badgePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .notif-panel { animation: slideDown 0.2s ease; }
        .notif-badge { animation: badgePulse 0.4s ease; }
        .mcard:hover { transform: translateY(-2px); box-shadow: ${theme.shadowMd}; }
        .orow:hover { background: ${theme.surfaceHover} !important; cursor: pointer; }
        .action-btn:hover { transform: translateY(-1px); opacity: 0.9; }
        @media (max-width: 900px) {
          .metrics-grid { grid-template-columns: 1fr 1fr !important; }
          .main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .hdr { padding: 10px 16px 10px 56px !important; }
          .main-pad { padding: 16px !important; padding-top: 60px !important; }
          .hide-sm { display: none !important; }
        }
        @media (max-width: 480px) { .metrics-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <SideNav active="dashboard" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header className="hdr" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", color: theme.textMuted, cursor: "pointer", fontSize: 15 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: theme.text }}>Dashboard</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{merchant?.shop_domain || "Loading..."}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Notification Bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) { markAllRead(); requestNotifPermission(); } }}
                style={{ position: "relative", background: unreadCount > 0 ? theme.goldBg : "none", border: `1px solid ${unreadCount > 0 ? theme.goldBorder : theme.border}`, borderRadius: 10, padding: "8px 10px", cursor: "pointer", color: theme.textSub, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                🔔
                {unreadCount > 0 && (
                  <span className="notif-badge" style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${theme.surface}` }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifs && (
                <div className="notif-panel" style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 340, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, boxShadow: theme.shadowMd, zIndex: 100, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text }}>Notifications</div>
                    <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: theme.gold, fontWeight: 700 }}>Mark all read</button>
                  </div>

                  <div style={{ maxHeight: 360, overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: "32px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
                        <div style={{ fontSize: 13, color: theme.textMuted }}>No notifications yet</div>
                        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Orders will appear here</div>
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={n.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.border}`, background: n.read ? "transparent" : theme.goldBg, display: "flex", gap: 12, alignItems: "flex-start", transition: "background 0.15s" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{n.title}</div>
                            <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.4 }}>{n.message}</div>
                            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 4 }}>{fmtTime(n.time)}</div>
                          </div>
                          {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: theme.gold, flexShrink: 0, marginTop: 4 }}></div>}
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ padding: "10px 16px", borderTop: `1px solid ${theme.border}`, textAlign: "center" }}>
                    <button onClick={() => { goTo("/orders"); setShowNotifs(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: theme.gold, fontWeight: 700 }}>View All Orders →</button>
                  </div>
                </div>
              )}
            </div>

            <button className="action-btn hide-sm" onClick={() => goTo("/catalogue")}
              style={{ background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 9, padding: "8px 16px", color: theme.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
              + Add Product
            </button>
            <button className="action-btn" onClick={() => goTo("/catalogue")}
              style={{ background: `linear-gradient(135deg, ${theme.gold}, #a07828)`, border: "none", borderRadius: 9, padding: "8px 18px", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", boxShadow: `0 4px 14px rgba(184,134,42,0.35)` }}>
              Publish to Store →
            </button>
          </div>
        </header>

        <div className="main-pad" style={{ padding: "24px 28px" }}>
          {/* Metrics */}
          <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
            {METRICS.map((m, i) => (
              <div key={i} className="mcard" style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "18px 20px", transition: "all 0.2s", boxShadow: theme.shadow }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.goldBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{m.icon}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: m.up ? theme.green : theme.orange, background: m.up ? theme.greenBg : theme.orangeBg, border: `1px solid ${m.up ? theme.greenBorder : theme.orangeBorder}`, padding: "3px 8px", borderRadius: 100 }}>
                    {m.up ? "↑" : "↓"} {m.delta}
                  </span>
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSub, marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: theme.textMuted }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
            {/* Orders Table */}
            <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden", boxShadow: theme.shadow }}>
              <div style={{ padding: "16px 22px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: theme.text }}>Recent Orders</div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Latest activity from your store</div>
                </div>
                <button onClick={() => goTo("/orders")} style={{ fontSize: 12, color: theme.gold, fontWeight: 700, background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>View All →</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
                  <thead>
                    <tr style={{ background: theme.surfaceAlt }}>
                      {["Order", "Product", "Customer", "Status", "Amount"].map(h => (
                        <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_ORDERS.map((o, i) => {
                      const s = statusConfig[o.status];
                      return (
                        <tr key={i} className="orow" onClick={() => goTo("/orders")} style={{ borderBottom: `1px solid ${theme.border}`, transition: "background 0.12s" }}>
                          <td style={{ padding: "13px 18px", fontSize: 12, fontWeight: 700, color: theme.gold }}>{o.id}</td>
                          <td style={{ padding: "13px 18px", fontSize: 13, color: theme.text, fontWeight: 500 }}>{o.product}</td>
                          <td style={{ padding: "13px 18px", fontSize: 12, color: theme.textSub }}>{o.customer}</td>
                          <td style={{ padding: "13px 18px" }}><span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{s.label}</span></td>
                          <td style={{ padding: "13px 18px", fontSize: 13, fontWeight: 700, color: theme.text }}>{o.amount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Quick Actions */}
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 18, boxShadow: theme.shadow }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Quick Actions</div>
                {[
                  { label: "Browse Catalogue", icon: "✦", href: "/catalogue", desc: "Add products to store" },
                  { label: "Edit Branding", icon: "◈", href: "/branding", desc: "Customize your labels" },
                  { label: "View Orders", icon: "⬡", href: "/orders", desc: "Track fulfillment" },
                ].map(a => (
                  <div key={a.href} onClick={() => goTo(a.href)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, borderRadius: 10, cursor: "pointer", marginBottom: 8, transition: "all 0.15s" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg, ${theme.gold}, #a07828)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: theme.goldText }}>{a.label}</div>
                      <div style={{ fontSize: 11, color: theme.textMuted }}>{a.desc}</div>
                    </div>
                    <span style={{ marginLeft: "auto", color: theme.gold, fontSize: 16 }}>→</span>
                  </div>
                ))}
              </div>

              {/* Fulfillment */}
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 18, boxShadow: theme.shadow }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Fulfillment</div>
                {[{ label: "Awaiting Pickup", count: 12, total: 54, color: "#f59e0b" }, { label: "In Transit", count: 24, total: 54, color: theme.blue }, { label: "Delivered", count: 18, total: 54, color: theme.green }].map((f, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: theme.textSub }}>{f.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: f.color }}>{f.count}</span>
                    </div>
                    <div style={{ height: 5, background: theme.border, borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(f.count / f.total) * 100}%`, background: f.color, borderRadius: 100 }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notification status */}
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 18, boxShadow: theme.shadow }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Notifications</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, borderRadius: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>🔔</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>Order Alerts Active</div>
                    <div style={{ fontSize: 11, color: theme.textMuted }}>Checking every 30 seconds</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: theme.green }}></div>
                </div>
                <button onClick={requestNotifPermission} style={{ width: "100%", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 9, padding: "9px", color: theme.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Enable Browser Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}