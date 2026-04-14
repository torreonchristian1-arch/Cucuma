import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

export default function Orders() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden", transition: "background 0.2s" }}>
      <style>{`
        @media (max-width: 768px) {
          .page-header { padding: 12px 16px 12px 60px !important; }
          .main-pad { padding: 16px !important; padding-top: 64px !important; }
          .webhook-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SideNav active="orders" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="page-header" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, transition: "background 0.2s" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: theme.text }}>Orders</div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Track and manage your fulfillment orders</div>
        </header>

        <div className="main-pad" style={{ padding: "28px", textAlign: "center" }}>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "44px 24px", marginBottom: 20, transition: "background 0.2s" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>📦</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 8 }}>Order Routing Coming Soon</div>
            <p style={{ fontSize: 14, color: theme.textMuted, maxWidth: 360, margin: "0 auto", lineHeight: 1.7 }}>
              Webhooks are registered and listening. Your full order dashboard is being built next.
            </p>
          </div>
          <div className="webhook-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {["orders/create", "orders/fulfilled", "products/update"].map(event => (
              <div key={event} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, transition: "background 0.2s" }}>
                <div style={{ fontSize: 11, color: theme.textSub, fontFamily: "monospace", marginBottom: 8 }}>{event}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></div>
                  <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Listening</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}