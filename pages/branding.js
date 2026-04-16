import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";
import { PageHeader, Toast } from "../components/Layout";
import { useTheme } from "./_app";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const PALETTES = [
  { name: "Gold Luxe", primary: "#c9963a", secondary: "#8b5e3c", accent: "#f5e6d0", bg: "#faf6f0" },
  { name: "Rose Bloom", primary: "#e91e8c", secondary: "#c2185b", accent: "#fce4ec", bg: "#fff5f8" },
  { name: "Sage Green", primary: "#2d6a4f", secondary: "#1b4332", accent: "#d8f3dc", bg: "#f5fbf7" },
  { name: "Ocean Blue", primary: "#1565c0", secondary: "#0d47a1", accent: "#e3f2fd", bg: "#f5f9ff" },
  { name: "Lavender", primary: "#7b1fa2", secondary: "#6a1b9a", accent: "#f3e5f5", bg: "#fdf5ff" },
  { name: "Coral", primary: "#e64a19", secondary: "#bf360c", accent: "#fbe9e7", bg: "#fff8f6" },
  { name: "Midnight", primary: "#1a1a2e", secondary: "#16213e", accent: "#e2d9f3", bg: "#f8f7ff" },
  { name: "Peach Glow", primary: "#ff6b6b", secondary: "#ee5a24", accent: "#ffeaa7", bg: "#fffbf5" },
];

const PRODUCTS = [
  "Rose Glow Serum", "Moisture Shield SPF50", "Vitamin C Brightener",
  "Retinol Night Repair", "Hydra Boost Toner", "Pore Refining Clay Mask",
  "Matte Lip Studio Kit", "Glow Highlighter Palette", "Skin Tint Foundation",
  "Keratin Repair Mask", "Scalp Revival Serum", "Argan Oil Treatment",
];

const LABEL_STYLES = ["Modern", "Classic", "Minimal", "Bold", "Elegant", "Natural"];
const FINISHES = ["Matte", "Glossy", "Metallic", "Frosted", "Textured"];
const LAYOUTS = ["Centered", "Left-aligned", "Top banner", "Wrap-around", "Minimalist"];
const FONTS = ["Serif Elegant", "Sans Modern", "Script Luxury", "Bold Impact", "Clean Minimal"];

export default function Branding() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme: T } = useTheme();
  const fileRef = useRef(null);
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState("identity");
  const [brandName, setBrandName] = useState("Your Brand");
  const [tagline, setTagline] = useState("Premium Beauty Collection");
  const [primary, setPrimary] = useState("#3D5A3E");
  const [secondary, setSecondary] = useState("#8b5e3c");
  const [accent, setAccent] = useState("#f5e6d0");
  const [bg, setBg] = useState("#faf6f0");
  const [style, setStyle] = useState("Modern");
  const [finish, setFinish] = useState("Matte");
  const [layout, setLayout] = useState("Centered");
  const [font, setFont] = useState("Serif Elegant");
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [drag, setDrag] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [mockupStyle, setMockupStyle] = useState("Studio White");
  const [generating, setGenerating] = useState(false);
  const [mockupResult, setMockupResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const [aiProduct, setAiProduct] = useState(PRODUCTS[0]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    if (!shop) return;
    supabase.from("branding").select("*").eq("shop_domain", shop).single().then(({ data }) => {
      if (!data) return;
      setBrandName(data.brand_name || "Your Brand");
      setTagline(data.tagline || "Premium Beauty Collection");
      setPrimary(data.primary_color || "#3D5A3E");
      setSecondary(data.secondary_color || "#8b5e3c");
      setAccent(data.accent_color || "#f5e6d0");
      setBg(data.bg_color || "#faf6f0");
      setStyle(data.label_style || "Modern");
      setLogoUrl(data.logo_url || null);
    });
  }, [shop]);

  function pickFile(file) {
    if (!file?.type.startsWith("image/")) return;
    setLogoFile(file);
    const r = new FileReader();
    r.onload = e => setLogoUrl(e.target.result);
    r.readAsDataURL(file);
  }

  async function save() {
    if (!shop) { setToast({ msg: "No store connected.", type: "error" }); return; }
    setSaving(true);
    let finalLogo = logoUrl;
    if (logoFile) {
      const name = `${shop}-logo-${Date.now()}.${logoFile.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("branding-assets").upload(name, logoFile, { upsert: true });
      if (!error) finalLogo = supabase.storage.from("branding-assets").getPublicUrl(name).data.publicUrl;
    }
    const { error } = await supabase.from("branding").upsert({
      shop_domain: shop, brand_name: brandName, tagline,
      primary_color: primary, secondary_color: secondary,
      accent_color: accent, bg_color: bg, label_style: style,
      logo_url: finalLogo, updated_at: new Date().toISOString()
    }, { onConflict: "shop_domain" });
    setSaving(false);
    if (!error) setToast({ msg: "Branding saved!", type: "success" });
    else setToast({ msg: "Failed to save.", type: "error" });
    setTimeout(() => setToast(null), 3000);
  }

  async function generateMockup() {
    setGenerating(true);
    setMockupResult(null);
    setImportDone(false);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "mockup", brandName, tagline, product: selectedProduct, style, finish, layout, font, primary, secondary, accent, mockupStyle })
      });
      const data = await response.json();
      if (data.error) { setToast({ msg: data.error, type: "error" }); }
      else setMockupResult(data);
    } catch { setToast({ msg: "Generation failed. Please try again.", type: "error" }); }
    setGenerating(false);
  }

  async function generateCatalogue() {
    setAiGenerating(true);
    setAiResult(null);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "catalogue", brandName, tagline, product: aiProduct, style })
      });
      const data = await response.json();
      if (data.error) { setToast({ msg: data.error, type: "error" }); }
      else setAiResult(data);
    } catch { setToast({ msg: "AI generation failed.", type: "error" }); }
    setAiGenerating(false);
  }

  async function importToShopify() {
    if (!mockupResult || !shop) return;
    setImporting(true);
    try {
      await fetch("/api/products/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, product: { id: Date.now(), name: selectedProduct, desc: mockupResult.description || selectedProduct, price: String(mockupResult.wholesalePrice || "22.99"), category: "Skincare", moq: 30 } })
      });
      setImportDone(true);
      setToast({ msg: `${selectedProduct} imported to Shopify!`, type: "success" });
    } catch { setToast({ msg: "Import failed.", type: "error" }); }
    setImporting(false);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bgBase, overflow: "hidden" }}>
      <style>{`
        input, select { outline: none; }
        input[type="color"] { cursor:pointer; border:none; background:none; padding:0; }
        .tab-pill { padding:7px 16px; border-radius:100px; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s; border:1px solid; font-family:'DM Sans',sans-serif; background:none; }
        .bcard { background:${T.bgCard}; border:1px solid ${T.borderSubtle}; border-radius:12px; padding:18px; box-shadow:${T.shadow}; margin-bottom:12px; }
        .opt-btn { padding:8px 12px; border-radius:8px; font-size:12px; font-weight:500; cursor:pointer; transition:all 0.15s; border:1px solid; font-family:'DM Sans',sans-serif; background:none; text-align:center; }
        .opt-btn.sel { background:${T.oliveSubtle}; border-color:${T.oliveBorder}; color:${T.olive}; }
        .opt-btn:not(.sel) { background:${T.bgSurface}; border-color:${T.borderSubtle}; color:${T.textSecondary}; }
        .pal-item { background:${T.bgSurface}; border:1px solid ${T.borderSubtle}; border-radius:8px; padding:10px; cursor:pointer; transition:all 0.15s; }
        .pal-item:hover { border-color:${T.oliveBorder}; background:${T.oliveSubtle}; }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
        .ai-pulse { animation:pulse 1.5s ease-in-out infinite; }
        @media(max-width:900px){.blayout{grid-template-columns:1fr!important;}}
        @media(max-width:768px){.mpad{padding:16px!important;} .cgrid{grid-template-columns:1fr 1fr!important;} .hide-mobile{display:none!important;}}
      `}</style>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SideNav active="branding" shop={shop} open={open} />
      <main style={{ flex: 1, overflow: "auto" }}>
        <PageHeader title="Brand Studio" subtitle="Design your identity, generate mockups & AI content"
          onMenuToggle={() => setOpen(!open)}
          actions={<button onClick={save} disabled={saving} style={{ background:T.olive, border:"none", borderRadius:8, padding:"8px 18px", color:"white", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", opacity:saving?0.7:1 }}>{saving?"Saving...":"Save Branding"}</button>}
        />
        <div className="mpad" style={{ padding: "18px 24px" }}>
          <div className="blayout" style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 16 }}>
            <div>
              {/* Tabs */}
              <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
                {[{id:"identity",label:"Identity"},{id:"colors",label:"Colors"},{id:"style",label:"Label Style"},{id:"mockup",label:"✦ Mockup Generator"},{id:"ai",label:"🤖 AI Catalogue"}].map(t => (
                  <button key={t.id} className="tab-pill" onClick={() => setTab(t.id)}
                    style={{ background:tab===t.id?T.oliveSubtle:"transparent", borderColor:tab===t.id?T.oliveBorder:T.borderSubtle, color:tab===t.id?T.olive:T.textSecondary }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* IDENTITY */}
              {tab==="identity" && (<>
                <div className="bcard">
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Logo Upload</div>
                  <div onDrop={e=>{e.preventDefault();setDrag(false);pickFile(e.dataTransfer.files[0]);}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onClick={()=>fileRef.current?.click()}
                    style={{ border:`2px dashed ${drag?T.olive:T.borderDefault}`, borderRadius:10, padding:"28px 20px", textAlign:"center", cursor:"pointer", background:drag?T.oliveSubtle:T.bgSurface, transition:"all 0.2s" }}>
                    {logoUrl?(<div><img src={logoUrl} style={{ maxHeight:64, maxWidth:180, objectFit:"contain", margin:"0 auto 8px" }} /><div style={{ fontSize:12, color:T.textTertiary }}>Click to change</div></div>):(<div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="1.5" style={{ margin:"0 auto 10px" }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><div style={{ fontSize:13, fontWeight:500, color:T.textSecondary, marginBottom:4 }}>Drop logo or click to upload</div><div style={{ fontSize:11, color:T.textTertiary }}>PNG, JPG, SVG · max 2MB</div></div>)}
                    <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>pickFile(e.target.files[0])} />
                  </div>
                </div>
                <div className="bcard">
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Brand Identity</div>
                  <div style={{ marginBottom:12 }}><label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>Brand Name</label><input value={brandName} onChange={e=>setBrandName(e.target.value)} style={{ width:"100%", background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"9px 12px", color:T.textPrimary, fontSize:14 }} /></div>
                  <div><label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>Tagline</label><input value={tagline} onChange={e=>setTagline(e.target.value)} style={{ width:"100%", background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"9px 12px", color:T.textPrimary, fontSize:14 }} /></div>
                </div>
              </>)}

              {/* COLORS */}
              {tab==="colors" && (<>
                <div className="bcard">
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Brand Colors</div>
                  <div className="cgrid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {[{label:"Primary",val:primary,set:setPrimary},{label:"Secondary",val:secondary,set:setSecondary},{label:"Accent",val:accent,set:setAccent},{label:"Background",val:bg,set:setBg}].map(c=>(
                      <div key={c.label}><label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>{c.label}</label>
                        <div style={{ display:"flex", alignItems:"center", gap:8, background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"7px 10px" }}>
                          <div style={{ position:"relative", width:28, height:28, borderRadius:6, overflow:"hidden", flexShrink:0 }}><input type="color" value={c.val} onChange={e=>c.set(e.target.value)} style={{ position:"absolute", inset:"-4px", width:"calc(100% + 8px)", height:"calc(100% + 8px)" }} /></div>
                          <input value={c.val} onChange={e=>c.set(e.target.value)} style={{ background:"none", border:"none", color:T.textSecondary, fontSize:12, fontFamily:"monospace", flex:1 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bcard">
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:12 }}>Preset Palettes</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                    {PALETTES.map(p=>(
                      <div key={p.name} className="pal-item" onClick={()=>{setPrimary(p.primary);setSecondary(p.secondary);setAccent(p.accent);setBg(p.bg);}}>
                        <div style={{ display:"flex", gap:3, marginBottom:6 }}>{[p.primary,p.secondary,p.accent].map(c=><div key={c} style={{ width:12, height:12, borderRadius:"50%", background:c }} />)}</div>
                        <div style={{ fontSize:10, fontWeight:600, color:T.textSecondary }}>{p.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>)}

              {/* STYLE */}
              {tab==="style" && (<>
                <div className="bcard"><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Label Style</div><div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>{LABEL_STYLES.map(s=><div key={s} onClick={()=>setStyle(s)} className={`opt-btn${style===s?" sel":""}`}>{s}</div>)}</div></div>
                <div className="bcard"><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Label Finish</div><div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>{FINISHES.map(f=><div key={f} onClick={()=>setFinish(f)} className={`opt-btn${finish===f?" sel":""}`}>{f}</div>)}</div></div>
                <div className="bcard"><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Label Layout</div><div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>{LAYOUTS.map(l=><div key={l} onClick={()=>setLayout(l)} className={`opt-btn${layout===l?" sel":""}`}>{l}</div>)}</div></div>
                <div className="bcard"><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Font Style</div><div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>{FONTS.map(f=><div key={f} onClick={()=>setFont(f)} className={`opt-btn${font===f?" sel":""}`}>{f}</div>)}</div></div>
              </>)}

              {/* MOCKUP GENERATOR */}
              {tab==="mockup" && (
                <div className="bcard">
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:T.goldSubtle, border:`1px solid ${T.goldBorder}`, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:14 }}>✦</span></div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary }}>AI Mockup Generator</div>
                  </div>
                  <p style={{ fontSize:12, color:T.textTertiary, marginBottom:16, lineHeight:1.6 }}>Claude AI generates a photo-realistic mockup description and Ideogram prompt using your exact brand settings. Copy the prompt into Ideogram to get the image.</p>

                  <div style={{ marginBottom:12 }}><label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>Product</label>
                    <select value={selectedProduct} onChange={e=>setSelectedProduct(e.target.value)} style={{ width:"100%", background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:7, padding:"8px 10px", color:T.textPrimary, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>{PRODUCTS.map(p=><option key={p}>{p}</option>)}</select>
                  </div>

                  <div style={{ marginBottom:14 }}><label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>Scene Style</label>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
                      {["Studio White","Marble Flat Lay","Natural Lifestyle","Dark Luxury","Garden Fresh","Minimal Pastel"].map(s=><div key={s} onClick={()=>setMockupStyle(s)} className={`opt-btn${mockupStyle===s?" sel":""}`} style={{ fontSize:11 }}>{s}</div>)}
                    </div>
                  </div>

                  <div style={{ background:T.bgBase, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:10, marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Using Your Brand</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {[{l:"Brand",v:brandName},{l:"Style",v:style},{l:"Finish",v:finish},{l:"Layout",v:layout},{l:"Font",v:font}].map(i=>(
                        <div key={i.l} style={{ background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:6, padding:"3px 8px", fontSize:11 }}><span style={{ color:T.textTertiary }}>{i.l}: </span><span style={{ color:T.textPrimary, fontWeight:500 }}>{i.v}</span></div>
                      ))}
                      <div style={{ display:"flex", gap:3, alignItems:"center" }}>{[primary,secondary,accent].map(c=><div key={c} style={{ width:12, height:12, borderRadius:"50%", background:c }} />)}</div>
                    </div>
                  </div>

                  <button onClick={generateMockup} disabled={generating} style={{ width:"100%", background:generating?T.bgSurface:T.olive, border:"none", borderRadius:8, padding:"11px", color:generating?T.textTertiary:"white", fontSize:13, fontWeight:600, cursor:generating?"default":"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:14 }}>
                    {generating?(<><span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:T.olive, borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}></span><span className="ai-pulse">Claude is generating...</span></>):"✦ Generate AI Mockup"}
                  </button>

                  {mockupResult && (
                    <div style={{ background:T.bgBase, border:`1px solid ${T.oliveBorder}`, borderRadius:10, padding:14 }}>
                      {/* Bottle Mockup Preview */}
                      <div style={{ background:`linear-gradient(135deg, ${bg} 0%, ${accent}40 100%)`, borderRadius:10, padding:"24px", textAlign:"center", marginBottom:12, position:"relative", minHeight:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div style={{ position:"relative", display:"inline-block" }}>
                          {/* Bottle shape */}
                          <svg width="90" height="140" viewBox="0 0 90 140" style={{ filter:`drop-shadow(0 8px 20px ${primary}50)` }}>
                            {/* Bottle body */}
                            <defs>
                              <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={secondary} stopOpacity="0.8"/>
                                <stop offset="40%" stopColor={primary}/>
                                <stop offset="100%" stopColor={secondary} stopOpacity="0.9"/>
                              </linearGradient>
                              <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e8e0d4"/>
                                <stop offset="100%" stopColor="#c4b8a8"/>
                              </linearGradient>
                              <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.25"/>
                                <stop offset="50%" stopColor="white" stopOpacity="0.08"/>
                                <stop offset="100%" stopColor="white" stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                            {/* Cap */}
                            <rect x="28" y="2" width="34" height="22" rx="4" fill="url(#capGrad)"/>
                            <rect x="32" y="18" width="26" height="6" rx="2" fill="#a89880"/>
                            {/* Neck */}
                            <rect x="33" y="22" width="24" height="12" rx="2" fill="url(#bottleGrad)"/>
                            {/* Shoulder */}
                            <path d="M25 34 Q20 38 18 46 L72 46 Q70 38 65 34 Z" fill="url(#bottleGrad)"/>
                            {/* Body */}
                            <rect x="18" y="46" width="54" height="80" rx="6" fill="url(#bottleGrad)"/>
                            {/* Label area */}
                            <rect x="22" y="55" width="46" height="60" rx="3" fill={bg} fillOpacity="0.92"/>
                            {/* Shine */}
                            <rect x="18" y="46" width="54" height="80" rx="6" fill="url(#shineGrad)"/>
                          </svg>
                          {/* Brand label overlay on bottle */}
                          <div style={{ position:"absolute", top:"52%", left:"50%", transform:"translate(-50%,-50%)", width:42, textAlign:"center" }}>
                            {logoUrl
                              ? <img src={logoUrl} style={{ width:24, height:24, objectFit:"contain", margin:"0 auto 3px", display:"block" }} />
                              : <div style={{ width:20, height:20, borderRadius:"50%", background:`linear-gradient(135deg,${primary},${secondary})`, margin:"0 auto 3px", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ color:"white", fontSize:9 }}>✦</span></div>
                            }
                            <div style={{ fontFamily:"Georgia,serif", fontSize:6, fontWeight:700, color:primary, lineHeight:1.2, letterSpacing:"0.04em" }}>{brandName}</div>
                            <div style={{ fontSize:4, color:secondary, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:1, opacity:0.8 }}>{selectedProduct.slice(0,14)}</div>
                          </div>
                        </div>
                        <div style={{ position:"absolute", top:6, right:6, background:"rgba(61,90,62,0.9)", color:"white", fontSize:8, fontWeight:700, padding:"2px 6px", borderRadius:100 }}>BOTTLE PREVIEW</div>
                        <div style={{ position:"absolute", bottom:8, left:0, right:0, textAlign:"center", fontSize:9, color:secondary, opacity:0.7 }}>{finish} finish · {mockupStyle}</div>
                      </div>

                      <div style={{ marginBottom:10 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>Description</div>
                        <p style={{ fontSize:12, color:T.textSecondary, lineHeight:1.7, background:T.bgCard, borderRadius:7, padding:10, border:`1px solid ${T.borderSubtle}` }}>{mockupResult.description}</p>
                      </div>

                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>Ideogram Prompt <span style={{ color:T.textTertiary, fontWeight:400, textTransform:"none", letterSpacing:0 }}>(copy into ideogram.ai)</span></div>
                        <div style={{ background:T.bgCard, border:`1px solid ${T.goldBorder}`, borderRadius:7, padding:10, fontSize:11, color:T.gold, fontFamily:"monospace", lineHeight:1.6, position:"relative" }}>
                          {mockupResult.ideogramPrompt}
                          <button onClick={()=>navigator.clipboard.writeText(mockupResult.ideogramPrompt).then(()=>setToast({msg:"Prompt copied!",type:"success"}))} style={{ position:"absolute", top:6, right:6, background:T.goldSubtle, border:`1px solid ${T.goldBorder}`, borderRadius:5, padding:"3px 8px", fontSize:10, color:T.gold, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Copy</button>
                        </div>
                      </div>

                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
                        {[{l:"Wholesale",v:`$${mockupResult.wholesalePrice||"22.99"}`,c:T.textSecondary},{l:"Retail",v:`$${mockupResult.retailPrice||"49.99"}`,c:T.textPrimary},{l:"Margin",v:`${mockupResult.margin||"54"}%`,c:T.olive}].map(i=>(
                          <div key={i.l} style={{ background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:7, padding:"8px", textAlign:"center" }}>
                            <div style={{ fontSize:9, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{i.l}</div>
                            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:i.c }}>{i.v}</div>
                          </div>
                        ))}
                      </div>

                      <button onClick={importToShopify} disabled={importing||importDone} style={{ width:"100%", background:importDone?"transparent":T.olive, border:importDone?`1px solid ${T.oliveBorder}`:"none", borderRadius:8, padding:"11px", color:importDone?T.olive:"white", fontSize:13, fontWeight:600, cursor:(importing||importDone)?"default":"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                        {importing?<><span style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}></span>Importing...</>:importDone?"✓ Imported to Shopify!":<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Import to Shopify Store</>}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* AI CATALOGUE */}
              {tab==="ai" && (
                <div className="bcard">
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary }}>AI Product Content Generator</div>
                  </div>
                  <p style={{ fontSize:12, color:T.textTertiary, marginBottom:16, lineHeight:1.6 }}>Claude AI writes compelling descriptions, pricing recommendations, SEO content, and tags — all tailored to your brand.</p>

                  <div style={{ marginBottom:12 }}><label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>Select Product</label>
                    <select value={aiProduct} onChange={e=>setAiProduct(e.target.value)} style={{ width:"100%", background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:7, padding:"8px 10px", color:T.textPrimary, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>{PRODUCTS.map(p=><option key={p}>{p}</option>)}</select>
                  </div>

                  <button onClick={generateCatalogue} disabled={aiGenerating} style={{ width:"100%", background:aiGenerating?T.bgSurface:T.olive, border:"none", borderRadius:8, padding:"11px", color:aiGenerating?T.textTertiary:"white", fontSize:13, fontWeight:600, cursor:aiGenerating?"default":"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:14 }}>
                    {aiGenerating?(<><span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:T.olive, borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}></span><span className="ai-pulse">Claude is writing your content...</span></>):"🤖 Generate with Claude AI"}
                  </button>

                  {aiResult && (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {aiResult.title && <div style={{ background:T.bgBase, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:12 }}><div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Product Title</div><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary }}>{aiResult.title}</div></div>}
                      <div style={{ background:T.bgBase, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:12 }}><div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Full Description</div><p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.7 }}>{aiResult.fullDesc}</p></div>
                      {aiResult.keyBenefits && <div style={{ background:T.bgBase, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:12 }}><div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Key Benefits</div>{aiResult.keyBenefits.map((b,i)=><div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}><span style={{ color:T.olive }}>✓</span><span style={{ fontSize:13, color:T.textSecondary }}>{b}</span></div>)}</div>}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                        {[{l:"Wholesale",v:`$${aiResult.wholesaleCost||"22.99"}`,c:T.textSecondary},{l:"Retail",v:`$${aiResult.suggestedRetailPrice||"49.99"}`,c:T.textPrimary},{l:"Margin",v:`${aiResult.profitMargin||"54"}%`,c:T.olive}].map(i=>(
                          <div key={i.l} style={{ background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"10px", textAlign:"center" }}><div style={{ fontSize:9, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>{i.l}</div><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:i.c }}>{i.v}</div></div>
                        ))}
                      </div>
                      {aiResult.tags && <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{aiResult.tags.map(t=><span key={t} style={{ background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, color:T.olive, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:100 }}>#{t}</span>)}</div>}
                      {aiResult.seoTitle && <div style={{ background:T.bgBase, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:12 }}><div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>SEO Title</div><div style={{ fontSize:13, color:T.textPrimary, marginBottom:8 }}>{aiResult.seoTitle}</div>{aiResult.seoDescription&&<><div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>SEO Description</div><div style={{ fontSize:12, color:T.textSecondary }}>{aiResult.seoDescription}</div></>}</div>}
                      <button onClick={()=>{navigator.clipboard.writeText(JSON.stringify(aiResult,null,2));setToast({msg:"Content copied!",type:"success"});}} style={{ background:T.bgSurface, border:`1px solid ${T.borderDefault}`, borderRadius:8, padding:"9px", color:T.textSecondary, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Copy All Content</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Preview */}
            <div style={{ position:"sticky", top:20 }}>
              <div className="bcard">
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Live Preview</div>
                <div style={{ background:bg, borderRadius:12, padding:"24px 18px", textAlign:"center", border:`1px solid ${primary}20`, marginBottom:12 }}>
                  {logoUrl?<img src={logoUrl} style={{ height:44, objectFit:"contain", margin:"0 auto 12px" }} />:<div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${primary},${secondary})`, margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:18 }}>✦</div>}
                  <div style={{ fontFamily:font.includes("Serif")?"Georgia,serif":"sans-serif", fontSize:font.includes("Bold")?17:14, fontWeight:font.includes("Bold")?800:600, color:primary, letterSpacing:layout==="Minimal"?"0.18em":"0.05em", fontStyle:style==="Classic"?"italic":"normal", textTransform:layout==="Minimal"?"uppercase":"none", marginBottom:5 }}>{brandName}</div>
                  <div style={{ fontSize:9, color:secondary, letterSpacing:"0.12em", textTransform:"uppercase", opacity:0.7, marginBottom:12 }}>{tagline}</div>
                  <div style={{ width:28, height:1, background:primary, margin:"0 auto 10px", opacity:0.5 }}></div>
                  <div style={{ fontSize:11, color:secondary }}>Rose Glow Serum · 30ml</div>
                  <div style={{ fontSize:9, color:accent, marginTop:4, opacity:0.7 }}>{finish} finish · {layout}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {[{l:"Style",v:style},{l:"Finish",v:finish},{l:"Layout",v:layout},{l:"Font",v:font}].map(i=>(
                    <div key={i.l} style={{ display:"flex", justifyContent:"space-between", fontSize:11, padding:"4px 0", borderBottom:`1px solid ${T.borderSubtle}` }}><span style={{ color:T.textTertiary }}>{i.l}</span><span style={{ color:T.textPrimary, fontWeight:500 }}>{i.v}</span></div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:6, marginTop:10 }}>
                  {[{l:"Primary",c:primary},{l:"Secondary",c:secondary},{l:"Accent",c:accent}].map(i=>(
                    <div key={i.l} style={{ flex:1, background:T.bgSurface, borderRadius:7, padding:"6px 4px", textAlign:"center", border:`1px solid ${T.borderSubtle}` }}>
                      <div style={{ width:14, height:14, borderRadius:"50%", background:i.c, margin:"0 auto 4px" }}></div>
                      <div style={{ fontSize:8, fontWeight:600, color:T.textTertiary, textTransform:"uppercase" }}>{i.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}