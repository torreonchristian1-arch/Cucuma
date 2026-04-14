import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈", href: "/dashboard" },
  { id: "catalogue", label: "Catalogue", icon: "✦", href: "/catalogue" },
  { id: "branding", label: "Branding", icon: "◉", href: "/branding" },
  { id: "orders", label: "Orders", icon: "⬡", href: "/orders" },
  { id: "settings", label: "Settings", icon: "⚙", href: "/settings" },
];

const PRESET_PALETTES = [
  { name: "Gold Luxe", primary: "#d4b68e", secondary: "#8b5e3c", accent: "#f5e6d0", bg: "#1a0e04" },
  { name: "Rose Bloom", primary: "#f9a8c9", secondary: "#e91e8c", accent: "#fce4ec", bg: "#1a0810" },
  { name: "Sage Green", primary: "#a8d5b5", secondary: "#2d6a4f", accent: "#e8f5e9", bg: "#071a0e" },
  { name: "Midnight Blue", primary: "#90caf9", secondary: "#1565c0", accent: "#e3f2fd", bg: "#070d1a" },
  { name: "Lavender", primary: "#ce93d8", secondary: "#7b1fa2", accent: "#f3e5f5", bg: "#100714" },
  { name: "Coral Glow", primary: "#ffab91", secondary: "#e64a19", accent: "#fbe9e7", bg: "#1a0700" },
];

const LABEL_STYLES = ["Modern", "Classic", "Minimal", "Bold"];

export default function Branding() {
  const router = useRouter();
  const { shop } = router.query;
  const fileInputRef = useRef(null);

  const [brandName, setBrandName] = useState("Your Brand");
  const [tagline, setTagline] = useState("Premium Beauty Collection");
  const [primaryColor, setPrimaryColor] = useState("#d4b68e");
  const [secondaryColor, setSecondaryColor] = useState("#8b5e3c");
  const [accentColor, setAccentColor] = useState("#f5e6d0");
  const [bgColor, setBgColor] = useState("#1a0e04");
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
      const { data } = await supabase
        .from("branding")
        .select("*")
        .eq("shop_domain", shop)
        .single();
      if (data) {
        setBrandName(data.brand_name || "Your Brand");
        setTagline(data.tagline || "Premium Beauty Collection");
        setPrimaryColor(data.primary_color || "#d4b68e");
        setSecondaryColor(data.secondary_color || "#8b5e3c");
        setAccentColor(data.accent_color || "#f5e6d0");
        setBgColor(data.bg_color || "#1a0e04");
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
      const { error } = await supabase.storage
        .from("branding-assets")
        .upload(fileName, logoFile, { upsert: true });
      if (!error) {
        const { data: urlData } = supabase.storage
          .from("branding-assets")
          .getPublicUrl(fileName);
        finalLogoUrl = urlData.publicUrl;
      }
    }
    const { error } = await supabase.from("branding").upsert({
      shop_domain: shop,
      brand_name: brandName,
      tagline,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      bg_color: bgColor,
      label_style: labelStyle,
      logo_url: finalLogoUrl,
      updated_at: new Date().toISOString(),
    }, { onConflict: "shop_domain" });
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080a0c", color: "#e8e0d4", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0f12; }
        ::-webkit-scrollbar-thumb { background: #2a2620; border-radius: 2px; }
        input[type="color"] { cursor: pointer; border: none; background: none; padding: 0; }
        input { outline: none; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? 240 : 64, background: "#0d0f12", borderRight: "1px solid #1a1c1f", display: "flex", flexDirection: "column", transition: "width 0.3s ease", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid #1a1c1f" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #d4b68e, #a07850)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✦</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#e8e0d4" }}>Cucuma</div>
                <div style={{ fontSize: 10, color: "#6b6560", letterSpacing: "0.15em", textTransform: "uppercase" }}>Private Label</div>
              </div>
            )}
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 10px" }}>
          {NAV.map(item => (
            <Link key={item.id} href={`${item.href}?shop=${shop}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 12px",
                borderRadius: 8, marginBottom: 4,
                borderLeft: item.id === "branding" ? "2px solid #d4b68e" : "2px solid transparent",
                background: item.id === "branding" ? "rgba(212,182,142,0.1)" : "transparent",
                color: item.id === "branding" ? "#d4b68e" : "#6b6560", cursor: "pointer",
              }}>
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
              <div style={{ fontSize: 12, color: "#a09080", wordBreak: "break-all" }}>{shop || "Loading..."}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }}></div>
                <span style={{ fontSize: 11, color: "#4ade80" }}>Active</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "20px 32px", borderBottom: "1px solid #1a1c1f", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#080a0c", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "1px solid #1a1c1f", borderRadius: 6, color: "#6b6560", cursor: "pointer", padding: "6px 8px", fontSize: 14 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#e8e0d4" }}>Brand Customisation ◉</div>
              <div style={{ fontSize: 12, color: "#4b4540", marginTop: 2 }}>Design your private label identity</div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ background: saved ? "#0d2b1a" : "#d4b68e", border: saved ? "1px solid #4ade80" : "none", borderRadius: 8, padding: "9px 24px", color: saved ? "#4ade80" : "#1a0e04", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Branding"}
          </button>
        </header>

        <div style={{ padding: "28px 32px", flex: 1, display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8 }}>
              {[{ id: "identity", label: "Identity", icon: "◈" }, { id: "colors", label: "Colors", icon: "◉" }, { id: "style", label: "Label Style", icon: "✦" }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  background: activeTab === tab.id ? "rgba(212,182,142,0.1)" : "transparent",
                  border: activeTab === tab.id ? "1px solid #d4b68e" : "1px solid #1a1c1f",
                  borderRadius: 10, padding: "9px 20px",
                  color: activeTab === tab.id ? "#d4b68e" : "#6b6560",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* IDENTITY TAB */}
            {activeTab === "identity" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 24 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 16 }}>Logo Upload</div>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: `2px dashed ${dragOver ? "#d4b68e" : "#2a2620"}`, borderRadius: 12, padding: "32px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(212,182,142,0.04)" : "transparent" }}
                  >
                    {logoUrl ? (
                      <div>
                        <img src={logoUrl} alt="logo" style={{ maxHeight: 80, maxWidth: 200, objectFit: "contain", margin: "0 auto 12px", display: "block" }} />
                        <div style={{ fontSize: 12, color: "#6b6560" }}>Click to change logo</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 36, marginBottom: 12, color: "#3a3530" }}>⊕</div>
                        <div style={{ fontSize: 14, color: "#6b6560", marginBottom: 6 }}>Drop your logo here or click to upload</div>
                        <div style={{ fontSize: 11, color: "#3a3530" }}>PNG, JPG, SVG — max 2MB</div>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileSelect(e.target.files[0])} />
                  </div>
                </div>
                <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 24 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 16 }}>Brand Identity</div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, color: "#6b6560", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Brand Name</label>
                    <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Your Brand Name"
                      style={{ width: "100%", background: "#13151a", border: "1px solid #1a1c1f", borderRadius: 8, padding: "10px 14px", color: "#e8e0d4", fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "#6b6560", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Tagline</label>
                    <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Premium Beauty Collection"
                      style={{ width: "100%", background: "#13151a", border: "1px solid #1a1c1f", borderRadius: 8, padding: "10px 14px", color: "#e8e0d4", fontSize: 14 }} />
                  </div>
                </div>
              </div>
            )}

            {/* COLORS TAB */}
            {activeTab === "colors" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 24 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 20 }}>Brand Colors</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[
                      { label: "Primary Color", value: primaryColor, setter: setPrimaryColor },
                      { label: "Secondary Color", value: secondaryColor, setter: setSecondaryColor },
                      { label: "Accent Color", value: accentColor, setter: setAccentColor },
                      { label: "Background Color", value: bgColor, setter: setBgColor },
                    ].map(({ label, value, setter }) => (
                      <div key={label}>
                        <label style={{ fontSize: 11, color: "#6b6560", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>{label}</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#13151a", border: "1px solid #1a1c1f", borderRadius: 8, padding: "8px 12px" }}>
                          <div style={{ position: "relative", width: 32, height: 32, borderRadius: 6, overflow: "hidden", border: "1px solid #2a2620", flexShrink: 0 }}>
                            <input type="color" value={value} onChange={e => setter(e.target.value)}
                              style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", cursor: "pointer" }} />
                          </div>
                          <input value={value} onChange={e => setter(e.target.value)}
                            style={{ background: "none", border: "none", color: "#a09080", fontSize: 13, fontFamily: "monospace", flex: 1 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRESET PALETTES */}
                <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 24 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 16 }}>Preset Palettes</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {PRESET_PALETTES.map(palette => (
                      <div
                        key={palette.name}
                        onClick={() => applyPalette(palette)}
                        style={{
                          background: palette.bg,
                          border: "1px solid #2a2620",
                          borderRadius: 10,
                          padding: "12px 14px",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        <div style={{ display: "flex", gap: 4, marginBottom: 8, pointerEvents: "none" }}>
                          {[palette.primary, palette.secondary, palette.accent].map(c => (
                            <div key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c }} />
                          ))}
                        </div>
                        <div style={{ fontSize: 11, color: palette.primary, fontWeight: 600, pointerEvents: "none" }}>
                          {palette.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STYLE TAB */}
            {activeTab === "style" && (
              <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 24 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 20 }}>Label Style</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                  {LABEL_STYLES.map(style => (
                    <div key={style} onClick={() => setLabelStyle(style)} style={{
                      background: labelStyle === style ? "rgba(212,182,142,0.08)" : "#13151a",
                      border: labelStyle === style ? "1px solid #d4b68e" : "1px solid #1a1c1f",
                      borderRadius: 12, padding: "20px 18px", cursor: "pointer",
                    }}>
                      <div style={{
                        height: 60, background: style === "Bold" ? primaryColor : bgColor,
                        borderRadius: 6, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center",
                        border: style === "Minimal" ? `1px solid ${primaryColor}` : "none",
                        pointerEvents: "none",
                      }}>
                        <span style={{
                          fontFamily: style === "Classic" || style === "Modern" ? "'Cormorant Garamond', serif" : "sans-serif",
                          fontSize: style === "Bold" ? 16 : 13,
                          fontWeight: style === "Bold" ? 800 : 400,
                          color: style === "Bold" ? bgColor : primaryColor,
                          letterSpacing: style === "Minimal" ? "0.2em" : "0.05em",
                          fontStyle: style === "Classic" ? "italic" : "normal",
                          textTransform: style === "Minimal" ? "uppercase" : "none",
                          pointerEvents: "none",
                        }}>{brandName || "Brand"}</span>
                      </div>
                      <div style={{ fontSize: 13, color: labelStyle === style ? "#d4b68e" : "#6b6560", fontWeight: 600, textAlign: "center", pointerEvents: "none" }}>{style}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div style={{ position: "sticky", top: 28 }}>
            <div style={{ background: "#0d0f12", border: "1px solid #1a1c1f", borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#e8e0d4", marginBottom: 20 }}>Live Preview</div>
              <div style={{ background: bgColor, borderRadius: 12, padding: "32px 24px", textAlign: "center", border: `1px solid ${primaryColor}30`, marginBottom: 16 }}>
                {logoUrl ? (
                  <img src={logoUrl} alt="logo" style={{ height: 56, objectFit: "contain", margin: "0 auto 16px", display: "block" }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: bgColor }}>✦</div>
                )}
                <div style={{
                  fontFamily: labelStyle === "Classic" || labelStyle === "Modern" ? "'Cormorant Garamond', serif" : "sans-serif",
                  fontSize: labelStyle === "Bold" ? 22 : 18, fontWeight: labelStyle === "Bold" ? 800 : 300,
                  color: primaryColor, letterSpacing: labelStyle === "Minimal" ? "0.25em" : "0.08em",
                  fontStyle: labelStyle === "Classic" ? "italic" : "normal",
                  textTransform: labelStyle === "Minimal" ? "uppercase" : "none", marginBottom: 8,
                }}>{brandName || "Your Brand"}</div>
                <div style={{ fontSize: 10, color: accentColor, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.7, marginBottom: 20 }}>{tagline}</div>
                <div style={{ width: 40, height: 1, background: primaryColor, margin: "0 auto 20px", opacity: 0.5 }}></div>
                <div style={{ fontSize: 13, color: accentColor, marginBottom: 4 }}>Rose Glow Serum</div>
                <div style={{ fontSize: 10, color: accentColor, opacity: 0.5 }}>30ml · Made in Korea</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
                  {[primaryColor, secondaryColor, accentColor].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
                  ))}
                </div>
              </div>

              <div style={{ background: "#13151a", borderRadius: 12, padding: "20px 24px", textAlign: "center", border: "1px solid #1a1c1f" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "#6b6560", marginBottom: 14 }}>Bottle Preview</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 32, height: 80, background: `linear-gradient(180deg, ${secondaryColor}, ${primaryColor})`, borderRadius: "4px 4px 6px 6px", position: "relative", border: `1px solid ${primaryColor}40` }}>
                      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: secondaryColor, borderRadius: "2px 2px 0 0" }}></div>
                    </div>
                    <div style={{ fontSize: 9, color: "#4b4540" }}>Serum</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 48, height: 40, background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})`, borderRadius: "4px 4px 8px 8px", border: `1px solid ${primaryColor}40`, position: "relative" }}>
                      <div style={{ position: "absolute", top: -6, left: 0, right: 0, height: 8, background: secondaryColor, borderRadius: "4px 4px 0 0" }}></div>
                    </div>
                    <div style={{ fontSize: 9, color: "#4b4540" }}>Jar</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 20, height: 72, background: `linear-gradient(180deg, ${accentColor}40, ${primaryColor})`, borderRadius: "3px 3px 8px 8px", border: `1px solid ${primaryColor}40`, position: "relative" }}>
                      <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", width: 12, height: 6, background: secondaryColor, borderRadius: 2 }}></div>
                    </div>
                    <div style={{ fontSize: 9, color: "#4b4540" }}>Tube</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                {[{ label: "Primary", color: primaryColor }, { label: "Secondary", color: secondaryColor }, { label: "Accent", color: accentColor }].map(({ label, color }) => (
                  <div key={label} style={{ flex: 1, background: "#13151a", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: color, margin: "0 auto 6px" }}></div>
                    <div style={{ fontSize: 9, color: "#4b4540", textTransform: "uppercase" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
