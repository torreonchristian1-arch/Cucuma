import Head from "next/head";
import { useState, useEffect, useRef } from "react";

const INSTALL_URL = "https://cucuma.vercel.app/api/auth/install?shop=";

// ── Scroll Reveal Hook ────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold, rootMargin: "0px 0px -50px 0px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, y = 36, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : `translateY(${y}px)`, transition: `opacity 0.72s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.72s cubic-bezier(.4,0,.2,1) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────
const PRODUCTS = [
  { name: "Rose Glow Serum", cat: "Skincare", price: "$22.99", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=480&q=85" },
  { name: "Matte Lip Studio", cat: "Cosmetics", price: "$13.59", img: "https://images.unsplash.com/photo-1586495777744-4e6232bf4e45?w=480&q=85" },
  { name: "Keratin Repair Mask", cat: "Haircare", price: "$37.49", img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=480&q=85" },
  { name: "Vitamin C Brightener", cat: "Skincare", price: "$25.99", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=480&q=85" },
  { name: "Glow Highlighter", cat: "Cosmetics", price: "$17.49", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=480&q=85" },
  { name: "Scalp Revival Serum", cat: "Haircare", price: "$33.79", img: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=480&q=85" },
];

const STEPS = [
  { n: "01", title: "Choose Your Products", desc: "Browse 18+ premium private label beauty products — skincare, cosmetics, haircare. All formulated and ready to brand.", img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=85" },
  { n: "02", title: "Design Your Brand", desc: "Upload your logo, choose your colors, and customize your label style. Your brand identity applied instantly to every product.", img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&q=85" },
  { n: "03", title: "Launch & Scale", desc: "Publish to your Shopify store with one click. We print, pack, and ship every order directly to your customers.", img: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=85" },
];

const TESTIMONIALS = [
  { quote: "I launched my skincare brand in one afternoon. First order came 3 days later. Cucuma handles everything — I just post and collect.", name: "Maria Santos", brand: "Glow With Maaria", location: "Manila, PH", initials: "MS" },
  { quote: "The branding tool is honestly insane. I uploaded my logo, picked my colors, and had a full product line on Shopify in under 10 minutes.", name: "Jan Reyes", brand: "Jan's Beauty Co.", location: "Cebu, PH", initials: "JR" },
  { quote: "My haircare line hit $3,200 in sales in the first 2 months. Zero inventory, zero stress. This is genuinely the real deal.", name: "Andrea Cruz", brand: "AndreaGlowUp", location: "Davao, PH", initials: "AC" },
];

const PLANS = [
  { name: "Starter", price: "$17.99", period: "/mo", features: ["Up to 5 products", "Basic label customization", "Order fulfillment", "Email support"], cta: "Start Free Trial", highlight: false },
  { name: "Growth", price: "$44.99", period: "/mo", features: ["Unlimited products", "Full brand customization", "Priority fulfillment", "Custom packaging", "Analytics dashboard", "Priority support"], cta: "Get Started →", highlight: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["Everything in Growth", "Dedicated account manager", "Custom formulations", "Bulk pricing", "White-glove onboarding"], cta: "Contact Us", highlight: false },
];

export default function Home() {
  const [shopInput, setShopInput] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [heroIn, setHeroIn] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setHeroIn(true), 80);
    const fn = () => setNavSolid(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function install(e) {
    e.preventDefault();
    let s = shopInput.trim();
    if (!s) return;
    if (!s.includes(".myshopify.com")) s += ".myshopify.com";
    window.location.href = INSTALL_URL + s;
  }

  const anim = (delay = 0, extra = {}) => ({
    opacity: heroIn ? 1 : 0,
    transform: heroIn ? "none" : "translateY(28px)",
    transition: `opacity 0.7s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.7s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    ...extra,
  });

  return (
    <>
      <Head>
        <title>Cucuma® — Launch Your Private Label Beauty Brand</title>
        <meta name="description" content="Design your label, publish to Shopify, sell with zero inventory. The premium private label beauty platform." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --cream: #FAF7F2;
          --cream-dark: #F2EDE4;
          --olive: #3D5A3E;
          --olive-light: #4E7350;
          --olive-pale: #EDF2ED;
          --gold: #B8860B;
          --gold-light: #F5EDD6;
          --gold-mid: #D4A017;
          --charcoal: #2C2C2C;
          --charcoal-soft: #404040;
          --text: #2C2C2C;
          --text-soft: #6B6355;
          --text-muted: #9A9085;
          --border: #E8E0D4;
          --shadow-sm: 0 2px 12px rgba(44,44,44,0.06);
          --shadow-md: 0 8px 32px rgba(44,44,44,0.1);
          --shadow-lg: 0 20px 60px rgba(44,44,44,0.14);
          --r: 14px;
          --serif: 'Cormorant Garamond', Georgia, serif;
          --sans: 'DM Sans', sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; font-size: 16px; }
        body { font-family: var(--sans); background: var(--cream); color: var(--text); overflow-x: hidden; }
        a { text-decoration: none; color: inherit; }
        img { display: block; }
        button, input { font-family: var(--sans); }
        input:focus { outline: none; }

        /* ── Buttons ── */
        .btn-olive { display: inline-flex; align-items: center; gap: 8px; background: var(--olive); color: white; font-weight: 600; font-size: 15px; padding: 13px 28px; border-radius: 100px; border: none; cursor: pointer; transition: background 0.22s, transform 0.22s, box-shadow 0.22s; box-shadow: 0 4px 20px rgba(61,90,62,0.3); }
        .btn-olive:hover { background: var(--olive-light); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(61,90,62,0.38); }
        .btn-gold { display: inline-flex; align-items: center; gap: 8px; background: var(--gold); color: white; font-weight: 600; font-size: 15px; padding: 13px 28px; border-radius: 100px; border: none; cursor: pointer; transition: all 0.22s; box-shadow: 0 4px 20px rgba(184,134,11,0.3); }
        .btn-gold:hover { background: var(--gold-mid); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(184,134,11,0.42); }
        .btn-outline-dark { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: var(--charcoal); font-weight: 600; font-size: 15px; padding: 12px 26px; border-radius: 100px; border: 2px solid var(--charcoal); cursor: pointer; transition: all 0.22s; }
        .btn-outline-dark:hover { background: var(--charcoal); color: white; transform: translateY(-2px); }
        .btn-outline-olive { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: var(--olive); font-weight: 600; font-size: 15px; padding: 12px 26px; border-radius: 100px; border: 2px solid var(--olive); cursor: pointer; transition: all 0.22s; }
        .btn-outline-olive:hover { background: var(--olive); color: white; }
        .btn-white-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: white; font-weight: 600; font-size: 15px; padding: 13px 28px; border-radius: 100px; border: 2px solid rgba(255,255,255,0.5); cursor: pointer; transition: all 0.22s; }
        .btn-white-outline:hover { background: rgba(255,255,255,0.12); border-color: white; }

        /* ── Nav ── */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; transition: all 0.3s; }
        .nav.solid { background: rgba(250,247,242,0.96); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .nav-logo { font-family: var(--serif); font-size: 24px; font-weight: 700; color: var(--charcoal); letter-spacing: -0.02em; }
        .nav-logo span { color: var(--olive); }
        .nav-links { display: flex; gap: 36px; }
        .nav-link { font-size: 14px; font-weight: 500; color: var(--text-soft); transition: color 0.2s; }
        .nav-link:hover { color: var(--charcoal); }

        /* ── Hero ── */
        .hero { min-height: 100vh; padding: 100px 48px 80px; background: linear-gradient(160deg, var(--cream) 50%, #EEF2E8 100%); position: relative; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .hero::before { content: ''; position: absolute; top: -100px; right: -100px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(61,90,62,0.06) 0%, transparent 65%); pointer-events: none; }
        .hero::after { content: ''; position: absolute; bottom: -80px; left: -60px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(184,134,11,0.05) 0%, transparent 65%); pointer-events: none; }

        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--olive-pale); border: 1px solid rgba(61,90,62,0.2); border-radius: 100px; padding: 7px 18px; font-size: 11px; font-weight: 700; color: var(--olive); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 32px; }
        .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--olive); animation: pulse 1.8s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.35;} }

        .hero-h1 { font-family: var(--serif); font-size: clamp(46px, 5.2vw, 80px); line-height: 1.03; color: var(--charcoal); letter-spacing: -0.025em; margin-bottom: 28px; }
        .hero-h1 .light { font-weight: 300; font-style: italic; color: var(--text-soft); }
        .hero-h1 .bold { font-weight: 700; }
        .hero-h1 .accent { font-weight: 700; color: var(--olive); font-style: italic; }

        .hero-sub { font-size: 18px; line-height: 1.7; color: var(--text-soft); margin-bottom: 36px; max-width: 480px; font-weight: 400; }

        .hero-bullets { display: flex; flex-direction: column; gap: 13px; margin-bottom: 40px; }
        .hero-bullet { display: flex; align-items: center; gap: 12px; font-size: 15px; color: var(--text); font-weight: 500; }
        .hero-bullet-icon { width: 22px; height: 22px; border-radius: 50%; background: var(--olive); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; flex-shrink: 0; }

        .install-form { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
        .install-input { flex: 1; min-width: 220px; background: white; border: 1.5px solid var(--border); border-radius: 100px; padding: 13px 22px; font-size: 14px; color: var(--charcoal); font-weight: 500; transition: border-color 0.2s, box-shadow 0.2s; box-shadow: var(--shadow-sm); }
        .install-input:focus { border-color: var(--olive); box-shadow: 0 0 0 3px rgba(61,90,62,0.1); }
        .install-input::placeholder { color: var(--text-muted); }
        .trust-line { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

        /* ── Hero Images ── */
        .hero-visual { position: relative; height: 580px; }
        .hero-img-main { position: absolute; top: 0; left: 10px; width: 58%; height: 78%; border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-lg); transform: rotate(-1.5deg); }
        .hero-img-main img { width: 100%; height: 100%; object-fit: cover; }
        .hero-img-secondary { position: absolute; top: 15%; right: 0; width: 45%; height: 55%; border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-lg); transform: rotate(2deg); border: 4px solid white; }
        .hero-img-secondary img { width: 100%; height: 100%; object-fit: cover; }
        .hero-img-tertiary { position: absolute; bottom: 0; left: 5%; width: 42%; height: 36%; border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-md); transform: rotate(1deg); border: 3px solid white; }
        .hero-img-tertiary img { width: 100%; height: 100%; object-fit: cover; }

        .hero-float-badge { position: absolute; bottom: 60px; right: -10px; background: white; border-radius: 16px; padding: 14px 20px; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 12px; z-index: 2; animation: float 3.5s ease-in-out infinite; border: 1px solid var(--border); }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-7px);} }
        .hero-float-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--olive); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; flex-shrink: 0; }

        /* ── Social Proof Bar ── */
        .proof-bar { background: var(--charcoal); padding: 36px 48px; }
        .proof-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; max-width: 900px; margin: 0 auto; }
        .proof-item { text-align: center; padding: 0 24px; border-right: 1px solid rgba(255,255,255,0.1); }
        .proof-item:last-child { border-right: none; }
        .proof-number { font-family: var(--serif); font-size: 40px; font-weight: 700; color: white; line-height: 1; margin-bottom: 6px; }
        .proof-label { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500; }

        /* ── Sections ── */
        .section { padding: 100px 48px; }
        .section-label { font-size: 11px; font-weight: 700; color: var(--olive); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 16px; }
        .section-title { font-family: var(--serif); font-size: clamp(32px,4vw,56px); font-weight: 600; color: var(--charcoal); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; }
        .section-title em { font-style: italic; color: var(--olive); }
        .section-sub { font-size: 17px; line-height: 1.7; color: var(--text-soft); max-width: 560px; }

        /* ── Steps ── */
        .steps-wrap { display: flex; flex-direction: column; gap: 0; }
        .step-row { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; padding: 60px 0; border-top: 1px solid var(--border); }
        .step-row:last-child { border-bottom: 1px solid var(--border); }
        .step-num { font-family: var(--serif); font-size: 80px; font-weight: 700; color: var(--gold-light); line-height: 1; margin-bottom: -10px; display: block; }
        .step-badge { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: var(--olive); color: white; font-size: 20px; font-weight: 700; margin-bottom: 20px; font-family: var(--serif); }
        .step-title { font-family: var(--serif); font-size: 30px; font-weight: 600; color: var(--charcoal); margin-bottom: 16px; line-height: 1.2; }
        .step-desc { font-size: 16px; line-height: 1.75; color: var(--text-soft); }
        .step-img { border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-lg); aspect-ratio: 4/3; }
        .step-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .step-img:hover img { transform: scale(1.03); }

        /* ── Products ── */
        .products-bg { background: var(--cream-dark); }
        .products-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .product-card { background: white; border-radius: var(--r); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.25s, box-shadow 0.25s; border: 1px solid var(--border); cursor: pointer; }
        .product-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
        .product-card:hover .product-img img { transform: scale(1.06); }
        .product-img { height: 200px; overflow: hidden; background: var(--cream-dark); }
        .product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
        .product-info { padding: 16px 18px 20px; }
        .product-cat { font-size: 10px; font-weight: 700; color: var(--olive); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px; }
        .product-name { font-family: var(--serif); font-size: 17px; font-weight: 600; color: var(--charcoal); margin-bottom: 6px; }
        .product-price { font-size: 14px; font-weight: 600; color: var(--text-soft); }

        /* ── Value Props ── */
        .values-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
        .value-card { background: white; border-radius: var(--r); padding: 28px 24px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); transition: transform 0.2s, box-shadow 0.2s; }
        .value-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .value-icon { width: 50px; height: 50px; border-radius: 14px; background: var(--olive-pale); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; }
        .value-title { font-family: var(--serif); font-size: 20px; font-weight: 600; color: var(--charcoal); margin-bottom: 10px; }
        .value-desc { font-size: 14px; line-height: 1.7; color: var(--text-soft); }

        /* ── Testimonials ── */
        .testi-bg { background: linear-gradient(160deg, var(--cream) 0%, #EDF2ED 100%); }
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .testi-card { background: white; border-radius: 20px; padding: 32px 28px; box-shadow: var(--shadow-md); border: 1px solid var(--border); position: relative; overflow: hidden; }
        .testi-card::before { content: '\201C'; position: absolute; top: -10px; right: 20px; font-family: var(--serif); font-size: 120px; color: var(--olive-pale); line-height: 1; pointer-events: none; }
        .testi-stars { color: var(--gold); font-size: 14px; letter-spacing: 2px; margin-bottom: 16px; }
        .testi-quote { font-size: 15px; line-height: 1.75; color: var(--text-soft); margin-bottom: 22px; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--olive); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 15px; font-family: var(--serif); flex-shrink: 0; }
        .testi-name { font-size: 14px; font-weight: 700; color: var(--charcoal); }
        .testi-brand { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        /* ── Pricing ── */
        .pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; max-width: 960px; margin: 0 auto; }
        .plan-card { background: white; border-radius: 22px; padding: 36px 30px; border: 2px solid var(--border); box-shadow: var(--shadow-sm); transition: transform 0.25s, box-shadow 0.25s; position: relative; }
        .plan-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .plan-card.highlight { background: var(--olive); border-color: var(--olive); }
        .plan-popular { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--gold); color: white; font-size: 10px; font-weight: 700; padding: 4px 16px; border-radius: 100px; letter-spacing: 0.08em; white-space: nowrap; }
        .plan-name { font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
        .plan-price { font-family: var(--serif); font-size: 46px; font-weight: 700; line-height: 1; margin-bottom: 8px; }
        .plan-desc { font-size: 13px; line-height: 1.5; margin-bottom: 26px; }
        .plan-features { display: flex; flex-direction: column; gap: 11px; margin-bottom: 30px; }
        .plan-feature { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; }
        .plan-check { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }

        /* ── Final CTA ── */
        .cta-section { background: var(--olive); padding: 100px 48px; text-align: center; position: relative; overflow: hidden; }
        .cta-section::before { content: ''; position: absolute; top: -150px; left: 50%; transform: translateX(-50%); width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%); pointer-events: none; }

        /* ── Sell Ticker ── */
        .ticker-wrap { background: #1a1208; padding: 18px 0; overflow: hidden; }
        .ticker { display: flex; gap: 48px; animation: ticker 22s linear infinite; white-space: nowrap; }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* ── Footer ── */
        footer { background: #1E2B1F; padding: 64px 48px 36px; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .footer-logo { font-family: var(--serif); font-size: 26px; font-weight: 700; color: white; margin-bottom: 14px; }
        .footer-logo span { color: var(--gold-light); }
        .footer-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.7; }
        .footer-col-title { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 18px; }
        .footer-links { display: flex; flex-direction: column; gap: 11px; }
        .footer-link { font-size: 13px; color: rgba(255,255,255,0.5); transition: color 0.2s; }
        .footer-link:hover { color: rgba(255,255,255,0.85); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.08); }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.3); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; padding: 100px 36px 60px; }
          .hero-visual { display: none; }
          .products-grid { grid-template-columns: repeat(2,1fr); }
          .values-grid { grid-template-columns: 1fr 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .steps-wrap .step-row { grid-template-columns: 1fr; gap: 32px; padding: 48px 0; }
          .step-row.reverse { direction: ltr; }
        }
        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .nav-links { display: none; }
          .hero { padding: 90px 20px 60px; }
          .section { padding: 64px 20px; }
          .proof-bar { padding: 36px 20px; }
          .proof-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .proof-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 16px 0; }
          .proof-item:nth-child(even) { padding-left: 20px; }
          .testi-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .pricing-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
          .cta-section { padding: 64px 20px; }
          footer { padding: 48px 20px 28px; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .ticker-wrap { padding: 14px 0; }
        }
        @media (max-width: 480px) {
          .install-form { flex-direction: column; }
          .install-input { width: 100%; }
          .products-grid { grid-template-columns: 1fr 1fr; }
          .values-grid { grid-template-columns: 1fr; }
          .proof-grid { grid-template-columns: 1fr 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}} />

      {/* ── NAV ── */}
      <nav className={`nav${navSolid ? " solid" : ""}`}>
        <a href="/" className="nav-logo">Cucuma<span>®</span></a>
        <div className="nav-links">
          {[["How It Works", "#how-it-works"], ["Catalogue", "#catalogue"], ["Pricing", "#pricing"]].map(([l, h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/dashboard" className="nav-link" style={{ fontSize: 14 }}>Login</a>
          <a href="#install" className="btn-olive" style={{ fontSize: 13, padding: "9px 22px" }}>Get Started</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div>
          <div style={anim(0, { display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32 })}>
            <span className="hero-badge">
              <span className="hero-badge-dot"></span>
              Now Live · Private Label Beauty
            </span>
          </div>

          <h1 className="hero-h1" style={anim(120)}>
            <span className="light">Launch Your</span><br />
            <span className="bold">Custom <span className="accent">Beauty</span></span><br />
            <span className="bold">Brand Today</span>
          </h1>

          <p className="hero-sub" style={anim(220)}>
            Design your label, publish to Shopify, and start selling — with zero upfront inventory. We print, pack, and ship every order directly to your customers.
          </p>

          <div className="hero-bullets" style={anim(300)}>
            {["Complete business in a box — design, product, fulfillment", "Start selling in 5 minutes or less", "Keep 100% profits — zero inventory risk"].map(b => (
              <div key={b} className="hero-bullet">
                <span className="hero-bullet-icon">✓</span>
                {b}
              </div>
            ))}
          </div>

          <form onSubmit={install} className="install-form" id="install" style={anim(380)}>
            <input className="install-input" value={shopInput} onChange={e => setShopInput(e.target.value)} placeholder="yourstore.myshopify.com" />
            <button type="submit" className="btn-olive">Install App →</button>
          </form>

          <p className="trust-line" style={anim(440)}>
            No credit card required · Cancel anytime · $0 upfront inventory
          </p>
        </div>

        {/* Editorial Image Collage */}
        <div className="hero-visual" style={anim(180, {})}>
          <div className="hero-img-main">
            <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=85" alt="Rose Glow Serum" />
          </div>
          <div className="hero-img-secondary">
            <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=85" alt="Skincare products" />
          </div>
          <div className="hero-img-tertiary">
            <img src="https://images.unsplash.com/photo-1586495777744-4e6232bf4e45?w=500&q=85" alt="Cosmetics" />
          </div>
          <div className="hero-float-badge">
            <div className="hero-float-icon">✦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--charcoal)" }}>$5,200+ earned</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>by sellers this month</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div style={{ overflow: "hidden" }}>
          <div className="ticker">
            {["TikTok Shop ✦", "Shopify ✦", "Lazada ✦", "Shopee ✦", "Instagram ✦", "Facebook ✦", "TikTok Shop ✦", "Shopify ✦", "Lazada ✦", "Shopee ✦", "Instagram ✦", "Facebook ✦"].map((p, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOCIAL PROOF BAR ── */}
      <div className="proof-bar">
        <Reveal>
          <div className="proof-grid">
            {[["2,400+", "Brands Launched"], ["180,000+", "Orders Shipped"], ["4.9 ★", "Average Rating"], ["$1.2M+", "Earned by Sellers"]].map(([num, label]) => (
              <div key={label} className="proof-item">
                <div className="proof-number">{num}</div>
                <div className="proof-label">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how-it-works" style={{ background: "var(--cream)" }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <div className="section-label">Simple Process</div>
            <h2 className="section-title">From Zero to <em>Brand Owner</em><br />in 3 Simple Steps</h2>
          </div>
        </Reveal>
        <div className="steps-wrap">
          {STEPS.map((step, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className={`step-row${i % 2 === 1 ? " reverse" : ""}`} style={i % 2 === 1 ? { direction: "rtl" } : {}}>
                <div style={{ direction: "ltr" }}>
                  <span className="step-num">{step.n}</span>
                  <div className="step-badge">{i + 1}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
                <div className="step-img" style={{ direction: "ltr" }}>
                  <img src={step.img} alt={step.title} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="section products-bg" id="catalogue">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="section-label">18+ Products</div>
              <h2 className="section-title">Premium Products,<br /><em>Your Brand</em></h2>
            </div>
            <a href="#install" className="btn-outline-olive">Browse All Products →</a>
          </div>
        </Reveal>
        <div className="products-grid">
          {PRODUCTS.map((p, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="product-card">
                <div className="product-img">
                  <img src={p.img} alt={p.name} />
                </div>
                <div className="product-info">
                  <div className="product-cat">{p.cat}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">{p.price} / unit</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="section" style={{ background: "white" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label">Why Cucuma</div>
            <h2 className="section-title">Everything You Need<br /><em>to Build a Real Brand</em></h2>
          </div>
        </Reveal>
        <div className="values-grid">
          {[
            { icon: "🛡️", title: "Zero Inventory Risk", desc: "Never buy stock upfront. We only print and ship when a customer places an order. Pure profit, zero waste." },
            { icon: "✦", title: "Your Brand, Your Rules", desc: "Your logo, colors, and label on every product. Complete brand ownership — no white-label disclaimers." },
            { icon: "🚀", title: "Fast Global Shipping", desc: "We fulfill from our Philippine warehouse with express options. Most orders delivered in 3-5 business days." },
            { icon: "💰", title: "100% Profits Yours", desc: "You set your prices. Pay only the wholesale cost per unit. Every peso above that is pure margin." },
          ].map((v, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testi-bg">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label">Real Sellers</div>
            <h2 className="section-title">Join Hundreds Making<br /><em>Real Profits</em></h2>
          </div>
        </Reveal>
        <div className="testi-grid" style={{ maxWidth: 1000, margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="testi-card">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.initials}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-brand">{t.brand} · {t.location}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section" style={{ background: "var(--cream-dark)" }} id="pricing">
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label">Simple Pricing</div>
            <h2 className="section-title">Plans That Grow<br /><em>With Your Brand</em></h2>
            <p style={{ fontSize: 16, color: "var(--text-soft)", marginTop: 12 }}>Start free. No credit card required.</p>
          </div>
        </Reveal>
        <div className="pricing-grid">
          {PLANS.map((plan, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className={`plan-card${plan.highlight ? " highlight" : ""}`}>
                {plan.highlight && <div className="plan-popular">MOST POPULAR</div>}
                <div className="plan-name" style={{ color: plan.highlight ? "rgba(255,255,255,0.6)" : "var(--olive)" }}>{plan.name}</div>
                <div className="plan-price" style={{ color: plan.highlight ? "white" : "var(--charcoal)" }}>
                  {plan.price}<span style={{ fontSize: 16, fontWeight: 400, opacity: 0.6 }}>{plan.period}</span>
                </div>
                <p className="plan-desc" style={{ color: plan.highlight ? "rgba(255,255,255,0.6)" : "var(--text-soft)" }}>{plan.desc}</p>
                <div className="plan-features">
                  {plan.features.map(f => (
                    <div key={f} className="plan-feature" style={{ color: plan.highlight ? "rgba(255,255,255,0.85)" : "var(--text)" }}>
                      <div className="plan-check" style={{ background: plan.highlight ? "rgba(255,255,255,0.15)" : "var(--olive-pale)", color: plan.highlight ? "white" : "var(--olive)" }}>✓</div>
                      {f}
                    </div>
                  ))}
                </div>
                <a href="#install" className={plan.highlight ? "btn-gold" : "btn-outline-dark"} style={{ width: "100%", justifyContent: "center", fontSize: 14 }}>{plan.cta}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta-section">
        <Reveal>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 20 }}>Ready to Launch?</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px,5vw,64px)", fontWeight: 600, color: "white", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" }}>
              Will You Build the Next<br /><em style={{ fontStyle: "italic" }}>Million Dollar Brand?</em>
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", marginBottom: 40, lineHeight: 1.7 }}>
              Enter your Shopify store URL and install Cucuma in seconds.
            </p>
            {emailSent ? (
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "18px 32px", color: "white", fontWeight: 600, fontSize: 15, display: "inline-block" }}>✓ We'll be in touch soon!</div>
            ) : (
              <form onSubmit={install} style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", maxWidth: 520, margin: "0 auto 20px" }}>
                <input value={shopInput} onChange={e => setShopInput(e.target.value)} placeholder="yourstore.myshopify.com" className="install-input" style={{ flex: 1, minWidth: 220, borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.95)" }} />
                <button type="submit" className="btn-gold">Install App →</button>
              </form>
            )}
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 16 }}>No credit card required · Cancel anytime · $0 upfront inventory</p>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">Cucuma<span>®</span></div>
            <p className="footer-desc">Launch your private label beauty brand with zero upfront inventory. Design, publish, sell — all in one platform.</p>
          </div>
          {[
            { title: "Platform", links: ["How It Works", "Catalogue", "Branding Tools", "Fulfillment", "Pricing"] },
            { title: "Resources", links: ["Getting Started", "Label Templates", "Help Center", "Blog"] },
            { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Shipping Policy", "Refund Policy"] },
          ].map(col => (
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <div className="footer-links">
                {col.links.map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Cucuma®. All Rights Reserved.</span>
          <span className="footer-copy">Made with ✦ for beauty entrepreneurs worldwide</span>
        </div>
      </footer>
    </>
  );
}