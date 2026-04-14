import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

function StatusBadge({ status, theme }) {
  const s = {
    fulfilled: { bg: theme.greenSubtle, color: theme.green, label: "Fulfilled" },
    unfulfilled: { bg: "rgba(196,151,90,0.12)", color: theme.gold, label: "Unfulfilled" },
    pending: { bg: "rgba(196,151,90,0.12)", color: theme.gold, label: "Pending" },
    cancelled: { bg: "rgba(192,80,80,0.1)", color: "#C05050", label: "Cancelled" },
  }[status] || { bg: "rgba(196,151,90,0.12)", color: theme.gold, label: "Unfulfilled" };
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 100 }}>{s.label}</span>;
}

export default function Orders() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => { if (!shop) { setLoading(false); return; } fetchOrders(); }, [shop]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/list?shop=${shop}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {}
    setLoading(false);
  }

  const stats = { total: orders.length, unfulfilled: orders.filter(o => !o.fulfillment_status || o.fulfillment_status === "unfulfilled").length, fulfilled: orders.filter(o => o.fulfillment_status === "fulfilled").length, revenue: orders.filter(o => o.fulfillment_status !== "cancelled").reduce((s, o) => s + parseFloat(o.total_price || 0), 0) };
  const filtered = filter === "all" ? orders : orders.filter(o => (o.fulfillment_status || "unfulfilled") === filter);

  function getItems(o) { try { return typeof o.line_items === "string" ? JSON.parse(o.line_items) : (o.line_items || []); } catch { return []; } }
  function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"; }

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bgBase, overflow: "hidden" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .orow { cursor: pointer; transition: background 0.12s; }
        .orow:hover { background: ${theme.bgElevated} !important; }
        .filter-tab { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; border: 1px solid; white-space: nowrap; }
        @media (max-width: 768px) { .hdr { padding: 10px 16px 10px 52px !important; } .main-pad { padding: 16px !important; } .stats-row { grid-template-columns: 1fr 1fr !important; } .orders-layout { grid-template-columns: 1fr !important; } .hide-sm { display: none !important; } }
        @media (max-width: 480px) { .stats-row { grid-template-columns: 1fr !important; } }
      `}</style>

      <SideNav active="orders" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="hdr" style={{ padding: "12px 24px", background: theme.bgCard, borderBottom: `1px solid ${theme.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.borderSubtle}`, borderRadius: 7, padding: "6px 9px", color: theme.textTertiary, cursor: "pointer", display: "flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary }}>Orders</div>
              <div style={{ fontSize: 12, color: theme.textTertiary }}>Real-time order routing & fulfillment</div>
            </div>
          </div>
          <button onClick={fetchOrders} style={{ background: theme.bgSurface, border: `1px solid ${theme.borderDefault}`, borderRadius: 8, padding: "7px 14px", color: theme.textSecondary, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            Refresh
          </button>
        </header>

        <div className="main-pad" style={{ padding: "18px 24px" }}>
          {/* Stats */}
          <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
            {[
              { label: "Total Orders", value: stats.total, icon: "📋" },
              { label: "Unfulfilled", value: stats.unfulfilled, color: theme.gold },
              { label: "Fulfilled", value: stats.fulfilled, color: theme.green },
              { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, color: theme.gold, mono: true },
            ].map((s, i) => (
              <div key={i} style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: "14px 16px", boxShadow: theme.shadow }}>
                <div style={{ fontFamily: s.mono ? "'JetBrains Mono', monospace" : "inherit", fontSize: 22, fontWeight: 600, color: s.color || theme.textPrimary, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
            {[{ key: "all", label: "All" }, { key: "unfulfilled", label: "Unfulfilled" }, { key: "fulfilled", label: "Fulfilled" }, { key: "cancelled", label: "Cancelled" }].map(f => (
              <button key={f.key} className="filter-tab" onClick={() => setFilter(f.key)}
                style={{ background: filter === f.key ? theme.goldSubtle : theme.bgSurface, borderColor: filter === f.key ? theme.goldBorder : theme.borderSubtle, color: filter === f.key ? theme.gold : theme.textSecondary }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Table / Empty */}
          <div className="orders-layout" style={{ display: "grid", gridTemplateColumns: selected ? "1fr 320px" : "1fr", gap: 16 }}>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, overflow: "hidden", boxShadow: theme.shadow }}>
              {loading ? (
                <div style={{ padding: "60px", textAlign: "center" }}>
                  <div style={{ width: 28, height: 28, border: `2px solid ${theme.borderDefault}`, borderTopColor: theme.gold, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }}></div>
                  <div style={{ fontSize: 13, color: theme.textTertiary }}>Loading orders...</div>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: "60px 24px", textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.bgSurface, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.textTertiary} strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary, marginBottom: 6 }}>{orders.length === 0 ? "No orders yet" : "No orders match this filter"}</div>
                  <p style={{ fontSize: 13, color: theme.textTertiary, maxWidth: 300, margin: "0 auto", lineHeight: 1.6 }}>{orders.length === 0 ? "Orders will appear here automatically when customers purchase from your Shopify store." : "Try selecting a different filter above."}</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                    <thead>
                      <tr style={{ background: theme.bgBase }}>
                        {["Order", "Customer", "Items", "Total", "Date", "Status"].map(h => (
                          <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: theme.textTertiary, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((o, i) => (
                        <tr key={i} className="orow" onClick={() => setSelected(selected?.shopify_order_id === o.shopify_order_id ? null : o)} style={{ borderBottom: `1px solid ${theme.borderSubtle}`, background: selected?.shopify_order_id === o.shopify_order_id ? theme.goldSubtle : "transparent" }}>
                          <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: theme.gold, fontFamily: "'JetBrains Mono', monospace" }}>{o.order_number}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: theme.textPrimary }}>{o.customer_name || "Guest"}</div>
                            <div style={{ fontSize: 11, color: theme.textTertiary }}>{o.customer_email}</div>
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: 12, color: theme.textSecondary }}>{getItems(o).length} item(s)</td>
                          <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: theme.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}>${parseFloat(o.total_price || 0).toFixed(2)}</td>
                          <td style={{ padding: "12px 16px", fontSize: 12, color: theme.textSecondary }}>{fmtDate(o.created_at)}</td>
                          <td style={{ padding: "12px 16px" }}><StatusBadge status={o.fulfillment_status || "unfulfilled"} theme={theme} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selected && (
              <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: 18, boxShadow: theme.shadow, height: "fit-content" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>{selected.order_number}</div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textTertiary, fontSize: 18 }}>✕</button>
                </div>
                <StatusBadge status={selected.fulfillment_status || "unfulfilled"} theme={theme} />
                <div style={{ marginTop: 14, background: theme.bgSurface, borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.textTertiary, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Customer</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{selected.customer_name || "Guest"}</div>
                  <div style={{ fontSize: 12, color: theme.textTertiary, marginTop: 2 }}>{selected.customer_email}</div>
                </div>
                {getItems(selected).map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.borderSubtle}` }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: theme.textPrimary }}>{item.title || item.name}</div>
                      <div style={{ fontSize: 11, color: theme.textTertiary }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: theme.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}>${parseFloat(item.price || 0).toFixed(2)}</div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: theme.goldSubtle, border: `1px solid ${theme.goldBorder}`, borderRadius: 8, marginTop: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: theme.gold }}>Total</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: theme.gold, fontFamily: "'JetBrains Mono', monospace" }}>${parseFloat(selected.total_price || 0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}