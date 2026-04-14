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
  function goTo(href) { router.push(`${href}?shop=${shop || ""}`); }

  const Card = ({ children, danger }) => (
    <div style={{ background: theme.surface, border: `1px solid ${danger ? "#fecaca" : theme.border}`, borderRadius: 14, padding: 22, boxShadow: theme.shadow }}>{children}</div>
  );

  const SectionTitle = ({ children }) => (
    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 16 }}>{children}</div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, overflow: "hidden", transition: "background 0.25s" }}>
      <style>{`
        input { outline: none; }
        @media (max-width: 768px) {
          .hdr { padding: 10px 16px 10px 56px !important; flex-wrap: wrap; gap: 8px; }
          .main-pad { padding: 16px !important; padding-top: 60px !important; }
          .config-grid { grid-template-columns: 1fr !important; }
          .hide-sm { display: none !important; }
        }
      `}</style>

      <SideNav active="settings" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="hdr" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", color: theme.textMuted, cursor: "pointer", fontSize: 15 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: theme.text }}>Settings</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>Manage your app configuration</div>
            </div>
          </div>
          <button onClick={handleSave} style={{ background: saved ? theme.greenBg : `linear-gradient(135deg, ${theme.gold}, #a07828)`, border: saved ? `1px solid ${theme.greenBorder}` : "none", borderRadius: 9, padding: "9px 20px", color: saved ? theme.green : "white", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: saved ? "none" : `0 4px 14px rgba(184,134,42,0.3)` }}>
            {saved ? "✓ Saved!" : "Save Settings"}
          </button>
        </header>

        <div className="main-pad" style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>

          {/* Appearance */}
          <Card>
            <SectionTitle>Appearance</SectionTitle>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: theme.surfaceAlt, border: `1px solid ${theme.border}`, borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 3 }}>{mode === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>Switch between light and dark theme</div>
              </div>
              <div onClick={toggleTheme} style={{ width: 50, height: 26, background: mode === "dark" ? theme.gold : theme.border, borderRadius: 100, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: mode === "dark" ? 24 : 3, width: 20, height: 20, background: "white", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}></div>
              </div>
            </div>
          </Card>

          {/* Store */}
          <Card>
            <SectionTitle>Store Information</SectionTitle>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Connected Store</div>
              <input defaultValue={shop || ""} readOnly style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, padding: "10px 14px", color: theme.textSub, fontSize: 14, fontWeight: 500 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.green }}></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.green }}>App installed and active</span>
            </div>
          </Card>

          {/* Custom Domain Info */}
          <Card>
            <SectionTitle>Custom Domain</SectionTitle>
            <p style={{ fontSize: 13, color: theme.textSub, lineHeight: 1.7, marginBottom: 16 }}>
              Want to use your own domain like <strong style={{ color: theme.text }}>mybrand.com</strong>? Custom domains are managed through Shopify, not Cucuma. Follow these steps:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {[
                "Buy a domain from GoDaddy, Namecheap, or any registrar",
                "In Shopify admin → Settings → Domains → Connect existing domain",
                "Enter your domain name and follow the DNS instructions",
                "Wait 24–48 hours for DNS propagation",
                "Your store will be live at your custom domain ✓",
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: theme.gold, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: theme.textSub, lineHeight: 1.5 }}>{step}</span>
                </div>
              ))}
            </div>
            <a href="https://help.shopify.com/en/manual/domains" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, borderRadius: 9, padding: "9px 16px", fontSize: 12, fontWeight: 700, color: theme.goldText, textDecoration: "none" }}>
              View Shopify Domain Guide →
            </a>
          </Card>

          {/* Webhooks */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <SectionTitle>Webhook Status</SectionTitle>
              <span style={{ fontSize: 10, fontWeight: 700, color: theme.green, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 100, padding: "4px 12px", letterSpacing: "0.06em" }}>ALL ACTIVE</span>
            </div>
            {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((topic, i, arr) => (
              <div key={topic} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                <code style={{ fontSize: 13, color: theme.textSub }}>{topic}</code>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 100, padding: "3px 10px" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: theme.green }}></div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: theme.green }}>Active</span>
                </div>
              </div>
            ))}
          </Card>

          {/* Config */}
          <Card>
            <SectionTitle>App Configuration</SectionTitle>
            <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Shopify API Version", "2024-01"], ["App Version", "1.0.0"], ["Environment", "Production"], ["Region", "Asia Pacific"]].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.textSub, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, padding: "10px 14px" }}>{value}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Help Center Link */}
          <div onClick={() => goTo("/help")} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, boxShadow: theme.shadow, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all 0.15s" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>❓</div>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 3 }}>Help Center & FAQ</div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>Find answers to common questions about Cucuma</div>
            </div>
            <span style={{ marginLeft: "auto", color: theme.gold, fontSize: 20 }}>→</span>
          </div>

          {/* Danger */}
          <Card danger>
            <SectionTitle>Danger Zone</SectionTitle>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4 }}>Uninstall App</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>Permanently remove the app from your Shopify store</div>
              </div>
              <button style={{ background: "transparent", border: "1px solid #fecaca", borderRadius: 9, padding: "9px 18px", color: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Uninstall</button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}