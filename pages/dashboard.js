import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";
import { PageHeader, StatCard, Card, EmptyState, Spinner, StatusBadge, Toast, Btn } from "../components/Layout";
import { useTheme } from "./_app";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const SAMPLE_ORDERS = [
  { id: "#4821", product: "Rose Glow Serum", customer: "Maria Santos", status: "fulfilled", amount: "22.99", time: "2m ago" },
  { id: "#4820", product: "Moisture Shield SPF50", customer: "Jan Cruz", status: "processing", amount: "15.99", time: "14m ago" },
  { id: "#4819", product: "Keratin Repair Mask", customer: "Ana Reyes", status: "pending", amount: "37.49", time: "1h ago" },
  { id: "#4818", product: "Matte Lip Studio Kit", customer: "Bea Gomez", status: "fulfilled", amount: "13.59", time: "3h ago" },
];

export default function Dashboard() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme: T } = useTheme();
  const [open, setOpen] = useState(true);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, products: 0, orders: 0, fulfillment: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState(null);
  const notifRef = useRef(null);
  const prevCount = useRef(0);

  useEffect(() => {
    if (!shop) { setLoading(false); return; }
    loadData();
    const iv = setInterval(checkNew, 30000);
    return () => clearInterval(iv);
  }, [shop]);

  useEffect(() => {
    const fn = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  async function loadData() {
    if (!shop) return;
    try {
      const { data: m } = await supabase.from("merchants").select("shop_domain").eq("shop_domain", shop).single();
      if (m) setMerchant(m);
      const { data: orders } = await supabase.from("orders").select("*").eq("shop_domain", shop).order("created_at", { ascending: false });
      if (orders) {
        const revenue = orders.filter(o => o.financial_status !== "refunded").reduce((s, o) => s + parseFloat(o.total_price || 0), 0);
        const fulfilled = orders.filter(o => o.fulfillment_status === "fulfilled").length;
        setStats({ revenue, orders: orders.length, fulfillment: orders.length > 0 ? Math.round((fulfilled / orders.length) * 100) : 0 });
        setRecentOrders(orders.slice(0, 5));
        prevCount.current = orders.length;
        setNotifs(orders.slice(0, 8).map(o => ({ id: o.shopify_order_id, title: "New Order", msg: `${o.customer_name || "Customer"} · $${parseFloat(o.total_price || 0).toFixed(2)}`, time: o.created_at, read: true })));
      }
      const { data: pub } = await supabase.from("published_products").select("id").eq("shop_domain", shop);
      if (pub) setStats(prev => ({ ...prev, products: pub.length }));
    } catch {}
    setLoading(false);
  }

  async function checkNew() {
    if (!shop) return;
    try {
      const { data: orders } = await supabase.from("orders").select("*").eq("shop_domain", shop).order("created_at", { ascending: false }).limit(10);
      if (orders && orders.length > prevCount.current) {
        setUnread(prev => prev + (orders.length - prevCount.current));
        prevCount.current = orders.length;
        setRecentOrders(orders.slice(0, 5));
      }
    } catch {}
  }

  function goTo(href) { router.push(`${href}?shop=${shop || ""}`); }
  function fmtDate(d) { if (!d) return "—"; const diff = Date.now() - new Date(d).getTime(); const m = Math.floor(diff / 60000); if (m < 1) return "Just now"; if (m < 60) return `${m}m ago`; if (m < 1440) return `${Math.floor(m / 60)}h ago`; return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

  if (!shop && !loading) return (
    <div style={{ minHeight: "100vh", background: T.bgBase, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: T.textPrimary }}>Welcome to Cucuma®</div>
      <p style={{ fontSize: 14, color: T.textSecondary, maxWidth: 360, lineHeight: 1.6 }}>Install the app from your Shopify store to get started.</p>
      <a href="/" style={{ background: T.olive, color: "white", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>Go to Homepage →</a>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bgBase, overflow: "hidden" }}>
      <style>{`
        .scard:hover{transform:translateY(-2px);box-shadow:${T.shadowMd}!important;}
        .orow:hover{background:${T.bgElevated}!important;cursor:pointer;}
        .qa:hover{background:${T.bgElevated}!important;border-color:${T.borderDefault}!important;}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
        .notif-panel{animation:slideDown 0.18s ease;}
        @media(max-width:900px){.mgrid{grid-template-columns:1fr 1fr!important;}.cgrid{grid-template-columns:1fr!important;}}
        @media(max-width:768px){.hdr{padding:10px 16px 10px 52px!important;}.mpad{padding:16px!important;}.hide-mobile{display:none!important;}}
        @media(max-width:480px){.mgrid{grid-template-columns:1fr!important;}}
      `}</style>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SideNav active="dashboard" shop={shop} open={open} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <PageHeader
          title="Dashboard"
          subtitle={merchant?.shop_domain || (loading ? "Loading..." : "No store connected")}
          onMenuToggle={() => setOpen(!open)}
          actions={
            <>
              {/* Notification bell */}
              <div ref={notifRef} style={{ position: "relative" }}>
                <button onClick={() => { setShowNotifs(!showNotifs); setUnread(0); }}
                  style={{ position: "relative", background: unread > 0 ? T.goldSubtle : "none", border: `1px solid ${unread > 0 ? T.goldBorder : T.borderSubtle}`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: T.textSecondary, display: "flex", alignItems: "center", transition: "all 0.2s" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                  {unread > 0 && <span style={{ position: "absolute", top: -3, right: -3, background: T.orange, color: "white", borderRadius: "50%", width: 15, height: 15, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.bgCard}` }}>{unread}</span>}
                </button>
                {showNotifs && (
                  <div className="notif-panel" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 300, background: T.bgCard, border: `1px solid ${T.borderDefault}`, borderRadius: 12, boxShadow: T.shadowMd, zIndex: 100, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.borderSubtle}`, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: T.textPrimary }}>Notifications</span>
                      <button onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: T.olive, fontWeight: 600 }}>Mark all read</button>
                    </div>
                    <div style={{ maxHeight: 300, overflowY: "auto" }}>
                      {notifs.length === 0
                        ? <div style={{ padding: "24px 16px", textAlign: "center", fontSize: 13, color: T.textTertiary }}>No notifications yet</div>
                        : notifs.map((n, i) => (
                          <div key={i} style={{ padding: "11px 16px", borderBottom: `1px solid ${T.borderSubtle}`, background: n.read ? "transparent" : T.goldSubtle }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 2 }}>{n.title}</div>
                            <div style={{ fontSize: 11, color: T.textSecondary }}>{n.msg}</div>
                            <div style={{ fontSize: 10, color: T.textTertiary, marginTop: 3 }}>{fmtDate(n.time)}</div>
                          </div>
                        ))}
                    </div>
                    <div style={{ padding: "10px 16px", borderTop: `1px solid ${T.borderSubtle}`, textAlign: "center" }}>
                      <button onClick={() => { goTo("/orders"); setShowNotifs(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: T.olive, fontWeight: 600 }}>View All Orders →</button>
                    </div>
                  </div>
                )}
              </div>
              <Btn variant="secondary" onClick={() => goTo("/catalogue")} style={{ fontSize: 13 }} className="hide-mobile">+ Add Product</Btn>
              <Btn variant="primary" onClick={() => goTo("/catalogue")} style={{ fontSize: 13 }}>Publish to Store</Btn>
            </>
          }
        />

        <div className="mpad" style={{ padding: "20px 24px" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}><Spinner /></div>
          ) : (
            <>
              {/* Stats */}
              <div className="mgrid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
                {[
                  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.olive} strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, label: "Revenue this month", value: `$${(stats.revenue ?? 0).toFixed(2)}` },
                  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.olive} strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, label: "Products published", value: String(stats.products ?? 0) },
                  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.olive} strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>, label: "Total orders", value: String(stats.orders ?? 0) },
                  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.olive} strokeWidth="1.8"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, label: "Fulfillment rate", value: `${stats.fulfillment ?? 0}%` },
                ].map((s, i) => (
                  <div key={i} className="scard" style={{ background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 12, padding: "18px 20px", boxShadow: T.shadow, transition: "all 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: T.oliveSubtle, border: `1px solid ${T.oliveBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: T.textPrimary, marginBottom: 4, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: T.textTertiary }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="cgrid" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 14 }}>
                {/* Orders */}
                <div style={{ background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.borderSubtle}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: T.textPrimary }}>Recent Orders</div>
                      <div style={{ fontSize: 11, color: T.textTertiary, marginTop: 1 }}>Latest activity from your store</div>
                    </div>
                    <button onClick={() => goTo("/orders")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: T.olive, fontWeight: 600 }}>View all →</button>
                  </div>
                  {recentOrders.length === 0 ? (
                    <EmptyState icon="📦" title="No orders yet" description="Orders will appear here automatically when customers purchase from your Shopify store." cta="Browse Catalogue" onCta={() => goTo("/catalogue")} />
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
                        <thead>
                          <tr style={{ background: T.bgBase }}>
                            {["Order", "Customer", "Product", "Total", "Status"].map(h => (
                              <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T.textTertiary, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(recentOrders.length > 0 ? recentOrders : SAMPLE_ORDERS).map((o, i) => {
                            const isReal = !!o.shopify_order_id;
                            const status = isReal ? (o.fulfillment_status || "unfulfilled") : o.status;
                            const orderId = isReal ? o.order_number : o.id;
                            const customer = isReal ? (o.customer_name || "Guest") : o.customer;
                            let product = o.product || "—";
                            if (isReal && o.line_items) { try { const items = typeof o.line_items === "string" ? JSON.parse(o.line_items) : o.line_items; product = items[0]?.title || "—"; } catch {} }
                            const amount = isReal ? parseFloat(o.total_price || 0).toFixed(2) : o.amount;
                            return (
                              <tr key={i} className="orow" style={{ borderBottom: `1px solid ${T.borderSubtle}`, transition: "background 0.12s" }} onClick={() => goTo("/orders")}>
                                <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: T.olive, fontFamily: "'DM Sans', monospace" }}>{orderId}</td>
                                <td style={{ padding: "12px 16px", fontSize: 13, color: T.textPrimary, fontWeight: 500 }}>{customer}</td>
                                <td style={{ padding: "12px 16px", fontSize: 12, color: T.textSecondary }}>{product}</td>
                                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: T.textPrimary }}>${amount}</td>
                                <td style={{ padding: "12px 16px" }}><StatusBadge status={status} /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right panel */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Quick Actions */}
                  <div style={{ background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 12, padding: 16, boxShadow: T.shadow }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: T.textPrimary, marginBottom: 12 }}>Quick Actions</div>
                    {[
                      { label: "Browse Catalogue", sub: "Add products", href: "/catalogue" },
                      { label: "Edit Branding", sub: "Logo & colors", href: "/branding" },
                      { label: "View Orders", sub: "Track fulfillment", href: "/orders" },
                      { label: "Billing & Plans", sub: "Manage subscription", href: "/billing" },
                    ].map(a => (
                      <div key={a.href} className="qa" onClick={() => goTo(a.href)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 11px", background: T.bgSurface, border: `1px solid ${T.borderSubtle}`, borderRadius: 8, cursor: "pointer", marginBottom: 7, transition: "all 0.15s" }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary }}>{a.label}</div>
                          <div style={{ fontSize: 10, color: T.textTertiary, marginTop: 1 }}>{a.sub}</div>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    ))}
                  </div>

                  {/* Store status */}
                  <div style={{ background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 12, padding: 16, boxShadow: T.shadow }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: T.textPrimary, marginBottom: 12 }}>Store Status</div>
                    {[
                      { label: "App installed", ok: true },
                      { label: "Webhooks active", ok: true },
                      { label: "Order routing", ok: true },
                      { label: "GDPR compliance", ok: true },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 3 ? `1px solid ${T.borderSubtle}` : "none" }}>
                        <span style={{ fontSize: 12, color: T.textSecondary }}>{s.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.oliveSubtle, padding: "2px 9px", borderRadius: 100 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.olive }}></div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: T.olive }}>Active</span>
                        </div>
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