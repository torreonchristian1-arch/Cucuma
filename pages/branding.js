import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PRESET_PALETTES = [
  { name: "Gold Luxe", primary: "#c9963a", secondary: "#8b5e3c", accent: "#f5e6d0", bg: "#faf6f0" },
  { name: "Rose Bloom", primary: "#e91e8c", secondary: "#c2185b", accent: "#fce4ec", bg: "#fff5f8" },
  { name: "Sage Green", primary: "#2d6a4f", secondary: "#1b4332", accent: "#d8f3dc", bg: "#f5fbf7" },
  { name: "Midnight Blue", primary: "#1565c0", secondary: "#0d47a1", accent: "#e3f2fd", bg: "#f5f9ff" },
  { name: "Lavender", primary: "#7b1fa2", secondary: "#6a1b9a", accent: "#f3e5f5", bg: "#fdf5ff" },
  { name: "Coral Glow", primary: "#e64a19", secondary: "#bf360c", accent: "#fbe9e7", bg: "#fff8f6" },
];

const LABEL_STYLES = ["Modern", "Classic", "Minimal", "Bold"];

export default function Branding() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode } = useTheme();
  const fileInputRef = useRef(null);

  const [brandName, setBrandName] = useState("Your Brand");
  const [tagline, setTagline] = useState("Premium Beauty Collection");
  const [primaryColor, setPrimaryColor] = useState("#c9963a");
  const [secondaryColor, setSecondaryColor] = useState("#8b5e3c");
  const [accentColor, setAccentColor] = useState("#f5e6d0");
  const [bgColor, setBgColor] = useState("#faf6f0");
  const [labelStyle, setLabelStyle] = useState("Modern");
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  useEffect(() => {
    if (!shop) return;
    async function load() {
      const { data } = await supabase.from("branding").select("*").eq("shop_domain", shop).single();
      if (data) {
        setBrandName(data.brand_name || "Your Brand");
        setTagline(data.tagline || "Premium Beauty Collection");
        setPrimaryColor(data.primary_color || "#c9963a");
        setSecondaryColor(data.secondary_color || "#8b5e3c");
        setAccentColor(data.accent_color || "#f5e6d0");
        setBgColor(data.bg_color || "#faf6f0");
        setLabelStyle(data.label_style || "Modern");
        setLogoUrl(data.logo_url || null);
      }
    }
    load();
  }, [shop]);

  function handleFileSelect(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoUrl(e.target.result);
    reader.readAsDataURL(file);
  }

  function applyPalette(p) {
    setPrimaryColor(p.primary);
    setSecondaryColor(p.secondary);
    setAccentColor(p.accent);
    setBgColor(p.bg);
  }

  async function handleSave() {
    if (!shop) return;
    setSaving(true);
    let finalLogoUrl = logoUrl;
    if (logoFile) {
      const fileName = `${shop}-logo-${Date.now()}.${logoFile.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("branding-assets").upload(fileName, logoFile, { upsert: true });
      if (!error) {
        const { data: urlData } = supabase.storage.from("branding-assets").getPublicUrl(fileName);
        finalLogoUrl = urlData.publicUrl;
      }
    }
    await supabase.from("branding").upsert({ shop_domain: shop, brand_name: brandName, tagline, primary_color: primaryColor, secondary_color: secondaryColor, accent_color: accentColor, bg_color: bgColor, label_style: labelStyle, logo_url: finalLogoUrl, updated_at: new Date().toISOString() }, { onConflict: "shop_domain" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden", transition: "background 0.2s" }}>
      <style>{`
        input { outline: none; }
        input[type="color"] { cursor: pointer; border: none; background: none; padding: 0; }
        @media (max-width: 900px) {
          .branding-layout { grid-template-columns: 1fr !important; }
          .preview-panel { position: relative !important; top: 0 !important; }
        }
        @media (max-width: 768px) {
          .page-header { padding: 12px 16px 12px 60px !important; flex-wrap: wrap; gap: 8px; }
          .main-pad { padding: 16px !important; padding-top: 64px !important; }
          .color-grid { grid-template-columns: 1fr 1fr !important; }
          .style-grid { grid-template-columns: 1fr 1fr !important; }
          .palette-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .color-grid { grid-template-columns: 1fr !important; }
          .palette-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <SideNav active="branding" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="page-header" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, transition: "background 0.2s" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: theme.text }}>Brand Customisation</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Design your private label identity</div>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ background: saved ? theme.tagBg : "linear-gradient(135deg, #c9963a, #a07020)", border: saved ? `1px solid ${theme.tagBorder}` : "none", borderRadius: 10, padding: "8px 18px", color: saved ? theme.tagText : "white", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Branding"}
          </button>
        </header>

        <div className="main-pad" style={{ padding: "20px 28px" }}>
          <div className="branding-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }}>

            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {[{ id: "identity", label: "Identity" }, { id: "colors", label: "Colors" }, { id: "style", label: "Label Style" }].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? theme.goldLight : theme.surface, border: activeTab === tab.id ? `1px solid ${theme.goldBorder}` : `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 16px", color: activeTab === tab.id ? theme.gold : theme.textSub, fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* IDENTITY */}
              {activeTab === "identity" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, transition: "background 0.2s" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Logo Upload</div>
                    <div
                      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onClick={() => fileInputRef.current?.click()}
                      style={{ border: `2px dashed ${dragOver ? theme.gold : theme.border}`, borderRadius: 12, padding: "24px 20px", textAlign: "center", cursor: "pointer", background: dragOver ? theme.goldLight : theme.inputBg, transition: "all 0.2s" }}>
                      {logoUrl ? (
                        <div>
                          <img src={logoUrl} alt="logo" style={{ maxHeight: 68, maxWidth: 160, objectFit: "contain", margin: "0 auto 8px", display: "block" }} />
                          <div style={{ fontSize: 12, color: theme.textMuted }}>Click to change</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 28, marginBottom: 8, color: theme.textMuted }}>⊕</div>
                          <div style={{ fontSize: 13, color: theme.textSub, fontWeight: 500, marginBottom: 4 }}>Drop your logo here or click to upload</div>
                          <div style={{ fontSize: 11, color: theme.textMuted }}>PNG, JPG, SVG — max 2MB</div>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileSelect(e.target.files[0])} />
                    </div>
                  </div>
                  <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, transition: "background 0.2s" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Brand Identity</div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 11, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontWeight: 600 }}>Brand Name</label>
                      <input value={brandName} onChange={e => setBrandName(e.target.value)} style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "10px 14px", color: theme.text, fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontWeight: 600 }}>Tagline</label>
                      <input value={tagline} onChange={e => setTagline(e.target.value)} style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "10px 14px", color: theme.text, fontSize: 14 }} />
                    </div>
                  </div>
                </div>
              )}

              {/* COLORS */}
              {activeTab === "colors" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, transition: "background 0.2s" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Brand Colors</div>
                    <div className="color-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[{ label: "Primary", value: primaryColor, setter: setPrimaryColor }, { label: "Secondary", value: secondaryColor, setter: setSecondaryColor }, { label: "Accent", value: accentColor, setter: setAccentColor }, { label: "Background", value: bgColor, setter: setBgColor }].map(({ label, value, setter }) => (
                        <div key={label}>
                          <label style={{ fontSize: 11, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "7px 10px" }}>
                            <div style={{ position: "relative", width: 28, height: 28, borderRadius: 6, overflow: "hidden", border: `1px solid ${theme.border}`, flexShrink: 0 }}>
                              <input type="color" value={value} onChange={e => setter(e.target.value)} style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)" }} />
                            </div>
                            <input value={value} onChange={e => setter(e.target.value)} style={{ background: "none", border: "none", color: theme.textSub, fontSize: 12, fontFamily: "monospace", flex: 1 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, transition: "background 0.2s" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Preset Palettes</div>
                    <div className="palette-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      {PRESET_PALETTES.map(palette => (
                        <div key={palette.name} onClick={() => applyPalette(palette)}
                          style={{ background: mode === "dark" ? theme.surfaceAlt : palette.bg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px", cursor: "pointer", userSelect: "none", transition: "all 0.15s" }}>
                          <div style={{ display: "flex", gap: 3, marginBottom: 6, pointerEvents: "none" }}>
                            {[palette.primary, palette.secondary, palette.accent].map(c => (
                              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                            ))}
                          </div>
                          <div style={{ fontSize: 10, color: palette.primary, fontWeight: 600, pointerEvents: "none" }}>{palette.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STYLE */}
              {activeTab === "style" && (
                <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 20, transition: "background 0.2s" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Label Style</div>
                  <div className="style-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                    {LABEL_STYLES.map(style => (
                      <div key={style} onClick={() => setLabelStyle(style)} style={{ background: labelStyle === style ? theme.goldLight : theme.inputBg, border: labelStyle === style ? `1px solid ${theme.goldBorder}` : `1px solid ${theme.border}`, borderRadius: 12, padding: "14px", cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ height: 50, background: style === "Bold" ? primaryColor : bgColor, borderRadius: 7, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", border: style === "Minimal" ? `1px solid ${primaryColor}` : "none", pointerEvents: "none" }}>
                          <span style={{ fontFamily: style === "Classic" || style === "Modern" ? "'Playfair Display', serif" : "sans-serif", fontSize: style === "Bold" ? 13 : 11, fontWeight: style === "Bold" ? 800 : 400, color: style === "Bold" ? "white" : primaryColor, letterSpacing: style === "Minimal" ? "0.2em" : "0.05em", fontStyle: style === "Classic" ? "italic" : "normal", textTransform: style === "Minimal" ? "uppercase" : "none", pointerEvents: "none" }}>{brandName || "Brand"}</span>
                        </div>
                        <div style={{ fontSize: 12, color: labelStyle === style ? theme.gold : theme.textSub, fontWeight: 600, textAlign: "center" }}>{style}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: PREVIEW */}
            <div className="preview-panel" style={{ position: "sticky", top: 20 }}>
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 18, transition: "background 0.2s" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Live Preview</div>

                <div style={{ background: bgColor, borderRadius: 12, padding: "24px 18px", textAlign: "center", border: `1px solid ${primaryColor}25`, marginBottom: 12 }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt="logo" style={{ height: 48, objectFit: "contain", margin: "0 auto 12px", display: "block" }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✦</div>
                  )}
                  <div style={{ fontFamily: labelStyle === "Classic" || labelStyle === "Modern" ? "'Playfair Display', serif" : "sans-serif", fontSize: labelStyle === "Bold" ? 19 : 16, fontWeight: labelStyle === "Bold" ? 800 : 400, color: primaryColor, letterSpacing: labelStyle === "Minimal" ? "0.2em" : "0.06em", fontStyle: labelStyle === "Classic" ? "italic" : "normal", textTransform: labelStyle === "Minimal" ? "uppercase" : "none", marginBottom: 5 }}>{brandName}</div>
                  <div style={{ fontSize: 9, color: secondaryColor, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7, marginBottom: 14 }}>{tagline}</div>
                  <div style={{ width: 28, height: 1, background: primaryColor, margin: "0 auto 12px", opacity: 0.4 }}></div>
                  <div style={{ fontSize: 12, color: secondaryColor, marginBottom: 2 }}>Rose Glow Serum</div>
                  <div style={{ fontSize: 9, color: secondaryColor, opacity: 0.5 }}>30ml · Made in Korea</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 12 }}>
                    {[primaryColor, secondaryColor, accentColor].map(c => (
                      <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.7 }} />
                    ))}
                  </div>
                </div>

                <div style={{ background: theme.surfaceAlt, borderRadius: 10, padding: "14px 16px", textAlign: "center", border: `1px solid ${theme.border}`, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500, marginBottom: 10 }}>Bottle Preview</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    {[
                      { w: 26, h: 68, label: "Serum", top: 9, capW: 9 },
                      { w: 42, h: 34, label: "Jar", top: -5, capW: 42 },
                      { w: 16, h: 60, label: "Tube", top: -3, capW: 10 },
                    ].map((b, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: b.w, height: b.h, background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor})`, borderRadius: i === 1 ? "3px 3px 6px 6px" : "2px 2px 5px 5px", position: "relative", border: `1px solid ${primaryColor}30` }}>
                          <div style={{ position: "absolute", top: b.top, left: "50%", transform: "translateX(-50%)", width: b.capW, height: i === 1 ? 6 : 8, background: secondaryColor, borderRadius: 2 }}></div>
                        </div>
                        <div style={{ fontSize: 9, color: theme.textMuted }}>{b.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  {[{ label: "Primary", color: primaryColor }, { label: "Secondary", color: secondaryColor }, { label: "Accent", color: accentColor }].map(({ label, color }) => (
                    <div key={label} style={{ flex: 1, background: theme.surfaceAlt, borderRadius: 8, padding: "7px 6px", textAlign: "center", border: `1px solid ${theme.border}` }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: color, margin: "0 auto 4px" }}></div>
                      <div style={{ fontSize: 9, color: theme.textMuted, textTransform: "uppercase" }}>{label}</div>
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