import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  }

  return (
    <>
      <Head>
        <title>Cucuma® | Launch Your Private Label Beauty Brand</title>
        <meta name="description" content="Launch your custom beauty brand with zero upfront inventory. Design, publish, sell — all in one platform." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style global jsx>{`
        :root {
          --cream: #faf6f0;
          --warm-white: #fff9f4;
          --black: #0e0c0a;
          --brown: #3d2b1a;
          --gold: #c9963a;
          --gold-light: #e8c97a;
          --rose: #d4748a;
          --sage: #7a9e7e;
          --text: #2a1f14;
          --muted: #8a7060;
          --border: #e8ddd0;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Outfit', sans-serif;
          background: var(--cream);
          color: var(--text);
          overflow-x: hidden;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-fade-up { animation: fadeUp 0.8s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }
        .hero-visual-wrap { animation: float 6s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--cream); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      `}</style>

      <div style={{ background: "var(--cream)", minHeight: "100vh" }}>

        {/* ── NAV ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px", height: 72,
          background: "rgba(250,246,240,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #e8ddd0",
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#0e0c0a", letterSpacing: "-0.02em" }}>
            Cucuma<span style={{ color: "#c9963a" }}>®</span>
          </div>
          <ul style={{ display: "flex", gap: 36, listStyle: "none" }}>
            {[["#how-it-works", "How It Works"], ["#catalogue", "Catalogue"], ["#features", "Features"], ["#pricing", "Pricing"]].map(([href, label]) => (
              <li key={href}><a href={href} style={{ fontSize: 14, fontWeight: 500, color: "#8a7060", textDecoration: "none" }}>{label}</a></li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/dashboard" style={{ fontSize: 14, fontWeight: 500, color: "#2a1f14", textDecoration: "none", padding: "8px 20px", border: "1px solid #e8ddd0", borderRadius: 100 }}>Login</a>
            <a href="/dashboard" style={{ fontSize: 14, fontWeight: 600, color: "#0e0c0a", textDecoration: "none", padding: "10px 24px", background: "#c9963a", borderRadius: 100, display: "flex", alignItems: "center", gap: 8 }}>Launch for ₱1 →</a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ 
          padding: "120px 48px 80px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60,
          alignItems: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(201,150,58,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div>
            <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,150,58,0.12)", border: "1px solid rgba(201,150,58,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 600, color: "#8a6020", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28 }}>
              ✦ Private Label Beauty Platform
            </div>
            <h1 className="animate-fade-up delay-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 5vw, 68px)", fontWeight: 900, lineHeight: 1.05, color: "#0e0c0a", letterSpacing: "-0.03em", marginBottom: 24 }}>
              Launch Your <em style={{ fontStyle: "italic", color: "#c9963a" }}>Custom</em> Beauty Brand
            </h1>
            <p className="animate-fade-up delay-2" style={{ fontSize: 18, color: "#8a7060", lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              Complete business in a box — design, product, fulfillment, and your own Shopify store. Start selling in 5 minutes with ₱0 upfront inventory.
            </p>
            <div className="animate-fade-up delay-2" style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 44 }}>
              {["Complete business in a box — design, product, fulfillment, store", "Start selling in 5 minutes or less", "Keep 100% profits + 100% equity", "Never buy or touch inventory"].map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "#2a1f14", fontWeight: 500 }}>
                  <span style={{ color: "#c9963a", fontSize: 10 }}>◆</span> {b}
                </div>
              ))}
            </div>
            <div className="animate-fade-up delay-3" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <a href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 700, color: "#0e0c0a", textDecoration: "none", padding: "18px 40px", background: "#c9963a", borderRadius: 100 }}>Get Started Now →</a>
              <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 600, color: "#0e0c0a", textDecoration: "none", padding: "18px 40px", background: "transparent", border: "2px solid #0e0c0a", borderRadius: 100 }}>See How It Works</a>
            </div>
            <p className="animate-fade-up delay-4" style={{ fontSize: 12, color: "#8a7060", marginTop: 16 }}>After our modest wholesale costs and membership fee</p>
          </div>

          <div className="hero-visual-wrap" style={{ position: "relative", height: 520 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, height: "100%" }}>
              <div style={{ gridRow: "span 2", background: "linear-gradient(135deg, #e8d8c8, #d4c0a8)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, color: "#3d2b1a", opacity: 0.25 }}>✦</div>
              <div style={{ background: "linear-gradient(135deg, #d4c4b0, #c0a888)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: "#3d2b1a", opacity: 0.25 }}>◈</div>
              <div style={{ background: "linear-gradient(135deg, #c8d8c8, #a8c0a8)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: "#1a3a1a", opacity: 0.25 }}>◉</div>
            </div>
            <div style={{ position: "absolute", bottom: -20, left: 24, background: "white", borderRadius: 14, padding: "14px 20px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #c9963a, #a07020)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18 }}>✦</div>
              <div>
                <strong style={{ display: "block", fontWeight: 700, color: "#0e0c0a", fontSize: 13 }}>500+ Products</strong>
                <span style={{ color: "#8a7060", fontSize: 11 }}>Ready to publish</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SELL ON ── */}
        <div style={{ background: "#0e0c0a", padding: "28px 48px", display: "flex", alignItems: "center", gap: 40, overflowX: "auto" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6b6560", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Sell On</span>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["TikTok Shop", "Instagram", "Shopify", "In Person", "Lazada", "Shopee"].map(p => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#a09080", whiteSpace: "nowrap" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c9963a" }} /> {p}
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ padding: "100px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c9963a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Simple Process</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.1, color: "#0e0c0a", letterSpacing: "-0.02em", marginBottom: 20 }}>
              Go from Label Design to <em style={{ color: "#c9963a" }}>Ready-to-Sell</em> in 5 Minutes
            </h2>
            <p style={{ fontSize: 17, color: "#8a7060", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>No experience needed. No inventory. No risk. Just your brand, your products, your profits.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { num: "01", icon: "🎨", title: "Design Your Brand", desc: "Upload your logo, choose your colors, and customize your label. Our live preview shows exactly how your product will look — instantly." },
              { num: "02", icon: "📦", title: "Publish to Your Store", desc: "Choose from 500+ private label products across Skincare, Cosmetics, and Haircare. One click publishes directly to your Shopify store." },
              { num: "03", icon: "💰", title: "Sell & Keep Profits", desc: "Promote on your channels. We print, pack, and ship every order directly to your customers. You never touch a thing — and keep all profits." },
            ].map(step => (
              <div key={step.num}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 80, fontWeight: 900, color: "rgba(201,150,58,0.08)", lineHeight: 1, marginBottom: -20 }}>{step.num}</div>
                <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #c9963a, #a07020)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: "#8a7060", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section id="catalogue" style={{ background: "#fff9f4", padding: "100px 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#c9963a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Product Catalogue</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.1, color: "#0e0c0a" }}>
                Freshly Launched, <em style={{ color: "#c9963a" }}>Just for You</em>
              </h2>
            </div>
            <Link href="/catalogue" style={{ fontSize: 14, fontWeight: 600, color: "#0e0c0a", textDecoration: "none", padding: "12px 28px", background: "transparent", border: "2px solid #0e0c0a", borderRadius: 100 }}>View All Products →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { cat: "Skincare", name: "Rose Glow Serum", desc: "Vitamin C + Niacinamide brightening serum. Lightweight, fast-absorbing formula.", price: "₱1,290", moq: 50, badge: "Bestseller", badgeBg: "#c9963a", icon: "✦", bg: "linear-gradient(135deg, #e8d8c8, #d4c0a8)" },
              { cat: "Haircare", name: "Keratin Repair Mask", desc: "Deep conditioning treatment that restores strength and shine to damaged hair.", price: "₱2,100", moq: 20, badge: "New", badgeBg: "#4ade80", badgeColor: "#0d1a0d", icon: "◈", bg: "linear-gradient(135deg, #d4e4d4, #b8ccb8)" },
              { cat: "Cosmetics", name: "Matte Lip Studio Kit", desc: "12-shade transfer-proof matte lip collection. Long-wearing formula.", price: "₱760", moq: 30, badge: "Popular", badgeBg: "#c084fc", badgeColor: "#1a0814", icon: "◉", bg: "linear-gradient(135deg, #e4d4e4, #ccb8cc)" },
            ].map(p => (
              <div key={p.name} style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #e8ddd0", transition: "all 0.3s" }}>
                <div style={{ height: 200, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, color: "#3d2b1a", opacity: 0.3, position: "relative" }}>
                  {p.icon}
                  <div style={{ position: "absolute", top: 16, right: 16, background: p.badgeBg, color: p.badgeColor || "#0e0c0a", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>{p.badge}</div>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#c9963a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{p.cat}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "#8a7060", lineHeight: 1.6, marginBottom: 20 }}>{p.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>{p.price}</div>
                      <div style={{ fontSize: 11, color: "#8a7060" }}>MOQ: {p.moq} units</div>
                    </div>
                    <Link href="/catalogue" style={{ background: "#0e0c0a", color: "white", textDecoration: "none", borderRadius: 100, padding: "8px 20px", fontSize: 13, fontWeight: 600 }}>+ Add to Store</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding: "100px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#c9963a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Everything You Need</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.1, color: "#0e0c0a", marginBottom: 20 }}>
                Ready to Launch <em style={{ color: "#c9963a" }}>Your Brand?</em>
              </h2>
              <p style={{ fontSize: 17, color: "#8a7060", lineHeight: 1.7, marginBottom: 40 }}>We've got everything covered so you can focus on selling.</p>
              <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 700, color: "#0e0c0a", textDecoration: "none", padding: "18px 40px", background: "#c9963a", borderRadius: 100 }}>Get Started Now →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { icon: "🏷️", title: "Custom Labels", desc: "Personalized labels that capture your brand. Direct-to-bottle printing, full bleed." },
                { icon: "📸", title: "3D Renders", desc: "Photorealistic product renders generated automatically from your label design." },
                { icon: "🌐", title: "Shopify Store", desc: "One-click publish to your Shopify store. Products, photos, descriptions — done." },
                { icon: "🚚", title: "Fulfillment", desc: "We print, pack, and ship every order. You never touch inventory — ever." },
              ].map(f => (
                <div key={f.title} style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid #e8ddd0" }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#8a7060", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROFIT ── */}
        <section id="pricing" style={{ background: "#0e0c0a", padding: "100px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c9963a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Why Cucuma®</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.1, color: "white", letterSpacing: "-0.02em", marginBottom: 20 }}>
              2x–3x More Profitable Than <em style={{ color: "#c9963a" }}>Affiliate Programs</em>
            </h2>
            <p style={{ fontSize: 17, color: "#8a8076", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>And it's YOUR company — you're the boss.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
            <div style={{ background: "#1a1612", border: "1px solid #2a2620", borderRadius: 20, padding: 36 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6560", marginBottom: 24 }}>Others (Affiliate / MLM)</div>
              {[["Sale Price", "₱3,000", "white"], ["Commission (30%)", "×30%", "white"], ["Your Profit", "₱900", "#f87171"]].map(([label, val, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 14, color: "#8a8076" }}>{label}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(135deg, rgba(201,150,58,0.15), rgba(201,150,58,0.05))", border: "1px solid rgba(201,150,58,0.3)", borderRadius: 20, padding: 36 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9963a", marginBottom: 24 }}>Cucuma® Private Label</div>
              {[["Sale Price", "₱3,000", "#c9963a"], ["Wholesale Cost", "−₱550", "white"], ["Your Profit", "₱2,450", "#4ade80"]].map(([label, val, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 14, color: "#8a8076" }}>{label}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[["1,000 orders", "₱2M+"], ["10,000 orders", "₱20M+"], ["100,000 orders", "₱200M+"]].map(([orders, profit]) => (
              <div key={orders} style={{ background: "#1a1612", border: "1px solid #2a2620", borderRadius: 16, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#6b6560", marginBottom: 8 }}>{orders}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: "#c9963a", marginBottom: 4 }}>{profit}</div>
                <div style={{ fontSize: 12, color: "#4b4540" }}>your profit</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ padding: "100px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c9963a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Real Sellers</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.1, color: "#0e0c0a" }}>
              Join Hundreds Making <em style={{ color: "#c9963a" }}>Real Profits</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { initial: "M", name: "Maria Santos", handle: "@glowwithmaaria · Manila", text: "I launched my skincare brand in one afternoon. My first order came in 3 days later. Cucuma handles everything — I just post and collect.", bg: "linear-gradient(135deg, #c9963a, #a07020)" },
              { initial: "J", name: "Jan Reyes", handle: "@jansbeautyco · Cebu", text: "The branding tool is insane. I uploaded my logo, picked my colors, and had a full product line published to Shopify in under 10 minutes.", bg: "linear-gradient(135deg, #7a9e7e, #4a7a4e)" },
              { initial: "A", name: "Andrea Cruz", handle: "@andreaglowup · Davao", text: "I was skeptical but my haircare line has done ₱180k in sales in 2 months. Zero inventory, zero stress. This is the real deal.", bg: "linear-gradient(135deg, #c084fc, #7b1fa2)" },
            ].map(t => (
              <div key={t.name} style={{ background: "white", borderRadius: 20, padding: 32, border: "1px solid #e8ddd0" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: t.bg, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "white" }}>{t.initial}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#8a7060", marginBottom: 16 }}>{t.handle}</div>
                <div style={{ color: "#c9963a", fontSize: 14, letterSpacing: 2, marginBottom: 12 }}>★★★★★</div>
                <div style={{ fontSize: 15, color: "#2a1f14", lineHeight: 1.7, fontStyle: "italic" }}>"{t.text}"</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: "linear-gradient(135deg, #1a0e04 0%, #2d1a08 50%, #1a0e04 100%)", padding: "120px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "radial-gradient(ellipse at center, rgba(201,150,58,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
          <p style={{ fontSize: 12, fontWeight: 700, color: "#c9963a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, position: "relative" }}>Get Started Today</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.1, color: "white", maxWidth: 600, margin: "0 auto 20px", position: "relative" }}>
            Will You Create the Next <em style={{ color: "#c9963a" }}>Million Peso Brand?</em>
          </h2>
          <p style={{ fontSize: 17, color: "#8a8076", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 48px", position: "relative" }}>Enter your email and we'll send you everything you need to launch your brand today.</p>
          {submitted ? (
            <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid #4ade80", borderRadius: 100, padding: "16px 40px", color: "#4ade80", fontSize: 16, fontWeight: 600, display: "inline-block", position: "relative" }}>✓ You're on the list! We'll be in touch soon.</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto 20px", position: "relative" }}>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter your email address" required
                style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "16px 24px", color: "white", fontSize: 15, outline: "none", fontFamily: "'Outfit', sans-serif" }} />
              <button type="submit" style={{ background: "#c9963a", color: "#0e0c0a", border: "none", borderRadius: 100, padding: "16px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Outfit', sans-serif" }}>Launch My Brand →</button>
            </form>
          )}
          <p style={{ fontSize: 12, color: "#4b4540", position: "relative" }}>No credit card required · Cancel anytime · ₱0 upfront inventory</p>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "#0e0c0a", color: "white", padding: "60px 48px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Cucuma<span style={{ color: "#c9963a" }}>®</span></div>
              <p style={{ fontSize: 14, color: "#6b6560", lineHeight: 1.7, maxWidth: 280 }}>Launch your private label beauty brand with zero upfront inventory. Design, publish, sell — all in one platform.</p>
            </div>
            {[
              { title: "Platform", links: [["#how-it-works", "How It Works"], ["#catalogue", "Catalogue"], ["/branding", "Branding Tools"], ["/dashboard", "Dashboard"]] },
              { title: "Resources", links: [["#", "Getting Started"], ["#", "Label Templates"], ["#", "Blog"], ["#", "Help Center"]] },
              { title: "Legal", links: [["#", "Terms of Service"], ["#", "Privacy Policy"], ["#", "Shipping Policy"], ["#", "Refund Policy"]] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4b4540", marginBottom: 20 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(([href, label]) => (
                    <li key={label}><a href={href} style={{ fontSize: 14, color: "#8a8076", textDecoration: "none" }}>{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1a1612", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "#4b4540" }}>© 2026 Cucuma®. All Rights Reserved.</p>
            <p style={{ fontSize: 13, color: "#4b4540" }}>Made with ✦ for beauty entrepreneurs in the Philippines</p>
          </div>
        </footer>

      </div>
    </>
  );
}
