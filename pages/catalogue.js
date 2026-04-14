// ── CATALOGUE ──────────────────────────────────────────────────
// FILE: pages/catalogue.js
import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

const CATALOGUE = {
  Skincare: [
    { id: 1, name: "Rose Glow Serum", category: "Skincare", desc: "Vitamin C + Niacinamide brightening serum", price: "1290", moq: 50, badge: "Bestseller" },
    { id: 2, name: "Moisture Shield SPF50", category: "Skincare", desc: "Lightweight daily sunscreen with hyaluronic acid", price: "890", moq: 30, badge: "New" },
    { id: 3, name: "Vitamin C Brightener", category: "Skincare", desc: "20% Vitamin C + ferulic acid day serum", price: "1450", moq: 25, badge: null },
    { id: 4, name: "Retinol Night Repair", category: "Skincare", desc: "0.3% retinol with ceramide barrier complex", price: "1650", moq: 20, badge: "Popular" },
    { id: 5, name: "Hydra Boost Toner", category: "Skincare", desc: "7-layer moisture toner with beta-glucan", price: "750", moq: 40, badge: null },
    { id: 6, name: "Pore Refining Clay Mask", category: "Skincare", desc: "Kaolin + charcoal deep pore cleanser", price: "680", moq: 35, badge: null },
  ],
  Cosmetics: [
    { id: 7, name: "Matte Lip Studio Kit", category: "Cosmetics", desc: "12-shade transfer-proof matte lip collection", price: "760", moq: 30, badge: "Bestseller" },
    { id: 8, name: "Glow Highlighter Palette", category: "Cosmetics", desc: "6-pan pressed pigment highlighter palette", price: "980", moq: 25, badge: null },
    { id: 9, name: "Skin Tint Foundation", category: "Cosmetics", desc: "Buildable coverage skin tint SPF20", price: "1100", moq: 20, badge: "New" },
    { id: 10, name: "Brow Define Pencil", category: "Cosmetics", desc: "Micro-tip brow pencil with spoolie", price: "420", moq: 50, badge: null },
    { id: 11, name: "Volume Lash Mascara", category: "Cosmetics", desc: "Tubing mascara — no panda eyes", price: "590", moq: 40, badge: "Popular" },
    { id: 12, name: "Blush Duo Compact", category: "Cosmetics", desc: "Buildable powder blush in 2 shades", price: "650", moq: 30, badge: null },
  ],
  Haircare: [
    { id: 13, name: "Keratin Repair Mask", category: "Haircare", desc: "Deep conditioning mask for damaged hair", price: "2100", moq: 20, badge: "Bestseller" },
    { id: 14, name: "Scalp Revival Serum", category: "Haircare", desc: "Caffeine + biotin scalp growth serum", price: "1890", moq: 15, badge: "New" },
    { id: 15, name: "Argan Oil Treatment", category: "Haircare", desc: "Lightweight frizz-control argan oil", price: "980", moq: 25, badge: null },
    { id: 16, name: "Color Protect Shampoo", category: "Haircare", desc: "Sulfate-free color-safe gentle cleanser", price: "650", moq: 30, badge: "Popular" },
    { id: 17, name: "Bond Repair Conditioner", category: "Haircare", desc: "Olaplex-style bond builder conditioner", price: "780", moq: 30, badge: null },
    { id: 18, name: "Heat Protect Spray", category: "Haircare", desc: "250C heat shield + shine spray", price: "560", moq: 40, badge: null },
  ],
};

export default function Catalogue() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode } = useTheme();
  const [activeCat, setActiveCat] = useState("Skincare");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [published, setPublished] = useState({});
  const [publishing, setPublishing] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = CATALOGUE[activeCat].filter(
    p => p.name.toLowerCase().includes(search.toLowerCase()) ||
         p.desc.toLowerCase().includes(search.toLowerCase())
  );

  function showToast(msg, url, type) {
    setToast({ message: msg, url, type });
    setTimeout(() => setToast(null), 5000);
  }

  async function handlePublish(product) {
    if (!shop) { showToast("No store connected.", null, "error"); return; }
    if (published[product.id] || publishing === product.id) return;
    setPublishing(product.id);
    try {
      const res = await fetch("/api/products/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shop, product }) });
      const data = await res.json();
      if (data.success) { setPublished(prev => ({ ...prev, [product.id]: data.shopifyProductUrl })); showToast(product.name + " published!", data.shopifyProductUrl, "success"); }
      else showToast(data.error || "Failed to publish.", null, "error");
    } catch { showToast("Network error.", null, "error"); }
    setPublishing(null);
  }

  const badgeStyle = { Bestseller: { bg: mode === "dark" ? "#1a1208" : "#fef3e2", color: "#c9963a" }, New: { bg: mode === "dark" ? "#0d2b1a" : "#f0fdf4", color: "#16a34a" }, Popular: { bg: mode === "dark" ? "#1a0d1a" : "#fdf4ff", color: "#9333ea" } };

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden", transition: "background 0.2s" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .toast-pop { animation: slideIn 0.3s ease; }
        .pcard { transition: transform 0.2s, box-shadow 0.2s; }
        .pcard:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
        input { outline: none; }
        @media (max-width: 768px) {
          .page-header { padding: 12px 16px 12px 60px !important; }
          .main-pad { padding: 16px !important; padding-top: 64px !important; }
          .products-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) { .products-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {toast && (
        <div className="toast-pop" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, background: theme.surface, border: `1px solid ${toast.type === "success" ? theme.tagBorder : "#fecaca"}`, borderRadius: 12, padding: "14px 18px", maxWidth: 320, boxShadow: theme.shadow }}>
          <p style={{ fontSize: 13, color: toast.type === "success" ? theme.tagText : "#dc2626", fontWeight: 500, marginBottom: toast.url ? 8 : 0 }}>{toast.type === "success" ? "✓ " : "✗ "}{toast.message}</p>
          {toast.url && <a href={toast.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: theme.gold, textDecoration: "none", fontWeight: 600 }}>View in Shopify →</a>}
        </div>
      )}

      <SideNav active="catalogue" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="page-header" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, transition: "background 0.2s" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: theme.text }}>Product Catalogue</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>Publish products to your store</div>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 14px", color: theme.text, fontSize: 13, width: 180 }} />
        </header>

        <div className="main-pad" style={{ padding: "20px 28px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
            {Object.keys(CATALOGUE).map(cat => (
              <button key={cat} onClick={() => { setActiveCat(cat); setSearch(""); }}
                style={{ background: activeCat === cat ? theme.goldLight : theme.surface, border: activeCat === cat ? `1px solid ${theme.goldBorder}` : `1px solid ${theme.border}`, borderRadius: 10, padding: "9px 18px", color: activeCat === cat ? theme.gold : theme.textSub, fontSize: 13, fontWeight: activeCat === cat ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
                {cat}
              </button>
            ))}
            <div style={{ marginLeft: "auto", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "9px 16px", fontSize: 13, color: theme.textMuted }}>
              Published: <span style={{ color: "#10b981", fontWeight: 700 }}>{Object.keys(published).length}</span>
            </div>
          </div>

          {/* Grid */}
          <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {filtered.map(product => {
              const isPub = published[product.id];
              const isPubbing = publishing === product.id;
              const badge = product.badge ? badgeStyle[product.badge] : null;
              return (
                <div key={product.id} className="pcard" style={{ background: theme.surface, border: `1px solid ${isPub ? theme.tagBorder : theme.border}`, borderRadius: 14, overflow: "hidden", transition: "background 0.2s" }}>
                  <div style={{ height: 130, background: theme.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: 36, opacity: 0.15, color: theme.gold }}>✦</span>
                    {badge && <span style={{ position: "absolute", top: 10, right: 10, background: badge.bg, color: badge.color, fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>{product.badge}</span>}
                    {isPub && (
                      <div style={{ position: "absolute", inset: 0, background: mode === "dark" ? "rgba(13,43,26,0.85)" : "rgba(240,253,244,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <span style={{ fontSize: 22, color: "#16a34a" }}>✓</span>
                        <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>Live in Store</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 4 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12, lineHeight: 1.5 }}>{product.desc}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: theme.text }}>₱{product.price}</div>
                        <div style={{ fontSize: 10, color: theme.textMuted }}>MOQ: {product.moq} units</div>
                      </div>
                    </div>
                    {isPub ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: 1, background: theme.tagBg, border: `1px solid ${theme.tagBorder}`, borderRadius: 8, padding: "8px", textAlign: "center", fontSize: 12, color: theme.tagText, fontWeight: 600 }}>✓ Published</div>
                        <a href={isPub} target="_blank" rel="noreferrer" style={{ background: theme.goldLight, border: `1px solid ${theme.goldBorder}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: theme.gold, textDecoration: "none", fontWeight: 600 }}>View →</a>
                      </div>
                    ) : (
                      <button onClick={() => handlePublish(product)} disabled={isPubbing}
                        style={{ width: "100%", borderRadius: 8, padding: "9px", background: isPubbing ? theme.surfaceAlt : "linear-gradient(135deg, #c9963a, #a07020)", border: isPubbing ? `1px solid ${theme.border}` : "none", color: isPubbing ? theme.textMuted : "white", fontSize: 13, fontWeight: 600, cursor: isPubbing ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {isPubbing ? <><span style={{ width: 11, height: 11, border: `2px solid ${theme.border}`, borderTopColor: theme.gold, borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>Publishing...</> : "🚀 Publish to Store"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: theme.textMuted }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>No products found</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}