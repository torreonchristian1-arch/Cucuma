import { useState, useEffect } from "react";
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

function MenuIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function CloseIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function SideNav({ active, shop, open = true }) {
  const router = useRouter();
  const { mode, theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [router.pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function goTo(href) {
    router.push(href + "?shop=" + (shop || ""));
  }

  const NavContent = ({ compact = false }) => (
    <>
      {/* Logo */}
      <div style={{ padding: "16px 14px 14px", borderBottom: `1px solid ${theme.borderSubtle}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${theme.gold}, #a07828)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 2px 8px rgba(196,151,90,0.35)` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          {!compact && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary, letterSpacing: "-0.01em", lineHeight: 1.2 }}>Cucuma®</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: theme.textTertiary, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 1 }}>Private Label</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {!compact && (
          <div style={{ fontSize: 9, fontWeight: 700, color: theme.textTertiary, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px 8px", userSelect: "none" }}>Navigation</div>
        )}
        {NAV_ITEMS.map(item => {
          const isActive = item.id === active;
          const isHovered = hoveredItem === item.id;
          return (
            <div key={item.id}
              onClick={() => goTo(item.href)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              title={compact ? item.label : undefined}
              style={{ display: "flex", alignItems: "center", gap: compact ? 0 : 10, justifyContent: compact ? "center" : "flex-start", padding: compact ? "10px" : "9px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2, position: "relative", userSelect: "none",
                background: isActive ? (theme.oliveSubtle || theme.goldSubtle) : isHovered ? theme.bgElevated : "transparent",
                color: isActive ? (theme.olive || theme.gold) : isHovered ? theme.textPrimary : theme.textSecondary,
                transition: "all 0.15s ease",
              }}>
              {/* Active accent bar */}
              {isActive && (
                <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, background: theme.olive || theme.gold, borderRadius: "0 3px 3px 0" }}></div>
              )}
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.icon(isActive ? (theme.olive || theme.gold) : isHovered ? theme.textPrimary : theme.textSecondary)}
              </div>
              {!compact && (
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap" }}>{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "10px 8px", borderTop: `1px solid ${theme.borderSubtle}`, flexShrink: 0 }}>
        {/* Theme Toggle */}
        <div onClick={toggleTheme}
          style={{ display: "flex", alignItems: "center", justifyContent: compact ? "center" : "space-between", padding: compact ? "10px" : "9px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 8, background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, transition: "all 0.15s" }}
          title={compact ? (mode === "dark" ? "Switch to light" : "Switch to dark") : undefined}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {mode === "dark"
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            }
            {!compact && <span style={{ fontSize: 12, fontWeight: 500, color: theme.textSecondary }}>{mode === "dark" ? "Dark" : "Light"} mode</span>}
          </div>
          {!compact && (
            <div style={{ width: 36, height: 20, background: mode === "dark" ? theme.gold : theme.borderDefault, borderRadius: 100, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 2, left: mode === "dark" ? 16 : 2, width: 16, height: 16, background: "white", borderRadius: "50%", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}></div>
            </div>
          )}
        </div>

        {/* Store status */}
        {!compact && (
          <div style={{ padding: "8px 10px", background: theme.bgSurface, borderRadius: 8, border: `1px solid ${theme.borderSubtle}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: shop ? 3 : 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: shop ? theme.green : theme.textTertiary, flexShrink: 0, boxShadow: shop ? `0 0 6px ${theme.green}` : "none" }}></div>
              <span style={{ fontSize: 10, fontWeight: 700, color: shop ? theme.green : theme.textTertiary, letterSpacing: "0.08em", textTransform: "uppercase" }}>{shop ? "Connected" : "No store"}</span>
            </div>
            {shop && (
              <div style={{ fontSize: 10, color: theme.textTertiary, wordBreak: "break-all", lineHeight: 1.4, paddingLeft: 12 }}>{shop}</div>
            )}
          </div>
        )}
        {compact && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: shop ? theme.green : theme.textTertiary, boxShadow: shop ? `0 0 6px ${theme.green}` : "none" }}></div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
        .mobile-drawer { animation: slideInLeft 0.25s cubic-bezier(.4,0,.2,1); }
        .mobile-overlay-bg { animation: fadeInBg 0.25s ease; }
        .nav-item-hover:hover { background: ${theme.bgElevated}; color: ${theme.textPrimary}; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-fab { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-fab { display: none !important; }
          .mobile-overlay { display: none !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{
        width: open ? 224 : 56,
        minWidth: open ? 224 : 56,
        background: theme.bgCard,
        borderRight: `1px solid ${theme.borderSubtle}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
        transition: "width 0.28s cubic-bezier(.4,0,.2,1), min-width 0.28s cubic-bezier(.4,0,.2,1)",
      }}>
        <NavContent compact={!open} />
      </aside>

      {/* Mobile Hamburger FAB */}
      <button className="mobile-fab" onClick={() => setMobileOpen(true)}
        style={{ display: "none", position: "fixed", top: 14, left: 14, zIndex: 200, background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 9, width: 36, height: 36, cursor: "pointer", alignItems: "center", justifyContent: "center", boxShadow: theme.shadowMd, transition: "all 0.15s" }}>
        <MenuIcon color={theme.textSecondary} />
      </button>

      {/* Mobile Overlay + Drawer */}
      {mobileOpen && (
        <div className="mobile-overlay" style={{ position: "fixed", inset: 0, zIndex: 300 }}>
          {/* Backdrop */}
          <div className="mobile-overlay-bg" onClick={() => setMobileOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} />

          {/* Drawer */}
          <div className="mobile-drawer" style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 240, background: theme.bgCard, borderRight: `1px solid ${theme.borderSubtle}`, display: "flex", flexDirection: "column", boxShadow: theme.shadowMd, zIndex: 1 }}>
            {/* Close button */}
            <button onClick={() => setMobileOpen(false)}
              style={{ position: "absolute", top: 14, right: 12, background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 7, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, transition: "all 0.15s" }}>
              <CloseIcon color={theme.textTertiary} />
            </button>
            <NavContent compact={false} />
          </div>
        </div>
      )}
    </>
  );
}