import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

const CATALOGUE = {
  All: [],
  Skincare: [
    { id: 1, name: "Rose Glow Serum", desc: "Vitamin C + Niacinamide brightening", price: "22.99", moq: 50, badge: "Bestseller", img: "https://ecqkxtxxmtwxhwydcevq.supabase.co/storage/v1/object/public/branding-assets/pszvvMNBTJaVnDojdiQkpw@2k.webp" },
    { id: 2, name: "Moisture Shield SPF50", desc: "Lightweight daily sunscreen + HA", price: "15.99", moq: 30, badge: "New", img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80" },
    { id: 3, name: "Vitamin C Brightener", desc: "20% Vitamin C + ferulic acid serum", price: "25.99", moq: 25, badge: null, img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" },
    { id: 4, name: "Retinol Night Repair", desc: "0.3% retinol with ceramide complex", price: "29.99", moq: 20, badge: "Popular", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80" },
    { id: 5, name: "Hydra Boost Toner", desc: "7-layer moisture with beta-glucan", price: "13.49", moq: 40, badge: null, img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80" },
    { id: 6, name: "Pore Refining Clay Mask", desc: "Kaolin + charcoal deep cleanser", price: "12.19", moq: 35, badge: null, img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80" },
  ],
  Cosmetics: [
    { id: 7, name: "Matte Lip Studio Kit", desc: "12-shade transfer-proof collection", price: "13.59", moq: 30, badge: "Bestseller", img: "https://ecqkxtxxmtwxhwydcevq.supabase.co/storage/v1/object/public/branding-assets/rsdlZycFSbOXD4UeesaTtg@2k%20(1).webp" },
    { id: 8, name: "Glow Highlighter Palette", desc: "6-pan pressed pigment palette", price: "17.49", moq: 25, badge: null, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80" },
    { id: 9, name: "Skin Tint Foundation", desc: "Buildable coverage skin tint SPF20", price: "19.69", moq: 20, badge: "New", img: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80" },
    { id: 10, name: "Brow Define Pencil", desc: "Micro-tip brow pencil with spoolie", price: "7.49", moq: 50, badge: null, img: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=400&q=80" },
    { id: 11, name: "Volume Lash Mascara", desc: "Tubing mascara, no panda eyes", price: "10.49", moq: 40, badge: "Popular", img: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400&q=80" },
    { id: 12, name: "Blush Duo Compact", desc: "Buildable powder blush in 2 shades", price: "11.59", moq: 30, badge: null, img: "https://images.unsplash.com/photo-1599733589046-833b12f81938?w=400&q=80" },
  ],
  Haircare: [
    { id: 13, name: "Keratin Repair Mask", desc: "Deep conditioning for damaged hair", price: "37.49", moq: 20, badge: "Bestseller", img: "https://ecqkxtxxmtwxhwydcevq.supabase.co/storage/v1/object/public/branding-assets/iLEtWdoIRoq0erfniMRspg@2k.webp" },
    { id: 14, name: "Scalp Revival Serum", desc: "Caffeine + biotin scalp growth", price: "33.79", moq: 15, badge: "New", img: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400&q=80" },
    { id: 15, name: "Argan Oil Treatment", desc: "Lightweight frizz-control argan oil", price: "17.49", moq: 25, badge: null, img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80" },
    { id: 16, name: "Color Protect Shampoo", desc: "Sulfate-free color-safe cleanser", price: "11.59", moq: 30, badge: "Popular", img: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&q=80" },
    { id: 17, name: "Bond Repair Conditioner", desc: "Bond builder conditioner", price: "13.99", moq: 30, badge: null, img: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&q=80" },
    { id: 18, name: "Heat Protect Spray", desc: "250°C heat shield + shine spray", price: "9.99", moq: 40, badge: null, img: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&q=80" },
  ],
};

// Build All category
CATALOGUE.All = [...CATALOGUE.Skincare, ...CATALOGUE.Cosmetics, ...CATALOGUE.Haircare];

const CATEGORIES = ["All", "Skincare", "Cosmetics", "Haircare"];
const BADGE_STYLES = (theme) => ({
  Bestseller: { bg: theme.goldSubtle, color: theme.gold },
  New: { bg: theme.greenSubtle, color: theme.green },
  Popular: { bg: "rgba(120,80,200,0.12)", color: "#9870D0" },
});

export default function Catalogue() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme } = useTheme();
  const [activeCat, setActiveCat] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [published, setPublished] = useState({});
  const [publishing, setPublishing] = useState(null);
  const [toast, setToast] = useState(null);
  const [imgErr, setImgErr] = useState({});

  const products = CATALOGUE[activeCat].filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase())
  );

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handlePublish(product) {
    if (!shop) { showToast("No store connected. Add ?shop=yourstore.myshopify.com to the URL.", "error"); return; }
    if (published[product.id] || publishing === product.id) return;
    setPublishing(product.id);
    try {
      const cat = CATEGORIES.find(c => c !== "All" && CATALOGUE[c].some(p => p.id === product.id)) || "Skincare";
      const res = await fetch("/api/products/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shop, product: { ...product, category: cat } }) });
      const data = await res.json();
      if (data.success) { setPublished(prev => ({ ...prev, [product.id]: data.shopifyProductUrl || "#" })); showToast(`${product.name} published to your store.`, "success"); }
      else showToast(data.error || "Failed to publish.", "error");
    } catch { showToast("Network error. Please try again.", "error"); }
    setPublishing(null);
  }

  const bs = BADGE_STYLES(theme);

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bgBase, overflow: "hidden" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .toast-anim { animation: slideUp 0.25s ease; }
        .pcard { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
        .pcard:hover { transform: translateY(-3px); box-shadow: ${theme.shadowMd}; border-color: ${theme.borderDefault} !important; }
        .pcard:hover .pcard-img img { transform: scale(1.05); }
        .pcard-img img { transition: transform 0.35s ease; }
        .tab-btn { cursor:pointer; padding:6px 14px; border-radius:100px; font-size:13px; font-weight:500; transition:all 0.15s; white-space:nowrap; border:1px solid; }
        .pub-btn { width:100%; padding:9px; font-size:13px; font-weight:600; border-radius:7px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:6px; }
        .pub-btn:hover:not(:disabled) { filter:brightness(1.1); transform:translateY(-1px); }
        input { outline:none; }
        @media (max-width: 1024px) { .pgrid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 768px) { .hdr { padding:10px 16px 10px 52px !important; flex-wrap:wrap; gap:8px; } .main-pad { padding:16px !important; } .pgrid { grid-template-columns: 1fr 1fr !important; } .hide-sm { display:none !important; } }
        @media (max-width: 480px) { .pgrid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="toast-anim" style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000, background: theme.bgCard, border: `1px solid ${toast.type === "success" ? theme.greenBorder : "rgba(192,80,80,0.3)"}`, borderRadius: 10, padding: "13px 16px", maxWidth: 320, boxShadow: theme.shadowMd, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: toast.type === "success" ? theme.green : "#C05050", flexShrink: 0 }}></div>
          <span style={{ fontSize: 13, color: theme.textPrimary, fontWeight: 500 }}>{toast.msg}</span>
        </div>
      )}

      <SideNav active="catalogue" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header className="hdr" style={{ padding: "12px 24px", background: theme.bgCard, borderBottom: `1px solid ${theme.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.borderSubtle}`, borderRadius: 7, padding: "6px 9px", color: theme.textTertiary, cursor: "pointer", display: "flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary }}>Product Catalogue</div>
              <div style={{ fontSize: 12, color: theme.textTertiary }}>Publish private label products to your Shopify store</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textTertiary} strokeWidth="2" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                style={{ background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 8, padding: "7px 12px 7px 30px", color: theme.textPrimary, fontSize: 13, width: 200 }} />
            </div>
            {/* Published count */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: theme.greenSubtle, border: `1px solid ${theme.greenBorder}`, borderRadius: 8, padding: "6px 12px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.green }}></div>
              <span style={{ fontSize: 12, fontWeight: 700, color: theme.green }}>{Object.keys(published).length} Published</span>
            </div>
          </div>
        </header>

        <div className="main-pad" style={{ padding: "18px 24px" }}>
          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", paddingBottom: 2 }}>
            {CATEGORIES.map(cat => {
              const count = cat === "All" ? CATALOGUE.All.length : CATALOGUE[cat].length;
              const isActive = activeCat === cat;
              return (
                <button key={cat} className="tab-btn" onClick={() => { setActiveCat(cat); setSearch(""); }}
                  style={{ background: isActive ? theme.goldSubtle : theme.bgSurface, borderColor: isActive ? theme.goldBorder : theme.borderSubtle, color: isActive ? theme.gold : theme.textSecondary }}>
                  {cat} · {count}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.bgSurface, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.textTertiary} strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary, marginBottom: 6 }}>No products found</div>
              <p style={{ fontSize: 13, color: theme.textTertiary }}>Try a different search or category</p>
            </div>
          ) : (
            <div className="pgrid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {products.map(product => {
                const isPub = published[product.id];
                const isPubbing = publishing === product.id;
                const badge = product.badge ? bs[product.badge] : null;
                return (
                  <div key={product.id} className="pcard" style={{ background: theme.bgCard, border: `1px solid ${isPub ? theme.greenBorder : theme.borderSubtle}`, borderRadius: 10, overflow: "hidden", boxShadow: theme.shadow }}>
                    {/* Image */}
                    <div className="pcard-img" style={{ aspectRatio: "3/4", overflow: "hidden", position: "relative", background: theme.bgSurface }}>
                      {!imgErr[product.id] ? (
                        <img src={product.img} alt={product.name} loading="lazy" onError={() => setImgErr(prev => ({ ...prev, [product.id]: true }))}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: theme.textTertiary, fontSize: 28 }}>✦</div>
                      )}
                      {badge && !isPub && (
                        <span style={{ position: "absolute", top: 8, right: 8, background: badge.bg, color: badge.color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100 }}>{product.badge}</span>
                      )}
                      {isPub && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(13,43,26,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: theme.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: theme.green }}>Live in Store</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: "12px 14px 14px" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</div>
                      <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.desc}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 500, color: theme.gold }}>${product.price}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: theme.textTertiary, background: theme.bgSurface, padding: "2px 7px", borderRadius: 100, border: `1px solid ${theme.borderSubtle}` }}>Min. {product.moq}</span>
                      </div>

                      {isPub ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <div style={{ flex: 1, background: theme.greenSubtle, border: `1px solid ${theme.greenBorder}`, borderRadius: 7, padding: "8px", textAlign: "center", fontSize: 12, fontWeight: 600, color: theme.green }}>Published</div>
                          <a href={isPub === "#" ? undefined : isPub} target="_blank" rel="noreferrer"
                            style={{ background: theme.bgSurface, border: `1px solid ${theme.borderDefault}`, borderRadius: 7, padding: "8px 10px", fontSize: 12, fontWeight: 600, color: theme.textSecondary, cursor: "pointer" }}>View</a>
                        </div>
                      ) : (
                        <button className="pub-btn" onClick={() => handlePublish(product)} disabled={isPubbing}
                          style={{ background: isPubbing ? theme.bgSurface : "transparent", border: `1px solid ${isPubbing ? theme.borderSubtle : theme.borderDefault}`, color: isPubbing ? theme.textTertiary : theme.textSecondary }}>
                          {isPubbing
                            ? <><span style={{ width: 11, height: 11, border: `2px solid ${theme.borderDefault}`, borderTopColor: theme.gold, borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>Publishing</>
                            : "Publish to Store →"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}