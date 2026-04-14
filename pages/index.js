import Head from "next/head";
import { useState, useEffect, useRef } from "react";

const INSTALL_URL = "https://cucuma.vercel.app/api/auth/install?shop=";

// ── Currency Config ───────────────────────────────────────────────
const CURRENCIES = {
  PH: { code: "PHP", symbol: "₱", name: "Philippine Peso", flag: "🇵🇭" },
  US: { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  AU: { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  GB: { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  SG: { code: "SGD", symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬" },
  MY: { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", flag: "🇲🇾" },
  ID: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", flag: "🇮🇩" },
  DEFAULT: { code: "USD", symbol: "$", name: "US Dollar", flag: "🌍" },
};

const RATES = { PHP: 56, USD: 1, AUD: 1.55, GBP: 0.79, SGD: 1.35, MYR: 4.72, IDR: 16000 };

function fp(usdPrice, currency) {
  if (!usdPrice) return `${currency.symbol}0`;
  const rate = RATES[currency.code] || 1;
  const val = usdPrice * rate;
  const rounded = currency.code === "IDR" ? Math.round(val / 1000) * 1000
    : ["PHP", "MYR"].includes(currency.code) ? Math.round(val / 10) * 10
    : Math.round(val * 100) / 100;
  if (currency.code === "IDR") return `${currency.symbol}${rounded.toLocaleString("id-ID")}`;
  const decimals = ["USD", "GBP", "AUD", "SGD"].includes(currency.code) ? 2 : 0;
  return `${currency.symbol}${rounded.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

const PRODUCTS = [
  { id: 1, name: "Rose Glow Serum", category: "Skincare", usdPrice: 22.99, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80" },
  { id: 7, name: "Matte Lip Studio Kit", category: "Cosmetics", usdPrice: 13.59, img: "https://images.unsplash.com/photo-1586495777744-4e6232bf4e45?w=400&q=80" },
  { id: 13, name: "Keratin Repair Mask", category: "Haircare", usdPrice: 37.49, img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80" },
  { id: 3, name: "Vitamin C Brightener", category: "Skincare", usdPrice: 25.99, img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" },
  { id: 8, name: "Glow Highlighter Palette", category: "Cosmetics", usdPrice: 17.49, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80" },
  { id: 14, name: "Scalp Revival Serum", category: "Haircare", usdPrice: 33.79, img: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400&q=80" },
];

const STEPS = [
  { number: "01", title: "Install on Shopify", desc: "Connect your store in one click. No coding needed.", icon: "⚡" },
  { number: "02", title: "Design Your Brand", desc: "Upload logo, pick colors, choose your label style.", icon: "🎨" },
  { number: "03", title: "Publish Products", desc: "Pick from 18+ premium products and go live instantly.", icon: "🚀" },
  { number: "04", title: "Sell & We Fulfill", desc: "We print your labels and ship to customers for you.", icon: "📦" },
];

const PLANS = [
  { name: "Starter", usdPrice: 17.99, period: "/mo", desc: "For new beauty entrepreneurs", dark: false, popular: false, features: ["Up to 5 products", "Basic label customization", "Order fulfillment", "Email support"] },
  { name: "Growth", usdPrice: 44.99, period: "/mo", desc: "For serious brand builders", dark: true, popular: true, features: ["Unlimited products", "Full brand customization", "Priority fulfillment", "Custom packaging", "Analytics", "Priority support"] },
  { name: "Enterprise", usdPrice: null, period: "", desc: "For scaling brands", dark: false, popular: false, features: ["Everything in Growth", "Dedicated manager", "Custom formulations", "Bulk discounts", "White-glove onboarding"] },
];

const TESTIMONIALS = [
  { name: "Maria Santos", handle: "@glowwithmaaria", location: "Manila", avatar: "M", color: "linear-gradient(135deg, #b8862a, #8a6010)", text: "I launched my skincare brand in one afternoon. First order came 3 days later. Cucuma handles everything." },
  { name: "Jan Reyes", handle: "@jansbeautyco", location: "Cebu", avatar: "J", color: "linear-gradient(135deg, #2d6a4f, #1b4332)", text: "The branding tool is insane. Logo uploaded, colors picked, full product line on Shopify in 10 minutes." },
  { name: "Andrea Cruz", handle: "@andreaglowup", location: "Davao", avatar: "A", color: "linear-gradient(135deg, #7b1fa2, #6a1b9a)", text: "My haircare line did ₱180k in sales in 2 months. Zero inventory, zero stress. Real deal." },
];

// ── Scroll Animation Hook ─────────────────────────────────────────
function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || "0px 0px -60px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// ── Animated wrapper component ────────────────────────────────────
function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, visible] = useScrollReveal();
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(-40px)", right: "translateX(40px)", scale: "scale(0.92)" };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : (transforms[direction] || transforms.up),
      transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function Home() {
  const [currency, setCurrency] = useState(CURRENCIES.PH);
  const [shopInput, setShopInput] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Detect country
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => { const c = CURRENCIES[d.country_code]; if (c) setCurrency(c); })
      .catch(() => {});

    // Nav scroll effect
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    // Hero entrance
    setTimeout(() => setHeroVisible(true), 100);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleInstall(e) {
    e.preventDefault();
    let shop = shopInput.trim();
    if (!shop) return;
    if (!shop.includes(".myshopify.com")) shop += ".myshopify.com";
    window.location.href = INSTALL_URL + shop;
  }

  const C = currency;

  return (
    <>
      <Head>
        <title>Cucuma® | Launch Your Private Label Beauty Brand</title>
        <meta name="description" content="Launch your custom beauty brand with zero upfront inventory." />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { font-family: 'Manrope', sans-serif; background: #faf9f7; color: #1a1208; overflow-x: hidden; }
        input, button { font-family: 'Manrope', sans-serif; outline: none; }
        a { text-decoration: none; color: inherit; }

        .btn-gold { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #b8862a, #8a6010); color: white; font-weight: 700; font-size: 15px; padding: 13px 28px; border-radius: 10px; border: none; cursor: pointer; transition: all 0.25s; box-shadow: 0 4px 18px rgba(184,134,42,0.35); }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(184,134,42,0.5); }
        .btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #1a1208; font-weight: 700; font-size: 15px; padding: 13px 28px; border-radius: 10px; border: 2px solid #1a1208; cursor: pointer; transition: all 0.25s; }
        .btn-outline:hover { background: #1a1208; color: white; transform: translateY(-2px); }
        .btn-white { display: inline-flex; align-items: center; gap: 8px; background: white; color: #1a1208; font-weight: 700; font-size: 15px; padding: 13px 28px; border-radius: 10px; border: none; cursor: pointer; transition: all 0.25s; box-shadow: 0 4px 18px rgba(0,0,0,0.15); }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.25); }

        .product-card { transition: transform 0.25s, box-shadow 0.25s; cursor: pointer; }
        .product-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(0,0,0,0.14); }
        .product-card:hover img { transform: scale(1.07); }
        .product-card img { transition: transform 0.35s; }

        .plan-card { transition: transform 0.25s, box-shadow 0.25s; }
        .plan-card:hover { transform: translateY(-5px); }

        .step-card { transition: transform 0.25s, box-shadow 0.25s; }
        .step-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }

        .nav-link { font-size: 14px; font-weight: 600; color: #5a4a3a; transition: color 0.2s; }
        .nav-link:hover { color: #b8862a; }

        .sell-ticker { display: flex; gap: 48px; animation: ticker 20s linear infinite; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .currency-opt:hover { background: #fff8ed !important; }

        @keyframes fadeDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .picker-anim { animation: fadeDown 0.18s ease; }

        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .float-badge { animation: float 3s ease-in-out infinite; }

        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .live-dot { animation: pulse-dot 1.5s ease-in-out infinite; }

        @media (max-width: 960px) {
          .hero-2col { grid-template-columns: 1fr !important; }
          .hero-img-wrap { display: none !important; }
          .hero-text { text-align: center; }
          .hero-bullets { align-items: center !important; }
          .hero-form { justify-content: center !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .products-grid { grid-template-columns: repeat(3,1fr) !important; }
          .plans-grid { grid-template-columns: 1fr !important; max-width: 420px !important; margin: 0 auto; }
          .testi-grid { grid-template-columns: 1fr !important; max-width: 480px !important; margin: 0 auto; }
          .profit-2col { grid-template-columns: 1fr !important; }
          .profit-stats { flex-direction: column !important; align-items: center; }
        }
        @media (max-width: 640px) {
          .section-pad { padding: 60px 20px !important; }
          .hero-pad { padding: 110px 20px 70px !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .products-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-links-wrap { display: none !important; }
          .nav-pad { padding: 0 20px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navScrolled ? "rgba(250,249,247,0.97)" : "rgba(250,249,247,0.88)", backdropFilter: "blur(20px)", borderBottom: navScrolled ? "1px solid #ebe6de" : "1px solid transparent", transition: "all 0.3s", padding: "0 48px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }} className="nav-pad">
        <a href="/" style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: "#1a1208", letterSpacing: "-0.02em" }}>Cucuma<span style={{ color: "#b8862a" }}>®</span></a>

        <div className="nav-links-wrap" style={{ display: "flex", gap: 32 }}>
          {[["How It Works", "#how-it-works"], ["Catalogue", "#catalogue"], ["Pricing", "#pricing"]].map(([label, href]) => (
            <a key={label} href={href} className="nav-link">{label}</a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Currency picker */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowPicker(!showPicker)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff8ed", border: "1px solid #f0d090", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#b8862a", transition: "all 0.15s" }}>
              <span>{C.flag}</span><span>{C.code}</span><span style={{ fontSize: 9, opacity: 0.6 }}>▾</span>
            </button>
            {showPicker && (
              <div className="picker-anim" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "white", border: "1px solid #ebe6de", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", minWidth: 210, overflow: "hidden", zIndex: 200 }}>
                <div style={{ padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#9a8878", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid #ebe6de" }}>Select Currency</div>
                {Object.entries(CURRENCIES).filter(([k]) => k !== "DEFAULT").map(([cc, cur]) => (
                  <div key={cc} className="currency-opt" onClick={() => { setCurrency(cur); setShowPicker(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", background: C.code === cur.code ? "#fff8ed" : "white", transition: "background 0.12s" }}>
                    <span style={{ fontSize: 18 }}>{cur.flag}</span>
                    <div><div style={{ fontSize: 13, fontWeight: 700, color: "#1a1208" }}>{cur.code}</div><div style={{ fontSize: 11, color: "#9a8878" }}>{cur.name}</div></div>
                    {C.code === cur.code && <span style={{ marginLeft: "auto", color: "#b8862a" }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <a href="https://cucuma.vercel.app/dashboard" className="nav-link" style={{ fontSize: 14 }}>Login</a>
          <a href="#install" className="btn-gold" style={{ fontSize: 13, padding: "9px 20px" }}>Get Started →</a>
        </div>
      </nav>
      {showPicker && <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setShowPicker(false)} />}

      {/* ── HERO ── */}
      <section className="hero-pad" style={{ minHeight: "100vh", padding: "120px 48px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", background: "linear-gradient(150deg, #faf9f7 55%, #fff8ed 100%)", position: "relative", overflow: "hidden" }} id="hero">
        {/* Background decoration */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,134,42,0.07) 0%, transparent 70%)", pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", bottom: "5%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,134,42,0.05) 0%, transparent 70%)", pointerEvents: "none" }}></div>

        <div className="hero-text hero-2col">
          {/* Badge */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(20px)", transition: "all 0.6s 0.1s", display: "inline-flex", alignItems: "center", gap: 8, background: "#fff8ed", border: "1px solid #f0d090", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#b8862a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28 }}>
            <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
            Now Live · {C.flag} Pricing in {C.code}
          </div>

          {/* Headline */}
          <h1 style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(30px)", transition: "all 0.7s 0.2s", fontFamily: "'Fraunces', serif", fontSize: "clamp(40px,5vw,72px)", fontWeight: 900, lineHeight: 1.05, color: "#1a1208", letterSpacing: "-0.03em", marginBottom: 24 }}>
            Launch Your<br /><em style={{ color: "#b8862a" }}>Custom Beauty</em><br />Brand Today
          </h1>

          {/* Subtext */}
          <p style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(30px)", transition: "all 0.7s 0.35s", fontSize: 18, color: "#7a6a5a", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
            Design your label, publish to Shopify, and start selling — with zero upfront inventory. We print, pack, and ship every order.
          </p>

          {/* Bullets */}
          <div className="hero-bullets" style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(20px)", transition: "all 0.7s 0.45s", display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
            {["Complete business in a box — design, product, fulfillment", "Start selling in 5 minutes or less", "Keep 100% profits — zero inventory risk"].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#1a1208", fontWeight: 500 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #b8862a, #8a6010)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, flexShrink: 0 }}>✓</div>
                {b}
              </div>
            ))}
          </div>

          {/* Install form */}
          <form onSubmit={handleInstall} id="install" className="hero-form" style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(20px)", transition: "all 0.7s 0.55s", display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <input value={shopInput} onChange={e => setShopInput(e.target.value)} placeholder="yourstore.myshopify.com"
              style={{ flex: 1, minWidth: 220, background: "white", border: "1px solid #ebe6de", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#1a1208", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.2s, box-shadow 0.2s" }}
              onFocus={e => { e.target.style.borderColor = "#b8862a"; e.target.style.boxShadow = "0 0 0 3px rgba(184,134,42,0.12)"; }}
              onBlur={e => { e.target.style.borderColor = "#ebe6de"; e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }} />
            <button type="submit" className="btn-gold">Install App →</button>
          </form>
          <p style={{ opacity: heroVisible ? 0.7 : 0, transition: "opacity 0.7s 0.65s", fontSize: 12, color: "#9a8878" }}>No credit card required · Cancel anytime · {fp(0, C)} upfront inventory</p>
        </div>

        {/* Hero images */}
        <div className="hero-img-wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, height: 560, position: "relative", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateX(40px) scale(0.96)", transition: "all 0.9s 0.3s" }}>
          <div style={{ borderRadius: 20, overflow: "hidden", gridRow: "span 2", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
            <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80" alt="serum" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}>
            <img src="https://images.unsplash.com/photo-1586495777744-4e6232bf4e45?w=400&q=80" alt="lips" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}>
            <img src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80" alt="hair" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {/* Floating badge */}
          <div className="float-badge" style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", background: "white", borderRadius: 16, padding: "14px 22px", boxShadow: "0 20px 60px rgba(0,0,0,0.14)", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #b8862a, #8a6010)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 20 }}>✦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1208" }}>{fp(5087.7, C)} earned</div>
              <div style={{ fontSize: 11, color: "#9a8878" }}>by sellers this month</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SELL ON TICKER ── */}
      <div style={{ background: "#1a1208", padding: "18px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", overflow: "hidden" }}>
          <div className="sell-ticker">
            {["TikTok Shop ✦", "Shopify ✦", "Lazada ✦", "Shopee ✦", "Instagram ✦", "Facebook ✦", "TikTok Shop ✦", "Shopify ✦", "Lazada ✦", "Shopee ✦", "Instagram ✦", "Facebook ✦"].map((p, i) => (
              <span key={i} style={{ fontSize: 14, fontWeight: 700, color: "#6b5a4a", whiteSpace: "nowrap" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section-pad" style={{ padding: "90px 48px", background: "#faf9f7" }} id="how-it-works">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#b8862a", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Simple Process</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, color: "#1a1208", lineHeight: 1.1 }}>
              From Zero to <em style={{ color: "#b8862a" }}>Brand Owner</em><br />in 4 Steps
            </h2>
          </div>
        </Reveal>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {STEPS.map((step, i) => (
            <Reveal key={i} delay={i * 100} direction="up">
              <div className="step-card" style={{ background: "white", border: "1px solid #ebe6de", borderRadius: 18, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", height: "100%" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 56, fontWeight: 900, color: "#f5e8c0", lineHeight: 1, marginBottom: -10 }}>{step.number}</div>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #b8862a, #8a6010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "white", marginBottom: 18, boxShadow: "0 6px 18px rgba(184,134,42,0.3)" }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, color: "#1a1208", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#7a6a5a", lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="section-pad" style={{ padding: "90px 48px", background: "white" }} id="catalogue">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#b8862a", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>18+ Products</div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, color: "#1a1208", lineHeight: 1.1 }}>Premium Products,<br /><em style={{ color: "#b8862a" }}>Your Brand</em></h2>
            </div>
            <a href="#install" className="btn-outline" style={{ fontSize: 14 }}>Browse All →</a>
          </div>
        </Reveal>
        <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 16 }}>
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={i * 80} direction="up">
              <div className="product-card" style={{ background: "#faf9f7", borderRadius: 16, overflow: "hidden", border: "1px solid #ebe6de", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ height: 160, overflow: "hidden" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#b8862a", letterSpacing: "0.06em", marginBottom: 4 }}>{p.category.toUpperCase()}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1208", marginBottom: 5 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: "#1a1208" }}>{fp(p.usdPrice, C)}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section-pad" style={{ padding: "90px 48px", background: "#faf9f7" }} id="pricing">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#b8862a", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Simple Pricing</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, color: "#1a1208", lineHeight: 1.1, marginBottom: 16 }}>
              Plans That Grow<br /><em style={{ color: "#b8862a" }}>With Your Brand</em>
            </h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff8ed", border: "1px solid #f0d090", borderRadius: 100, padding: "6px 16px", marginTop: 8 }}>
              <span style={{ fontSize: 14 }}>{C.flag}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#b8862a" }}>Prices in {C.code} · {C.name}</span>
              <button onClick={() => setShowPicker(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#b8862a", fontWeight: 700, textDecoration: "underline", padding: 0 }}>Change</button>
            </div>
          </div>
        </Reveal>
        <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 960, margin: "0 auto" }}>
          {PLANS.map((plan, i) => (
            <Reveal key={i} delay={i * 120} direction="up">
              <div className="plan-card" style={{ background: plan.dark ? "#1a1208" : "white", border: `2px solid ${plan.popular ? "#d4a84e" : "#ebe6de"}`, borderRadius: 22, padding: "34px 28px", position: "relative", boxShadow: plan.popular ? "0 24px 64px rgba(184,134,42,0.2)" : "0 4px 20px rgba(0,0,0,0.06)", height: "100%" }}>
                {plan.popular && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #b8862a, #8a6010)", color: "white", fontSize: 11, fontWeight: 700, padding: "5px 18px", borderRadius: 100, whiteSpace: "nowrap", letterSpacing: "0.06em" }}>MOST POPULAR</div>}
                <div style={{ fontSize: 13, fontWeight: 700, color: plan.dark ? "#d4a84e" : "#b8862a", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 900, color: plan.dark ? "white" : "#1a1208", lineHeight: 1 }}>
                    {plan.usdPrice ? fp(plan.usdPrice, C) : "Custom"}
                  </span>
                  {plan.period && <span style={{ fontSize: 14, color: plan.dark ? "#7a6a5a" : "#9a8878", marginBottom: 7 }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: 13, color: plan.dark ? "#7a6a5a" : "#7a6a5a", marginBottom: 24 }}>{plan.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: plan.dark ? "#d0c8b8" : "#3a2a1a", fontWeight: 500 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: plan.dark ? "rgba(212,168,78,0.15)" : "#fff8ed", border: `1px solid ${plan.dark ? "#d4a84e50" : "#f0d090"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: plan.dark ? "#d4a84e" : "#b8862a", flexShrink: 0 }}>✓</div>
                      {f}
                    </div>
                  ))}
                </div>
                <a href="#install" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: plan.dark ? "linear-gradient(135deg, #b8862a, #8a6010)" : "transparent", color: plan.dark ? "white" : "#1a1208", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 10, border: plan.dark ? "none" : "2px solid #1a1208", cursor: "pointer", transition: "all 0.2s", boxShadow: plan.dark ? "0 4px 18px rgba(184,134,42,0.35)" : "none" }}>{plan.popular ? "Get Started →" : plan.usdPrice ? "Start Free Trial" : "Contact Us"}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PROFIT ── */}
      <section className="section-pad" style={{ padding: "90px 48px", background: "#1a1208" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#b8862a", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Why Cucuma®</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, color: "white", lineHeight: 1.1 }}>
              2x–3x More Profitable<br /><em style={{ color: "#d4a84e" }}>Than Affiliate Programs</em>
            </h2>
          </div>
        </Reveal>
        <div className="profit-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 760, margin: "0 auto 48px" }}>
          <Reveal direction="left">
            <div style={{ background: "#111010", border: "1px solid #2a2720", borderRadius: 18, padding: "28px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6b5a4a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Others (MLM / Affiliate)</div>
              {[["Sale Price", fp(53.6, C)], ["Commission 30%", "×30%"], ["Your Profit", fp(16.07, C)]].map(([l, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: i < 2 ? "1px solid #2a2720" : "none" }}>
                  <span style={{ fontSize: 13, color: "#6b5a4a" }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i === 2 ? "#f87171" : "#a09080" }}>{v}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal direction="right">
            <div style={{ background: "#1a1208", border: "2px solid #d4a84e", borderRadius: 18, padding: "28px", boxShadow: "0 0 40px rgba(212,168,78,0.12)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#d4a84e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Cucuma® Private Label</div>
              {[["Sale Price", fp(53.6, C)], ["Wholesale Cost", `−${fp(9.82, C)}`], ["Your Profit", fp(43.75, C)]].map(([l, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: i < 2 ? "1px solid #2a2720" : "none" }}>
                  <span style={{ fontSize: 13, color: "#a09080" }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i === 2 ? "#4ade80" : "#e8e0d0" }}>{v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="profit-stats" style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {[[1000, 43750], [10000, 437500], [100000, 4375000]].map(([orders, profit], i) => (
            <Reveal key={i} delay={i * 100} direction="up">
              <div style={{ background: "#111010", border: "1px solid #2a2720", borderRadius: 16, padding: "22px 30px", textAlign: "center", minWidth: 160 }}>
                <div style={{ fontSize: 12, color: "#6b5a4a", fontWeight: 600, marginBottom: 6 }}>{orders.toLocaleString()} orders</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: "#d4a84e" }}>{fp(profit, C)}+</div>
                <div style={{ fontSize: 11, color: "#4b4540", marginTop: 4 }}>your profit</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-pad" style={{ padding: "90px 48px", background: "white" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#b8862a", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Real Sellers</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, color: "#1a1208", lineHeight: 1.1 }}>
              Join Hundreds Making<br /><em style={{ color: "#b8862a" }}>Real Profits</em>
            </h2>
          </div>
        </Reveal>
        <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 960, margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 120} direction="up">
              <div style={{ background: "#faf9f7", border: "1px solid #ebe6de", borderRadius: 18, padding: "28px 24px", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces', serif", flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1208" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#9a8878" }}>{t.handle} · {t.location}</div>
                  </div>
                </div>
                <div style={{ color: "#f59e0b", fontSize: 15, marginBottom: 12, letterSpacing: "0.05em" }}>★★★★★</div>
                <p style={{ fontSize: 13, color: "#5a4a3a", lineHeight: 1.7 }}>"{t.text}"</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad" style={{ padding: "90px 48px", background: "linear-gradient(135deg, #b8862a 0%, #8a6010 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }}></div>
        <Reveal>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,56px)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 20 }}>
            Will You Create the Next<br /><em>Million {C.code === "PHP" ? "Peso" : "Dollar"} Brand?</em>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            Enter your email and we'll send you everything you need to launch your brand today.
          </p>
          {emailSent ? (
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "16px 32px", display: "inline-block", color: "white", fontWeight: 700, fontSize: 15 }}>✓ We'll be in touch soon!</div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setEmailSent(true); }} style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", maxWidth: 500, margin: "0 auto" }}>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="Enter your email address"
                style={{ flex: 1, minWidth: 220, background: "white", border: "none", borderRadius: 10, padding: "13px 18px", fontSize: 14, color: "#1a1208" }} />
              <button type="submit" className="btn-white">Launch My Brand →</button>
            </form>
          )}
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>No credit card required · Cancel anytime · {fp(0, C)} upfront inventory</p>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#111010", padding: "52px 48px 32px", borderTop: "1px solid #2a2720" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 44 }}>
          <Reveal direction="left">
            <div style={{ maxWidth: 280 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "white", marginBottom: 12 }}>Cucuma<span style={{ color: "#d4a84e" }}>®</span></div>
              <p style={{ fontSize: 13, color: "#6b5a4a", lineHeight: 1.7 }}>Launch your private label beauty brand with zero upfront inventory. Design, publish, sell — all in one platform.</p>
            </div>
          </Reveal>
          {[
            { title: "Platform", links: ["How It Works", "Catalogue", "Branding Tools", "Fulfillment"] },
            { title: "Resources", links: ["Getting Started", "Label Templates", "Blog", "Help Center"] },
            { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Shipping Policy", "Refund Policy"] },
          ].map((col, i) => (
            <Reveal key={col.title} delay={i * 80}>
              <div>
                <h4 style={{ fontSize: 10, fontWeight: 700, color: "#6b5a4a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(link => <li key={link}><a href="#" style={{ fontSize: 13, color: "#4b4540", transition: "color 0.2s" }}>{link}</a></li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingTop: 24, borderTop: "1px solid #2a2720" }}>
          <p style={{ fontSize: 12, color: "#4b4540" }}>© 2026 Cucuma®. All Rights Reserved.</p>
          <p style={{ fontSize: 12, color: "#4b4540" }}>Made with ✦ for beauty entrepreneurs worldwide</p>
        </div>
      </footer>
    </>
  );
}