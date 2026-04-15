import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";
import { PageHeader, Toast, EmptyState, StatusBadge } from "../components/Layout";
import { useTheme } from "./_app";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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
CATALOGUE.All = [...CATALOGUE.Skincare, ...CATALOGUE.Cosmetics, ...CATALOGUE.Haircare];
const CATS = ["All", "Skincare", "Cosmetics", "Haircare"];

export default function Catalogue() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme: T } = useTheme();
  const [open, setOpen] = useState(true);
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [published, setPublished] = useState({});
  const [publishing, setPublishing] = useState(null);
  const [toast, setToast] = useState(null);
  const [imgErr, setImgErr] = useState({});

  // Load published products from Supabase so state persists across navigation
  useEffect(() => {
    if (!shop) return;
    supabase.from("published_products").select("cucuma_product_id, shopify_product_id").eq("shop_domain", shop)
      .then(({ data }) => {
        if (data) {
          const map = {};
          data.forEach(p => { map[p.cucuma_product_id] = `https://${shop}/admin/products/${p.shopify_product_id}`; });
          setPublished(map);
        }
      });
  }, [shop]);

  const products = CATALOGUE[cat].filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));

  async function handlePublish(product) {
    if (!shop) { setToast({ msg: "No store connected.", type: "error" }); return; }
    if (published[product.id] || publishing === product.id) return;
    setPublishing(product.id);
    try {
      const category = CATS.find(c => c !== "All" && CATALOGUE[c].some(p => p.id === product.id)) || "Skincare";
      const res = await fetch("/api/products/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shop, product: { ...product, category } }) });
      const data = await res.json();
      if (data.success) { setPublished(prev => ({ ...prev, [product.id]: data.shopifyProductUrl || "#" })); setToast({ msg: `${product.name} published to your store!`, type: "success" }); }
      else setToast({ msg: data.error || "Failed to publish.", type: "error" });
    } catch { setToast({ msg: "Network error. Please try again.", type: "error" }); }
    setPublishing(null);
  }

  const badgeColors = {
    Bestseller: { bg: "rgba(184,134,11,0.1)", color: "#B8860B", border: "rgba(184,134,11,0.22)" },
    New: { bg: "rgba(61,90,62,0.08)", color: "#3D5A3E", border: "rgba(61,90,62,0.2)" },
    Popular: { bg: "rgba(120,80,180,0.08)", color: "#7850B4", border: "rgba(120,80,180,0.2)" },
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bgBase, overflow: "hidden" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        .toast-anim{animation:slideUp 0.25s ease;}
        .pcard{transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s;}
        .pcard:hover{transform:translateY(-3px);box-shadow:${T.shadowMd};border-color:${T.borderDefault}!important;}
        .pcard:hover .pimg img{transform:scale(1.05);}
        .pimg img{transition:transform 0.35s;}
        .tab-btn{cursor:pointer;padding:6px 16px;border-radius:100px;font-size:13px;font-weight:500;transition:all 0.15s;white-space:nowrap;border:1px solid;font-family:'DM Sans',sans-serif;background:none;}
        .pub-btn{width:100%;padding:9px;font-size:13px;font-weight:600;border-radius:7px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px;font-family:'DM Sans',sans-serif;border:1px solid;}
        .pub-btn:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);}
        input{outline:none;}
        @media(max-width:1024px){.pgrid{grid-template-columns:repeat(3,1fr)!important;}}
        @media(max-width:768px){.hdr{padding:10px 16px 10px 52px!important;flex-wrap:wrap;gap:8px;}.mpad{padding:16px!important;}.pgrid{grid-template-columns:1fr 1fr!important;}.hide-mobile{display:none!important;}}
        @media(max-width:480px){.pgrid{grid-template-columns:1fr!important;}}
      `}</style>

      {toast && <div className="toast-anim" style={{ position:"fixed", bottom:20, right:20, zIndex:1000, background:T.bgCard, border:`1px solid ${toast.type==="success"?T.oliveBorder:T.orangeBorder}`, borderRadius:10, padding:"13px 16px", maxWidth:320, boxShadow:T.shadowMd, display:"flex", alignItems:"center", gap:10 }}><div style={{ width:7, height:7, borderRadius:"50%", background:toast.type==="success"?T.olive:T.orange, flexShrink:0 }}></div><span style={{ fontSize:13, color:T.textPrimary, fontWeight:500 }}>{toast.msg}</span><button onClick={() => setToast(null)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textTertiary, fontSize:18, marginLeft:"auto" }}>×</button></div>}

      <SideNav active="catalogue" shop={shop} open={open} />
      <main style={{ flex: 1, overflow: "auto" }}>
        <PageHeader
          title="Product Catalogue"
          subtitle="Publish private label products to your Shopify store"
          onMenuToggle={() => setOpen(!open)}
          actions={
            <>
              <div style={{ position: "relative" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                  style={{ background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"7px 12px 7px 30px", color:T.textPrimary, fontSize:13, width:200 }} />
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:8, padding:"6px 12px" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:T.olive }}></div>
                <span style={{ fontSize:12, fontWeight:700, color:T.olive }}>{Object.keys(published).length} Published</span>
              </div>
            </>
          }
        />

        <div className="mpad" style={{ padding: "18px 24px" }}>
          {/* Category tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", paddingBottom: 2 }}>
            {CATS.map(c => {
              const count = c === "All" ? CATALOGUE.All.length : CATALOGUE[c].length;
              const isActive = cat === c;
              return (
                <button key={c} className="tab-btn" onClick={() => { setCat(c); setSearch(""); }}
                  style={{ background: isActive ? T.oliveSubtle : T.bgSurface, borderColor: isActive ? T.oliveBorder : T.borderSubtle, color: isActive ? T.olive : T.textSecondary }}>
                  {c} · {count}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <EmptyState icon="✦" title="No products found" description="Try a different search or category." />
          ) : (
            <div className="pgrid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {products.map(product => {
                const isPub = published[product.id];
                const isPubbing = publishing === product.id;
                const badge = product.badge ? badgeColors[product.badge] : null;
                return (
                  <div key={product.id} className="pcard" style={{ background: T.bgCard, border: `1px solid ${isPub ? T.oliveBorder : T.borderSubtle}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow }}>
                    <div className="pimg" style={{ aspectRatio: "3/4", overflow: "hidden", position: "relative", background: T.bgElevated }}>
                      {!imgErr[product.id] ? (
                        <img src={product.img} alt={product.name} loading="lazy" onError={() => setImgErr(prev => ({ ...prev, [product.id]: true }))} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:T.textTertiary, fontSize:28 }}>✦</div>
                      )}
                      {badge && !isPub && (
                        <span style={{ position:"absolute", top:8, right:8, background:badge.bg, color:badge.color, border:`1px solid ${badge.border}`, fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:100 }}>{product.badge}</span>
                      )}
                      {isPub && (
                        <div style={{ position:"absolute", inset:0, background:"rgba(61,90,62,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
                          <div style={{ width:36, height:36, borderRadius:"50%", background:"white", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.olive} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:"white" }}>Live in Store</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "12px 14px 14px" }}>
                      <div style={{ fontSize:10, fontWeight:700, color:T.gold, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3 }}>{CATS.find(c => c !== "All" && CATALOGUE[c].some(p => p.id === product.id))}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:T.textPrimary, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{product.name}</div>
                      <div style={{ fontSize:12, color:T.textSecondary, marginBottom:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{product.desc}</div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:T.textPrimary }}>${product.price}</span>
                        <span style={{ fontSize:10, fontWeight:600, color:T.textTertiary, background:T.bgSurface, padding:"2px 7px", borderRadius:100, border:`1px solid ${T.borderSubtle}` }}>Min. {product.moq}</span>
                      </div>
                      {isPub ? (
                        <div style={{ display:"flex", gap:6 }}>
                          <div style={{ flex:1, background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:7, padding:"8px", textAlign:"center", fontSize:12, fontWeight:600, color:T.olive }}>Published</div>
                          <a href={isPub === "#" ? undefined : isPub} target="_blank" rel="noreferrer" style={{ background:T.bgSurface, border:`1px solid ${T.borderDefault}`, borderRadius:7, padding:"8px 10px", fontSize:12, fontWeight:600, color:T.textSecondary, cursor:"pointer" }}>View</a>
                        </div>
                      ) : (
                        <button className="pub-btn" onClick={() => handlePublish(product)} disabled={isPubbing}
                          style={{ background:isPubbing?T.bgSurface:"transparent", borderColor:isPubbing?T.borderSubtle:T.borderDefault, color:isPubbing?T.textTertiary:T.textSecondary }}>
                          {isPubbing ? <><span style={{ width:11, height:11, border:`2px solid ${T.borderDefault}`, borderTopColor:T.olive, borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}></span>Publishing</> : "Publish to Store →"}
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