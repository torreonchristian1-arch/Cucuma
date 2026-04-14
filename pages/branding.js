import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import SideNav from "../components/SideNav";

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
    async function loadBranding() {
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
    loadBranding();
  }, [shop]);

  function handleFileSelect(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoUrl(e.target.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }

  function applyPalette(palette) {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    setAccentColor(palette.accent);
    setBgColor(palette.bg);
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
    const { error } = await supabase.from("branding").upsert({
      shop_domain: shop, brand_name: brandName, tagline,
      primary_color: primaryColor, secondary_color: secondaryColor,
      accent_color: accentColor, bg_color: bgColor,
      label_style: labelStyle, logo_url: finalLogoUrl,
      updated_at: new Date().toISOString(),
    }, { onConflict: "shop_domain" });
    setSaving(false);
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#faf9f7", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e8ddd0; border-radius: 2px; }
        input { outline: none; }
        input[type="color"] { cursor: pointer; border: none; background: none; padding: 0; }

        @media (max-width: 900px) {
          .branding-layout { grid-template-columns: 1fr !important; }
          .preview-sticky { position: relative !important; top: 0 !important; }
          .color-grid { grid-template-columns: 1fr 1fr !important; }
          .style-grid { grid-template-columns: 1fr 1fr !important; }
          .palette-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .page-header { padding: 12px 16px 12px 60px !important; flex-wrap: wrap; gap: 8px; }
          .main-pad { padding: 16px !important; }
          .tab-row { overflow-x: auto; }
        }
        @media (max-width: 480px) {
          .color-grid { grid-template-columns: 1fr !important; }
          .palette-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <SideNav active="branding" shop={shop} open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header className="page-header" style={{ padding: "16px 28px", background: "white", borderBottom: "1px solid #f0ebe3", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a0e04" }}>Brand Customisation</div>
            <div style={{ fontSize: 12, color: "#a09080", marginTop: 2 }}>Design your private label identity</div>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ background: saved ? "#f0fdf4" : "linear-gradient(135deg, #c9963a, #a07020)", border: saved ? "1px solid #bbf7d0" : "none", borderRadius: 10, padding: "9px 20px", color: saved ? "#16a34a" : "white", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Branding"}
          </button>
        </header>

        <div className="main-pad" style={{ padding: "20px 28px" }}>
          <div className="branding-layout" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>

            {/* LEFT EDITOR */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Tabs */}
              <div className="tab-row" style={{ display: "flex", gap: 8 }}>
                {[{ id: "identity", label: "Identity" }, { id: "colors", label: "Colors" }, { id: "style", label: "Label Style" }].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    background: activeTab === tab.id ? "#fef3e2" : "white",
                    border: activeTab === tab.id ? "1px solid #f3d098" : "1px solid #f0ebe3",
                    borderRadius: 10, padding: "9px 18px",
                    color: activeTab === tab.id ? "#c9963a" : "#6b5a4e",
                    fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}>{tab.label}</button>
                ))}
              </div>

              {/* IDENTITY TAB */}
              {activeTab === "identity" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Logo Upload */}
                  <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 20 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a0e04", marginBottom: 14 }}>Logo Upload</div>
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onClick={() => fileInputRef.current?.click()}
                      style={{ border: `2px dashed ${dragOver ? "#c9963a" : "#f0ebe3"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: dragOver ? "#fef9f0" : "#faf9f7", transition: "all 0.2s" }}
                    >
                      {logoUrl ? (
                        <div>
                          <img src={logoUrl} alt="logo" style={{ maxHeight: 72, maxWidth: 180, objectFit: "contain", margin: "0 auto 10px", display: "block" }} />
                          <div style={{ fontSize: 12, color: "#a09080" }}>Click to change logo</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 32, marginBottom: 10 }}>⊕</div>
                          <div style={{ fontSize: 14, color: "#6b5a4e", fontWeight: 500, marginBottom: 4 }}>Drop your logo here or click to upload</div>
                          <div style={{ fontSize: 12, color: "#a09080" }}>PNG, JPG, SVG — max 2MB</div>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileSelect(e.target.files[0])} />
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 20 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a0e04", marginBottom: 16 }}>Brand Identity</div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 11, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>Brand Name</label>
                      <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Your Brand Name"
                        style={{ width: "100%", background: "#faf9f7", border: "1px solid #f0ebe3", borderRadius: 8, padding: "10px 14px", color: "#1a0e04", fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>Tagline</label>
                      <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Premium Beauty Collection"
                        style={{ width: "100%", background: "#faf9f7", border: "1px solid #f0ebe3", borderRadius: 8, padding: "10px 14px", color: "#1a0e04", fontSize: 14 }} />
                    </div>
                  </div>
                </div>
              )}

              {/* COLORS TAB */}
              {activeTab === "colors" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 20 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a0e04", marginBottom: 16 }}>Brand Colors</div>
                    <div className="color-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {[
                        { label: "Primary", value: primaryColor, setter: setPrimaryColor },
                        { label: "Secondary", value: secondaryColor, setter: setSecondaryColor },
                        { label: "Accent", value: accentColor, setter: setAccentColor },
                        { label: "Background", value: bgColor, setter: setBgColor },
                      ].map(({ label, value, setter }) => (
                        <div key={label}>
                          <label style={{ fontSize: 11, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8, fontWeight: 600 }}>{label}</label>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#faf9f7", border: "1px solid #f0ebe3", borderRadius: 8, padding: "8px 12px" }}>
                            <div style={{ position: "relative", width: 30, height: 30, borderRadius: 6, overflow: "hidden", border: "1px solid #f0ebe3", flexShrink: 0 }}>
                              <input type="color" value={value} onChange={e => setter(e.target.value)}
                                style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)" }} />
                            </div>
                            <input value={value} onChange={e => setter(e.target.value)}
                              style={{ background: "none", border: "none", color: "#6b5a4e", fontSize: 13, fontFamily: "monospace", flex: 1 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Palettes */}
                  <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 20 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a0e04", marginBottom: 14 }}>Preset Palettes</div>
                    <div className="palette-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      {PRESET_PALETTES.map(palette => (
                        <div key={palette.name} onClick={() => applyPalette(palette)}
                          style={{ background: palette.bg, border: "1px solid #f0ebe3", borderRadius: 10, padding: "12px", cursor: "pointer", userSelect: "none" }}>
                          <div style={{ display: "flex", gap: 4, marginBottom: 8, pointerEvents: "none" }}>
                            {[palette.primary, palette.secondary, palette.accent].map(c => (
                              <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
                            ))}
                          </div>
                          <div style={{ fontSize: 11, color: palette.primary, fontWeight: 600, pointerEvents: "none" }}>{palette.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STYLE TAB */}
              {activeTab === "style" && (
                <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a0e04", marginBottom: 16 }}>Label Style</div>
                  <div className="style-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                    {LABEL_STYLES.map(style => (
                      <div key={style} onClick={() => setLabelStyle(style)} style={{
                        background: labelStyle === style ? "#fef3e2" : "#faf9f7",
                        border: labelStyle === style ? "1px solid #f3d098" : "1px solid #f0ebe3",
                        borderRadius: 12, padding: "16px", cursor: "pointer",
                      }}>
                        <div style={{ height: 56, background: style === "Bold" ? primaryColor : bgColor, borderRadius: 8, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", border: style === "Minimal" ? `1px solid ${primaryColor}` : "none", pointerEvents: "none" }}>
                          <span style={{ fontFamily: style === "Classic" || style === "Modern" ? "'Playfair Display', serif" : "sans-serif", fontSize: style === "Bold" ? 15 : 12, fontWeight: style === "Bold" ? 800 : 400, color: style === "Bold" ? "white" : primaryColor, letterSpacing: style === "Minimal" ? "0.2em" : "0.05em", fontStyle: style === "Classic" ? "italic" : "normal", textTransform: style === "Minimal" ? "uppercase" : "none", pointerEvents: "none" }}>{brandName || "Brand"}</span>
                        </div>
                        <div style={{ fontSize: 13, color: labelStyle === style ? "#c9963a" : "#6b5a4e", fontWeight: 600, textAlign: "center" }}>{style}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: LIVE PREVIEW */}
            <div className="preview-sticky" style={{ position: "sticky", top: 20 }}>
              <div style={{ background: "white", border: "1px solid #f0ebe3", borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a0e04", marginBottom: 16 }}>Live Preview</div>

                {/* Label Preview */}
                <div style={{ background: bgColor, borderRadius: 12, padding: "28px 20px", textAlign: "center", border: `1px solid ${primaryColor}20`, marginBottom: 14 }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt="logo" style={{ height: 52, objectFit: "contain", margin: "0 auto 14px", display: "block" }} />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✦</div>
                  )}
                  <div style={{ fontFamily: labelStyle === "Classic" || labelStyle === "Modern" ? "'Playfair Display', serif" : "sans-serif", fontSize: labelStyle === "Bold" ? 20 : 17, fontWeight: labelStyle === "Bold" ? 800 : 400, color: primaryColor, letterSpacing: labelStyle === "Minimal" ? "0.2em" : "0.06em", fontStyle: labelStyle === "Classic" ? "italic" : "normal", textTransform: labelStyle === "Minimal" ? "uppercase" : "none", marginBottom: 6 }}>{brandName}</div>
                  <div style={{ fontSize: 10, color: secondaryColor, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7, marginBottom: 16 }}>{tagline}</div>
                  <div style={{ width: 32, height: 1, background: primaryColor, margin: "0 auto 16px", opacity: 0.4 }}></div>
                  <div style={{ fontSize: 13, color: secondaryColor, marginBottom: 2 }}>Rose Glow Serum</div>
                  <div style={{ fontSize: 10, color: secondaryColor, opacity: 0.5 }}>30ml · Made in Korea</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 14 }}>
                    {[primaryColor, secondaryColor, accentColor].map(c => (
                      <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />
                    ))}
                  </div>
                </div>

                {/* Bottle Preview */}
                <div style={{ background: "#faf9f7", borderRadius: 12, padding: "16px 20px", textAlign: "center", border: "1px solid #f0ebe3", marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#a09080", fontWeight: 500, marginBottom: 12 }}>Bottle Preview</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 28, height: 70, background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor})`, borderRadius: "3px 3px 5px 5px", position: "relative", border: `1px solid ${primaryColor}30` }}>
                        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 9, height: 9, background: secondaryColor, borderRadius: "2px 2px 0 0" }}></div>
                      </div>
                      <div style={{ fontSize: 9, color: "#a09080" }}>Serum</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 44, height: 36, background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})`, borderRadius: "4px 4px 7px 7px", border: `1px solid ${primaryColor}30`, position: "relative" }}>
                        <div style={{ position: "absolute", top: -5, left: 0, right: 0, height: 7, background: secondaryColor, borderRadius: "4px 4px 0 0" }}></div>
                      </div>
                      <div style={{ fontSize: 9, color: "#a09080" }}>Jar</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 18, height: 64, background: `linear-gradient(180deg, ${accentColor}, ${primaryColor})`, borderRadius: "2px 2px 7px 7px", border: `1px solid ${primaryColor}30`, position: "relative" }}>
                        <div style={{ position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)", width: 11, height: 5, background: secondaryColor, borderRadius: 2 }}></div>
                      </div>
                      <div style={{ fontSize: 9, color: "#a09080" }}>Tube</div>
                    </div>
                  </div>
                </div>

                {/* Color Summary */}
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ label: "Primary", color: primaryColor }, { label: "Secondary", color: secondaryColor }, { label: "Accent", color: accentColor }].map(({ label, color }) => (
                    <div key={label} style={{ flex: 1, background: "#faf9f7", borderRadius: 8, padding: "8px", textAlign: "center", border: "1px solid #f0ebe3" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: color, margin: "0 auto 5px", border: "1px solid #f0ebe3" }}></div>
                      <div style={{ fontSize: 9, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
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