import { useRouter } from "next/router";
import { useState } from "react";
import SideNav from "../components/SideNav";

export default function Orders() {
  const router = useRouter();
  const { shop } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#faf9f7", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .page-header { padding: 12px 16px 12px 60px !important; }
          .main-pad { padding: 16px !important; }
          .webhook-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SideNav active="orders" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="page-header" style={{ padding: "16px 28px", background: "white", borderBottom: "1px solid #f0ebe3" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a0e04" }}>Orders</div>
          <div style={{ fontSize: 12, color: "#a09080", marginTop: 2 }}>Track and manage your fulfillment orders</div>
        </header>

        <div className="main-pad" style={{ padding: "28px", textAlign: "center" }}>
          <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 16, padding: "48px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a0e04", marginBottom: 8 }}>Order Routing Coming Soon</div>
            <p style={{ fontSize: 14, color: "#a09080", maxWidth: 380, margin: "0 auto", lineHeight: 1.7 }}>
              Webhooks are registered and listening. Your order routing dashboard is the next feature being built.
            </p>
          </div>

          <div className="webhook-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {["orders/create", "orders/fulfilled", "products/update"].map(event => (
              <div key={event} style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 12, padding: "16px" }}>
                <div style={{ fontSize: 11, color: "#6b5a4e", fontFamily: "monospace", marginBottom: 8 }}>{event}</div>
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