import { useRouter } from "next/router";
import { useState } from "react";
import SideNav from "../components/SideNav";

export default function Settings() {
  const router = useRouter();
  const { shop } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#faf9f7", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { outline: none; }
        @media (max-width: 768px) {
          .page-header { padding: 12px 16px 12px 60px !important; }
          .main-pad { padding: 16px !important; }
          .config-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SideNav active="settings" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="page-header" style={{ padding: "16px 28px", background: "white", borderBottom: "1px solid #f0ebe3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a0e04" }}>Settings</div>
            <div style={{ fontSize: 12, color: "#a09080", marginTop: 2 }}>Manage your app configuration</div>
          </div>
          <button onClick={handleSave} style={{ background: saved ? "#f0fdf4" : "linear-gradient(135deg, #c9963a, #a07020)", border: saved ? "1px solid #bbf7d0" : "none", borderRadius: 10, padding: "9px 20px", color: saved ? "#16a34a" : "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {saved ? "✓ Saved!" : "Save Settings"}
          </button>
        </header>

        <div className="main-pad" style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
          {/* Store Info */}
          <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1a0e04", marginBottom: 16 }}>Store Information</div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>Connected Store</label>
              <input defaultValue={shop || ""} readOnly style={{ width: "100%", background: "#faf9f7", border: "1px solid #f0ebe3", borderRadius: 8, padding: "10px 14px", color: "#6b5a4e", fontSize: 14 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }}></div>
              <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 500 }}>App installed and active</span>
            </div>
          </div>

          {/* Webhooks */}
          <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1a0e04", marginBottom: 16 }}>Webhook Status</div>
            {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((topic, i, arr) => (
              <div key={topic} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid #f5f0e8" : "none" }}>
                <span style={{ fontSize: 13, color: "#6b5a4e", fontFamily: "monospace" }}>{topic}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", padding: "3px 10px", borderRadius: 100 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></div>
                  <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Active</span>
                </div>
              </div>
            ))}
          </div>

          {/* Config */}
          <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1a0e04", marginBottom: 16 }}>App Configuration</div>
            <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["Shopify API Version", "2024-01"], ["App Version", "1.0.0"], ["Environment", "Production"], ["Region", "Asia Pacific"]].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 14, color: "#6b5a4e", background: "#faf9f7", border: "1px solid #f0ebe3", borderRadius: 8, padding: "10px 14px" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger */}
          <div style={{ background: "white", border: "1px solid #fecaca", borderRadius: 14, padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#dc2626", marginBottom: 14 }}>Danger Zone</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, color: "#1a0e04", fontWeight: 500, marginBottom: 4 }}>Uninstall App</div>
                <div style={{ fontSize: 12, color: "#a09080" }}>This will remove the app from your Shopify store</div>
              </div>
              <button style={{ background: "transparent", border: "1px solid #fecaca", borderRadius: 8, padding: "9px 18px", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Uninstall</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}