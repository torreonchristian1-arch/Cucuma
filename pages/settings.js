// FILE: pages/settings.js
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

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bgBase, overflow: "hidden" }}>
      <style>{`
        input { outline: none; }
        .setting-card { background: ${theme.bgCard}; border: 1px solid ${theme.borderSubtle}; border-radius: 10px; padding: 18px 20px; box-shadow: ${theme.shadow}; margin-bottom: 12px; }
        .help-link:hover { background: ${theme.bgElevated} !important; }
        @media (max-width: 768px) { .hdr { padding: 10px 16px 10px 52px !important; flex-wrap: wrap; gap: 8px; } .main-pad { padding: 16px !important; } .config-grid { grid-template-columns: 1fr !important; } .hide-sm { display: none !important; } }
      `}</style>

      <SideNav active="settings" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="hdr" style={{ padding: "12px 24px", background: theme.bgCard, borderBottom: `1px solid ${theme.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.borderSubtle}`, borderRadius: 7, padding: "6px 9px", color: theme.textTertiary, cursor: "pointer", display: "flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary }}>Settings</div>
              <div style={{ fontSize: 12, color: theme.textTertiary }}>Manage your app configuration</div>
            </div>
          </div>
          <button onClick={handleSave} style={{ background: saved ? theme.greenSubtle : theme.gold, border: saved ? `1px solid ${theme.greenBorder}` : "none", borderRadius: 8, padding: "8px 18px", color: saved ? theme.green : "white", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            {saved ? "Saved ✓" : "Save Settings"}
          </button>
        </header>

        <div className="main-pad" style={{ padding: "18px 24px", maxWidth: 700 }}>
          {/* Appearance */}
          <div className="setting-card">
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 14 }}>Appearance</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: theme.bgSurface, borderRadius: 8, border: `1px solid ${theme.borderSubtle}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {mode === "dark"
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
                }
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>{mode === "dark" ? "Dark Mode" : "Light Mode"}</div>
                  <div style={{ fontSize: 12, color: theme.textTertiary }}>Switch between dark and light themes</div>
                </div>
              </div>
              <div onClick={toggleTheme} style={{ width: 44, height: 24, background: mode === "dark" ? theme.gold : theme.borderDefault, borderRadius: 100, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: mode === "dark" ? 22 : 3, width: 18, height: 18, background: "white", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}></div>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="setting-card">
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 14 }}>Store Information</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: theme.textTertiary, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Connected Store</label>
              <input defaultValue={shop || ""} readOnly style={{ width: "100%", background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 8, padding: "9px 12px", color: theme.textSecondary, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: theme.greenSubtle, border: `1px solid ${theme.greenBorder}`, borderRadius: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: theme.green }}></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.green }}>App installed and active</span>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="setting-card">
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 12 }}>Custom Domain</div>
            <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.7, marginBottom: 14 }}>
              Custom domains are managed through Shopify. Go to <strong style={{ color: theme.textPrimary }}>Shopify Admin → Settings → Domains</strong> to connect your own domain.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {["Buy a domain from GoDaddy, Namecheap, or any registrar", "In Shopify: Settings → Domains → Connect existing domain", "Enter your domain and follow the DNS instructions", "Wait 24–48 hours for propagation"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: theme.goldSubtle, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: theme.gold, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
            <a href="https://help.shopify.com/en/manual/domains" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: theme.bgSurface, border: `1px solid ${theme.borderDefault}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: theme.textSecondary, textDecoration: "none" }}>
              Shopify Domain Guide →
            </a>
          </div>

          {/* Webhooks */}
          <div className="setting-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary }}>Webhook Status</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: theme.green, background: theme.greenSubtle, border: `1px solid ${theme.greenBorder}`, borderRadius: 100, padding: "3px 10px", letterSpacing: "0.06em" }}>ALL ACTIVE</span>
            </div>
            {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((w, i, arr) => (
              <div key={w} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.borderSubtle}` : "none" }}>
                <code style={{ fontSize: 12, color: theme.textSecondary, fontFamily: "'JetBrains Mono', monospace" }}>{w}</code>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: theme.greenSubtle, padding: "3px 10px", borderRadius: 100 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: theme.green }}></div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: theme.green }}>Active</span>
                </div>
              </div>
            ))}
          </div>

          {/* Config */}
          <div className="setting-card">
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 14 }}>App Configuration</div>
            <div className="config-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["API Version", "2024-01"], ["App Version", "1.0.0"], ["Environment", "Production"], ["Region", "Asia Pacific"]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: theme.textTertiary, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: theme.textSecondary, background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 7, padding: "8px 10px", fontFamily: "'JetBrains Mono', monospace" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Help Center link */}
          <div className="help-link" onClick={() => goTo("/help")} style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: "14px 18px", boxShadow: theme.shadow, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, marginBottom: 12, transition: "all 0.15s" }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: theme.bgSurface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>Help Center & FAQ</div>
              <div style={{ fontSize: 12, color: theme.textTertiary, marginTop: 1 }}>Find answers to common questions</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textTertiary} strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
          </div>

          {/* Danger */}
          <div style={{ background: theme.bgCard, border: "1px solid rgba(192,80,80,0.25)", borderRadius: 10, padding: "16px 20px", boxShadow: theme.shadow }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C05050", marginBottom: 12 }}>Danger Zone</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: theme.textPrimary }}>Uninstall App</div>
                <div style={{ fontSize: 12, color: theme.textTertiary, marginTop: 2 }}>Permanently remove from your Shopify store</div>
              </div>
              <button style={{ background: "transparent", border: "1px solid rgba(192,80,80,0.4)", borderRadius: 8, padding: "8px 16px", color: "#C05050", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Uninstall</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}