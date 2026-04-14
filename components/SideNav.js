// components/SideNav.js
// Shared navigation component used across all pages

import { useRouter } from "next/router";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈", href: "/dashboard" },
  { id: "catalogue", label: "Catalogue", icon: "✦", href: "/catalogue" },
  { id: "branding", label: "Branding", icon: "◉", href: "/branding" },
  { id: "orders", label: "Orders", icon: "⬡", href: "/orders" },
  { id: "settings", label: "Settings", icon: "⚙", href: "/settings" },
];

export default function SideNav({ active, shop, open, onToggle }) {
  const router = useRouter();

  function goTo(href) {
    router.push(href + "?shop=" + (shop || ""));
  }

  return (
    <aside style={{
      width: open ? 240 : 64,
      background: "#0d0f12",
      borderRight: "1px solid #1a1c1f",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s ease",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid #1a1c1f", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #d4b68e, #a07850)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✦</div>
        {open && (
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#e8e0d4" }}>Cucuma</div>
            <div style={{ fontSize: 10, color: "#6b6560", letterSpacing: "0.15em", textTransform: "uppercase" }}>Private Label</div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "16px 10px" }}>
        {NAV.map(item => (
          <div
            key={item.id}
            onClick={() => goTo(item.href)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 12px", borderRadius: 8, marginBottom: 4,
              borderLeft: item.id === active ? "2px solid #d4b68e" : "2px solid transparent",
              background: item.id === active ? "rgba(212,182,142,0.1)" : "transparent",
              color: item.id === active ? "#d4b68e" : "#6b6560",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
            {open && <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* Store Badge */}
      {open && (
        <div style={{ padding: 16, borderTop: "1px solid #1a1c1f" }}>
          <div style={{ background: "#13151a", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "#6b6560", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Connected Store</div>
            <div style={{ fontSize: 12, color: "#a09080", wordBreak: "break-all" }}>{shop || "No store"}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: shop ? "#4ade80" : "#f87171" }}></div>
              <span style={{ fontSize: 11, color: shop ? "#4ade80" : "#f87171" }}>{shop ? "Active" : "Not connected"}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}