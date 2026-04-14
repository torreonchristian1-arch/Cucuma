// ── BRANDING ──────────────────────────────────────────────────────
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
  const { theme, mode } = useTheme();
  const fileRef = useRef(null);
  const [brandName, setBrandName] = useState("Your Brand");
  const [tagline, setTagline] = useState("Premium Beauty Collection");
  const [primary, setPrimary] = useState("#c9963a");
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

  useEffect(() => {
    if (!shop) return;
    supabase.from("branding").select("*").eq("shop_domain", shop).single().then(({ data }) => {
      if (!data) return;
      setBrandName(data.brand_name || "Your Brand");
      setTagline(data.tagline || "Premium Beauty Collection");
      setPrimary(data.primary_color || "#c9963a");
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
    if (!shop) return;
    setSaving(true);
    let finalLogo = logoUrl;
    if (logoFile) {
      const name = `${shop}-logo-${Date.now()}.${logoFile.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("branding-assets").upload(name, logoFile, { upsert: true });
      if (!error) finalLogo = supabase.storage.from("branding-assets").getPublicUrl(name).data.publicUrl;
    }
    await supabase.from("branding").upsert({ shop_domain: shop, brand_name: brandName, tagline, primary_color: primary, secondary_color: secondary, accent_color: accent, bg_color: bg, label_style: style, logo_url: finalLogo, updated_at: new Date().toISOString() }, { onConflict: "shop_domain" });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
  }

  const Card = ({ children, style: s }) => (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, boxShadow: theme.shadow, ...s }}>{children}</div>
  );

  const Label = ({ children }) => (
    <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{children}</div>
  );

  const Input = ({ value, onChange, placeholder }) => (
    <input value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, padding: "10px 14px", color: theme.text, fontSize: 14, fontWeight: 500 }} />
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, overflow: "hidden", transition: "background 0.25s" }}>
      <style>{`
        input { outline: none; }
        input[type="color"] { cursor: pointer; border: none; background: none; padding: 0; }
        @media (max-width: 900px) {
          .brand-layout { grid-template-columns: 1fr !important; }
          .preview-sticky { position: relative !important; top: 0 !important; }
        }
        @media (max-width: 768px) {
          .hdr { padding: 10px 16px 10px 56px !important; flex-wrap: wrap; gap: 8px; }
          .main-pad { padding: 16px !important; padding-top: 60px !important; }
          .color-grid { grid-template-columns: 1fr 1fr !important; }
          .style-grid { grid-template-columns: 1fr 1fr !important; }
          .palette-grid { grid-template-columns: repeat(3,1fr) !important; }
          .hide-sm { display: none !important; }
        }
        @media (max-width: 480px) {
          .color-grid { grid-template-columns: 1fr !important; }
          .palette-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <SideNav active="branding" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="hdr" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", color: theme.textMuted, cursor: "pointer", fontSize: 15 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: theme.text }}>Brand Customisation</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>Design your private label identity</div>
            </div>
          </div>
          <button onClick={save} disabled={saving} style={{ background: saved ? theme.greenBg : `linear-gradient(135deg, ${theme.gold}, #a07828)`, border: saved ? `1px solid ${theme.greenBorder}` : "none", borderRadius: 9, padding: "9px 20px", color: saved ? theme.green : "white", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: saved ? "none" : `0 4px 14px rgba(184,134,42,0.3)` }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Branding"}
          </button>
        </header>

        <div className="main-pad" style={{ padding: "22px 28px" }}>
          <div className="brand-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                {[{ id: "identity", label: "Identity" }, { id: "colors", label: "Colors" }, { id: "style", label: "Label Style" }].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? theme.gold : theme.surface, border: tab === t.id ? "none" : `1px solid ${theme.border}`, borderRadius: 9, padding: "8px 18px", color: tab === t.id ? "white" : theme.textSub, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", boxShadow: tab === t.id ? `0 4px 14px rgba(184,134,42,0.3)` : "none", transition: "all 0.15s" }}>{t.label}</button>
                ))}
              </div>

              {/* IDENTITY */}
              {tab === "identity" && (
                <>
                  <Card>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Logo Upload</div>
                    <div onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onClick={() => fileRef.current?.click()}
                      style={{ border: `2px dashed ${drag ? theme.gold : theme.border}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: drag ? theme.goldBg : theme.surfaceAlt, transition: "all 0.2s" }}>
                      {logoUrl ? (
                        <div><img src={logoUrl} alt="logo" style={{ maxHeight: 68, maxWidth: 200, objectFit: "contain", margin: "0 auto 8px", display: "block" }} /><div style={{ fontSize: 12, color: theme.textMuted }}>Click to change</div></div>
                      ) : (
                        <div>
                          <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 12px" }}>⊕</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: theme.textSub, marginBottom: 4 }}>Drop your logo or click to upload</div>
                          <div style={{ fontSize: 11, color: theme.textMuted }}>PNG, JPG, SVG — max 2MB</div>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => pickFile(e.target.files[0])} />
                    </div>
                  </Card>
                  <Card>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Brand Identity</div>
                    <div style={{ marginBottom: 14 }}><Label>Brand Name</Label><Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Your Brand Name" /></div>
                    <div><Label>Tagline</Label><Input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Premium Beauty Collection" /></div>
                  </Card>
                </>
              )}

              {/* COLORS */}
              {tab === "colors" && (
                <>
                  <Card>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Brand Colors</div>
                    <div className="color-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[{ label: "Primary", val: primary, set: setPrimary }, { label: "Secondary", val: secondary, set: setSecondary }, { label: "Accent", val: accent, set: setAccent }, { label: "Background", val: bg, set: setBg }].map(c => (
                        <div key={c.label}><Label>{c.label}</Label>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, padding: "7px 10px" }}>
                            <div style={{ position: "relative", width: 30, height: 30, borderRadius: 7, overflow: "hidden", border: `1px solid ${theme.border}`, flexShrink: 0 }}>
                              <input type="color" value={c.val} onChange={e => c.set(e.target.value)} style={{ position: "absolute", inset: "-4px", width: "calc(100%+8px)", height: "calc(100%+8px)" }} />
                            </div>
                            <input value={c.val} onChange={e => c.set(e.target.value)} style={{ background: "none", border: "none", color: theme.textSub, fontSize: 12, fontFamily: "monospace", flex: 1 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Preset Palettes</div>
                    <div className="palette-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                      {PALETTES.map(p => (
                        <div key={p.name} onClick={() => { setPrimary(p.primary); setSecondary(p.secondary); setAccent(p.accent); setBg(p.bg); }}
                          style={{ background: mode === "dark" ? theme.surfaceAlt : p.bg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "11px", cursor: "pointer", userSelect: "none", transition: "transform 0.15s" }}>
                          <div style={{ display: "flex", gap: 4, marginBottom: 7, pointerEvents: "none" }}>{[p.primary, p.secondary, p.accent].map(c => <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />)}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: p.primary, pointerEvents: "none" }}>{p.name}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {/* STYLE */}
              {tab === "style" && (
                <Card>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Label Style</div>
                  <div className="style-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
                    {["Modern", "Classic", "Minimal", "Bold"].map(s => (
                      <div key={s} onClick={() => setStyle(s)} style={{ background: style === s ? theme.goldBg : theme.surfaceAlt, border: style === s ? `2px solid ${theme.gold}` : `1px solid ${theme.border}`, borderRadius: 12, padding: "14px", cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ height: 52, background: s === "Bold" ? primary : bg, borderRadius: 8, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", border: s === "Minimal" ? `1px solid ${primary}` : "none", pointerEvents: "none" }}>
                          <span style={{ fontFamily: s === "Modern" || s === "Classic" ? "'Fraunces', serif" : "sans-serif", fontSize: s === "Bold" ? 14 : 12, fontWeight: s === "Bold" ? 900 : 400, color: s === "Bold" ? "white" : primary, letterSpacing: s === "Minimal" ? "0.2em" : "0.04em", fontStyle: s === "Classic" ? "italic" : "normal", textTransform: s === "Minimal" ? "uppercase" : "none", pointerEvents: "none" }}>{brandName || "Brand"}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, textAlign: "center", color: style === s ? theme.goldText : theme.textSub }}>{s}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* PREVIEW */}
            <div className="preview-sticky" style={{ position: "sticky", top: 20 }}>
              <Card>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Live Preview</div>
                <div style={{ background: bg, borderRadius: 14, padding: "28px 20px", textAlign: "center", border: `2px solid ${primary}20`, marginBottom: 14 }}>
                  {logoUrl ? <img src={logoUrl} alt="logo" style={{ height: 50, objectFit: "contain", margin: "0 auto 14px", display: "block" }} /> : <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg, ${primary}, ${secondary})`, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "white" }}>✦</div>}
                  <div style={{ fontFamily: style === "Modern" || style === "Classic" ? "'Fraunces', serif" : "sans-serif", fontSize: style === "Bold" ? 20 : 17, fontWeight: style === "Bold" ? 900 : 600, color: primary, letterSpacing: style === "Minimal" ? "0.2em" : "0.05em", fontStyle: style === "Classic" ? "italic" : "normal", textTransform: style === "Minimal" ? "uppercase" : "none", marginBottom: 6 }}>{brandName}</div>
                  <div style={{ fontSize: 10, color: secondary, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7, marginBottom: 16 }}>{tagline}</div>
                  <div style={{ width: 32, height: 2, background: primary, margin: "0 auto 16px", borderRadius: 2, opacity: 0.5 }}></div>
                  <div style={{ fontSize: 13, color: secondary, marginBottom: 2 }}>Rose Glow Serum</div>
                  <div style={{ fontSize: 10, color: secondary, opacity: 0.5, marginBottom: 14 }}>30ml · Made in Korea</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                    {[primary, secondary, accent].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                </div>

                {/* Bottle preview */}
                <div style={{ background: theme.surfaceAlt, borderRadius: 12, padding: "16px", textAlign: "center", border: `1px solid ${theme.border}`, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Bottle Preview</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
                    {[
                      { w: 28, h: 72, r: "3px 3px 6px 6px", cap: { w: 10, h: 9, t: 0 }, label: "Serum" },
                      { w: 44, h: 38, r: "4px 4px 8px 8px", cap: { w: 44, h: 7, t: -6 }, label: "Jar" },
                      { w: 18, h: 64, r: "2px 2px 6px 6px", cap: { w: 11, h: 6, t: -3 }, label: "Tube" },
                    ].map((b, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <div style={{ width: b.w, height: b.h, background: `linear-gradient(180deg, ${secondary}, ${primary})`, borderRadius: b.r, position: "relative", border: `1px solid ${primary}30` }}>
                          <div style={{ position: "absolute", top: b.cap.t, left: "50%", transform: "translateX(-50%)", width: b.cap.w, height: b.cap.h, background: secondary, borderRadius: 3 }}></div>
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: theme.textMuted }}>{b.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {[{ label: "Primary", color: primary }, { label: "Secondary", color: secondary }, { label: "Accent", color: accent }].map(c => (
                    <div key={c.label} style={{ flex: 1, background: theme.surfaceAlt, border: `1px solid ${theme.border}`, borderRadius: 9, padding: "8px 6px", textAlign: "center" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: c.color, margin: "0 auto 5px", border: `1px solid ${theme.border}` }}></div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}