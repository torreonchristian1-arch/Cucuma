import Head from "next/head";
import { useState } from "react";

const INSTALL_URL = "https://cucuma.vercel.app/api/auth/install?shop=";

const PRODUCTS = [
  { name: "Rose Glow Serum", category: "Skincare", price: "₱1,290", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80" },
  { name: "Matte Lip Studio Kit", category: "Cosmetics", price: "₱760", img: "https://images.unsplash.com/photo-1586495777744-4e6232bf4e45?w=400&q=80" },
  { name: "Keratin Repair Mask", category: "Haircare", price: "₱2,100", img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80" },
  { name: "Vitamin C Brightener", category: "Skincare", price: "₱1,450", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" },
  { name: "Glow Highlighter Palette", category: "Cosmetics", price: "₱980", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80" },
  { name: "Scalp Revival Serum", category: "Haircare", price: "₱1,890", img: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400&q=80" },
];

const STEPS = [
  { number: "01", title: "Install Cucuma on Shopify", desc: "Connect your Shopify store in one click. No coding required — just install and go.", icon: "⚡" },
  { number: "02", title: "Design Your Brand", desc: "Upload your logo, pick your colors, and choose your label style. Your brand, your rules.", icon: "🎨" },
  { number: "03", title: "Publish to Your Store", desc: "Pick from 18+ premium beauty products and publish them to Shopify in one click.", icon: "🚀" },
  { number: "04", title: "Sell & We Fulfill", desc: "Orders come in, we print your labels and ship directly to your customers. Zero inventory.", icon: "📦" },
];

const PLANS = [
  {
    name: "Starter",
    price: "₱990",
    period: "/month",
    desc: "Perfect for new beauty entrepreneurs",
    color: "#f8f7f5",
    border: "#ebe6de",
    features: ["Up to 5 products published", "Basic label customization", "Order routing & fulfillment", "Email support", "Shopify integration"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    price: "₱2,490",
    period: "/month",
    desc: "For serious beauty brand builders",
    color: "#1a1208",
    border: "#d4a84e",
    features: ["Unlimited products published", "Full brand customization", "Priority fulfillment", "Custom packaging inserts", "Analytics dashboard", "Priority support"],
    cta: "Get Started →",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For established brands scaling fast",
    color: "#f8f7f5",
    border: "#ebe6de",
    features: ["Everything in Growth", "Dedicated account manager", "Custom product formulations", "Bulk pricing discounts", "White-glove onboarding", "SLA guarantee"],
    cta: "Contact Us",
    popular: false,
  },
];

const TESTIMONIALS = [
  { name: "Maria Santos", handle: "@glowwithmaaria", location: "Manila", avatar: "M", text: "I launched my skincare brand in one afternoon. My first order came in 3 days later. Cucuma handles everything — I just post and collect.", stars: 5, revenue: "₱240k/mo" },
  { name: "Jan Reyes", handle: "@jansbeautyco", location: "Cebu", avatar: "J", color: "#2d6a4f", text: "The branding tool is insane. I uploaded my logo, picked my colors, and had a full product line published to Shopify in under 10 minutes.", stars: 5, revenue: "₱180k/mo" },
  { name: "Andrea Cruz", handle: "@andreaglowup", location: "Davao", avatar: "A", color: "#7b1fa2", text: "I was skeptical at first but my haircare line has done ₱180k in sales in 2 months. Zero inventory, zero stress. This is the real deal.", stars: 5, revenue: "₱180k/mo" },
];

export default function Home() {
  const [shopInput, setShopInput] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  function handleInstall(e) {
    e.preventDefault();
    let shop = shopInput.trim();
    if (!shop) return;
    if (!shop.includes(".myshopify.com")) shop = shop + ".myshopify.com";
    window.location.href = INSTALL_URL + shop;
  }

  function handleEmail(e) {
    e.preventDefault();
    setEmailSent(true);
  }

  return (
    <>
      <Head>
        <title>Cucuma® | Launch Your Private Label Beauty Brand</title>
        <meta name="description" content="Launch your custom beauty brand with zero upfront inventory. Design, publish, sell — all in one platform." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { font-family: 'Manrope', sans-serif; background: #faf9f7; color: #1a1208; overflow-x: hidden; }
        input, button { font-family: 'Manrope', sans-serif; }
        input:focus { outline: none; }
        a { text-decoration: none; color: inherit; }

        .nav-link { font-size: 14px; font-weight: 600; color: #5a4a3a; transition: color 0.2s; }
        .nav-link:hover { color: #1a1208; }

        .btn-gold { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #b8862a, #8a6010); color: white; font-weight: 700; font-size: 15px; padding: 13px 28px; border-radius: 10px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 18px rgba(184,134,42,0.35); text-decoration: none; }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(184,134,42,0.45); }
        .btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #1a1208; font-weight: 700; font-size: 15px; padding: 13px 28px; border-radius: 10px; border: 2px solid #1a1208; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-outline:hover { background: #1a1208; color: white; }
        .btn-white { display: inline-flex; align-items: center; gap: 8px; background: white; color: #1a1208; font-weight: 700; font-size: 15px; padding: 13px 28px; border-radius: 10px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 18px rgba(0,0,0,0.15); text-decoration: none; }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }

        .product-card { transition: transform 0.2s, box-shadow 0.2s; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
        .product-card img { transition: transform 0.3s; }
        .product-card:hover img { transform: scale(1.06); }

        .step-card { transition: transform 0.2s; }
        .step-card:hover { transform: translateY(-3px); }

        .plan-card { transition: transform 0.2s, box-shadow 0.2s; }
        .plan-card:hover { transform: translateY(-4px); }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-cta { justify-content: center !important; }
          .hero-img-col { display: none !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .products-grid { grid-template-columns: 1fr 1fr 1fr !important; }
          .plans-grid { grid-template-columns: 1fr !important; max-width: 420px !important; margin: 0 auto; }
          .testimonials-grid { grid-template-columns: 1fr !important; max-width: 480px !important; margin: 0 auto; }
          .profit-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .hero-section { padding: 100px 20px 60px !important; }
          .section { padding: 60px 20px !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .products-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(250,249,247,0.94)", backdropFilter: "blur(16px)", borderBottom: "1px solid #ebe6de", padding: "0 48px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: "#1a1208" }}>Cucuma<span style={{ color: "#b8862a" }}>®</span></a>
        <div className="nav-links" style={{ display: "flex", gap: 32 }}>
          {["How It Works", "Catalogue", "Pricing", "Blog"].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="nav-link">{link}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="https://cucuma.vercel.app/dashboard" className="nav-link" style={{ fontSize: 14 }}>Login</a>
          <a href="#install" className="btn-gold" style={{ fontSize: 13, padding: "9px 20px" }}>Get Started →</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section" style={{ minHeight: "100vh", padding: "120px 48px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", background: "linear-gradient(135deg, #faf9f7 60%, #fff8ed)" }} id="hero">
        <div className="hero-grid">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff8ed", border: "1px solid #f0d090", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#b8862a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28 }}>
            ✦ Now Live in the Philippines
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(40px,5vw,72px)", fontWeight: 900, lineHeight: 1.05, color: "#1a1208", letterSpacing: "-0.03em", marginBottom: 24 }}>
            Launch Your<br /><em style={{ color: "#b8862a" }}>Custom Beauty</em><br />Brand Today
          </h1>
          <p style={{ fontSize: 18, color: "#7a6a5a", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Design your label, publish to Shopify, and start selling — with zero upfront inventory. We print, pack, and ship every order.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
            {["Complete business in a box — design, product, fulfillment", "Start selling in 5 minutes or less", "Keep 100% profits — zero inventory risk"].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#1a1208", fontWeight: 500 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #b8862a, #8a6010)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, flexShrink: 0 }}>✓</div>
                {b}
              </div>
            ))}
          </div>

          {/* Install form */}
          <form onSubmit={handleInstall} id="install" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }} className="hero-cta">
            <input value={shopInput} onChange={e => setShopInput(e.target.value)} placeholder="yourstore.myshopify.com"
              style={{ flex: 1, minWidth: 220, background: "white", border: "1px solid #ebe6de", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#1a1208", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} />
            <button type="submit" className="btn-gold">Install App →</button>
          </form>
          <p style={{ fontSize: 12, color: "#9a8878" }}>No credit card required · Cancel anytime · ₱0 upfront inventory</p>
        </div>

        <div className="hero-img-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, height: 560 }}>
          {[
            { img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", span: "span 2" },
            { img: "https://images.unsplash.com/photo-1586495777744-4e6232bf4e45?w=400&q=80" },
            { img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80" },
          ].map((item, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: "hidden", gridRow: item.span }}>
              <img src={item.img} alt="beauty product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
          {/* Floating badge */}
          <div style={{ position: "absolute", bottom: 40, left: "55%", background: "white", borderRadius: 14, padding: "14px 20px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #b8862a, #8a6010)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18 }}>✦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1208" }}>₱284,910</div>
              <div style={{ fontSize: 11, color: "#9a8878" }}>earned this month</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SELL ON BAR ── */}
      <div style={{ background: "#1a1208", padding: "20px 48px", display: "flex", alignItems: "center", gap: 40, overflowX: "auto" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#6b5a4a", letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Sell On</span>
        {["TikTok Shop", "Shopify", "Lazada", "Shopee", "Instagram", "Facebook"].map(p => (
          <span key={p} style={{ fontSize: 14, fontWeight: 700, color: "#a09080", whiteSpace: "nowrap" }}>{p}</span>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ padding: "80px 48px", background: "#faf9f7" }} id="how-it-works">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b8862a", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Simple Process</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#1a1208", lineHeight: 1.1 }}>
            From Zero to <em style={{ color: "#b8862a" }}>Brand Owner</em><br />in 4 Steps
          </h2>
        </div>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {STEPS.map(step => (
            <div key={step.number} className="step-card" style={{ background: "white", border: "1px solid #ebe6de", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 52, fontWeight: 900, color: "#f0d090", lineHeight: 1, marginBottom: -8 }}>{step.number}</div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #b8862a, #8a6010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "white", marginBottom: 16 }}>{step.icon}</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, color: "#1a1208", marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: "#7a6a5a", lineHeight: 1.65 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="section" style={{ padding: "80px 48px", background: "white" }} id="catalogue">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#b8862a", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>18+ Products</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#1a1208", lineHeight: 1.1 }}>Premium Products,<br /><em style={{ color: "#b8862a" }}>Your Brand</em></h2>
          </div>
          <a href="#install" className="btn-outline" style={{ fontSize: 14 }}>Browse All Products →</a>
        </div>
        <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 16 }}>
          {PRODUCTS.map((p, i) => (
            <div key={i} className="product-card" style={{ background: "#faf9f7", borderRadius: 14, overflow: "hidden", border: "1px solid #ebe6de" }}>
              <div style={{ height: 160, overflow: "hidden" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#b8862a", letterSpacing: "0.06em", marginBottom: 4 }}>{p.category.toUpperCase()}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1208", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: "#1a1208" }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section" style={{ padding: "80px 48px", background: "#faf9f7" }} id="pricing">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b8862a", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Simple Pricing</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#1a1208", lineHeight: 1.1, marginBottom: 16 }}>
            Plans That Grow<br /><em style={{ color: "#b8862a" }}>With Your Brand</em>
          </h2>
          <p style={{ fontSize: 16, color: "#7a6a5a", maxWidth: 480, margin: "0 auto" }}>Start with a free trial. No credit card required. Cancel anytime.</p>
        </div>
        <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 960, margin: "0 auto" }}>
          {PLANS.map((plan, i) => (
            <div key={i} className="plan-card" style={{ background: plan.color, border: `2px solid ${plan.border}`, borderRadius: 20, padding: "32px 28px", position: "relative", boxShadow: plan.popular ? "0 20px 60px rgba(184,134,42,0.2)" : "0 4px 16px rgba(0,0,0,0.06)" }}>
              {plan.popular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #b8862a, #8a6010)", color: "white", fontSize: 11, fontWeight: 700, padding: "5px 18px", borderRadius: 100, whiteSpace: "nowrap", letterSpacing: "0.06em" }}>MOST POPULAR</div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: plan.popular ? "#d4a84e" : "#b8862a", marginBottom: 8 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 900, color: plan.popular ? "white" : "#1a1208", lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: plan.popular ? "#a09080" : "#9a8878", marginBottom: 6 }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 13, color: plan.popular ? "#a09080" : "#7a6a5a", marginBottom: 24, lineHeight: 1.5 }}>{plan.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: plan.popular ? "#e8e0d0" : "#3a2a1a", fontWeight: 500 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: plan.popular ? "rgba(212,168,78,0.2)" : "#fff8ed", border: `1px solid ${plan.popular ? "#d4a84e" : "#f0d090"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: plan.popular ? "#d4a84e" : "#b8862a", flexShrink: 0 }}>✓</div>
                    {f}
                  </div>
                ))}
              </div>
              <a href="#install" className={plan.popular ? "btn-gold" : "btn-outline"} style={{ width: "100%", justifyContent: "center", fontSize: 14 }}>{plan.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROFIT COMPARISON ── */}
      <section className="section" style={{ padding: "80px 48px", background: "#1a1208" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b8862a", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Why Cucuma®</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "white", lineHeight: 1.1 }}>
            2x–3x More Profitable<br /><em style={{ color: "#d4a84e" }}>Than Affiliate Programs</em>
          </h2>
        </div>
        <div className="profit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 760, margin: "0 auto 48px" }}>
          <div style={{ background: "#111010", border: "1px solid #2a2720", borderRadius: 16, padding: "28px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b5a4a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Others (MLM / Affiliate)</div>
            {[["Sale Price", "₱3,000"], ["Your Commission (30%)", "×30%"], ["Your Profit", "₱900"]].map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? "1px solid #2a2720" : "none" }}>
                <span style={{ fontSize: 13, color: "#6b5a4a" }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: i === 2 ? "#f87171" : "#a09080" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#1a1208", border: "2px solid #d4a84e", borderRadius: 16, padding: "28px", boxShadow: "0 0 40px rgba(212,168,78,0.15)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#d4a84e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Cucuma® Private Label</div>
            {[["Sale Price", "₱3,000"], ["Wholesale Cost", "−₱550"], ["Your Profit", "₱2,450"]].map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? "1px solid #2a2720" : "none" }}>
                <span style={{ fontSize: 13, color: "#a09080" }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: i === 2 ? "#4ade80" : "#e8e0d0" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {[["1,000 orders", "₱2M+"], ["10,000 orders", "₱20M+"], ["100,000 orders", "₱200M+"]].map(([orders, profit]) => (
            <div key={orders} style={{ background: "#111010", border: "1px solid #2a2720", borderRadius: 14, padding: "20px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#6b5a4a", fontWeight: 600, marginBottom: 6 }}>{orders}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: "#d4a84e" }}>{profit}</div>
              <div style={{ fontSize: 11, color: "#4b4540", marginTop: 4 }}>your profit</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ padding: "80px 48px", background: "white" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b8862a", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Real Sellers</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#1a1208", lineHeight: 1.1 }}>
            Join Hundreds Making<br /><em style={{ color: "#b8862a" }}>Real Profits</em>
          </h2>
        </div>
        <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 960, margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: "#faf9f7", border: "1px solid #ebe6de", borderRadius: 16, padding: "28px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.color || "linear-gradient(135deg, #b8862a, #8a6010)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces', serif", flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1208" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#9a8878" }}>{t.handle} · {t.location}</div>
                </div>
                <div style={{ marginLeft: "auto", background: "#fff8ed", border: "1px solid #f0d090", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#b8862a", whiteSpace: "nowrap" }}>{t.revenue}</div>
              </div>
              <div style={{ color: "#f59e0b", fontSize: 14, marginBottom: 12 }}>{"★".repeat(t.stars)}</div>
              <p style={{ fontSize: 13, color: "#5a4a3a", lineHeight: 1.65 }}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ padding: "80px 48px", background: "linear-gradient(135deg, #b8862a, #8a6010)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 20 }}>
          Will You Create the Next<br /><em>Million Peso Brand?</em>
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>Enter your email and we'll send you everything you need to launch your brand today.</p>
        {emailSent ? (
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "16px 32px", display: "inline-block", color: "white", fontWeight: 700 }}>✓ We'll be in touch soon!</div>
        ) : (
          <form onSubmit={handleEmail} style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", maxWidth: 500, margin: "0 auto" }}>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="Enter your email address"
              style={{ flex: 1, minWidth: 220, background: "white", border: "none", borderRadius: 10, padding: "13px 18px", fontSize: 14, color: "#1a1208" }} />
            <button type="submit" className="btn-white">Launch My Brand →</button>
          </form>
        )}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>No credit card required · Cancel anytime · ₱0 upfront inventory</p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#111010", padding: "48px 48px 32px", borderTop: "1px solid #2a2720" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "white", marginBottom: 12 }}>Cucuma<span style={{ color: "#d4a84e" }}>®</span></div>
            <p style={{ fontSize: 13, color: "#6b5a4a", lineHeight: 1.7 }}>Launch your private label beauty brand with zero upfront inventory. Design, publish, sell — all in one platform.</p>
          </div>
          {[
            { title: "Platform", links: ["How It Works", "Catalogue", "Branding Tools", "Fulfillment"] },
            { title: "Resources", links: ["Getting Started", "Label Templates", "Blog", "Help Center"] },
            { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Shipping Policy", "Refund Policy"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: "#6b5a4a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(link => <li key={link}><a href="#" style={{ fontSize: 13, color: "#4b4540", transition: "color 0.2s" }}>{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingTop: 24, borderTop: "1px solid #2a2720" }}>
          <p style={{ fontSize: 12, color: "#4b4540" }}>© 2026 Cucuma®. All Rights Reserved.</p>
          <p style={{ fontSize: 12, color: "#4b4540" }}>Made with ✦ for beauty entrepreneurs in the Philippines</p>
        </div>
      </footer>
    </>
  );
}