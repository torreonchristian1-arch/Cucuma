import Head from "next/head";
import { useState, useEffect, useRef } from "react";

const INSTALL_URL = "https://cucuma.vercel.app/api/auth/install?shop=";

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(32px)", transition: `opacity 0.7s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.7s cubic-bezier(.4,0,.2,1) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

const PRODUCTS = [
  { name: "Rose Glow Serum", cat: "Skincare", price: "$22.99", img: "https://ecqkxtxxmtwxhwydcevq.supabase.co/storage/v1/object/public/branding-assets/pszvvMNBTJaVnDojdiQkpw@2k.webp" },
  { name: "Matte Lip Studio", cat: "Cosmetics", price: "$13.59", img: "https://ecqkxtxxmtwxhwydcevq.supabase.co/storage/v1/object/public/branding-assets/rsdlZycFSbOXD4UeesaTtg@2k%20(1).webp" },
  { name: "Keratin Repair Mask", cat: "Haircare", price: "$37.49", img: "https://ecqkxtxxmtwxhwydcevq.supabase.co/storage/v1/object/public/branding-assets/iLEtWdoIRoq0erfniMRspg@2k.webp" },
  { name: "Vitamin C Brightener", cat: "Skincare", price: "$25.99", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80" },
  { name: "Glow Highlighter", cat: "Cosmetics", price: "$17.49", img: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80" },
  { name: "Scalp Revival Serum", cat: "Haircare", price: "$33.79", img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80" },
];

const STEPS = [
  { n: "01", title: "Choose Your Products", desc: "Browse 18+ luxury beauty products — skincare, cosmetics, haircare. All reverse-engineered luxury formulas, ready to brand as your own.", img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=85" },
  { n: "02", title: "Design Your Label", desc: "Upload your logo, choose your colors, pick your label style. Our automatic label rendering system applies your brand instantly — no Photoshop, no designers needed.", img: "https://images.unsplash.com/photo-1561069934-eee225952461?w=600&q=85" },
  { n: "03", title: "Sell & We Ship", desc: "Publish to Shopify with one click. When a customer orders, we print your label, pack, and ship the product directly to them. You never touch a thing.", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=85" },
];

const TESTIMONIALS = [
  { quote: "I launched my skincare brand in one afternoon. First order came 3 days later. Cucuma handles everything — I just post and collect.", name: "Maria Santos", brand: "Glow With Maaria", location: "Manila, PH", initials: "MS" },
  { quote: "The branding tool is honestly insane. I uploaded my logo, picked colors, and had a full product line on Shopify in under 10 minutes.", name: "Jan Reyes", brand: "Jan's Beauty Co.", location: "Cebu, PH", initials: "JR" },
  { quote: "My haircare line hit $3,200 in sales in the first 2 months. Zero inventory, zero stress. This is genuinely the real deal.", name: "Andrea Cruz", brand: "AndreaGlowUp", location: "Davao, PH", initials: "AC" },
];

const PLANS = [
  { name: "Starter", price: "$17.99", period: "/mo", features: ["Up to 5 products", "Basic label customization", "Order fulfillment", "Email support"], cta: "Start Free Trial", highlight: false },
  { name: "Growth", price: "$44.99", period: "/mo", features: ["Unlimited products", "Full brand customization", "Priority fulfillment", "Custom packaging", "Analytics", "Priority support"], cta: "Get Started →", highlight: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["Everything in Growth", "Dedicated account manager", "Custom formulations", "Bulk pricing", "White-glove onboarding"], cta: "Contact Us", highlight: false },
];

const CSS = `
  :root{--cream:#FAF7F2;--cream-d:#F2EDE4;--olive:#3D5A3E;--olive-l:#4E7350;--olive-p:#EDF2ED;--gold:#B8860B;--gold-l:#F5EDD6;--gold-m:#D4A017;--charcoal:#2C2C2C;--text-s:#6B6355;--text-m:#9A9085;--border:#E8E0D4;--shadow:0 2px 12px rgba(44,44,44,0.06);--shadow-md:0 8px 32px rgba(44,44,44,0.1);--shadow-lg:0 20px 60px rgba(44,44,44,0.14);--r:14px;--serif:'Cormorant Garamond',Georgia,serif;--sans:'DM Sans',sans-serif;}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;}
  body{font-family:var(--sans);background:var(--cream);color:var(--charcoal);overflow-x:hidden;}
  a{text-decoration:none;color:inherit;}img{display:block;}
  button,input{font-family:var(--sans);}input:focus{outline:none;}

  .btn-olive{display:inline-flex;align-items:center;gap:8px;background:var(--olive);color:white;font-weight:600;font-size:15px;padding:13px 28px;border-radius:100px;border:none;cursor:pointer;transition:all 0.22s;box-shadow:0 4px 20px rgba(61,90,62,0.3);}
  .btn-olive:hover{background:var(--olive-l);transform:translateY(-2px);box-shadow:0 8px 32px rgba(61,90,62,0.38);}
  .btn-outline-d{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--charcoal);font-weight:600;font-size:15px;padding:12px 26px;border-radius:100px;border:2px solid var(--charcoal);cursor:pointer;transition:all 0.22s;}
  .btn-outline-d:hover{background:var(--charcoal);color:white;transform:translateY(-2px);}
  .btn-outline-o{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--olive);font-weight:600;font-size:15px;padding:12px 26px;border-radius:100px;border:2px solid var(--olive);cursor:pointer;transition:all 0.22s;}
  .btn-outline-o:hover{background:var(--olive);color:white;}
  .btn-gold{display:inline-flex;align-items:center;gap:8px;background:var(--gold);color:white;font-weight:600;font-size:15px;padding:13px 28px;border-radius:100px;border:none;cursor:pointer;transition:all 0.22s;box-shadow:0 4px 20px rgba(184,134,11,0.3);}
  .btn-gold:hover{background:var(--gold-m);transform:translateY(-2px);}
  .btn-white{display:inline-flex;align-items:center;gap:8px;background:white;color:var(--charcoal);font-weight:600;font-size:15px;padding:13px 28px;border-radius:100px;border:none;cursor:pointer;transition:all 0.22s;box-shadow:0 4px 18px rgba(0,0,0,0.15);}
  .btn-white:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.25);}

  nav.main-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 48px;transition:all 0.3s;}
  nav.main-nav.solid{background:rgba(250,247,242,0.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);box-shadow:var(--shadow);}
  .nav-logo{font-family:var(--serif);font-size:24px;font-weight:700;color:var(--charcoal);letter-spacing:-0.02em;}
  .nav-logo span{color:var(--olive);}
  .nav-links{display:flex;gap:36px;}
  .nav-link{font-size:14px;font-weight:500;color:var(--text-s);transition:color 0.2s;}
  .nav-link:hover{color:var(--charcoal);}

  .hero{min-height:100vh;padding:100px 48px 80px;background:linear-gradient(160deg,var(--cream) 50%,#EEF2E8 100%);display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;top:-100px;right:-100px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(61,90,62,0.06) 0%,transparent 65%);pointer-events:none;}
  .hero-badge{display:inline-flex;align-items:center;gap:8px;background:var(--olive-p);border:1px solid rgba(61,90,62,0.2);border-radius:100px;padding:7px 18px;font-size:11px;font-weight:700;color:var(--olive);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:32px;}
  .hero-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--olive);animation:ldpulse 1.8s ease-in-out infinite;}
  @keyframes ldpulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
  .hero-h1{font-family:var(--serif);font-size:clamp(46px,5.2vw,80px);line-height:1.03;color:var(--charcoal);letter-spacing:-0.025em;margin-bottom:28px;}
  .hero-h1 .light{font-weight:300;font-style:italic;color:var(--text-s);}
  .hero-h1 .bold{font-weight:700;}
  .hero-h1 .accent{font-weight:700;color:var(--olive);font-style:italic;}
  .hero-sub{font-size:18px;line-height:1.7;color:var(--text-s);margin-bottom:36px;max-width:480px;}
  .hero-bullets{display:flex;flex-direction:column;gap:13px;margin-bottom:40px;}
  .hero-bullet{display:flex;align-items:center;gap:12px;font-size:15px;color:var(--charcoal);font-weight:500;}
  .hero-check{width:22px;height:22px;border-radius:50%;background:var(--olive);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;flex-shrink:0;}
  .install-form{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;}
  .install-input{flex:1;min-width:220px;background:white;border:1.5px solid var(--border);border-radius:100px;padding:13px 22px;font-size:14px;color:var(--charcoal);font-weight:500;transition:border-color 0.2s,box-shadow 0.2s;box-shadow:var(--shadow);}
  .install-input:focus{border-color:var(--olive);box-shadow:0 0 0 3px rgba(61,90,62,0.1);}
  .install-input::placeholder{color:var(--text-m);}
  .trust-line{font-size:12px;color:var(--text-m);}

  .hero-visual{position:relative;height:580px;}
  .hero-img-a{position:absolute;top:0;left:10px;width:58%;height:78%;border-radius:20px;overflow:hidden;box-shadow:var(--shadow-lg);transform:rotate(-1.5deg);}
  .hero-img-b{position:absolute;top:15%;right:0;width:45%;height:55%;border-radius:16px;overflow:hidden;box-shadow:var(--shadow-lg);transform:rotate(2deg);border:4px solid white;}
  .hero-img-c{position:absolute;bottom:0;left:5%;width:42%;height:36%;border-radius:16px;overflow:hidden;box-shadow:var(--shadow-md);transform:rotate(1deg);border:3px solid white;}
  .hero-img-a img,.hero-img-b img,.hero-img-c img{width:100%;height:100%;object-fit:cover;}
  .hero-float{position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);background:white;border-radius:16px;padding:14px 22px;box-shadow:var(--shadow-lg);display:flex;align-items:center;gap:14px;white-space:nowrap;border:1px solid var(--border);animation:ldfloat 3.5s ease-in-out infinite;}
  @keyframes ldfloat{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-7px);}}
  .hero-float-icon{width:42px;height:42px;border-radius:12px;background:var(--olive);display:flex;align-items:center;justify-content:center;color:white;font-size:20px;flex-shrink:0;}

  .ticker-wrap{background:#1a1208;padding:18px 0;overflow:hidden;}
  .ticker{display:flex;gap:48px;animation:ldticker 22s linear infinite;white-space:nowrap;}
  @keyframes ldticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}

  .proof-bar{background:var(--charcoal);padding:36px 48px;}
  .proof-grid{display:grid;grid-template-columns:repeat(4,1fr);max-width:900px;margin:0 auto;}
  .proof-item{text-align:center;padding:0 24px;border-right:1px solid rgba(255,255,255,0.1);}
  .proof-item:last-child{border-right:none;}
  .proof-num{font-family:var(--serif);font-size:40px;font-weight:700;color:white;line-height:1;margin-bottom:6px;}
  .proof-lbl{font-size:13px;color:rgba(255,255,255,0.5);font-weight:500;}

  .section{padding:100px 48px;}
  .section-lbl{font-size:11px;font-weight:700;color:var(--olive);letter-spacing:0.16em;text-transform:uppercase;margin-bottom:16px;}
  .section-title{font-family:var(--serif);font-size:clamp(32px,4vw,56px);font-weight:600;color:var(--charcoal);line-height:1.1;letter-spacing:-0.02em;margin-bottom:20px;}
  .section-title em{font-style:italic;color:var(--olive);}

  .steps-wrap{display:flex;flex-direction:column;}
  .step-row{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;padding:60px 0;border-top:1px solid var(--border);}
  .step-row:last-child{border-bottom:1px solid var(--border);}
  .step-num{font-family:var(--serif);font-size:80px;font-weight:700;color:#F5E8C0;line-height:1;margin-bottom:-10px;display:block;}
  .step-badge{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:var(--olive);color:white;font-size:20px;font-weight:700;margin-bottom:20px;font-family:var(--serif);}
  .step-title{font-family:var(--serif);font-size:30px;font-weight:600;color:var(--charcoal);margin-bottom:16px;line-height:1.2;}
  .step-desc{font-size:16px;line-height:1.75;color:var(--text-s);}
  .step-img{border-radius:20px;overflow:hidden;box-shadow:var(--shadow-lg);aspect-ratio:4/3;transition:box-shadow 0.3s;}
  .step-img:hover{box-shadow:0 28px 72px rgba(44,44,44,0.18);}
  .step-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s;}
  .step-img:hover img{transform:scale(1.03);}

  .pgrid-6{display:grid;grid-template-columns:repeat(6,1fr);gap:16px;}
  .pcard{background:white;border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--border);transition:transform 0.25s,box-shadow 0.25s;cursor:pointer;}
  .pcard:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg);}
  .pcard:hover .pcard-img img{transform:scale(1.06);}
  .pcard-img{height:160px;overflow:hidden;background:var(--cream-d);}
  .pcard-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.35s;}
  .pcard-info{padding:12px 14px;}
  .pcard-cat{font-size:10px;font-weight:700;color:var(--olive);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;}
  .pcard-name{font-family:var(--serif);font-size:16px;font-weight:600;color:var(--charcoal);margin-bottom:4px;}
  .pcard-price{font-size:14px;font-weight:600;color:var(--text-s);}

  .values-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
  .value-card{background:white;border-radius:var(--r);padding:28px 24px;border:1px solid var(--border);box-shadow:var(--shadow);transition:transform 0.2s,box-shadow 0.2s;}
  .value-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);}
  .value-icon{width:50px;height:50px;border-radius:14px;background:var(--olive-p);display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:18px;}
  .value-title{font-family:var(--serif);font-size:20px;font-weight:600;color:var(--charcoal);margin-bottom:10px;}
  .value-desc{font-size:14px;line-height:1.7;color:var(--text-s);}

  .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1000px;margin:0 auto;}
  .testi-card{background:white;border-radius:20px;padding:32px 28px;box-shadow:var(--shadow-md);border:1px solid var(--border);position:relative;overflow:hidden;}
  .testi-card::before{content:open-quote;position:absolute;top:-10px;right:20px;font-family:var(--serif);font-size:120px;color:var(--olive-p);line-height:1;pointer-events:none;quotes:'"' '"';}
  .testi-stars{color:var(--gold);font-size:14px;letter-spacing:2px;margin-bottom:16px;}
  .testi-quote{font-size:15px;line-height:1.75;color:var(--text-s);margin-bottom:22px;font-style:italic;}
  .testi-name{font-size:14px;font-weight:700;color:var(--charcoal);}
  .testi-brand{font-size:12px;color:var(--text-m);margin-top:2px;}

  .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:960px;margin:0 auto;}
  .plan-card{background:white;border-radius:22px;padding:36px 30px;border:2px solid var(--border);box-shadow:var(--shadow);transition:transform 0.25s,box-shadow 0.25s;position:relative;}
  .plan-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);}
  .plan-card.hl{background:var(--olive);border-color:var(--olive);}
  .plan-pop{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--gold);color:white;font-size:10px;font-weight:700;padding:5px 18px;border-radius:100px;white-space:nowrap;letter-spacing:0.08em;}
  .plan-name{font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;}
  .plan-price{font-family:var(--serif);font-size:46px;font-weight:700;line-height:1;margin-bottom:8px;}
  .plan-desc{font-size:13px;line-height:1.5;margin-bottom:26px;}
  .plan-features{display:flex;flex-direction:column;gap:11px;margin-bottom:30px;}
  .plan-feat{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:500;}
  .plan-check{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;}

  .cta-section{background:var(--olive);padding:100px 48px;text-align:center;position:relative;overflow:hidden;}
  .cta-section::before{content:'';position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 65%);pointer-events:none;}

  footer{background:#1E2B1F;padding:64px 48px 36px;}
  .footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px;}
  .footer-logo{font-family:var(--serif);font-size:26px;font-weight:700;color:white;margin-bottom:14px;}
  .footer-logo span{color:#F5EDD6;}
  .footer-desc{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;}
  .footer-col-title{font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:18px;}
  .footer-links{display:flex;flex-direction:column;gap:11px;}
  .footer-link{font-size:13px;color:rgba(255,255,255,0.5);transition:color 0.2s;}
  .footer-link:hover{color:rgba(255,255,255,0.85);}
  .footer-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);}
  .footer-copy{font-size:12px;color:rgba(255,255,255,0.3);}

  @media(max-width:1024px){.hero{grid-template-columns:1fr;padding:100px 36px 60px;}.hero-visual{display:none;}.pgrid-6{grid-template-columns:repeat(3,1fr);}.values-grid{grid-template-columns:1fr 1fr;}.footer-grid{grid-template-columns:1fr 1fr;}.step-row{grid-template-columns:1fr;gap:32px;padding:48px 0;}}
  @media(max-width:768px){nav.main-nav{padding:0 20px;}.nav-links{display:none;}.hero{padding:90px 20px 60px;}.section{padding:64px 20px;}.proof-bar{padding:36px 20px;}.proof-grid{grid-template-columns:1fr 1fr;}.proof-item{border-right:none;border-bottom:1px solid rgba(255,255,255,0.1);padding:16px 0;}.testi-grid{grid-template-columns:1fr;max-width:480px;}.pricing-grid{grid-template-columns:1fr;max-width:400px;}.cta-section{padding:64px 20px;}footer{padding:48px 20px 28px;}.footer-grid{grid-template-columns:1fr 1fr;gap:32px;}}
  @media(max-width:480px){.install-form{flex-direction:column;}.install-input{width:100%;}.pgrid-6{grid-template-columns:1fr 1fr;}.values-grid{grid-template-columns:1fr;}.footer-grid{grid-template-columns:1fr;}}
`;

export default function Home() {
  const [shopInput, setShopInput] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [heroIn, setHeroIn] = useState(false);

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

  const a = (delay = 0) => ({ opacity: heroIn ? 1 : 0, transform: heroIn ? "none" : "translateY(28px)", transition: `opacity 0.7s cubic-bezier(.4,0,.2,1) ${delay}ms, transform 0.7s cubic-bezier(.4,0,.2,1) ${delay}ms` });

  return (
    <>
      <Head>
        <title>Cucuma® — Private Label Beauty for Shopify | Automatic Label Rendering, Zero Inventory</title>
        <meta name="description" content="Launch your luxury private label beauty brand on Shopify in minutes. Automatic label rendering, automated fulfillment, zero inventory. Built for influencers, DTC sellers & entrepreneurs." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      {/* NAV */}
      <nav className={`main-nav${navSolid ? " solid" : ""}`}>
        <a href="/" className="nav-logo">Cucuma<span>®</span></a>
        <div className="nav-links">
          {[["How It Works", "#how"], ["Catalogue", "#catalogue"], ["Pricing", "#pricing"]].map(([l, h]) => <a key={l} href={h} className="nav-link">{l}</a>)}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/dashboard" className="nav-link" style={{ fontSize: 14 }}>Login</a>
          <a href="#install" className="btn-olive" style={{ fontSize: 13, padding: "9px 22px" }}>Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div>
          <div style={{ ...a(0), display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <span className="hero-badge"><span className="hero-badge-dot"></span>Private Label Beauty · Built for Shopify Merchants</span>
          </div>
          <h1 className="hero-h1" style={a(120)}>
            <span className="light">Launch Your</span><br />
            <span className="bold">Custom <span className="accent">Beauty</span></span><br />
            <span className="bold">Brand Today</span>
          </h1>
          <p className="hero-sub" style={a(220)}>Automatic label rendering — no Photoshop needed. We print, pack, and ship luxury beauty products directly to your customers. Zero inventory. Launch in minutes.</p>
          <div className="hero-bullets" style={a(300)}>
            {["Automatic label rendering system — no Photoshop needed", "Automated fulfillment — we print, pack & ship to your customer", "Zero inventory — launch your private label brand in minutes"].map(b => (
              <div key={b} className="hero-bullet"><span className="hero-check">✓</span>{b}</div>
            ))}
          </div>
          <form onSubmit={install} className="install-form" id="install" style={a(380)}>
            <input className="install-input" value={shopInput} onChange={e => setShopInput(e.target.value)} placeholder="yourstore.myshopify.com" />
            <button type="submit" className="btn-olive">Install App →</button>
          </form>
          <p className="trust-line" style={a(440)}>No credit card required · Cancel anytime · $0 upfront inventory</p>
        </div>
        <div className="hero-visual" style={a(200)}>
          <div className="hero-img-a"><img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=85" alt="Skincare" /></div>
          <div className="hero-img-b"><img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=85" alt="Beauty" /></div>
          <div className="hero-img-c"><img src="https://images.unsplash.com/photo-1586495777744-4e6232bf4e45?w=500&q=85" alt="Cosmetics" /></div>
          <div className="hero-float">
            <div className="hero-float-icon">✦</div>
            <div><div style={{ fontWeight: 700, fontSize: 14, color: "#2C2C2C" }}>$5,200+ earned</div><div style={{ fontSize: 11, color: "#9A9085", marginTop: 2 }}>by sellers this month</div></div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div style={{ overflow: "hidden" }}>
          <div className="ticker">
            {["Influencers ✦", "DTC Sellers ✦", "MLM Escapees ✦", "Entrepreneurs ✦", "Beauty Brands ✦", "Shopify Stores ✦", "Influencers ✦", "DTC Sellers ✦", "MLM Escapees ✦", "Entrepreneurs ✦", "Beauty Brands ✦", "Shopify Stores ✦"].map((p, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* PROOF */}
      <div className="proof-bar">
        <Reveal>
          <div className="proof-grid">
            {[["2,400+", "Brands Launched"], ["180,000+", "Orders Shipped"], ["4.9 ★", "Average Rating"], ["$1.2M+", "Earned by Sellers"]].map(([num, lbl]) => (
              <div key={lbl} className="proof-item"><div className="proof-num">{num}</div><div className="proof-lbl">{lbl}</div></div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how" style={{ background: "var(--cream)" }}>
        <Reveal><div style={{ marginBottom: 60 }}><div className="section-lbl">Simple Process</div><h2 className="section-title">From Zero to <em>Brand Owner</em><br />in 3 Steps</h2></div></Reveal>
        <div className="steps-wrap">
          {STEPS.map((step, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="step-row" style={i % 2 === 1 ? { direction: "rtl" } : {}}>
                <div style={{ direction: "ltr" }}>
                  <span className="step-num">{step.n}</span>
                  <div className="step-badge">{i + 1}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
                <div className="step-img" style={{ direction: "ltr" }}><img src={step.img} alt={step.title} loading="lazy" /></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section" id="catalogue" style={{ background: "var(--cream-d)" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
            <div><div className="section-lbl">18+ Products</div><h2 className="section-title">Premium Products,<br /><em>Your Brand</em></h2></div>
            <a href="#install" className="btn-outline-o" style={{ fontSize: 14 }}>Browse All →</a>
          </div>
        </Reveal>
        <div className="pgrid-6">
          {PRODUCTS.map((p, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="pcard">
                <div className="pcard-img"><img src={p.img} alt={p.name} loading="lazy" /></div>
                <div className="pcard-info">
                  <div className="pcard-cat">{p.cat}</div>
                  <div className="pcard-name">{p.name}</div>
                  <div className="pcard-price">{p.price} / unit</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="section" style={{ background: "white" }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 56 }}><div className="section-lbl">Why Cucuma</div><h2 className="section-title">Complete Beauty Brand<br /><em>for Real Entrepreneurs</em></h2></div></Reveal>
        <div className="values-grid">
          {[
            { icon: "🏷️", title: "Automatic Label Rendering", desc: "No Photoshop needed. Upload your logo, choose colors, and our system renders your custom label on every product automatically." },
            { icon: "📦", title: "Automated Fulfillment", desc: "We print, pack, and ship luxury beauty products directly to your customer. You never touch inventory — not a single box." },
            { icon: "🚀", title: "Zero Inventory Required", desc: "Launch your private label skincare brand in minutes with $0 upfront. Products are only created when a customer orders." },
            { icon: "💄", title: "Built for Influencers & Entrepreneurs", desc: "Perfect for influencers, DTC sellers, MLM escapees, and beauty entrepreneurs ready to build a real brand that's 100% theirs." },
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

      {/* TESTIMONIALS */}
      <section className="section" style={{ background: "linear-gradient(160deg,var(--cream) 0%,#EDF2ED 100%)" }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}><div className="section-lbl">Real Sellers</div><h2 className="section-title">Join Hundreds Making<br /><em>Real Profits</em></h2></div></Reveal>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="testi-card">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-quote">"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--olive)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{t.initials}</div>
                  <div><div className="testi-name">{t.name}</div><div className="testi-brand">{t.brand} · {t.location}</div></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing" style={{ background: "var(--cream-d)" }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}><div className="section-lbl">Simple Pricing</div><h2 className="section-title">Plans That Grow<br /><em>With Your Brand</em></h2><p style={{ fontSize: 16, color: "var(--text-s)", marginTop: 12 }}>Start free. No credit card required.</p></div></Reveal>
        <div className="pricing-grid">
          {PLANS.map((plan, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className={`plan-card${plan.highlight ? " hl" : ""}`}>
                {plan.highlight && <div className="plan-pop">MOST POPULAR</div>}
                <div className="plan-name" style={{ color: plan.highlight ? "rgba(255,255,255,0.6)" : "var(--olive)" }}>{plan.name}</div>
                <div className="plan-price" style={{ color: plan.highlight ? "white" : "var(--charcoal)" }}>{plan.price}<span style={{ fontSize: 16, fontWeight: 400, opacity: 0.6 }}>{plan.period}</span></div>
                <p className="plan-desc" style={{ color: plan.highlight ? "rgba(255,255,255,0.65)" : "var(--text-s)" }}>{plan.desc || "—"}</p>
                <div className="plan-features">
                  {plan.features.map(f => (
                    <div key={f} className="plan-feat" style={{ color: plan.highlight ? "rgba(255,255,255,0.85)" : "var(--charcoal)" }}>
                      <div className="plan-check" style={{ background: plan.highlight ? "rgba(255,255,255,0.15)" : "var(--olive-p)", color: plan.highlight ? "white" : "var(--olive)" }}>✓</div>
                      {f}
                    </div>
                  ))}
                </div>
                <a href="#install" className={plan.highlight ? "btn-gold" : "btn-outline-d"} style={{ width: "100%", justifyContent: "center", fontSize: 14 }}>{plan.cta}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <Reveal>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 20 }}>Ready to Launch?</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px,5vw,64px)", fontWeight: 600, color: "white", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" }}>
              Will You Build the Next<br /><em>Million Dollar Brand?</em>
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", marginBottom: 40, lineHeight: 1.7 }}>Enter your Shopify store URL to install Cucuma in seconds.</p>
            {emailSent ? (
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "18px 32px", color: "white", fontWeight: 600, display: "inline-block" }}>✓ We'll be in touch soon!</div>
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

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">Cucuma<span>®</span></div>
            <p className="footer-desc">Launch your private label beauty brand with zero upfront inventory. Design, publish, sell — all in one platform.</p>
          </div>
          {[{ title: "Platform", links: [["How It Works", "#how"], ["Catalogue", "#catalogue"], ["Pricing", "#pricing"]] }, { title: "Resources", links: [["Getting Started", "#install"], ["Help Center", "/help"], ["Blog", "#"]] }, { title: "Legal", links: [["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"], ["Shipping Policy", "/terms"], ["Refund Policy", "/terms"]] }].map(col => (
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <div className="footer-links">{col.links.map(([l, href]) => <a key={l} href={href} className="footer-link">{l}</a>)}</div>
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