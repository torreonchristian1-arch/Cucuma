import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { PageHeader, EmptyState, Spinner, StatusBadge } from "../components/Layout";
import { useTheme } from "./_app";

export default function Orders() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme: T } = useTheme();
  const [open, setOpen] = useState(true);
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

  const stats = {
    total: orders.length,
    unfulfilled: orders.filter(o => !o.fulfillment_status || o.fulfillment_status === "unfulfilled").length,
    fulfilled: orders.filter(o => o.fulfillment_status === "fulfilled").length,
    revenue: orders.filter(o => o.financial_status !== "cancelled").reduce((s, o) => s + parseFloat(o.total_price || 0), 0),
  };

  const filtered = filter === "all" ? orders : orders.filter(o => (o.fulfillment_status || "unfulfilled") === filter);
  function getItems(o) { try { return typeof o.line_items === "string" ? JSON.parse(o.line_items) : (o.line_items || []); } catch { return []; } }
  function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"; }

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bgBase, overflow: "hidden" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        .orow{cursor:pointer;transition:background 0.12s;}
        .orow:hover{background:${T.bgElevated}!important;}
        .ftab{padding:6px 14px;border-radius:100px;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.15s;border:1px solid;white-space:nowrap;font-family:'DM Sans',sans-serif;background:none;}
        @media(max-width:768px){.hdr{padding:10px 16px 10px 52px!important;}.mpad{padding:16px!important;}.sgrid{grid-template-columns:1fr 1fr!important;}.olayout{grid-template-columns:1fr!important;}.hide-mobile{display:none!important;}}
        @media(max-width:480px){.sgrid{grid-template-columns:1fr!important;}}
      `}</style>

      <SideNav active="orders" shop={shop} open={open} />
      <main style={{ flex: 1, overflow: "auto" }}>
        <PageHeader
          title="Orders"
          subtitle="Real-time order routing & fulfillment"
          onMenuToggle={() => setOpen(!open)}
          actions={
            <button onClick={fetchOrders} style={{ background:T.bgSurface, border:`1px solid ${T.borderDefault}`, borderRadius:8, padding:"7px 14px", color:T.textSecondary, fontSize:13, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"'DM Sans',sans-serif" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              Refresh
            </button>
          }
        />

        <div className="mpad" style={{ padding: "18px 24px" }}>
          {/* Stats */}
          <div className="sgrid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
            {[
              { label: "Total Orders", value: stats.total },
              { label: "Unfulfilled", value: stats.unfulfilled, color: T.gold },
              { label: "Fulfilled", value: stats.fulfilled, color: T.olive },
              { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, color: T.textPrimary, serif: true },
            ].map((s, i) => (
              <div key={i} style={{ background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:12, padding:"14px 16px", boxShadow:T.shadow }}>
                <div style={{ fontFamily:s.serif?"'Cormorant Garamond',serif":"inherit", fontSize:22, fontWeight:600, color:s.color||T.textPrimary, marginBottom:4 }}>{s.value}</div>
                <div style={{ fontSize:11, fontWeight:600, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto" }}>
            {[{ key:"all", label:"All" }, { key:"unfulfilled", label:"Unfulfilled" }, { key:"fulfilled", label:"Fulfilled" }, { key:"cancelled", label:"Cancelled" }].map(f => (
              <button key={f.key} className="ftab" onClick={() => setFilter(f.key)}
                style={{ background:filter===f.key?T.oliveSubtle:"transparent", borderColor:filter===f.key?T.oliveBorder:T.borderSubtle, color:filter===f.key?T.olive:T.textSecondary }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="olayout" style={{ display:"grid", gridTemplateColumns:selected?"1fr 300px":"1fr", gap:14 }}>
            <div style={{ background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:12, overflow:"hidden", boxShadow:T.shadow }}>
              {loading ? (
                <div style={{ padding:"60px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}><Spinner /><div style={{ fontSize:13, color:T.textTertiary }}>Loading orders...</div></div>
              ) : filtered.length === 0 ? (
                <EmptyState icon="📦" title={orders.length === 0 ? "No orders yet" : "No orders match this filter"} description={orders.length === 0 ? "Orders will appear automatically when customers purchase from your Shopify store." : "Try selecting a different filter."} />
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
                    <thead>
                      <tr style={{ background:T.bgBase }}>
                        {["Order", "Customer", "Items", "Total", "Date", "Status"].map(h => (
                          <th key={h} style={{ padding:"9px 16px", textAlign:"left", fontSize:10, fontWeight:700, color:T.textTertiary, letterSpacing:"0.1em", textTransform:"uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((o, i) => (
                        <tr key={i} className="orow" onClick={() => setSelected(selected?.shopify_order_id === o.shopify_order_id ? null : o)} style={{ borderBottom:`1px solid ${T.borderSubtle}`, background:selected?.shopify_order_id===o.shopify_order_id?T.oliveSubtle:"transparent" }}>
                          <td style={{ padding:"12px 16px", fontSize:12, fontWeight:600, color:T.olive }}>{o.order_number}</td>
                          <td style={{ padding:"12px 16px" }}><div style={{ fontSize:13, fontWeight:500, color:T.textPrimary }}>{o.customer_name||"Guest"}</div><div style={{ fontSize:11, color:T.textTertiary }}>{o.customer_email}</div></td>
                          <td style={{ padding:"12px 16px", fontSize:12, color:T.textSecondary }}>{getItems(o).length} item(s)</td>
                          <td style={{ padding:"12px 16px", fontSize:13, fontWeight:600, color:T.textPrimary }}>${parseFloat(o.total_price||0).toFixed(2)}</td>
                          <td style={{ padding:"12px 16px", fontSize:12, color:T.textSecondary }}>{fmtDate(o.created_at)}</td>
                          <td style={{ padding:"12px 16px" }}><StatusBadge status={o.fulfillment_status||"unfulfilled"} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selected && (
              <div style={{ background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:12, padding:18, boxShadow:T.shadow, height:"fit-content" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary }}>{selected.order_number}</div>
                  <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textTertiary, fontSize:18 }}>✕</button>
                </div>
                <StatusBadge status={selected.fulfillment_status||"unfulfilled"} />
                <div style={{ marginTop:14, background:T.bgSurface, borderRadius:8, padding:12, marginBottom:12 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Customer</div>
                  <div style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>{selected.customer_name||"Guest"}</div>
                  <div style={{ fontSize:12, color:T.textTertiary, marginTop:2 }}>{selected.customer_email}</div>
                </div>
                {getItems(selected).map((item, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.borderSubtle}` }}>
                    <div><div style={{ fontSize:12, fontWeight:500, color:T.textPrimary }}>{item.title||item.name}</div><div style={{ fontSize:11, color:T.textTertiary }}>Qty: {item.quantity}</div></div>
                    <div style={{ fontSize:12, fontWeight:600, color:T.textPrimary }}>${parseFloat(item.price||0).toFixed(2)}</div>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", padding:"12px", background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:8, marginTop:12 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:T.olive }}>Total</span>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:T.olive }}>${parseFloat(selected.total_price||0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}