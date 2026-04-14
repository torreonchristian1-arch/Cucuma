import { useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "../pages/_app";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard",
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  },
  { id: "catalogue", label: "Catalogue", href: "/catalogue",
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  },
  { id: "branding", label: "Branding", href: "/branding",
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  },
  { id: "orders", label: "Orders", href: "/orders",
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
  },
  { id: "settings", label: "Settings", href: "/settings",
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  },
  { id: "help", label: "Help Center", href: "/help",
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  },
];

export default function SideNav({ active, shop, open, onToggle }) {
  const router = useRouter();
  const { mode, theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  function goTo(href) {
    router.push(href + "?shop=" + (shop || ""));
    setMobileOpen(false);
  }

  const sidebarContent = (
    <>
      <style>{`
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px; cursor:pointer; font-size:14px; font-weight:500; color:${theme.textSecondary}; transition:all 0.15s ease; position:relative; margin-bottom:2px; }
        .nav-item:hover { background:${theme.bgElevated}; color:${theme.textPrimary}; }
        .nav-item.active { background:${theme.goldSubtle}; color:${theme.gold}; }
        .nav-item.active::before { content:''; position:absolute; left:0; top:8px; bottom:8px; width:3px; background:${theme.gold}; border-radius:0 3px 3px 0; }
        .nav-toggle { width:100%; display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:${theme.bgSurface}; border:1px solid ${theme.borderSubtle}; border-radius:8px; cursor:pointer; font-size:12px; font-weight:500; color:${theme.textSecondary}; transition:all 0.15s; }
        .nav-toggle:hover { background:${theme.bgElevated}; color:${theme.textPrimary}; }
        .toggle-pill { width:32px; height:18px; background:${mode === "dark" ? theme.gold : theme.borderDefault}; border-radius:100px; position:relative; transition:background 0.2s; flex-shrink:0; }
        .toggle-dot { position:absolute; top:2px; left:${mode === "dark" ? "14px" : "2px"}; width:14px; height:14px; background:white; border-radius:50%; transition:left 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.3); }
      `}</style>

      {/* Logo */}
      <div style={{ padding: "18px 16px 16px", borderBottom: `1px solid ${theme.borderSubtle}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary, letterSpacing: "-0.01em" }}>Cucuma®</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: theme.textTertiary, letterSpacing: "0.1em", textTransform: "uppercase" }}>Private Label</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: theme.textTertiary, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 12px", marginBottom: 8 }}>Menu</div>
        {NAV_ITEMS.map(item => (
          <div key={item.id} className={`nav-item${item.id === active ? " active" : ""}`} onClick={() => goTo(item.href)}>
            {item.icon(item.id === active ? theme.gold : theme.textSecondary)}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 10px", borderTop: `1px solid ${theme.borderSubtle}` }}>
        {/* Theme toggle */}
        <div className="nav-toggle" onClick={toggleTheme} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {mode === "dark"
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            }
            <span style={{ fontSize: 12 }}>{mode === "dark" ? "Dark mode" : "Light mode"}</span>
          </div>
          <div className="toggle-pill"><div className="toggle-dot"></div></div>
        </div>

        {/* Store status */}
        <div style={{ padding: "8px 12px", background: theme.bgSurface, borderRadius: 8, border: `1px solid ${theme.borderSubtle}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: shop ? theme.green : "#888", flexShrink: 0 }}></div>
            <span style={{ fontSize: 10, fontWeight: 700, color: shop ? theme.green : theme.textTertiary, letterSpacing: "0.06em", textTransform: "uppercase" }}>{shop ? "Connected" : "No store"}</span>
          </div>
          {shop && <div style={{ fontSize: 11, color: theme.textTertiary, wordBreak: "break-all", lineHeight: 1.4 }}>{shop}</div>}
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-fab { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-overlay { display: none !important; }
          .mobile-fab { display: none !important; }
        }
      `}</style>

      {/* Desktop */}
      <aside className="desktop-sidebar" style={{ width: open ? 248 : 0, minWidth: open ? 248 : 0, background: theme.bgCard, borderRight: `1px solid ${theme.borderSubtle}`, display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0, transition: "width 0.28s cubic-bezier(.4,0,.2,1), min-width 0.28s cubic-bezier(.4,0,.2,1)" }}>
        {sidebarContent}
      </aside>

      {/* Mobile FAB */}
      <button className="mobile-fab" onClick={() => setMobileOpen(true)}
        style={{ display: "none", position: "fixed", top: 12, left: 12, zIndex: 200, background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 8, width: 38, height: 38, cursor: "pointer", alignItems: "center", justifyContent: "center", boxShadow: theme.shadowMd }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-overlay" style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
          <div style={{ background: "rgba(0,0,0,0.6)", position: "absolute", inset: 0, backdropFilter: "blur(4px)" }} onClick={() => setMobileOpen(false)} />
          <div style={{ width: 260, background: theme.bgCard, height: "100%", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
            <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: theme.textTertiary, fontSize: 20, zIndex: 1 }}>✕</button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}