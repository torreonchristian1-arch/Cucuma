// components/SideNav.js
import { useState } from "react";
import { useRouter } from "next/router";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞", href: "/dashboard" },
  { id: "catalogue", label: "Catalogue", icon: "✦", href: "/catalogue" },
  { id: "branding", label: "Branding", icon: "◉", href: "/branding" },
  { id: "orders", label: "Orders", icon: "📦", href: "/orders" },
  { id: "settings", label: "Settings", icon: "⚙", href: "/settings" },
];

export default function SideNav({ active, shop, open, onToggle }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function goTo(href) {
    router.push(href + "?shop=" + (shop || ""));
    setMobileOpen(false);
  }

  const navContent = (
    <>
      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid #f0ebe3", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #c9963a, #a07020)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: "white" }}>✦</div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a0e04" }}>Cucuma<span style={{ color: "#c9963a" }}>®</span></div>
          <div style={{ fontSize: 10, color: "#a09080", letterSpacing: "0.12em", textTransform: "uppercase" }}>Private Label</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "12px" }}>
        {NAV.map(item => (
          <div key={item.id}
            onClick={() => goTo(item.href)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, marginBottom: 2,
              background: item.id === active ? "#fef3e2" : "transparent",
              color: item.id === active ? "#c9963a" : "#6b5a4e",
              cursor: "pointer", fontSize: 14,
              fontWeight: item.id === active ? 600 : 400,
            }}>
            <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.id === active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#c9963a" }}></span>}
          </div>
        ))}
      </nav>

      {/* Store Badge */}
      <div style={{ padding: 12, borderTop: "1px solid #f0ebe3" }}>
        <div style={{ background: "#faf9f7", borderRadius: 12, padding: "10px 12px", border: "1px solid #f0ebe3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: shop ? "#16a34a" : "#f87171" }}></div>
            <span style={{ fontSize: 10, fontWeight: 600, color: shop ? "#16a34a" : "#f87171" }}>{shop ? "Connected" : "Not connected"}</span>
          </div>
          <div style={{ fontSize: 11, color: "#6b5a4e", wordBreak: "break-all" }}>{shop || "No store"}</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-overlay { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{
        width: open ? 260 : 72,
        background: "white",
        borderRight: "1px solid #f0ebe3",
        display: "flex", flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden", flexShrink: 0,
        boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
      }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #f0ebe3", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #c9963a, #a07020)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: "white" }}>✦</div>
          {open && (
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a0e04" }}>Cucuma<span style={{ color: "#c9963a" }}>®</span></div>
              <div style={{ fontSize: 10, color: "#a09080", letterSpacing: "0.12em", textTransform: "uppercase" }}>Private Label</div>
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: "12px" }}>
          {NAV.map(item => (
            <div key={item.id} onClick={() => goTo(item.href)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, marginBottom: 2, background: item.id === active ? "#fef3e2" : "transparent", color: item.id === active ? "#c9963a" : "#6b5a4e", cursor: "pointer", fontSize: 14, fontWeight: item.id === active ? 600 : 400 }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              {open && <span>{item.label}</span>}
              {open && item.id === active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#c9963a" }}></span>}
            </div>
          ))}
        </nav>
        {open && (
          <div style={{ padding: 12, borderTop: "1px solid #f0ebe3" }}>
            <div style={{ background: "#faf9f7", borderRadius: 12, padding: "10px 12px", border: "1px solid #f0ebe3" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: shop ? "#16a34a" : "#f87171" }}></div>
                <span style={{ fontSize: 10, fontWeight: 600, color: shop ? "#16a34a" : "#f87171" }}>{shop ? "Connected" : "Not connected"}</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b5a4e", wordBreak: "break-all" }}>{shop || "No store"}</div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        style={{ display: "none", position: "fixed", top: 16, left: 16, zIndex: 200, background: "white", border: "1px solid #f0ebe3", borderRadius: 10, padding: "8px 12px", fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", alignItems: "center", justifyContent: "center" }}>
        ☰
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
          <div style={{ background: "rgba(0,0,0,0.4)", position: "absolute", inset: 0 }} onClick={() => setMobileOpen(false)} />
          <div style={{ width: 280, background: "white", height: "100%", display: "flex", flexDirection: "column", position: "relative", zIndex: 1, boxShadow: "4px 0 24px rgba(0,0,0,0.15)" }}>
            <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b5a4e" }}>✕</button>
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}