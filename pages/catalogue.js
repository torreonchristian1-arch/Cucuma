import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";
import { PageHeader, Toast } from "../components/Layout";
import { useTheme } from "./_app";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const PRODUCTS = [
  {
    id: 1, name: "Radiance Serum", type: "Serum", tagline: "Concentrated actives in a lightweight drop",
    desc: "A fast-absorbing serum packed with skin-identical ingredients. Targets your chosen concern with clinical-grade actives in a silky, fragrance-free base.",
    img: "https://ecqkxtxxmtwxhwydcevq.supabase.co/storage/v1/object/public/branding-assets/pszvvMNBTJaVnDojdiQkpw@2k.webp",
    wholesale: 22.99, suggestedRetail: 54.99, volume: "30ml", icon: "💧",
    concerns: ["glow", "anti-aging", "hydration"],
    customOptions: {
      hydration: { active: "Hyaluronic Acid 2%", benefit: "Deep 72-hour hydration" },
      glow: { active: "Vitamin C 15% + Niacinamide", benefit: "Brightens and evens skin tone" },
      "anti-aging": { active: "Retinol 0.3% + Peptides", benefit: "Reduces fine lines and firms skin" },
    }
  },
  {
    id: 2, name: "Cloud Cream", type: "Face Cream", tagline: "Rich yet weightless daily moisturiser",
    desc: "A whipped moisturiser that melts into skin without residue. Formulated for all-day hydration with a protective barrier complex.",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    wholesale: 19.99, suggestedRetail: 48.99, volume: "50ml", icon: "☁️",
    concerns: ["hydration", "sensitive", "anti-aging"],
    customOptions: {
      hydration: { active: "Ceramide Complex + Glycerin", benefit: "Restores skin barrier overnight" },
      sensitive: { active: "Oat Extract + Allantoin", benefit: "Calms redness and irritation" },
      "anti-aging": { active: "Collagen Peptides + Squalane", benefit: "Plumps and firms with every use" },
    }
  },
  {
    id: 3, name: "Pure Balance Cleanser", type: "Cleanser", tagline: "Cleanses without stripping",
    desc: "A gentle yet effective gel cleanser that removes impurities and excess oil without disrupting skin's natural pH balance.",
    img: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80",
    wholesale: 14.99, suggestedRetail: 34.99, volume: "150ml", icon: "🫧",
    concerns: ["acne", "sensitive", "hydration"],
    customOptions: {
      acne: { active: "Salicylic Acid 2% + Tea Tree", benefit: "Unclogs pores and controls breakouts" },
      sensitive: { active: "Micellar Technology + Aloe", benefit: "Removes makeup without friction" },
      hydration: { active: "Amino Acids + Rose Water", benefit: "Cleanses while maintaining moisture" },
    }
  },
  {
    id: 4, name: "Velvet Body Butter", type: "Body Butter", tagline: "Deeply nourishing whole-body treatment",
    desc: "A rich, indulgent body butter that transforms dry skin in seconds. Formulated with premium butters and oils for lasting softness.",
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80",
    wholesale: 17.49, suggestedRetail: 42.99, volume: "200ml", icon: "✨",
    concerns: ["hydration", "sensitive", "glow"],
    customOptions: {
      hydration: { active: "Shea Butter + Jojoba Oil", benefit: "24-hour moisture lock for dry skin" },
      sensitive: { active: "Oat Oil + Chamomile Extract", benefit: "Soothes eczema-prone and reactive skin" },
      glow: { active: "Marula Oil + Vitamin E", benefit: "Illuminates and evens skin tone on body" },
    }
  },
  {
    id: 5, name: "Silk Lip Gloss", type: "Lip Gloss", tagline: "Plumping colour with skincare benefits",
    desc: "A non-sticky, high-shine lip gloss with skincare actives. Available in 6 curated shades from nude to statement.",
    img: "https://ecqkxtxxmtwxhwydcevq.supabase.co/storage/v1/object/public/branding-assets/rsdlZycFSbOXD4UeesaTtg@2k%20(1).webp",
    wholesale: 11.49, suggestedRetail: 28.99, volume: "8ml", icon: "💋",
    concerns: ["hydration", "glow", "sensitive"],
    shades: [
      { name: "Bare", hex: "#C4927A" }, { name: "Rosé", hex: "#E8A0A0" },
      { name: "Berry", hex: "#8B3A5A" }, { name: "Coral", hex: "#E87560" },
      { name: "Nude", hex: "#B8896A" }, { name: "Glam", hex: "#C04080" },
    ],
    customOptions: {
      hydration: { active: "Hyaluronic Acid + Vitamin E", benefit: "Plumps and hydrates lips all day" },
      glow: { active: "Vitamin C + Pearl Shimmer", benefit: "Brightening with a luminous finish" },
      sensitive: { active: "Aloe + Jojoba Oil", benefit: "Fragrance-free, gentle formula" },
    }
  },
];

const CONCERNS = [
  { id: "all", label: "All Products", icon: "✦", desc: "Browse all 5 hero products" },
  { id: "hydration", label: "Hydration", icon: "💧", desc: "Deep moisture & barrier repair" },
  { id: "glow", label: "Glow", icon: "✨", desc: "Brightening & radiance" },
  { id: "anti-aging", label: "Anti-Aging", icon: "⏳", desc: "Fine lines & firmness" },
  { id: "acne", label: "Acne Care", icon: "🎯", desc: "Pore clearing & balancing" },
  { id: "sensitive", label: "Sensitive Skin", icon: "🌿", desc: "Calming & gentle formulas" },
];

export default function Catalogue() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme: T } = useTheme();
  const [open, setOpen] = useState(true);
  const [concern, setConcern] = useState("all");
  const [selected, setSelected] = useState(null);
  const [selectedShade, setSelectedShade] = useState(null);
  const [published, setPublished] = useState({});
  const [publishing, setPublishing] = useState(null);
  const [toast, setToast] = useState(null);

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

  const filtered = concern === "all" ? PRODUCTS : PRODUCTS.filter(p => p.concerns.includes(concern));

  function getCustom(product) {
    const c = product.concerns.includes(concern) ? concern : product.concerns[0];
    return { concern: c, data: product.customOptions[c] };
  }

  function profitCalc(p) {
    const margin = Math.round(((p.suggestedRetail - p.wholesale) / p.suggestedRetail) * 100);
    return { margin, profit: (p.suggestedRetail - p.wholesale).toFixed(2) };
  }

  async function handlePublish(product) {
    if (!shop) { setToast({ msg: "No store connected.", type: "error" }); return; }
    if (published[product.id] || publishing === product.id) return;
    const { concern: activeConcern, data: custom } = getCustom(product);
    const shadeInfo = selectedShade ? ` - ${selectedShade.name}` : "";
    setPublishing(product.id);
    try {
      const res = await fetch("/api/products/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop,
          product: {
            id: product.id,
            name: `${product.name}${shadeInfo}`,
            desc: `${product.desc}\n\nFormulated for ${activeConcern}: ${custom?.benefit || product.tagline}.\nKey Active: ${custom?.active || "Premium formula"}.\nVolume: ${product.volume}.`,
            price: String(product.wholesale),
            category: product.type,
            moq: 25,
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setPublished(prev => ({ ...prev, [product.id]: data.shopifyProductUrl || "#" }));
        setToast({ msg: `${product.name} published!`, type: "success" });
        setSelected(null);
      } else setToast({ msg: data.error || "Failed to publish.", type: "error" });
    } catch { setToast({ msg: "Network error.", type: "error" }); }
    setPublishing(null);
  }

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bgBase, overflow:"hidden" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes toastIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        .concern-btn{cursor:pointer;border-radius:12px;padding:12px 10px;transition:all 0.2s;border:1px solid;font-family:'DM Sans',sans-serif;background:none;text-align:center;width:100%;}
        .concern-btn:hover{transform:translateY(-2px);}
        .pcard{transition:all 0.22s;border-radius:16px;overflow:hidden;cursor:pointer;}
        .pcard:hover{transform:translateY(-4px);box-shadow:${T.shadowMd};}
        .pcard:hover .pimg img{transform:scale(1.05);}
        .pimg img{transition:transform 0.4s;}
        .shade-dot{width:28px;height:28px;border-radius:50%;cursor:pointer;transition:all 0.15s;border:2px solid transparent;}
        .shade-dot:hover{transform:scale(1.15);}
        .shade-dot.sel{border-color:${T.textPrimary};transform:scale(1.2);}
        .pub-btn{width:100%;padding:13px;font-size:14px;font-weight:700;border-radius:10px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'DM Sans',sans-serif;border:none;}
        .pub-btn:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);}
        .pub-btn:disabled{opacity:0.7;cursor:default;}
        .modal-bg{position:fixed;inset:0;background:rgba(44,28,14,0.5);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal{background:${T.bgCard};border-radius:20px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,0.25);animation:slideUp 0.25s ease;}
        @media(max-width:1100px){.pgrid{grid-template-columns:repeat(3,1fr)!important;}}
        @media(max-width:768px){.mpad{padding:16px!important;}.concerns-row{grid-template-columns:repeat(3,1fr)!important;}.pgrid{grid-template-columns:1fr 1fr!important;}.hide-mobile{display:none!important;}}
        @media(max-width:480px){.concerns-row{grid-template-columns:repeat(2,1fr)!important;}.pgrid{grid-template-columns:1fr!important;}}
      `}</style>

      {toast && <div style={{ position:"fixed", bottom:20, right:20, zIndex:1000, background:T.bgCard, border:`1px solid ${toast.type==="success"?T.oliveBorder:T.orangeBorder}`, borderRadius:10, padding:"13px 16px", maxWidth:320, boxShadow:T.shadowMd, display:"flex", alignItems:"center", gap:10, animation:"toastIn 0.25s ease" }}><div style={{ width:7, height:7, borderRadius:"50%", background:toast.type==="success"?T.olive:T.orange, flexShrink:0 }}></div><span style={{ fontSize:13, color:T.textPrimary, fontWeight:500 }}>{toast.msg}</span><button onClick={()=>setToast(null)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textTertiary, fontSize:18, marginLeft:"auto" }}>×</button></div>}

      {/* Product Detail Modal */}
      {selected && (
        <div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
          <div className="modal">
            <div style={{ height:220, overflow:"hidden", position:"relative", background:T.bgElevated }}>
              <img src={selected.img} alt={selected.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <button onClick={()=>setSelected(null)} style={{ position:"absolute", top:14, right:14, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(8px)", border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", color:"white", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
              {published[selected.id] && <div style={{ position:"absolute", top:14, left:14, background:"rgba(61,90,62,0.92)", color:"white", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:100 }}>✓ Live in Your Store</div>}
            </div>
            <div style={{ padding:"24px 26px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:T.gold, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>{selected.type} · {selected.volume}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:T.textPrimary }}>{selected.name}</div>
                  <div style={{ fontSize:13, color:T.textSecondary, marginTop:3 }}>{selected.tagline}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:T.textPrimary }}>${selected.wholesale}</div>
                  <div style={{ fontSize:10, color:T.textTertiary }}>wholesale / unit</div>
                </div>
              </div>

              {/* Concern selector */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Customer Skin Concern</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {selected.concerns.map(c => {
                    const cd = CONCERNS.find(x=>x.id===c);
                    const isSel = concern===c||(concern==="all"&&c===selected.concerns[0]);
                    return <button key={c} onClick={()=>setConcern(c)} style={{ padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:600, cursor:"pointer", border:`1px solid ${isSel?T.oliveBorder:T.borderSubtle}`, background:isSel?T.oliveSubtle:"transparent", color:isSel?T.olive:T.textSecondary, fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s" }}>{cd?.icon} {cd?.label}</button>;
                  })}
                </div>
              </div>

              {/* Active ingredient */}
              {(() => {
                const ac = selected.concerns.includes(concern)?concern:selected.concerns[0];
                const custom = selected.customOptions[ac];
                const cd = CONCERNS.find(x=>x.id===ac);
                return custom ? (
                  <div style={{ background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:T.bgCard, border:`1px solid ${T.oliveBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{cd?.icon}</div>
                      <div><div style={{ fontSize:11, fontWeight:700, color:T.olive, marginBottom:1 }}>Formulated for {cd?.label}</div><div style={{ fontSize:13, color:T.textPrimary, fontWeight:600 }}>{custom.active}</div><div style={{ fontSize:12, color:T.textSecondary }}>{custom.benefit}</div></div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Shade selector */}
              {selected.shades && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Choose Shade {selectedShade&&<span style={{ color:T.textPrimary, fontWeight:500, letterSpacing:0, textTransform:"none" }}>· {selectedShade.name}</span>}</div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    {selected.shades.map(shade=><button key={shade.name} className={`shade-dot${selectedShade?.name===shade.name?" sel":""}`} onClick={()=>setSelectedShade(shade)} style={{ background:shade.hex }} title={shade.name} />)}
                  </div>
                </div>
              )}

              <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.75, marginBottom:18 }}>{selected.desc}</p>

              {/* Profit */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:18 }}>
                {[{l:"Your Cost",v:`$${selected.wholesale}`,s:"per unit",c:T.textSecondary},{l:"Suggested Retail",v:`$${selected.suggestedRetail}`,s:"you set the price",c:T.textPrimary},{l:"Est. Profit",v:`$${profitCalc(selected).profit}`,s:`${profitCalc(selected).margin}% margin`,c:T.olive}].map(i=>(
                  <div key={i.l} style={{ background:T.bgBase, border:`1px solid ${T.borderSubtle}`, borderRadius:10, padding:"11px", textAlign:"center" }}>
                    <div style={{ fontSize:9, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{i.l}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:700, color:i.c }}>{i.v}</div>
                    <div style={{ fontSize:10, color:T.textTertiary, marginTop:1 }}>{i.s}</div>
                  </div>
                ))}
              </div>

              {published[selected.id] ? (
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1, background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:10, padding:"12px", textAlign:"center", fontSize:14, fontWeight:700, color:T.olive }}>✓ Published to Store</div>
                  <a href={published[selected.id]!=="#"?published[selected.id]:undefined} target="_blank" rel="noreferrer" style={{ background:T.bgSurface, border:`1px solid ${T.borderDefault}`, borderRadius:10, padding:"12px 16px", fontSize:13, fontWeight:600, color:T.textSecondary, cursor:"pointer" }}>View →</a>
                </div>
              ) : (
                <button className="pub-btn" onClick={()=>handlePublish(selected)} disabled={publishing===selected.id||(selected.shades&&!selectedShade)}
                  style={{ background:selected.shades&&!selectedShade?T.bgSurface:T.olive, color:selected.shades&&!selectedShade?T.textTertiary:"white" }}>
                  {publishing===selected.id?<><span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}></span>Publishing...</>:selected.shades&&!selectedShade?"Select a shade first":`Publish to Your Store →`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <SideNav active="catalogue" shop={shop} open={open} />
      <main style={{ flex:1, overflow:"auto" }}>
        <PageHeader title="Product Catalogue" subtitle="5 hero products · customised for your customers' skin concerns"
          onMenuToggle={()=>setOpen(!open)}
          actions={<div style={{ display:"flex", alignItems:"center", gap:8, background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:8, padding:"6px 14px" }}><div style={{ width:6, height:6, borderRadius:"50%", background:T.olive }}></div><span style={{ fontSize:12, fontWeight:700, color:T.olive }}>{Object.keys(published).length} / {PRODUCTS.length} Published</span></div>}
        />

        <div className="mpad" style={{ padding:"20px 24px" }}>
          {/* Concerns */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:12 }}>Filter by Skin Concern</div>
            <div className="concerns-row" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
              {CONCERNS.map(c=>(
                <button key={c.id} className="concern-btn" onClick={()=>setConcern(c.id)}
                  style={{ background:concern===c.id?T.oliveSubtle:T.bgCard, borderColor:concern===c.id?T.oliveBorder:T.borderSubtle, boxShadow:concern===c.id?`0 4px 16px ${T.olive}20`:T.shadow }}>
                  <div style={{ fontSize:22, marginBottom:5 }}>{c.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:concern===c.id?T.olive:T.textPrimary, marginBottom:2 }}>{c.label}</div>
                  <div style={{ fontSize:10, color:T.textTertiary, lineHeight:1.4 }}>{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Products grid */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:600, color:T.textPrimary }}>
              {concern==="all"?"All Products":`${CONCERNS.find(c=>c.id===concern)?.label} Products`}
              <span style={{ fontSize:12, color:T.textTertiary, fontWeight:400, marginLeft:6 }}>({filtered.length} products)</span>
            </div>
          </div>

          <div className="pgrid" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
            {filtered.map(product=>{
              const isPub = published[product.id];
              const {concern:ac,data:custom} = getCustom(product);
              const {margin} = profitCalc(product);
              return (
                <div key={product.id} className="pcard" onClick={()=>{setSelected(product);setSelectedShade(null);}}
                  style={{ background:T.bgCard, border:`1px solid ${isPub?T.oliveBorder:T.borderSubtle}`, boxShadow:T.shadow }}>
                  <div className="pimg" style={{ aspectRatio:"3/4", overflow:"hidden", position:"relative", background:T.bgElevated }}>
                    <img src={product.img} alt={product.name} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <div style={{ position:"absolute", top:8, left:8, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)", color:"white", fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:100 }}>{product.type.toUpperCase()}</div>
                    {isPub && <div style={{ position:"absolute", inset:0, background:"rgba(61,90,62,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}><div style={{ width:34, height:34, borderRadius:"50%", background:"white", display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.olive} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></div><span style={{ fontSize:10, fontWeight:700, color:"white" }}>Live in Store</span></div>}
                    {concern!=="all" && <div style={{ position:"absolute", bottom:8, right:8, background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:100, padding:"2px 7px", fontSize:9, fontWeight:700, color:T.olive }}>{CONCERNS.find(c=>c.id===concern)?.icon}</div>}
                  </div>
                  <div style={{ padding:"12px 14px" }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:700, color:T.textPrimary, marginBottom:2 }}>{product.name}</div>
                    <div style={{ fontSize:11, color:T.textSecondary, marginBottom:concern!=="all"&&custom?8:10, lineHeight:1.5 }}>{product.tagline}</div>
                    {concern!=="all"&&custom&&<div style={{ background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:6, padding:"5px 8px", marginBottom:8 }}><div style={{ fontSize:9, fontWeight:700, color:T.olive }}>Active</div><div style={{ fontSize:10, color:T.textPrimary, fontWeight:500 }}>{custom.active}</div></div>}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <div><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:700, color:T.textPrimary }}>${product.wholesale}</div><div style={{ fontSize:9, color:T.textTertiary }}>wholesale</div></div>
                      <div style={{ background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:100, padding:"2px 8px", fontSize:10, fontWeight:700, color:T.olive }}>{margin}% margin</div>
                    </div>
                    <div style={{ width:"100%", padding:"8px", fontSize:11, fontWeight:600, borderRadius:7, textAlign:"center", background:isPub?T.oliveSubtle:"transparent", border:`1px solid ${isPub?T.oliveBorder:T.borderDefault}`, color:isPub?T.olive:T.textSecondary, fontFamily:"'DM Sans',sans-serif" }}>
                      {isPub?"Published ✓":"Customise & Publish →"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length===0&&<div style={{ textAlign:"center", padding:"60px 24px", background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:14, marginTop:8 }}><div style={{ fontSize:32, marginBottom:12 }}>🌿</div><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:T.textPrimary, marginBottom:8 }}>No products for this concern</div><p style={{ fontSize:13, color:T.textTertiary }}>Try a different filter or browse all products.</p></div>}
        </div>
      </main>
    </div>
  );
}