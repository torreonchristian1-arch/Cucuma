// FILE: pages/branding.js
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const PALETTES = [
  { name: "Gold Luxe", primary: "#c9963a", secondary: "#8b5e3c", accent: "#f5e6d0", bg: "#faf6f0" },
  { name: "Rose Bloom", primary: "#e91e8c", secondary: "#c2185b", accent: "#fce4ec", bg: "#fff5f8" },
  { name: "Sage", primary: "#2d6a4f", secondary: "#1b4332", accent: "#d8f3dc", bg: "#f5fbf7" },
  { name: "Ocean", primary: "#1565c0", secondary: "#0d47a1", accent: "#e3f2fd", bg: "#f5f9ff" },
  { name: "Lavender", primary: "#7b1fa2", secondary: "#6a1b9a", accent: "#f3e5f5", bg: "#fdf5ff" },
  { name: "Coral", primary: "#e64a19", secondary: "#bf360c", accent: "#fbe9e7", bg: "#fff8f6" },
];

export default function Branding() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme } = useTheme();
  const fileRef = useRef(null);
  const [brandName, setBrandName] = useState("Your Brand");
  const [tagline, setTagline] = useState("Premium Beauty Collection");
  const [primary, setPrimary] = useState("#C4975A");
  const [secondary, setSecondary] = useState("#8b5e3c");
  const [accent, setAccent] = useState("#f5e6d0");
  const [bg, setBg] = useState("#faf6f0");
  const [style, setStyle] = useState("Modern");
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("identity");
  const [drag, setDrag] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!shop) return;
    supabase.from("branding").select("*").eq("shop_domain", shop).single().then(({ data }) => {
      if (!data) return;
      setBrandName(data.brand_name || "Your Brand");
      setTagline(data.tagline || "Premium Beauty Collection");
      setPrimary(data.primary_color || "#C4975A");
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
    if (!shop) { setToast({ msg: "No store connected.", type: "error" }); setTimeout(() => setToast(null), 3000); return; }
    setSaving(true);
    let finalLogo = logoUrl;
    if (logoFile) {
      const name = `${shop}-logo-${Date.now()}.${logoFile.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("branding-assets").upload(name, logoFile, { upsert: true });
      if (!error) finalLogo = supabase.storage.from("branding-assets").getPublicUrl(name).data.publicUrl;
    }
    const { error } = await supabase.from("branding").upsert({ shop_domain: shop, brand_name: brandName, tagline, primary_color: primary, secondary_color: secondary, accent_color: accent, bg_color: bg, label_style: style, logo_url: finalLogo, updated_at: new Date().toISOString() }, { onConflict: "shop_domain" });
    setSaving(false);
    if (!error) { setSaved(true); setToast({ msg: "Branding saved!", type: "success" }); setTimeout(() => { setSaved(false); setToast(null); }, 3000); }
    else { setToast({ msg: "Failed to save. Please try again.", type: "error" }); setTimeout(() => setToast(null), 3000); }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bgBase, overflow: "hidden" }}>
      <style>{`
        input { outline: none; }
        input[type="color"] { cursor: pointer; border: none; background: none; padding: 0; }
        .tab-pill { padding: 7px 16px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; border: 1px solid; }
        .brand-card { background: ${theme.bgCard}; border: 1px solid ${theme.borderSubtle}; border-radius: 10px; padding: 18px; box-shadow: ${theme.shadow}; margin-bottom: 12px; }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .toast-anim { animation: slideUp 0.25s ease; }
        @media (max-width: 900px) { .brand-layout { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .hdr { padding: 10px 16px 10px 52px !important; flex-wrap: wrap; gap: 8px; } .main-pad { padding: 16px !important; } .color-grid { grid-template-columns: 1fr 1fr !important; } .palette-grid { grid-template-columns: repeat(3,1fr) !important; } .hide-sm { display: none !important; } }
      `}</style>

      {toast && (
        <div className="toast-anim" style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000, background: theme.bgCard, border: `1px solid ${toast.type === "success" ? theme.greenBorder : "rgba(192,80,80,0.3)"}`, borderRadius: 10, padding: "13px 16px", boxShadow: theme.shadowMd, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: toast.type === "success" ? theme.green : "#C05050", flexShrink: 0 }}></div>
          <span style={{ fontSize: 13, color: theme.textPrimary, fontWeight: 500 }}>{toast.msg}</span>
        </div>
      )}

      <SideNav active="branding" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="hdr" style={{ padding: "12px 24px", background: theme.bgCard, borderBottom: `1px solid ${theme.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.borderSubtle}`, borderRadius: 7, padding: "6px 9px", color: theme.textTertiary, cursor: "pointer", display: "flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary }}>Brand Customisation</div>
              <div style={{ fontSize: 12, color: theme.textTertiary }}>Design your private label identity</div>
            </div>
          </div>
          <button onClick={save} disabled={saving} style={{ background: saved ? theme.greenSubtle : theme.gold, border: saved ? `1px solid ${theme.greenBorder}` : "none", borderRadius: 8, padding: "8px 18px", color: saved ? theme.green : "white", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Branding"}
          </button>
        </header>

        <div className="main-pad" style={{ padding: "18px 24px" }}>
          <div className="brand-layout" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
            <div>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
                {[{ id: "identity", label: "Identity" }, { id: "colors", label: "Colors" }, { id: "style", label: "Label Style" }].map(t => (
                  <button key={t.id} className="tab-pill" onClick={() => setTab(t.id)}
                    style={{ background: tab === t.id ? theme.goldSubtle : theme.bgSurface, borderColor: tab === t.id ? theme.goldBorder : theme.borderSubtle, color: tab === t.id ? theme.gold : theme.textSecondary }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* IDENTITY */}
              {tab === "identity" && (
                <>
                  <div className="brand-card">
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 14 }}>Logo Upload</div>
                    <div onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onClick={() => fileRef.current?.click()}
                      style={{ border: `2px dashed ${drag ? theme.gold : theme.borderDefault}`, borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: drag ? theme.goldSubtle : theme.bgSurface, transition: "all 0.2s" }}>
                      {logoUrl ? (
                        <div><img src={logoUrl} alt="logo" style={{ maxHeight: 64, maxWidth: 180, objectFit: "contain", margin: "0 auto 8px" }} /><div style={{ fontSize: 12, color: theme.textTertiary }}>Click to change</div></div>
                      ) : (
                        <div>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.textTertiary} strokeWidth="1.5" style={{ margin: "0 auto 10px" }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <div style={{ fontSize: 13, fontWeight: 500, color: theme.textSecondary, marginBottom: 4 }}>Drop your logo here or click to upload</div>
                          <div style={{ fontSize: 11, color: theme.textTertiary }}>PNG, JPG, SVG — max 2MB</div>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => pickFile(e.target.files[0])} />
                    </div>
                  </div>
                  <div className="brand-card">
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 14 }}>Brand Identity</div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: theme.textTertiary, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Brand Name</label>
                      <input value={brandName} onChange={e => setBrandName(e.target.value)} style={{ width: "100%", background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 8, padding: "9px 12px", color: theme.textPrimary, fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: theme.textTertiary, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Tagline</label>
                      <input value={tagline} onChange={e => setTagline(e.target.value)} style={{ width: "100%", background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 8, padding: "9px 12px", color: theme.textPrimary, fontSize: 14 }} />
                    </div>
                  </div>
                </>
              )}

              {/* COLORS */}
              {tab === "colors" && (
                <>
                  <div className="brand-card">
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 14 }}>Brand Colors</div>
                    <div className="color-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[{ label: "Primary", val: primary, set: setPrimary }, { label: "Secondary", val: secondary, set: setSecondary }, { label: "Accent", val: accent, set: setAccent }, { label: "Background", val: bg, set: setBg }].map(c => (
                        <div key={c.label}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: theme.textTertiary, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{c.label}</label>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 8, padding: "7px 10px" }}>
                            <div style={{ position: "relative", width: 28, height: 28, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                              <input type="color" value={c.val} onChange={e => c.set(e.target.value)} style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)" }} />
                            </div>
                            <input value={c.val} onChange={e => c.set(e.target.value)} style={{ background: "none", border: "none", color: theme.textSecondary, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", flex: 1 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="brand-card">
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 12 }}>Preset Palettes</div>
                    <div className="palette-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                      {PALETTES.map(p => (
                        <div key={p.name} onClick={() => { setPrimary(p.primary); setSecondary(p.secondary); setAccent(p.accent); setBg(p.bg); }}
                          style={{ background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 8, padding: "10px", cursor: "pointer", transition: "all 0.15s", userSelect: "none" }}>
                          <div style={{ display: "flex", gap: 3, marginBottom: 6, pointerEvents: "none" }}>{[p.primary, p.secondary, p.accent].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}</div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: theme.textSecondary, pointerEvents: "none" }}>{p.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* STYLE */}
              {tab === "style" && (
                <div className="brand-card">
                  <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 14 }}>Label Style</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {["Modern", "Classic", "Minimal", "Bold"].map(s => (
                      <div key={s} onClick={() => setStyle(s)} style={{ background: style === s ? theme.goldSubtle : theme.bgSurface, border: `1px solid ${style === s ? theme.goldBorder : theme.borderSubtle}`, borderRadius: 10, padding: "14px", cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ height: 48, background: s === "Bold" ? primary : bg, borderRadius: 7, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", border: s === "Minimal" ? `1px solid ${primary}` : "none", pointerEvents: "none" }}>
                          <span style={{ fontFamily: s === "Modern" || s === "Classic" ? "Georgia, serif" : "sans-serif", fontSize: s === "Bold" ? 13 : 11, fontWeight: s === "Bold" ? 800 : 400, color: s === "Bold" ? "white" : primary, letterSpacing: s === "Minimal" ? "0.2em" : "0.05em", fontStyle: s === "Classic" ? "italic" : "normal", textTransform: s === "Minimal" ? "uppercase" : "none", pointerEvents: "none" }}>{brandName || "Brand"}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, textAlign: "center", color: style === s ? theme.gold : theme.textSecondary }}>{s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div style={{ position: "sticky", top: 20 }}>
              <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: 18, boxShadow: theme.shadow }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 14 }}>Live Preview</div>
                <div style={{ background: bg, borderRadius: 12, padding: "24px 18px", textAlign: "center", border: `1px solid ${primary}20`, marginBottom: 12 }}>
                  {logoUrl ? <img src={logoUrl} alt="logo" style={{ height: 44, objectFit: "contain", margin: "0 auto 12px" }} /> : <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${primary}, ${secondary})`, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18 }}>✦</div>}
                  <div style={{ fontFamily: style === "Modern" || style === "Classic" ? "Georgia, serif" : "sans-serif", fontSize: style === "Bold" ? 18 : 15, fontWeight: style === "Bold" ? 800 : 600, color: primary, letterSpacing: style === "Minimal" ? "0.18em" : "0.05em", fontStyle: style === "Classic" ? "italic" : "normal", textTransform: style === "Minimal" ? "uppercase" : "none", marginBottom: 5 }}>{brandName}</div>
                  <div style={{ fontSize: 9, color: secondary, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7, marginBottom: 14 }}>{tagline}</div>
                  <div style={{ width: 28, height: 1, background: primary, margin: "0 auto 12px", opacity: 0.5 }}></div>
                  <div style={{ fontSize: 12, color: secondary }}>Rose Glow Serum · 30ml</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[{ label: "Primary", color: primary }, { label: "Secondary", color: secondary }, { label: "Accent", color: accent }].map(c => (
                    <div key={c.label} style={{ flex: 1, background: theme.bgSurface, borderRadius: 7, padding: "7px 4px", textAlign: "center", border: `1px solid ${theme.borderSubtle}` }}>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: c.color, margin: "0 auto 4px" }}></div>
                      <div style={{ fontSize: 8, fontWeight: 600, color: theme.textTertiary, textTransform: "uppercase" }}>{c.label}</div>
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