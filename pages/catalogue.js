import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";

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

const BADGE_STYLE = {
  Bestseller: { bg: "#fef3e2", color: "#c9963a" },
  New: { bg: "#f0fdf4", color: "#16a34a" },
  Popular: { bg: "#fdf4ff", color: "#9333ea" },
};

export default function Catalogue() {
  const router = useRouter();
  const { shop } = router.query;
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

  function showToast(message, url, type) {
    setToast({ message, url, type });
    setTimeout(() => setToast(null), 5000);
  }

  async function handlePublish(product) {
    if (!shop) { showToast("No store connected.", null, "error"); return; }
    if (published[product.id] || publishing === product.id) return;
    setPublishing(product.id);
    try {
      const res = await fetch("/api/products/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, product }),
      });
      const data = await res.json();
      if (data.success) {
        setPublished(prev => ({ ...prev, [product.id]: data.shopifyProductUrl }));
        showToast(product.name + " published to your store!", data.shopifyProductUrl, "success");
      } else {
        showToast(data.error || "Failed to publish.", null, "error");
      }
    } catch {
      showToast("Network error. Please try again.", null, "error");
    }
    setPublishing(null);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#faf9f7", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e8ddd0; border-radius: 2px; }
        .pcard { transition: transform 0.2s, box-shadow 0.2s; }
        .pcard:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        input { outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .toast { animation: slideIn 0.3s ease; }

        @media (max-width: 768px) {
          .cat-grid { grid-template-columns: 1fr 1fr !important; }
          .products-grid { grid-template-columns: 1fr 1fr !important; }
          .page-header { padding: 12px 16px 12px 60px !important; }
          .main-pad { padding: 16px !important; }
          .stats-bar { display: none !important; }
          .search-input { width: 160px !important; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .cat-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, background: toast.type === "success" ? "white" : "#fff5f5", border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`, borderRadius: 12, padding: "14px 18px", maxWidth: 340, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: 13, color: toast.type === "success" ? "#16a34a" : "#dc2626", fontWeight: 500, marginBottom: toast.url ? 8 : 0 }}>
            {toast.type === "success" ? "✓ " : "✗ "}{toast.message}
          </p>
          {toast.url && <a href={toast.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#c9963a", textDecoration: "none", fontWeight: 600 }}>View in Shopify →</a>}
        </div>
      )}

      <SideNav active="catalogue" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header className="page-header" style={{ padding: "16px 28px", background: "white", borderBottom: "1px solid #f0ebe3", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a0e04" }}>Product Catalogue</div>
              <div style={{ fontSize: 12, color: "#a09080" }}>Publish products to your store</div>
            </div>
          </div>
          <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            style={{ background: "#faf9f7", border: "1px solid #f0ebe3", borderRadius: 10, padding: "8px 14px", color: "#3a2a1a", fontSize: 13, width: 200 }} />
        </header>

        <div className="main-pad" style={{ padding: "20px 28px" }}>
          {/* Stats */}
          <div className="stats-bar" style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {Object.entries(CATALOGUE).map(([cat, prods]) => (
              <div key={cat} style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 14, color: cat === "Skincare" ? "#c9963a" : cat === "Cosmetics" ? "#9333ea" : "#0ea5e9" }}>
                  {cat === "Skincare" ? "◈" : cat === "Cosmetics" ? "✦" : "◉"}
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.06em" }}>{cat}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#1a0e04" }}>{prods.length}</div>
                </div>
              </div>
            ))}
            <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 12, padding: "12px 16px", marginLeft: "auto" }}>
              <div style={{ fontSize: 10, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.06em" }}>Published</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#16a34a" }}>{Object.keys(published).length}</div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
            {Object.keys(CATALOGUE).map(cat => (
              <button key={cat} onClick={() => { setActiveCat(cat); setSearch(""); }}
                style={{ background: activeCat === cat ? "#fef3e2" : "white", border: activeCat === cat ? "1px solid #f3d098" : "1px solid #f0ebe3", borderRadius: 10, padding: "10px 14px", color: activeCat === cat ? "#c9963a" : "#6b5a4e", fontSize: 13, fontWeight: activeCat === cat ? 600 : 400, cursor: "pointer", textAlign: "center" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {filtered.map(product => {
              const isPub = published[product.id];
              const isPubbing = publishing === product.id;
              const badge = product.badge ? BADGE_STYLE[product.badge] : null;
              return (
                <div key={product.id} className="pcard" style={{ background: "white", border: `1px solid ${isPub ? "#bbf7d0" : "#f0ebe3"}`, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ height: 140, background: "linear-gradient(135deg, #faf6f0, #f0ebe3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: 40, opacity: 0.2, color: "#c9963a" }}>✦</span>
                    {badge && <span style={{ position: "absolute", top: 10, right: 10, background: badge.bg, color: badge.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{product.badge}</span>}
                    {isPub && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(240,253,244,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <span style={{ fontSize: 24, color: "#16a34a" }}>✓</span>
                        <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>Live in Store</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a0e04", marginBottom: 4 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: "#a09080", marginBottom: 12, lineHeight: 1.5 }}>{product.desc}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a0e04" }}>₱{product.price}</div>
                        <div style={{ fontSize: 10, color: "#a09080" }}>MOQ: {product.moq} units</div>
                      </div>
                    </div>
                    {isPub ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: 1, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px", textAlign: "center", fontSize: 12, color: "#16a34a", fontWeight: 600 }}>✓ Published</div>
                        <a href={isPub} target="_blank" rel="noreferrer" style={{ background: "#fef3e2", border: "1px solid #f3d098", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#c9963a", textDecoration: "none", fontWeight: 600 }}>View →</a>
                      </div>
                    ) : (
                      <button onClick={() => handlePublish(product)} disabled={isPubbing}
                        style={{ width: "100%", borderRadius: 8, padding: "9px", background: isPubbing ? "#faf9f7" : "linear-gradient(135deg, #c9963a, #a07020)", border: isPubbing ? "1px solid #f0ebe3" : "none", color: isPubbing ? "#a09080" : "white", fontSize: 13, fontWeight: 600, cursor: isPubbing ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {isPubbing ? <><span style={{ width: 12, height: 12, border: "2px solid #e8ddd0", borderTopColor: "#c9963a", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>Publishing...</> : "🚀 Publish to Store"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#a09080" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>No products found</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}