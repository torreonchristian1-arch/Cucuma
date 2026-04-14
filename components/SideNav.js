import { useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "../pages/_app";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "catalogue", label: "Catalogue", icon: "✦" },
  { id: "branding", label: "Branding", icon: "◈" },
  { id: "orders", label: "Orders", icon: "⬡" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

export default function SideNav({ active, shop, open, onToggle }) {
  const router = useRouter();
  const { mode, theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  function goTo(id) {
    router.push(`/${id}?shop=${shop || ""}`);
    setMobileOpen(false);
  }

  const Inner = ({ full }) => (
    <>
      {/* Logo */}
      <div style={{ padding: full ? "24px 20px 20px" : "24px 14px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #d4a84e, #a07828)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 17, fontWeight: 900, flexShrink: 0, fontFamily: "'Fraunces', serif" }}>C</div>
        {full && (
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, color: theme.text, lineHeight: 1.1 }}>Cucuma<span style={{ color: theme.gold }}>®</span></div>
            <div style={{ fontSize: 10, color: theme.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 2 }}>Private Label</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: full ? "14px 12px" : "14px 8px" }}>
        {full && <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>Navigation</div>}
        {NAV.map(item => {
          const isActive = item.id === active;
          return (
            <div key={item.id} onClick={() => goTo(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: full ? 11 : 0,
                justifyContent: full ? "flex-start" : "center",
                padding: full ? "10px 12px" : "12px",
                borderRadius: 9, marginBottom: 2,
                background: isActive ? theme.goldBg : "transparent",
                color: isActive ? theme.goldText : theme.navText,
                cursor: "pointer", fontSize: 13.5, fontWeight: isActive ? 700 : 500,
                transition: "all 0.15s",
                border: isActive ? `1px solid ${theme.goldBorder}` : "1px solid transparent",
              }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
              {full && <span>{item.label}</span>}
              {full && isActive && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: theme.gold }}></div>}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      {full && (
        <div style={{ padding: "12px 12px 16px", borderTop: `1px solid ${theme.border}` }}>
          {/* Theme toggle */}
          <div onClick={toggleTheme} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 9, background: theme.surfaceAlt, border: `1px solid ${theme.border}`, cursor: "pointer", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{mode === "light" ? "☀️" : "🌙"}</span>
              <span style={{ fontSize: 12, color: theme.textSub, fontWeight: 600 }}>{mode === "light" ? "Light" : "Dark"}</span>
            </div>
            <div style={{ width: 34, height: 18, background: mode === "dark" ? theme.gold : theme.border, borderRadius: 100, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 2, left: mode === "dark" ? 16 : 2, width: 14, height: 14, background: "white", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}></div>
            </div>
          </div>

          {/* Store */}
          <div style={{ background: theme.surfaceAlt, borderRadius: 9, padding: "10px 12px", border: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: shop ? "#16a34a" : "#f87171", flexShrink: 0 }}></div>
              <span style={{ fontSize: 10, fontWeight: 700, color: shop ? "#16a34a" : "#f87171", letterSpacing: "0.06em", textTransform: "uppercase" }}>{shop ? "Connected" : "No store"}</span>
            </div>
            <div style={{ fontSize: 11, color: theme.textMuted, wordBreak: "break-all", lineHeight: 1.4 }}>{shop || "Install app to connect"}</div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <style>{`
        .nav-item-hover:hover { background: ${theme.surfaceHover} !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-overlay { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* Desktop */}
      <aside className="desktop-nav" style={{ width: open ? 250 : 66, background: theme.navBg, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", transition: "width 0.28s cubic-bezier(.4,0,.2,1)", overflow: "hidden", flexShrink: 0, boxShadow: theme.shadow }}>
        <Inner full={open} />
      </aside>

      {/* Mobile FAB */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}
        style={{ display: "none", position: "fixed", top: 12, left: 12, zIndex: 200, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10, width: 40, height: 40, fontSize: 17, cursor: "pointer", alignItems: "center", justifyContent: "center", color: theme.textSub, boxShadow: theme.shadow }}>
        ☰
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-overlay" style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
          <div style={{ background: "rgba(0,0,0,0.45)", position: "absolute", inset: 0, backdropFilter: "blur(2px)" }} onClick={() => setMobileOpen(false)} />
          <div style={{ width: 260, background: theme.navBg, height: "100%", display: "flex", flexDirection: "column", position: "relative", zIndex: 1, boxShadow: "6px 0 32px rgba(0,0,0,0.18)" }}>
            <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: theme.textMuted, zIndex: 1 }}>✕</button>
            <Inner full={true} />
          </div>
        </div>
      )}
    </>
  );
}