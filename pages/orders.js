// FILE: pages/orders.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

export default function Orders() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!shop) { setLoading(false); return; }
    fetchOrders();
  }, [shop]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/list?shop=${shop}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch { }
    setLoading(false);
  }

  const SC = {
    fulfilled: { label: "Fulfilled", color: theme.green, bg: theme.greenBg, border: theme.greenBorder },
    unfulfilled: { label: "Unfulfilled", color: "#ca8a04", bg: mode === "dark" ? "#1a1500" : "#fefce8", border: mode === "dark" ? "#854d0e" : "#fde68a" },
    cancelled: { label: "Cancelled", color: theme.orange, bg: theme.orangeBg, border: theme.orangeBorder },
    partial: { label: "Partial", color: theme.blue, bg: theme.blueBg, border: theme.blueBorder },
  };

  const filtered = filter === "all" ? orders : orders.filter(o => (o.fulfillment_status || "unfulfilled") === filter);
  const stats = {
    total: orders.length,
    unfulfilled: orders.filter(o => !o.fulfillment_status || o.fulfillment_status === "unfulfilled").length,
    fulfilled: orders.filter(o => o.fulfillment_status === "fulfilled").length,
    cancelled: orders.filter(o => o.fulfillment_status === "cancelled").length,
    revenue: orders.filter(o => o.fulfillment_status !== "cancelled").reduce((s, o) => s + parseFloat(o.total_price || 0), 0),
  };

  function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : "—"; }
  function fmtTime(d) { return d ? new Date(d).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }) : ""; }
  function getItems(o) { try { return typeof o.line_items === "string" ? JSON.parse(o.line_items) : (o.line_items || []); } catch { return []; } }
  function getAddr(o) { try { const a = typeof o.shipping_address === "string" ? JSON.parse(o.shipping_address) : o.shipping_address; return a?.city ? `${a.city}, ${a.province || ""} ${a.country || ""}`.trim() : "No address"; } catch { return "—"; } }

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, overflow: "hidden", transition: "background 0.25s" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .orow { cursor: pointer; transition: background 0.12s; }
        .orow:hover { background: ${theme.surfaceHover} !important; }
        @media (max-width: 768px) {
          .hdr { padding: 10px 16px 10px 56px !important; flex-wrap: wrap; gap: 8px; }
          .main-pad { padding: 16px !important; padding-top: 60px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .orders-layout { grid-template-columns: 1fr !important; }
          .hide-sm { display: none !important; }
        }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <SideNav active="orders" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="hdr" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", color: theme.textMuted, cursor: "pointer", fontSize: 15 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: theme.text }}>Orders</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>Real-time order routing & fulfillment</div>
            </div>
          </div>
          <button onClick={fetchOrders} style={{ background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, borderRadius: 9, padding: "8px 16px", color: theme.goldText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>↻ Refresh</button>
        </header>

        <div className="main-pad" style={{ padding: "22px 28px" }}>
          {/* Stats */}
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Total", value: stats.total, icon: "📋", color: theme.text },
              { label: "Unfulfilled", value: stats.unfulfilled, icon: "⏳", color: "#ca8a04" },
              { label: "Fulfilled", value: stats.fulfilled, icon: "✓", color: theme.green },
              { label: "Cancelled", value: stats.cancelled, icon: "✗", color: theme.orange },
              { label: "Revenue", value: `₱${stats.revenue.toLocaleString("en-PH", { minimumFractionDigits: 0 })}`, icon: "💰", color: theme.gold },
            ].map((s, i) => (
              <div key={i} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "16px", boxShadow: theme.shadow }}>
                <div style={{ fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: i === 4 ? 16 : 24, fontWeight: 700, color: s.color, marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
            {[{ key: "all", label: "All" }, { key: "unfulfilled", label: "Unfulfilled" }, { key: "fulfilled", label: "Fulfilled" }, { key: "cancelled", label: "Cancelled" }].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{ background: filter === f.key ? theme.gold : theme.surface, border: filter === f.key ? "none" : `1px solid ${theme.border}`, borderRadius: 9, padding: "8px 16px", color: filter === f.key ? "white" : theme.textSub, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", boxShadow: filter === f.key ? `0 4px 14px rgba(184,134,42,0.3)` : "none", transition: "all 0.15s" }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Layout */}
          <div className="orders-layout" style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: 16 }}>
            <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden", boxShadow: theme.shadow }}>
              {loading ? (
                <div style={{ padding: "60px", textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, border: `3px solid ${theme.border}`, borderTopColor: theme.gold, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }}></div>
                  <div style={{ fontSize: 14, color: theme.textMuted }}>Loading orders...</div>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: "60px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>📦</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: theme.text, marginBottom: 8 }}>{orders.length === 0 ? "No orders yet" : "No orders match this filter"}</div>
                  <p style={{ fontSize: 13, color: theme.textMuted, maxWidth: 340, margin: "0 auto", lineHeight: 1.6 }}>
                    {orders.length === 0 ? "Orders appear here automatically when customers purchase from your Shopify store." : "Try a different filter above."}
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                    <thead>
                      <tr style={{ background: theme.surfaceAlt }}>
                        {["Order", "Customer", "Items", "Total", "Date", "Status"].map(h => (
                          <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((o, i) => {
                        const s = SC[o.fulfillment_status || "unfulfilled"] || SC.unfulfilled;
                        const isSelected = selected?.shopify_order_id === o.shopify_order_id;
                        return (
                          <tr key={i} className="orow" onClick={() => setSelected(isSelected ? null : o)}
                            style={{ borderBottom: `1px solid ${theme.border}`, background: isSelected ? theme.goldBg : "transparent" }}>
                            <td style={{ padding: "13px 18px", fontSize: 12, fontWeight: 700, color: theme.gold }}>{o.order_number}</td>
                            <td style={{ padding: "13px 18px" }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{o.customer_name || "Guest"}</div>
                              <div style={{ fontSize: 11, color: theme.textMuted }}>{o.customer_email}</div>
                            </td>
                            <td style={{ padding: "13px 18px", fontSize: 12, color: theme.textSub }}>{getItems(o).length} item(s)</td>
                            <td style={{ padding: "13px 18px", fontSize: 13, fontWeight: 700, color: theme.text }}>₱{parseFloat(o.total_price || 0).toLocaleString()}</td>
                            <td style={{ padding: "13px 18px" }}>
                              <div style={{ fontSize: 12, color: theme.textSub }}>{fmtDate(o.created_at)}</div>
                              <div style={{ fontSize: 10, color: theme.textMuted }}>{fmtTime(o.created_at)}</div>
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                              <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 100, padding: "3px 11px", fontSize: 11, fontWeight: 700 }}>{s.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selected && (
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, boxShadow: theme.shadow, height: "fit-content" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: theme.text }}>{selected.order_number}</div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: 20 }}>✕</button>
                </div>
                {(() => { const s = SC[selected.fulfillment_status || "unfulfilled"] || SC.unfulfilled; return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 16 }}>{s.label}</span>; })()}
                <div style={{ background: theme.surfaceAlt, borderRadius: 10, padding: "12px", marginBottom: 14, border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Customer</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{selected.customer_name || "Guest"}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>{selected.customer_email || "No email"}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>📍 {getAddr(selected)}</div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Items</div>
                  {getItems(selected).map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${theme.border}` }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{item.title || item.name}</div>
                        <div style={{ fontSize: 11, color: theme.textMuted }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>₱{parseFloat(item.price || 0).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, borderRadius: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: theme.goldText }}>Total</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: theme.gold }}>₱{parseFloat(selected.total_price || 0).toLocaleString()}</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: theme.textMuted, textAlign: "center" }}>{fmtDate(selected.created_at)} at {fmtTime(selected.created_at)}</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}