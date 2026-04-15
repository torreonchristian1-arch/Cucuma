import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "../pages/_app";

const NAV = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard",
    icon: c => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id: "catalogue", label: "Catalogue", href: "/catalogue",
    icon: c => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  { id: "branding", label: "Branding", href: "/branding",
    icon: c => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: "orders", label: "Orders", href: "/orders",
    icon: c => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
  { id: "billing", label: "Billing", href: "/billing",
    icon: c => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: "settings", label: "Settings", href: "/settings",
    icon: c => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  { id: "help", label: "Help Center", href: "/help",
    icon: c => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
];

export default function SideNav({ active, shop, open = true }) {
  const router = useRouter();
  const { mode, theme: T, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function goTo(href) { router.push(`${href}?shop=${shop || ""}`); }

  const Content = ({ compact }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <style>{`
        .ni { display:flex; align-items:center; gap:${compact ? 0 : 10}px; justify-content:${compact ? "center" : "flex-start"}; padding:${compact ? "10px" : "9px 12px"}; border-radius:8px; cursor:pointer; font-size:13px; font-weight:500; transition:all 0.15s; position:relative; margin-bottom:2px; border:none; background:none; width:100%; font-family:'DM Sans',sans-serif; }
        .ni:hover { background:${T.bgElevated}; color:${T.textPrimary} !important; }
        .ni.active { background:${T.oliveSubtle}; color:${T.olive} !important; }
        .ni.active::before { content:''; position:absolute; left:0; top:20%; bottom:20%; width:3px; background:${T.olive}; border-radius:0 3px 3px 0; }
        .theme-toggle { width:100%; display:flex; align-items:center; justify-content:${compact?"center":"space-between"}; padding:${compact?"10px":"8px 12px"}; background:${T.bgSurface}; border:1px solid ${T.borderSubtle}; border-radius:8px; cursor:pointer; transition:all 0.15s; margin-bottom:8px; }
        .theme-toggle:hover { background:${T.bgElevated}; }
        .tpill { width:34px; height:19px; background:${mode==="dark"?T.olive:T.borderDefault}; border-radius:100px; position:relative; transition:background 0.2s; flex-shrink:0; }
        .tdot { position:absolute; top:2px; left:${mode==="dark"?"15px":"2px"}; width:15px; height:15px; background:white; border-radius:50%; transition:left 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
      `}</style>

      {/* Logo */}
      <div style={{ padding: "18px 14px 16px", borderBottom: `1px solid ${T.borderSubtle}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: compact ? "center" : "flex-start" }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: T.olive, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          {!compact && (
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: T.textPrimary, letterSpacing: "-0.01em", lineHeight: 1.2 }}>Cucuma®</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: T.textTertiary, letterSpacing: "0.14em", textTransform: "uppercase" }}>Private Label</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {!compact && <div style={{ fontSize: 9, fontWeight: 700, color: T.textTertiary, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 10px 8px" }}>Menu</div>}
        {NAV.map(item => {
          const isActive = item.id === active;
          return (
            <button key={item.id} className={`ni${isActive ? " active" : ""}`}
              onClick={() => goTo(item.href)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              title={compact ? item.label : undefined}
              style={{ color: isActive ? T.olive : hovered === item.id ? T.textPrimary : T.textSecondary }}>
              {item.icon(isActive ? T.olive : hovered === item.id ? T.textPrimary : T.textSecondary)}
              {!compact && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "10px 8px", borderTop: `1px solid ${T.borderSubtle}`, flexShrink: 0 }}>
        <button className="theme-toggle" onClick={toggleTheme} title={compact ? (mode === "dark" ? "Light mode" : "Dark mode") : undefined}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {mode === "dark"
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textSecondary} strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textSecondary} strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
            }
            {!compact && <span style={{ fontSize: 12, fontWeight: 500, color: T.textSecondary }}>{mode === "dark" ? "Dark" : "Light"} mode</span>}
          </div>
          {!compact && <div className="tpill"><div className="tdot"></div></div>}
        </button>

        {!compact && shop && (
          <div style={{ padding: "8px 10px", background: T.bgSurface, borderRadius: 8, border: `1px solid ${T.borderSubtle}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.olive, boxShadow: `0 0 6px ${T.olive}` }}></div>
              <span style={{ fontSize: 10, fontWeight: 700, color: T.olive, letterSpacing: "0.08em", textTransform: "uppercase" }}>Connected</span>
            </div>
            <div style={{ fontSize: 10, color: T.textTertiary, wordBreak: "break-all", lineHeight: 1.4 }}>{shop}</div>
          </div>
        )}
        {compact && <div style={{ display: "flex", justifyContent: "center", paddingTop: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: shop ? T.olive : T.textTertiary }}></div></div>}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes slideIn { from { transform:translateX(-100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes fadeBg { from { opacity:0; } to { opacity:1; } }
        .mob-drawer { animation: slideIn 0.25s cubic-bezier(.4,0,.2,1); }
        .mob-bg { animation: fadeBg 0.25s ease; }
        @media(max-width:768px){ .desk-nav{display:none!important;} .mob-btn{display:flex!important;} }
        @media(min-width:769px){ .mob-btn{display:none!important;} .mob-overlay{display:none!important;} }
      `}</style>

      {/* Desktop */}
      <aside className="desk-nav" style={{ width: open ? 224 : 56, minWidth: open ? 224 : 56, background: T.bgCard, borderRight: `1px solid ${T.borderSubtle}`, flexShrink: 0, transition: "width 0.28s cubic-bezier(.4,0,.2,1), min-width 0.28s cubic-bezier(.4,0,.2,1)", overflow: "hidden" }}>
        <Content compact={!open} />
      </aside>

      {/* Mobile button */}
      <button className="mob-btn" onClick={() => setMobileOpen(true)}
        style={{ display: "none", position: "fixed", top: 14, left: 14, zIndex: 200, background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", alignItems: "center", justifyContent: "center", boxShadow: T.shadowMd }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.textSecondary} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="mob-overlay" style={{ position: "fixed", inset: 0, zIndex: 300 }}>
          <div className="mob-bg" onClick={() => setMobileOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(44,28,14,0.5)", backdropFilter: "blur(6px)" }} />
          <div className="mob-drawer" style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 240, background: T.bgCard, borderRight: `1px solid ${T.borderSubtle}`, zIndex: 1 }}>
            <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 14, right: 12, background: T.bgSurface, border: `1px solid ${T.borderSubtle}`, borderRadius: 7, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <Content compact={false} />
          </div>
        </div>
      )}
    </>
  );
}