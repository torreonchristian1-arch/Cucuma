import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { useTheme } from "./_app";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const STEPS = [
  {
    id: 1,
    title: "Welcome to Cucuma®",
    subtitle: "Launch your private label beauty brand on Shopify — automatic label rendering, zero inventory, automated fulfillment.",
    cta: "Get Started →",
    icon: (gold) => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Browse Your Product Catalogue",
    subtitle: "Browse 18+ luxury beauty products — reverse-engineered luxury formulas ready to sell under your brand name.",
    cta: "Continue →",
    icon: (gold) => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Design Your Brand Identity",
    subtitle: "Upload your logo, choose your colors. Our automatic label rendering system applies your brand — no Photoshop needed.",
    cta: "Continue →",
    icon: (gold) => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Publish Your First Product",
    subtitle: "You're ready! Go to the catalogue and publish your first product to your Shopify store.",
    cta: "Go to Dashboard →",
    icon: (gold) => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
];

const FEATURES = [
  { icon: "🛡️", text: "Zero inventory upfront" },
  { icon: "🚀", text: "Publish products in minutes" },
  { icon: "💰", text: "Keep 100% of your profits" },
  { icon: "📦", text: "We handle all fulfillment" },
];

const PRODUCTS_PREVIEW = [
  { name: "Rose Glow Serum", cat: "Skincare", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80" },
  { name: "Matte Lip Kit", cat: "Cosmetics", img: "https://images.unsplash.com/photo-1586495777744-4e6232bf4e45?w=300&q=80" },
  { name: "Keratin Mask", cat: "Haircare", img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&q=80" },
  { name: "Vitamin C Serum", cat: "Skincare", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&q=80" },
];

export default function Onboarding() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode } = useTheme();
  const [step, setStep] = useState(1);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!shop) return;
    // Check if merchant already completed onboarding
    checkOnboarding();
  }, [shop]);

  async function checkOnboarding() {
    try {
      const { data } = await supabase
        .from("merchants")
        .select("onboarding_completed")
        .eq("shop_domain", shop)
        .single();
      if (data?.onboarding_completed) {
        router.push(`/dashboard?shop=${shop}`);
      }
    } catch {}
  }

  async function completeOnboarding() {
    setCompleting(true);
    try {
      await supabase
        .from("merchants")
        .update({ onboarding_completed: true })
        .eq("shop_domain", shop);
    } catch {}
    router.push(`/dashboard?shop=${shop}`);
  }

  function handleCta() {
    if (step < 4) setStep(step + 1);
    else completeOnboarding();
  }

  function handleSkip() {
    completeOnboarding();
  }

  const progress = ((step - 1) / 3) * 100;

  return (
    <div style={{ minHeight: "100vh", background: theme.bgBase, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .onboard-card { animation: fadeUp 0.4s ease; }
        .step-dot { transition: all 0.3s; cursor: pointer; }
        .product-thumb:hover img { transform: scale(1.05); }
        .product-thumb img { transition: transform 0.3s; }
        .feature-item:hover { background: ${theme.bgElevated} !important; transform: translateY(-1px); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: theme.textTertiary }}>Step {step} of 4</span>
            <button onClick={handleSkip} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: theme.textTertiary, fontWeight: 500 }}>Skip setup</button>
          </div>
          <div style={{ height: 4, background: theme.borderSubtle, borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: theme.gold, borderRadius: 100, transition: "width 0.4s ease" }}></div>
          </div>
          {/* Step dots */}
          <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="step-dot" onClick={() => s < step && setStep(s)}
                style={{ width: s === step ? 20 : 8, height: 8, borderRadius: 100, background: s === step ? theme.gold : s < step ? theme.green : theme.borderDefault, transition: "all 0.3s" }}></div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div key={step} className="onboard-card" style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 16, overflow: "hidden", boxShadow: theme.shadowMd }}>
          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div style={{ padding: "40px 36px" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: theme.goldSubtle, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                {STEPS[0].icon(theme.gold)}
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, marginBottom: 10, lineHeight: 1.2 }}>{STEPS[0].title}</h1>
              <p style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.7, marginBottom: 28 }}>{STEPS[0].subtitle}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
                {FEATURES.map(f => (
                  <div key={f.text} className="feature-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, transition: "all 0.15s" }}>
                    <span style={{ fontSize: 18 }}>{f.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: theme.textSecondary }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: theme.greenSubtle, border: `1px solid ${theme.greenBorder}`, borderRadius: 10, marginBottom: 28 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: theme.green, flexShrink: 0 }}></div>
                <span style={{ fontSize: 13, fontWeight: 500, color: theme.green }}>Store connected: <strong>{shop}</strong></span>
              </div>

              <button onClick={handleCta} style={{ width: "100%", background: theme.gold, border: "none", borderRadius: 10, padding: "14px", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                {STEPS[0].cta}
              </button>
            </div>
          )}

          {/* Step 2 — Catalogue */}
          {step === 2 && (
            <div>
              <div style={{ padding: "32px 36px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.goldSubtle, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {STEPS[1].icon(theme.gold)}
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.textPrimary, marginBottom: 3 }}>{STEPS[1].title}</h2>
                    <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>{STEPS[1].subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Product previews */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 36px 28px" }}>
                {PRODUCTS_PREVIEW.map(p => (
                  <div key={p.name} className="product-thumb" style={{ background: theme.bgSurface, borderRadius: 10, overflow: "hidden", border: `1px solid ${theme.borderSubtle}` }}>
                    <div style={{ height: 100, overflow: "hidden" }}>
                      <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "8px 10px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: theme.gold, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{p.cat}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{p.name}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "0 36px 8px", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: theme.textTertiary }}>+ 14 more products available</span>
              </div>

              <div style={{ padding: "0 36px 32px", display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: theme.bgSurface, border: `1px solid ${theme.borderDefault}`, borderRadius: 10, padding: "12px", color: theme.textSecondary, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <button onClick={handleCta} style={{ flex: 2, background: theme.gold, border: "none", borderRadius: 10, padding: "12px", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{STEPS[1].cta}</button>
              </div>
            </div>
          )}

          {/* Step 3 — Branding */}
          {step === 3 && (
            <div style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.goldSubtle, border: `1px solid ${theme.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {STEPS[2].icon(theme.gold)}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.textPrimary, marginBottom: 3 }}>{STEPS[2].title}</h2>
                  <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>{STEPS[2].subtitle}</p>
                </div>
              </div>

              {/* Branding preview */}
              <div style={{ background: theme.bgSurface, borderRadius: 12, padding: 20, marginBottom: 20, border: `1px solid ${theme.borderSubtle}` }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: `linear-gradient(135deg, ${theme.gold}, #a07828)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 22, flexShrink: 0 }}>✦</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary }}>Your Brand Name</div>
                    <div style={{ fontSize: 12, color: theme.textTertiary, marginTop: 2 }}>Premium Beauty Collection</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["#C4975A", "#8b5e3c", "#f5e6d0"].map(color => (
                    <div key={color} style={{ flex: 1, height: 28, borderRadius: 7, background: color }}></div>
                  ))}
                </div>
              </div>

              {[
                { icon: "📤", text: "Upload your logo (PNG, JPG, SVG)" },
                { icon: "🎨", text: "Choose your brand colors" },
                { icon: "🏷️", text: "Pick a label style" },
              ].map(item => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${theme.borderSubtle}` }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>{item.text}</span>
                  <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: theme.borderDefault, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.textTertiary} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: theme.bgSurface, border: `1px solid ${theme.borderDefault}`, borderRadius: 10, padding: "12px", color: theme.textSecondary, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <button onClick={handleCta} style={{ flex: 2, background: theme.gold, border: "none", borderRadius: 10, padding: "12px", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{STEPS[2].cta}</button>
              </div>
            </div>
          )}

          {/* Step 4 — Ready! */}
          {step === 4 && (
            <div style={{ padding: "40px 36px", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: theme.greenSubtle, border: `1px solid ${theme.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, marginBottom: 10 }}>You're All Set! 🎉</h2>
              <p style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.7, marginBottom: 28, maxWidth: 380, margin: "0 auto 28px" }}>
                Your store is connected and you're ready to start building your beauty brand. Go to the catalogue to publish your first product!
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {[
                  { label: "Browse Catalogue", desc: "Pick your first product to sell", href: "/catalogue", primary: true },
                  { label: "Set Up Branding", desc: "Upload your logo and colors", href: "/branding", primary: false },
                ].map(action => (
                  <button key={action.label} onClick={() => router.push(`${action.href}?shop=${shop}`)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: action.primary ? theme.gold : theme.bgSurface, border: action.primary ? "none" : `1px solid ${theme.borderDefault}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: action.primary ? "white" : theme.textPrimary }}>{action.label}</div>
                      <div style={{ fontSize: 12, color: action.primary ? "rgba(255,255,255,0.7)" : theme.textTertiary, marginTop: 2 }}>{action.desc}</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={action.primary ? "white" : theme.textTertiary} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                ))}
              </div>

              <button onClick={completeOnboarding} disabled={completing}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: theme.textTertiary, fontWeight: 500 }}>
                {completing ? "Loading..." : "Go to Dashboard →"}
              </button>
            </div>
          )}
        </div>

        {/* Bottom trust line */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ fontSize: 12, color: theme.textTertiary }}>Secured by Shopify OAuth · No credit card required</span>
        </div>
      </div>
    </div>
  );
}