import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

export default function Settings() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 3000); }

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden", transition: "background 0.2s" }}>
      <style>{`
        input { outline: none; }
        @media (max-width: 768px) {
          .page-header { padding: 12px 16px 12px 60px !important; flex-wrap: wrap; gap: 8px; }
          .main-pad { padding: 16px !important; padding-top: 64px !important; }
          .config-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SideNav active="settings" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="page-header" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: theme.text }}>Settings</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Manage your app configuration</div>
          </div>
          <button onClick={handleSave} style={{ background: saved ? theme.tagBg : "linear-gradient(135deg, #c9963a, #a07020)", border: saved ? `1px solid ${theme.tagBorder}` : "none", borderRadius: 10, padding: "8px 18px", color: saved ? theme.tagText : "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {saved ? "✓ Saved!" : "Save Settings"}
          </button>
        </header>

        <div className="main-pad" style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 700 }}>

          {/* Theme Toggle Card */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, transition: "background 0.2s" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Appearance</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, color: theme.text, fontWeight: 500, marginBottom: 4 }}>{mode === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>Toggle between light and dark theme</div>
              </div>
              <button onClick={toggleTheme} style={{
                width: 52, height: 28, background: mode === "dark" ? theme.gold : theme.border,
                border: "none", borderRadius: 100, position: "relative", cursor: "pointer", transition: "background 0.2s",
              }}>
                <div style={{ position: "absolute", top: 3, left: mode === "dark" ? 26 : 3, width: 22, height: 22, background: "white", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}></div>
              </button>
            </div>
          </div>

          {/* Store Info */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, transition: "background 0.2s" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Store Information</div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>Connected Store</label>
              <input defaultValue={shop || ""} readOnly style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "10px 14px", color: theme.textSub, fontSize: 14 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: theme.tagBg, border: `1px solid ${theme.tagBorder}`, borderRadius: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }}></div>
              <span style={{ fontSize: 13, color: theme.tagText, fontWeight: 500 }}>App installed and active</span>
            </div>
          </div>

          {/* Webhooks */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, transition: "background 0.2s" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Webhook Status</div>
            {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((topic, i, arr) => (
              <div key={topic} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                <span style={{ fontSize: 13, color: theme.textSub, fontFamily: "monospace" }}>{topic}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: theme.tagBg, padding: "3px 10px", borderRadius: 100 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }}></div>
                  <span style={{ fontSize: 11, color: theme.tagText, fontWeight: 600 }}>Active</span>
                </div>
              </div>
            ))}
          </div>

          {/* Config */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, transition: "background 0.2s" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 16 }}>App Configuration</div>
            <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Shopify API Version", "2024-01"], ["App Version", "1.0.0"], ["Environment", "Production"], ["Region", "Asia Pacific"]].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 13, color: theme.textSub, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "9px 12px" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger */}
          <div style={{ background: theme.surface, border: "1px solid #fecaca", borderRadius: 14, padding: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#dc2626", marginBottom: 14 }}>Danger Zone</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, color: theme.text, fontWeight: 500, marginBottom: 4 }}>Uninstall App</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>This will remove the app from your store</div>
              </div>
              <button style={{ background: "transparent", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 16px", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Uninstall</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}