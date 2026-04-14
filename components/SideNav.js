// components/SideNav.js
import { useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "../pages/_app";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞", href: "/dashboard" },
  { id: "catalogue", label: "Catalogue", icon: "✦", href: "/catalogue" },
  { id: "branding", label: "Branding", icon: "◉", href: "/branding" },
  { id: "orders", label: "Orders", icon: "📦", href: "/orders" },
  { id: "settings", label: "Settings", icon: "⚙", href: "/settings" },
];

export default function SideNav({ active, shop, open, onToggle }) {
  const router = useRouter();
  const { mode, theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  function goTo(href) {
    router.push(href + "?shop=" + (shop || ""));
    setMobileOpen(false);
  }

  const sidebarContent = (full = true) => (
    <>
      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #c9963a, #a07020)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: "white" }}>✦</div>
        {full && (
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: theme.text }}>Cucuma<span style={{ color: theme.gold }}>®</span></div>
            <div style={{ fontSize: 10, color: theme.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Private Label</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px" }}>
        {full && <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>Menu</div>}
        {NAV.map(item => (
          <div key={item.id} onClick={() => goTo(item.href)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10, marginBottom: 2,
              background: item.id === active ? theme.navActive : "transparent",
              color: item.id === active ? theme.navActiveText : theme.navText,
              cursor: "pointer", fontSize: 14,
              fontWeight: item.id === active ? 600 : 400,
              transition: "all 0.15s",
            }}>
            <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
            {full && <span>{item.label}</span>}
            {full && item.id === active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: theme.gold }}></span>}
          </div>
        ))}
      </nav>

      {/* Theme Toggle + Store Badge */}
      {full && (
        <div style={{ padding: 12, borderTop: `1px solid ${theme.border}` }}>
          {/* Dark/Light Toggle */}
          <button onClick={toggleTheme} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            background: theme.surfaceAlt, border: `1px solid ${theme.border}`,
            borderRadius: 10, padding: "8px 12px", cursor: "pointer", marginBottom: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{mode === "light" ? "☀️" : "🌙"}</span>
              <span style={{ fontSize: 12, color: theme.textSub, fontWeight: 500 }}>{mode === "light" ? "Light Mode" : "Dark Mode"}</span>
            </div>
            {/* Toggle pill */}
            <div style={{ width: 36, height: 20, background: mode === "dark" ? theme.gold : theme.border, borderRadius: 100, position: "relative", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: 2, left: mode === "dark" ? 18 : 2, width: 16, height: 16, background: "white", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}></div>
            </div>
          </button>

          {/* Store badge */}
          <div style={{ background: theme.surfaceAlt, borderRadius: 10, padding: "10px 12px", border: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: shop ? "#10b981" : "#f87171" }}></div>
              <span style={{ fontSize: 10, fontWeight: 600, color: shop ? "#10b981" : "#f87171" }}>{shop ? "Connected" : "Not connected"}</span>
            </div>
            <div style={{ fontSize: 11, color: theme.textSub, wordBreak: "break-all" }}>{shop || "No store"}</div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <style>{`
        .sidenav-item:hover { background: ${theme.goldLight} !important; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-fab { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-overlay { display: none !important; }
          .mobile-fab { display: none !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{
        width: open ? 260 : 68,
        background: theme.surface,
        borderRight: `1px solid ${theme.border}`,
        display: "flex", flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden", flexShrink: 0,
        boxShadow: theme.shadow,
      }}>
        {sidebarContent(open)}
      </aside>

      {/* Mobile FAB */}
      <button className="mobile-fab" onClick={() => setMobileOpen(true)}
        style={{ display: "none", position: "fixed", top: 14, left: 14, zIndex: 200, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 12px", fontSize: 18, cursor: "pointer", boxShadow: theme.shadow, alignItems: "center", justifyContent: "center", color: theme.textSub }}>
        ☰
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
          <div style={{ background: "rgba(0,0,0,0.5)", position: "absolute", inset: 0 }} onClick={() => setMobileOpen(false)} />
          <div style={{ width: 280, background: theme.surface, height: "100%", display: "flex", flexDirection: "column", position: "relative", zIndex: 1, boxShadow: "4px 0 24px rgba(0,0,0,0.2)" }}>
            <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: theme.textSub }}>✕</button>
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}