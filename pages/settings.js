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
    <div style={{ display: "flex", height: "100vh", background: "#080a0c", color: "#e8e0d4", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Cormorant+Garamond:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { outline: none; }
      `}</style>

      <SideNav active="settings" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header style={{ padding: "20px 32px", borderBottom: "1px solid #1a1c1f", background: "#080a0c", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "1px solid #1a1c1f", borderRadius: 6, color: "#6b6560", cursor: "pointer", padding: "6px 8px", fontSize: 14 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#e8e0d4" }}>Settings ⚙</div>
              <div style={{ fontSize: 12, color: "#4b4540", marginTop: 2 }}>Manage your app configuration</div>
            </div>
          </div>
          <button onClick={handleSave} style={{ background: saved ? "#0d2b1a" : "#d4b68e", border: saved ? "1px solid #4ade80" : "none", borderRadius: 8, padding: "9px 24px", color: saved ? "#4ade80" : "#1a0e04", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {saved ? "✓ Saved!" : "Save Settings"}
          </button>
        </header>

        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 700 }}>
          <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 20 }}>Store Information</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "#6b6560", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Connected Store</label>
              <input defaultValue={shop || ""} readOnly style={{ width: "100%", background: "#13151a", border: "1px solid #1a1c1f", borderRadius: 8, padding: "10px 14px", color: "#6b6560", fontSize: 14 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }}></div>
              <span style={{ fontSize: 13, color: "#4ade80" }}>App installed and active</span>
            </div>
          </div>

          <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 20 }}>Webhook Status</div>
            {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((topic, i, arr) => (
              <div key={topic} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid #111316" : "none" }}>
                <span style={{ fontSize: 13, color: "#8a8076", fontFamily: "monospace" }}>{topic}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }}></div>
                  <span style={{ fontSize: 11, color: "#4ade80" }}>Active</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 20 }}>App Configuration</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[["Shopify API Version", "2024-01"], ["App Version", "1.0.0"], ["Environment", "Development"], ["Region", "Asia Pacific"]].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: "#6b6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 14, color: "#a09080", background: "#13151a", border: "1px solid #1a1c1f", borderRadius: 8, padding: "10px 14px" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#0d0f12", border: "1px solid #2b1a1a", borderRadius: 14, padding: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#f87171", marginBottom: 16 }}>Danger Zone</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, color: "#e8e0d4", marginBottom: 4 }}>Uninstall App</div>
                <div style={{ fontSize: 12, color: "#6b6560" }}>This will remove the app from your Shopify store</div>
              </div>
              <button style={{ background: "transparent", border: "1px solid #f87171", borderRadius: 8, padding: "9px 20px", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Uninstall</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}