import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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

const ICONS = { Skincare: "◈", Cosmetics: "✦", Haircare: "◉" };
const COLORS = { Skincare: "#d4b68e", Cosmetics: "#c084fc", Haircare: "#67e8f9" };
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈", href: "/dashboard" },
  { id: "catalogue", label: "Catalogue", icon: "✦", href: "/catalogue" },
  { id: "branding", label: "Branding", icon: "◉", href: "/branding" },
  { id: "orders", label: "Orders", icon: "⬡", href: "/orders" },
  { id: "settings", label: "Settings", icon: "⚙", href: "/settings" },
];

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
    setTimeout(() => setToast(null), 6000);
  }

  async function handlePublish(product) {
    if (!shop) {
      showToast("No store connected. Add ?shop=yourstore.myshopify.com to the URL.", null, "error");
      return;
    }
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
        showToast(product.name + " is now live in your store!", data.shopifyProductUrl, "success");
      } else {
        showToast(data.error || "Failed to publish.", null, "error");
      }
    } catch (err) {
      showToast("Network error. Please try again.", null, "error");
    }
    setPublishing(null);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080a0c", color: "#e8e0d4", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Cormorant+Garamond:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2620; border-radius: 2px; }
        .pcard { transition: transform 0.2s; }
        .pcard:hover { transform: translateY(-3px); }
        input { outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .toast { animation: slideIn 0.3s ease; }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div className="toast" style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          background: toast.type === "success" ? "#0d2b1a" : "#2b0d0d",
          border: "1px solid " + (toast.type === "success" ? "#4ade80" : "#f87171"),
          borderRadius: 12, padding: "14px 18px", maxWidth: 360,
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
        }}>
          <p style={{ fontSize: 13, color: toast.type === "success" ? "#4ade80" : "#f87171", fontWeight: 500, marginBottom: toast.url ? 10 : 0 }}>
            {toast.type === "success" ? "✓ " : "✗ "}{toast.message}
          </p>
          {toast.url && (
            <a href={toast.url} target="_blank" rel="noreferrer"
              style={{ fontSize: 12, color: "#d4b68e", textDecoration: "none", background: "rgba(212,182,142,0.1)", borderRadius: 6, padding: "5px 10px", display: "inline-block" }}>
              View in Shopify →
            </a>
          )}
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? 240 : 64, background: "#0d0f12", borderRight: "1px solid #1a1c1f", display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #1a1c1f", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #d4b68e, #a07850)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✦</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#e8e0d4" }}>Cucuma</div>
              <div style={{ fontSize: 10, color: "#6b6560", letterSpacing: "0.15em", textTransform: "uppercase" }}>Private Label</div>
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: "16px 10px" }}>
          {NAV.map(item => (
            <Link key={item.id} href={item.href + "?shop=" + (shop || "")} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 8, marginBottom: 4, borderLeft: item.id === "catalogue" ? "2px solid #d4b68e" : "2px solid transparent", background: item.id === "catalogue" ? "rgba(212,182,142,0.1)" : "transparent", color: item.id === "catalogue" ? "#d4b68e" : "#6b6560", cursor: "pointer" }}>
                <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</span>}
              </div>
            </Link>
          ))}
        </nav>
        {sidebarOpen && (
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

      {/* MAIN */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header style={{ padding: "20px 32px", borderBottom: "1px solid #1a1c1f", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#080a0c", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "1px solid #1a1c1f", borderRadius: 6, color: "#6b6560", cursor: "pointer", padding: "6px 8px", fontSize: 14 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#e8e0d4" }}>Product Catalogue ✦</div>
              <div style={{ fontSize: 12, color: "#4b4540", marginTop: 2 }}>Publish private label products to your Shopify store</div>
            </div>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 8, padding: "9px 16px", color: "#e8e0d4", fontSize: 13, width: 220 }} />
        </header>

        <div style={{ padding: "24px 32px" }}>
          {/* Stats */}
          <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
            {Object.entries(CATALOGUE).map(([cat, prods]) => (
              <div key={cat} style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: COLORS[cat] }}>{ICONS[cat]}</span>
                <div>
                  <div style={{ fontSize: 10, color: "#4b4540", textTransform: "uppercase" }}>{cat}</div>
                  <div style={{ fontSize: 18, color: "#e8e0d4" }}>{prods.length} <span style={{ fontSize: 11, color: "#6b6560" }}>products</span></div>
                </div>
              </div>
            ))}
            <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 12, padding: "12px 18px", marginLeft: "auto" }}>
              <div style={{ fontSize: 10, color: "#4b4540", textTransform: "uppercase" }}>Published</div>
              <div style={{ fontSize: 18, color: "#4ade80" }}>{Object.keys(published).length} <span style={{ fontSize: 11, color: "#6b6560" }}>products</span></div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {Object.keys(CATALOGUE).map(cat => (
              <button key={cat} onClick={() => { setActiveCat(cat); setSearch(""); }}
                style={{ background: activeCat === cat ? "rgba(212,182,142,0.1)" : "transparent", border: activeCat === cat ? "1px solid " + COLORS[cat] : "1px solid #1a1c1f", borderRadius: 10, padding: "9px 20px", color: activeCat === cat ? COLORS[cat] : "#6b6560", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                {ICONS[cat]} {cat} <span style={{ background: "#1a1c1f", borderRadius: 20, padding: "1px 7px", fontSize: 11, color: "#6b6560", marginLeft: 4 }}>{CATALOGUE[cat].length}</span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {filtered.map(product => {
              const isPub = published[product.id];
              const isPubbing = publishing === product.id;
              return (
                <div key={product.id} className="pcard" style={{ background: "#0d0f12", border: "1px solid " + (isPub ? "#1a3a20" : "#1a1c1f"), borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ height: 150, background: "linear-gradient(135deg, #111316, #1a1c1f)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: 44, opacity: 0.12 }}>{ICONS[activeCat]}</span>
                    {product.badge && (
                      <span style={{ position: "absolute", top: 12, right: 12, background: product.badge === "Bestseller" ? "#d4b68e" : product.badge === "New" ? "#4ade80" : "#c084fc", color: "#0d0f12", borderRadius: 6, padding: "3px 9px", fontSize: 10, fontWeight: 700 }}>{product.badge}</span>
                    )}
                    {isPub && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(13,43,26,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <span style={{ fontSize: 26, color: "#4ade80" }}>✓</span>
                        <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>Live in Store</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e0d4", marginBottom: 5 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: "#6b6560", marginBottom: 12, lineHeight: 1.5 }}>{product.desc}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 18, color: "#e8e0d4" }}>₱{product.price}</div>
                        <div style={{ fontSize: 10, color: "#4b4540" }}>MOQ: {product.moq} units</div>
                      </div>
                      <span style={{ fontSize: 10, color: COLORS[activeCat], background: "rgba(212,182,142,0.08)", borderRadius: 6, padding: "3px 9px" }}>{activeCat}</span>
                    </div>
                    {isPub ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: 1, background: "#0d2b1a", border: "1px solid #4ade80", borderRadius: 8, padding: "9px", textAlign: "center", fontSize: 12, color: "#4ade80", fontWeight: 600 }}>✓ Published</div>
                        <a href={isPub} target="_blank" rel="noreferrer" style={{ background: "#1a1c1f", border: "1px solid #2a2620", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#d4b68e", textDecoration: "none" }}>View →</a>
                      </div>
                    ) : (
                      <button onClick={() => handlePublish(product)} disabled={isPubbing}
                        style={{ width: "100%", borderRadius: 8, padding: "10px", background: isPubbing ? "#1a1c1f" : "#d4b68e", border: isPubbing ? "1px solid #2a2620" : "none", color: isPubbing ? "#6b6560" : "#1a0e04", fontSize: 13, fontWeight: 600, cursor: isPubbing ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        {isPubbing
                          ? <><span style={{ width: 12, height: 12, border: "2px solid #6b6560", borderTopColor: "#d4b68e", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>Publishing...</>
                          : "🚀 Publish to Store"
                        }
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#4b4540" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>◈</div>
              <div style={{ fontSize: 18 }}>No products found</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}