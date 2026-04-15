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
];

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
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [drag, setDrag] = useState(false);
  const [toast, setToast] = useState(null);

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
    const { error } = await supabase.from("branding").upsert({ shop_domain: shop, brand_name: brandName, tagline, primary_color: primary, secondary_color: secondary, accent_color: accent, bg_color: bg, label_style: style, logo_url: finalLogo, updated_at: new Date().toISOString() }, { onConflict: "shop_domain" });
    setSaving(false);
    if (!error) setToast({ msg: "Branding saved!", type: "success" });
    else setToast({ msg: "Failed to save. Please try again.", type: "error" });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bgBase, overflow: "hidden" }}>
      <style>{`
        input{outline:none;}
        input[type="color"]{cursor:pointer;border:none;background:none;padding:0;}
        .tab-pill{padding:7px 16px;border-radius:100px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.15s;border:1px solid;font-family:'DM Sans',sans-serif;background:none;}
        .bcard{background:${T.bgCard};border:1px solid ${T.borderSubtle};border-radius:12px;padding:18px;box-shadow:${T.shadow};margin-bottom:12px;}
        .pal-item:hover{border-color:${T.oliveBorder}!important;background:${T.oliveSubtle}!important;}
        @keyframes toastIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @media(max-width:900px){.blayout{grid-template-columns:1fr!important;}}
        @media(max-width:768px){.hdr{padding:10px 16px 10px 52px!important;}.mpad{padding:16px!important;}.cgrid{grid-template-columns:1fr 1fr!important;}.pgrid{grid-template-columns:repeat(3,1fr)!important;}.hide-mobile{display:none!important;}}
      `}</style>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SideNav active="branding" shop={shop} open={open} />
      <main style={{ flex: 1, overflow: "auto" }}>
        <PageHeader title="Brand Customisation" subtitle="Design your private label identity" onMenuToggle={() => setOpen(!open)}
          actions={
            <button onClick={save} disabled={saving} style={{ background:T.olive, border:"none", borderRadius:8, padding:"8px 18px", color:"white", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif", opacity:saving?0.7:1 }}>
              {saving ? "Saving..." : "Save Branding"}
            </button>
          }
        />

        <div className="mpad" style={{ padding: "18px 24px" }}>
          <div className="blayout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
            <div>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {[{ id:"identity", label:"Identity" }, { id:"colors", label:"Colors" }, { id:"style", label:"Label Style" }, { id:"mockup", label:"✦ Mockup Generator" }].map(t => (
                  <button key={t.id} className="tab-pill" onClick={() => setTab(t.id)}
                    style={{ background:tab===t.id?T.oliveSubtle:"transparent", borderColor:tab===t.id?T.oliveBorder:T.borderSubtle, color:tab===t.id?T.olive:T.textSecondary }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Identity */}
              {tab === "identity" && (
                <>
                  <div className="bcard">
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Logo Upload</div>
                    <div onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onClick={() => fileRef.current?.click()}
                      style={{ border:`2px dashed ${drag?T.olive:T.borderDefault}`, borderRadius:10, padding:"28px 20px", textAlign:"center", cursor:"pointer", background:drag?T.oliveSubtle:T.bgSurface, transition:"all 0.2s" }}>
                      {logoUrl ? (
                        <div><img src={logoUrl} alt="logo" style={{ maxHeight:64, maxWidth:180, objectFit:"contain", margin:"0 auto 8px" }} /><div style={{ fontSize:12, color:T.textTertiary }}>Click to change</div></div>
                      ) : (
                        <div>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="1.5" style={{ margin:"0 auto 10px" }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <div style={{ fontSize:13, fontWeight:500, color:T.textSecondary, marginBottom:4 }}>Drop your logo here or click to upload</div>
                          <div style={{ fontSize:11, color:T.textTertiary }}>PNG, JPG, SVG — max 2MB</div>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => pickFile(e.target.files[0])} />
                    </div>
                  </div>
                  <div className="bcard">
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Brand Identity</div>
                    <div style={{ marginBottom:12 }}>
                      <label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>Brand Name</label>
                      <input value={brandName} onChange={e => setBrandName(e.target.value)} style={{ width:"100%", background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"9px 12px", color:T.textPrimary, fontSize:14 }} />
                    </div>
                    <div>
                      <label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>Tagline</label>
                      <input value={tagline} onChange={e => setTagline(e.target.value)} style={{ width:"100%", background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"9px 12px", color:T.textPrimary, fontSize:14 }} />
                    </div>
                  </div>
                </>
              )}

              {/* Colors */}
              {tab === "colors" && (
                <>
                  <div className="bcard">
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Brand Colors</div>
                    <div className="cgrid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      {[{ label:"Primary", val:primary, set:setPrimary }, { label:"Secondary", val:secondary, set:setSecondary }, { label:"Accent", val:accent, set:setAccent }, { label:"Background", val:bg, set:setBg }].map(c => (
                        <div key={c.label}>
                          <label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>{c.label}</label>
                          <div style={{ display:"flex", alignItems:"center", gap:8, background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"7px 10px" }}>
                            <div style={{ position:"relative", width:28, height:28, borderRadius:6, overflow:"hidden", flexShrink:0 }}>
                              <input type="color" value={c.val} onChange={e => c.set(e.target.value)} style={{ position:"absolute", inset:"-4px", width:"calc(100% + 8px)", height:"calc(100% + 8px)" }} />
                            </div>
                            <input value={c.val} onChange={e => c.set(e.target.value)} style={{ background:"none", border:"none", color:T.textSecondary, fontSize:12, fontFamily:"monospace", flex:1 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bcard">
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:12 }}>Preset Palettes</div>
                    <div className="pgrid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                      {PALETTES.map(p => (
                        <div key={p.name} className="pal-item" onClick={() => { setPrimary(p.primary); setSecondary(p.secondary); setAccent(p.accent); setBg(p.bg); }}
                          style={{ background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"10px", cursor:"pointer", transition:"all 0.15s" }}>
                          <div style={{ display:"flex", gap:3, marginBottom:6 }}>{[p.primary, p.secondary, p.accent].map(c => <div key={c} style={{ width:12, height:12, borderRadius:"50%", background:c }} />)}</div>
                          <div style={{ fontSize:10, fontWeight:600, color:T.textSecondary }}>{p.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Mockup Generator */}
              {tab === "mockup" && (
                <div className="bcard">
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:6 }}>Product Mockup Generator</div>
                  <p style={{ fontSize:12, color:T.textTertiary, marginBottom:16, lineHeight:1.6 }}>Generate a photo-realistic product image using your branding, then import it directly to your Shopify store.</p>

                  {/* Step 1 - Select product */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>1. Select Product</label>
                    <select id="mockup-product" style={{ width:"100%", background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:7, padding:"8px 10px", color:T.textPrimary, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none" }}>
                      <option>Rose Glow Serum</option>
                      <option>Moisture Shield SPF50</option>
                      <option>Vitamin C Brightener</option>
                      <option>Keratin Repair Mask</option>
                      <option>Matte Lip Studio Kit</option>
                      <option>Argan Oil Treatment</option>
                      <option>Volume Lash Mascara</option>
                      <option>Scalp Revival Serum</option>
                    </select>
                  </div>

                  {/* Step 2 - Style */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>2. Mockup Style</label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {["Studio White", "Marble Flat", "Natural Lifestyle", "Dark Luxury"].map((s, i) => (
                        <div key={s} id={`mock-style-${i}`} onClick={() => {
                          document.querySelectorAll("[id^='mock-style-']").forEach(el => { el.style.borderColor = T.borderSubtle; el.style.background = T.bgSurface; });
                          document.getElementById(`mock-style-${i}`).style.borderColor = T.oliveBorder;
                          document.getElementById(`mock-style-${i}`).style.background = T.oliveSubtle;
                        }}
                          style={{ background:i===0?T.oliveSubtle:T.bgSurface, border:`1px solid ${i===0?T.oliveBorder:T.borderSubtle}`, borderRadius:8, padding:"9px 12px", cursor:"pointer", fontSize:12, fontWeight:500, color:T.textSecondary, transition:"all 0.15s", textAlign:"center" }}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 3 - Generate */}
                  <div style={{ background:T.bgBase, border:`1px solid ${T.borderSubtle}`, borderRadius:9, padding:14, marginBottom:14, textAlign:"center" }}>
                    <div style={{ fontSize:12, color:T.textTertiary, marginBottom:10, lineHeight:1.6 }}>
                      Your brand colors, logo and label style will be applied automatically to the product mockup.
                    </div>
                    <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:10 }}>
                      {[primary, secondary, accent].map(c => (
                        <div key={c} style={{ width:18, height:18, borderRadius:"50%", background:c, border:`1px solid ${T.borderSubtle}` }}></div>
                      ))}
                    </div>
                    <div style={{ fontSize:11, fontWeight:600, color:T.textSecondary }}>{brandName} · {style} style</div>
                  </div>

                  {/* Generate button */}
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => {
                      const genBtn = document.getElementById("gen-btn");
                      if (genBtn) { genBtn.textContent = "Generating..."; genBtn.disabled = true; }
                      setTimeout(() => {
                        const preview = document.getElementById("mockup-preview");
                        const importBtn = document.getElementById("import-btn");
                        if (preview) { preview.style.display = "block"; }
                        if (importBtn) { importBtn.style.display = "flex"; }
                        if (genBtn) { genBtn.textContent = "Regenerate"; genBtn.disabled = false; }
                      }, 2000);
                    }}
                      id="gen-btn"
                      style={{ flex:1, background:T.olive, border:"none", borderRadius:8, padding:"10px", color:"white", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}>
                      ✦ Generate Mockup
                    </button>
                  </div>

                  {/* Preview area */}
                  <div id="mockup-preview" style={{ display:"none", marginTop:14 }}>
                    <div style={{ background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:10, overflow:"hidden", marginBottom:10 }}>
                      <div style={{ background:bg, padding:"24px", textAlign:"center", minHeight:200, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                        {/* Simulated product mockup */}
                        <div style={{ textAlign:"center" }}>
                          <div style={{ width:80, height:120, background:`linear-gradient(135deg, ${primary}, ${secondary})`, borderRadius:12, margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(0,0,0,0.15)" }}>
                            {logoUrl ? <img src={logoUrl} style={{ width:50, height:50, objectFit:"contain" }} /> : <span style={{ color:"white", fontSize:24 }}>✦</span>}
                          </div>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontWeight:600, color:primary }}>{brandName}</div>
                          <div style={{ fontSize:10, color:secondary, letterSpacing:"0.1em", textTransform:"uppercase" }}>Rose Glow Serum</div>
                        </div>
                        <div style={{ position:"absolute", top:10, right:10, background:"rgba(61,90,62,0.9)", color:"white", fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:100 }}>PREVIEW</div>
                      </div>
                    </div>

                    {/* Import to Shopify */}
                    <button id="import-btn"
                      style={{ display:"none", width:"100%", background:T.olive, border:"none", borderRadius:8, padding:"11px", color:"white", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", alignItems:"center", justifyContent:"center", gap:8 }}
                      onClick={async () => {
                        const btn = document.getElementById("import-btn");
                        if (btn) { btn.textContent = "Importing to Shopify..."; btn.disabled = true; }
                        // In production this would call the publish API with the mockup image
                        setTimeout(() => {
                          if (btn) { btn.innerHTML = "✓ Imported to Shopify!"; btn.style.background = "#2d6a4f"; btn.disabled = false; }
                        }, 1500);
                      }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Import to Shopify Store
                    </button>
                  </div>
                </div>
              )}

              {/* Style */}
              {tab === "style" && (
                <div className="bcard">
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Label Style</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {["Modern", "Classic", "Minimal", "Bold"].map(s => (
                      <div key={s} onClick={() => setStyle(s)} style={{ background:style===s?T.oliveSubtle:T.bgSurface, border:`1px solid ${style===s?T.oliveBorder:T.borderSubtle}`, borderRadius:10, padding:"14px", cursor:"pointer", transition:"all 0.15s" }}>
                        <div style={{ height:48, background:s==="Bold"?primary:bg, borderRadius:7, marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", border:s==="Minimal"?`1px solid ${primary}`:"none" }}>
                          <span style={{ fontFamily:s==="Modern"||s==="Classic"?"Georgia,serif":"sans-serif", fontSize:s==="Bold"?13:11, fontWeight:s==="Bold"?800:400, color:s==="Bold"?"white":primary, letterSpacing:s==="Minimal"?"0.2em":"0.05em", fontStyle:s==="Classic"?"italic":"normal", textTransform:s==="Minimal"?"uppercase":"none" }}>{brandName||"Brand"}</span>
                        </div>
                        <div style={{ fontSize:12, fontWeight:600, textAlign:"center", color:style===s?T.olive:T.textSecondary }}>{s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div style={{ position:"sticky", top:20 }}>
              <div className="bcard">
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>Live Preview</div>
                <div style={{ background:bg, borderRadius:12, padding:"24px 18px", textAlign:"center", border:`1px solid ${primary}20`, marginBottom:12 }}>
                  {logoUrl ? <img src={logoUrl} alt="logo" style={{ height:44, objectFit:"contain", margin:"0 auto 12px" }} /> : <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${primary},${secondary})`, margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:18 }}>✦</div>}
                  <div style={{ fontFamily:style==="Modern"||style==="Classic"?"Georgia,serif":"sans-serif", fontSize:style==="Bold"?18:15, fontWeight:style==="Bold"?800:600, color:primary, letterSpacing:style==="Minimal"?"0.18em":"0.05em", fontStyle:style==="Classic"?"italic":"normal", textTransform:style==="Minimal"?"uppercase":"none", marginBottom:5 }}>{brandName}</div>
                  <div style={{ fontSize:9, color:secondary, letterSpacing:"0.12em", textTransform:"uppercase", opacity:0.7, marginBottom:14 }}>{tagline}</div>
                  <div style={{ width:28, height:1, background:primary, margin:"0 auto 12px", opacity:0.5 }}></div>
                  <div style={{ fontSize:12, color:secondary }}>Rose Glow Serum · 30ml</div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {[{ label:"Primary", color:primary }, { label:"Secondary", color:secondary }, { label:"Accent", color:accent }].map(c => (
                    <div key={c.label} style={{ flex:1, background:T.bgSurface, borderRadius:7, padding:"7px 4px", textAlign:"center", border:`1px solid ${T.borderSubtle}` }}>
                      <div style={{ width:14, height:14, borderRadius:"50%", background:c.color, margin:"0 auto 4px" }}></div>
                      <div style={{ fontSize:8, fontWeight:600, color:T.textTertiary, textTransform:"uppercase" }}>{c.label}</div>
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