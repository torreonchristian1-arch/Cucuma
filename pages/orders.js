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
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
    setLoading(false);
  }

  const statusStyle = {
    fulfilled: { bg: mode === "dark" ? "#0d2b1a" : "#f0fdf4", color: "#16a34a", border: mode === "dark" ? "#166534" : "#bbf7d0", label: "Fulfilled" },
    unfulfilled: { bg: mode === "dark" ? "#1a1a0d" : "#fefce8", color: "#ca8a04", border: mode === "dark" ? "#854d0e" : "#fef08a", label: "Unfulfilled" },
    cancelled: { bg: mode === "dark" ? "#1a0d0d" : "#fff7ed", color: "#ea580c", border: mode === "dark" ? "#9a3412" : "#fed7aa", label: "Cancelled" },
    partial: { bg: mode === "dark" ? "#0d1a2b" : "#eff6ff", color: "#2563eb", border: mode === "dark" ? "#1e3a5f" : "#bfdbfe", label: "Partial" },
  };

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.fulfillment_status === filter);

  const stats = {
    total: orders.length,
    unfulfilled: orders.filter(o => o.fulfillment_status === "unfulfilled" || !o.fulfillment_status).length,
    fulfilled: orders.filter(o => o.fulfillment_status === "fulfilled").length,
    cancelled: orders.filter(o => o.fulfillment_status === "cancelled").length,
    revenue: orders.filter(o => o.fulfillment_status !== "cancelled").reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0),
  };

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatTime(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
  }

  function getLineItems(order) {
    try {
      const items = typeof order.line_items === "string" ? JSON.parse(order.line_items) : order.line_items;
      return items || [];
    } catch { return []; }
  }

  function getShippingAddress(order) {
    try {
      const addr = typeof order.shipping_address === "string" ? JSON.parse(order.shipping_address) : order.shipping_address;
      if (!addr || !addr.city) return "No address";
      return `${addr.city}, ${addr.province || ""} ${addr.country || ""}`.trim();
    } catch { return "—"; }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden", transition: "background 0.2s" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .order-row { cursor: pointer; transition: background 0.15s; }
        .order-row:hover { background: ${theme.surfaceAlt} !important; }
        .filter-btn:hover { background: ${theme.goldLight} !important; }
        @media (max-width: 768px) {
          .page-header { padding: 12px 16px 12px 60px !important; flex-wrap: wrap; gap: 8px; }
          .main-pad { padding: 16px !important; padding-top: 64px !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .orders-layout { grid-template-columns: 1fr !important; }
          th:nth-child(4), td:nth-child(4),
          th:nth-child(5), td:nth-child(5) { display: none; }
        }
        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SideNav active="orders" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header className="page-header" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, transition: "background 0.2s" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: theme.text }}>Orders</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Real-time order routing & fulfillment</div>
          </div>
          <button onClick={fetchOrders} style={{ background: theme.goldLight, border: `1px solid ${theme.goldBorder}`, borderRadius: 10, padding: "8px 16px", color: theme.gold, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ↻ Refresh
          </button>
        </header>

        <div className="main-pad" style={{ padding: "20px 28px" }}>

          {/* Stats */}
          <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Total Orders", value: stats.total, color: theme.text, icon: "📋" },
              { label: "Unfulfilled", value: stats.unfulfilled, color: "#ca8a04", icon: "⏳" },
              { label: "Fulfilled", value: stats.fulfilled, color: "#16a34a", icon: "✓" },
              { label: "Cancelled", value: stats.cancelled, color: "#ea580c", icon: "✗" },
              { label: "Total Revenue", value: `₱${stats.revenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`, color: theme.gold, icon: "💰" },
            ].map((s, i) => (
              <div key={i} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "14px 16px", transition: "background 0.2s" }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: i === 4 ? 16 : 22, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
            {[{ key: "all", label: "All Orders" }, { key: "unfulfilled", label: "Unfulfilled" }, { key: "fulfilled", label: "Fulfilled" }, { key: "cancelled", label: "Cancelled" }].map(f => (
              <button key={f.key} className="filter-btn" onClick={() => setFilter(f.key)}
                style={{ background: filter === f.key ? theme.goldLight : theme.surface, border: filter === f.key ? `1px solid ${theme.goldBorder}` : `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 16px", color: filter === f.key ? theme.gold : theme.textSub, fontSize: 13, fontWeight: filter === f.key ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>
                {f.label}
                <span style={{ marginLeft: 6, background: theme.surfaceAlt, borderRadius: 100, padding: "1px 7px", fontSize: 11, color: theme.textMuted }}>
                  {f.key === "all" ? orders.length : orders.filter(o => (o.fulfillment_status || "unfulfilled") === f.key).length}
                </span>
              </button>
            ))}
          </div>

          {/* Orders Layout */}
          <div className="orders-layout" style={{ display: "grid", gridTemplateColumns: selectedOrder ? "1fr 360px" : "1fr", gap: 16 }}>

            {/* Orders Table */}
            <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden", transition: "background 0.2s" }}>
              {loading ? (
                <div style={{ padding: "60px 24px", textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, border: `3px solid ${theme.border}`, borderTopColor: theme.gold, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }}></div>
                  <div style={{ fontSize: 14, color: theme.textMuted }}>Loading orders...</div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div style={{ padding: "60px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: theme.text, marginBottom: 8 }}>
                    {orders.length === 0 ? "No orders yet" : "No orders match this filter"}
                  </div>
                  <p style={{ fontSize: 13, color: theme.textMuted, maxWidth: 320, margin: "0 auto" }}>
                    {orders.length === 0 ? "Orders will appear here automatically when customers purchase from your store." : "Try selecting a different filter."}
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                    <thead>
                      <tr style={{ background: theme.surfaceAlt }}>
                        {["Order", "Customer", "Items", "Total", "Date", "Status"].map(h => (
                          <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, color: theme.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, i) => {
                        const status = order.fulfillment_status || "unfulfilled";
                        const s = statusStyle[status] || statusStyle.unfulfilled;
                        const items = getLineItems(order);
                        const isSelected = selectedOrder?.shopify_order_id === order.shopify_order_id;
                        return (
                          <tr key={i} className="order-row"
                            onClick={() => setSelectedOrder(isSelected ? null : order)}
                            style={{ borderBottom: `1px solid ${theme.border}`, background: isSelected ? theme.goldLight : "transparent" }}>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: theme.gold, fontWeight: 600 }}>{order.order_number}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{order.customer_name || "Guest"}</div>
                              <div style={{ fontSize: 11, color: theme.textMuted }}>{order.customer_email}</div>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: theme.textSub }}>{items.length} item{items.length !== 1 ? "s" : ""}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: theme.text, fontWeight: 600 }}>₱{parseFloat(order.total_price || 0).toLocaleString()}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ fontSize: 12, color: theme.textSub }}>{formatDate(order.created_at)}</div>
                              <div style={{ fontSize: 10, color: theme.textMuted }}>{formatTime(order.created_at)}</div>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{s.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Order Detail Panel */}
            {selectedOrder && (
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, height: "fit-content", transition: "background 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: theme.text }}>{selectedOrder.order_number}</div>
                  <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, fontSize: 18 }}>✕</button>
                </div>

                {/* Status */}
                {(() => {
                  const status = selectedOrder.fulfillment_status || "unfulfilled";
                  const s = statusStyle[status] || statusStyle.unfulfilled;
                  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 600, display: "inline-block", marginBottom: 16 }}>{s.label}</span>;
                })()}

                {/* Customer */}
                <div style={{ marginBottom: 16, padding: "12px 14px", background: theme.surfaceAlt, borderRadius: 10, border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: 10, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 8 }}>Customer</div>
                  <div style={{ fontSize: 13, color: theme.text, fontWeight: 500, marginBottom: 2 }}>{selectedOrder.customer_name || "Guest"}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>{selectedOrder.customer_email || "No email"}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>📍 {getShippingAddress(selectedOrder)}</div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>Order Items</div>
                  {getLineItems(selectedOrder).map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
                      <div>
                        <div style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{item.title || item.name}</div>
                        <div style={{ fontSize: 11, color: theme.textMuted }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>₱{parseFloat(item.price || 0).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: theme.goldLight, borderRadius: 10, border: `1px solid ${theme.goldBorder}` }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme.gold }}>Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: theme.gold }}>₱{parseFloat(selectedOrder.total_price || 0).toLocaleString()}</span>
                </div>

                {/* Date */}
                <div style={{ marginTop: 12, fontSize: 11, color: theme.textMuted, textAlign: "center" }}>
                  Placed on {formatDate(selectedOrder.created_at)} at {formatTime(selectedOrder.created_at)}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
