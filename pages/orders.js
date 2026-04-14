import { useRouter } from "next/router";
import { useState } from "react";
import SideNav from "../components/SideNav";

export default function Orders() {
  const router = useRouter();
  const { shop } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080a0c", color: "#e8e0d4", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Cormorant+Garamond:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <SideNav active="orders" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header style={{ padding: "20px 32px", borderBottom: "1px solid #1a1c1f", background: "#080a0c", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "1px solid #1a1c1f", borderRadius: 6, color: "#6b6560", cursor: "pointer", padding: "6px 8px", fontSize: 14 }}>☰</button>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#e8e0d4" }}>Orders ⬡</div>
            <div style={{ fontSize: 12, color: "#4b4540", marginTop: 2 }}>Track and manage your fulfillment orders</div>
          </div>
        </header>

        <div style={{ padding: "60px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 24, opacity: 0.15 }}>⬡</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#e8e0d4", marginBottom: 12 }}>Order Routing Coming Soon</div>
          <div style={{ fontSize: 14, color: "#6b6560", maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Webhooks are registered and listening. The order routing dashboard is the next feature being built.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 600, margin: "0 auto" }}>
            {["orders/create", "orders/fulfilled", "products/update"].map(event => (
              <div key={event} style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: "#6b6560", fontFamily: "monospace", marginBottom: 8 }}>{event}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }}></div>
                  <span style={{ fontSize: 11, color: "#4ade80" }}>Listening</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}