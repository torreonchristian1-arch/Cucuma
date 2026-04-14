import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

// Real Unsplash beauty product images — free to use
const CATALOGUE = {
  Skincare: [
    { id: 1, name: "Rose Glow Serum", desc: "Vitamin C + Niacinamide brightening serum", price: "1290", moq: 50, badge: "Bestseller", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80" },
    { id: 2, name: "Moisture Shield SPF50", desc: "Lightweight daily sunscreen with hyaluronic acid", price: "890", moq: 30, badge: "New", img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80" },
    { id: 3, name: "Vitamin C Brightener", desc: "20% Vitamin C + ferulic acid day serum", price: "1450", moq: 25, badge: null, img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" },
    { id: 4, name: "Retinol Night Repair", desc: "0.3% retinol with ceramide barrier complex", price: "1650", moq: 20, badge: "Popular", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80" },
    { id: 5, name: "Hydra Boost Toner", desc: "7-layer moisture toner with beta-glucan", price: "750", moq: 40, badge: null, img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80" },
    { id: 6, name: "Pore Refining Clay Mask", desc: "Kaolin + charcoal deep pore cleanser", price: "680", moq: 35, badge: null, img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80" },
  ],
  Cosmetics: [
    { id: 7, name: "Matte Lip Studio Kit", desc: "12-shade transfer-proof matte lip collection", price: "760", moq: 30, badge: "Bestseller", img: "https://images.unsplash.com/photo-1586495777744-4e6232bf4e45?w=400&q=80" },
    { id: 8, name: "Glow Highlighter Palette", desc: "6-pan pressed pigment highlighter palette", price: "980", moq: 25, badge: null, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80" },
    { id: 9, name: "Skin Tint Foundation", desc: "Buildable coverage skin tint SPF20", price: "1100", moq: 20, badge: "New", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80" },
    { id: 10, name: "Brow Define Pencil", desc: "Micro-tip brow pencil with spoolie", price: "420", moq: 50, badge: null, img: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=400&q=80" },
    { id: 11, name: "Volume Lash Mascara", desc: "Tubing mascara — no panda eyes", price: "590", moq: 40, badge: "Popular", img: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400&q=80" },
    { id: 12, name: "Blush Duo Compact", desc: "Buildable powder blush in 2 shades", price: "650", moq: 30, badge: null, img: "https://images.unsplash.com/photo-1599733589046-833b12f81938?w=400&q=80" },
  ],
  Haircare: [
    { id: 13, name: "Keratin Repair Mask", desc: "Deep conditioning mask for damaged hair", price: "2100", moq: 20, badge: "Bestseller", img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80" },
    { id: 14, name: "Scalp Revival Serum", desc: "Caffeine + biotin scalp growth serum", price: "1890", moq: 15, badge: "New", img: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400&q=80" },
    { id: 15, name: "Argan Oil Treatment", desc: "Lightweight frizz-control argan oil", price: "980", moq: 25, badge: null, img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80" },
    { id: 16, name: "Color Protect Shampoo", desc: "Sulfate-free color-safe gentle cleanser", price: "650", moq: 30, badge: "Popular", img: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&q=80" },
    { id: 17, name: "Bond Repair Conditioner", desc: "Olaplex-style bond builder conditioner", price: "780", moq: 30, badge: null, img: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&q=80" },
    { id: 18, name: "Heat Protect Spray", desc: "250C heat shield + shine spray", price: "560", moq: 40, badge: null, img: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&q=80" },
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
  const [imgErrors, setImgErrors] = useState({});

  const filtered = CATALOGUE[activeCat].filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.desc.toLowerCase().includes(search.toLowerCase())
  );

  function showToast(msg, url, type) {
    setToast({ msg, url, type });
    setTimeout(() => setToast(null), 5000);
  }

  async function handlePublish(product) {
    if (!shop) { showToast("No store connected. Add ?shop=yourstore.myshopify.com to the URL.", null, "error"); return; }
    if (published[product.id] || publishing === product.id) return;
    setPublishing(product.id);
    try {
      const res = await fetch("/api/products/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, product: { ...product, category: activeCat } })
      });
      const data = await res.json();
      if (data.success) {
        setPublished(prev => ({ ...prev, [product.id]: data.shopifyProductUrl || "#" }));
        showToast(`${product.name} is live in your store!`, data.shopifyProductUrl, "success");
      } else showToast(data.error || "Failed to publish.", null, "error");
    } catch { showToast("Network error. Please try again.", null, "error"); }
    setPublishing(null);
  }

  const badgeColors = {
    Bestseller: { bg: mode === "dark" ? "#1a1200" : "#fff8ed", color: "#b8862a", border: mode === "dark" ? "#5a4010" : "#f0d090" },
    New: { bg: mode === "dark" ? "#0d2b1a" : "#f0fdf4", color: "#16a34a", border: mode === "dark" ? "#166534" : "#bbf7d0" },
    Popular: { bg: mode === "dark" ? "#1a0d1a" : "#fdf4ff", color: "#9333ea", border: mode === "dark" ? "#5a1a5a" : "#e9d5ff" },
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, overflow: "hidden", transition: "background 0.25s" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .toast-anim { animation: slideUp 0.3s ease; }
        .pcard { transition: transform 0.18s, box-shadow 0.18s; }
        .pcard:hover { transform: translateY(-4px); box-shadow: ${theme.shadowMd}; }
        .pcard img { transition: transform 0.3s; }
        .pcard:hover img { transform: scale(1.04); }
        input { outline: none; }
        @media (max-width: 768px) {
          .hdr { padding: 10px 16px 10px 56px !important; flex-wrap: wrap; gap: 8px; }
          .main-pad { padding: 16px !important; padding-top: 60px !important; }
          .pgrid { grid-template-columns: 1fr 1fr !important; }
          .hide-sm { display: none !important; }
          .search-wrap { width: 160px !important; }
        }
        @media (max-width: 480px) { .pgrid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="toast-anim" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, background: theme.surface, border: `1px solid ${toast.type === "success" ? theme.greenBorder : theme.orangeBorder}`, borderRadius: 14, padding: "16px 20px", maxWidth: 340, boxShadow: theme.shadowMd }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: toast.type === "success" ? theme.green : theme.orange, marginBottom: toast.url ? 8 : 0 }}>
            {toast.type === "success" ? "✓ " : "✗ "}{toast.msg}
          </p>
          {toast.url && <a href={toast.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: theme.gold, fontWeight: 700 }}>View in Shopify →</a>}
        </div>
      )}

      <SideNav active="catalogue" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header className="hdr" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", color: theme.textMuted, cursor: "pointer", fontSize: 15 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: theme.text }}>Product Catalogue</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>Publish private label products to your Shopify store</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="search-wrap" style={{ position: "relative", width: 200 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: theme.textMuted, fontSize: 14 }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, padding: "8px 14px 8px 30px", color: theme.text, fontSize: 13, width: "100%" }} />
            </div>
            <div style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 9, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: theme.green, whiteSpace: "nowrap" }}>
              {Object.keys(published).length} Published
            </div>
          </div>
        </header>

        <div className="main-pad" style={{ padding: "22px 28px" }}>
          {/* Category tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 22, overflowX: "auto", paddingBottom: 2 }}>
            {Object.entries(CATALOGUE).map(([cat, prods]) => (
              <button key={cat} onClick={() => { setActiveCat(cat); setSearch(""); }}
                style={{ background: activeCat === cat ? theme.gold : theme.surface, border: activeCat === cat ? "none" : `1px solid ${theme.border}`, borderRadius: 9, padding: "9px 20px", color: activeCat === cat ? "white" : theme.textSub, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8, boxShadow: activeCat === cat ? `0 4px 14px rgba(184,134,42,0.3)` : "none", transition: "all 0.15s" }}>
                {cat}
                <span style={{ background: activeCat === cat ? "rgba(255,255,255,0.25)" : theme.surfaceAlt, borderRadius: 100, padding: "1px 8px", fontSize: 11 }}>{prods.length}</span>
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="pgrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {filtered.map(product => {
              const isPub = published[product.id];
              const isPubbing = publishing === product.id;
              const badge = product.badge ? badgeColors[product.badge] : null;
              const imgFailed = imgErrors[product.id];
              return (
                <div key={product.id} className="pcard" style={{ background: theme.surface, border: `1px solid ${isPub ? theme.greenBorder : theme.border}`, borderRadius: 16, overflow: "hidden", boxShadow: theme.shadow }}>
                  {/* Product Image */}
                  <div style={{ height: 180, overflow: "hidden", position: "relative", background: `linear-gradient(135deg, ${theme.goldBg}, ${theme.surfaceAlt})` }}>
                    {!imgFailed ? (
                      <img
                        src={product.img}
                        alt={product.name}
                        onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.gold}40, ${theme.gold}20)`, border: `2px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: theme.gold }}>✦</div>
                      </div>
                    )}
                    {badge && (
                      <span style={{ position: "absolute", top: 10, right: 10, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, backdropFilter: "blur(4px)" }}>{product.badge}</span>
                    )}
                    {isPub && (
                      <div style={{ position: "absolute", inset: 0, background: mode === "dark" ? "rgba(13,43,26,0.9)" : "rgba(240,253,244,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: theme.green, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 22 }}>✓</div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: theme.green }}>Live in Store</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: "16px 18px 18px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 5, lineHeight: 1.3 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.55, marginBottom: 14 }}>{product.desc}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: theme.text, lineHeight: 1 }}>₱{product.price}</div>
                        <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 700, marginTop: 4, letterSpacing: "0.06em" }}>MIN. {product.moq} UNITS</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: theme.goldText, background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, borderRadius: 100, padding: "3px 10px" }}>{activeCat.toUpperCase()}</span>
                    </div>
                    {isPub ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: 1, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 9, padding: "9px", textAlign: "center", fontSize: 12, fontWeight: 700, color: theme.green }}>✓ Published</div>
                        <a href={isPub} target="_blank" rel="noreferrer" style={{ background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, borderRadius: 9, padding: "9px 14px", fontSize: 12, fontWeight: 700, color: theme.goldText }}>View →</a>
                      </div>
                    ) : (
                      <button onClick={() => handlePublish(product)} disabled={isPubbing}
                        style={{ width: "100%", borderRadius: 9, padding: "11px", background: isPubbing ? theme.surfaceAlt : `linear-gradient(135deg, ${theme.gold}, #a07828)`, border: "none", color: isPubbing ? theme.textMuted : "white", fontSize: 13, fontWeight: 700, cursor: isPubbing ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: isPubbing ? "none" : `0 4px 14px rgba(184,134,42,0.3)`, transition: "all 0.15s" }}>
                        {isPubbing
                          ? <><span style={{ width: 12, height: 12, border: `2px solid ${theme.border}`, borderTopColor: theme.gold, borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span> Publishing...</>
                          : "🚀 Publish to Store"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: theme.text, marginBottom: 6 }}>No products found</div>
              <div style={{ fontSize: 13, color: theme.textMuted }}>Try a different search or category</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}