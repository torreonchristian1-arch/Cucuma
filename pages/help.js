import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

const FAQS = [
  {
    category: "Getting Started",
    icon: "⚡",
    questions: [
      { q: "How do I install Cucuma on my Shopify store?", a: "Go to cucuma.vercel.app, enter your Shopify store URL in the install form, and click 'Install App'. You'll be redirected to Shopify to approve the permissions, then automatically brought to your dashboard." },
      { q: "How long does it take to launch my first product?", a: "Most merchants publish their first product within 10 minutes of installing. Just go to Catalogue, pick a product, and click 'Publish to Store'. Your product will be live in your Shopify store instantly." },
      { q: "Do I need any inventory upfront?", a: "No — that's the whole point of Cucuma. You never buy or touch inventory. We only print and ship when a customer places an order. Zero upfront cost." },
      { q: "What Shopify plan do I need?", a: "Any Shopify plan works with Cucuma, including the Basic plan at $29/month. You just need an active Shopify store." },
    ]
  },
  {
    category: "Branding & Products",
    icon: "🎨",
    questions: [
      { q: "Can I use my own logo on the products?", a: "Yes! Go to the Branding page, upload your logo, choose your brand colors, and pick a label style. Your branding will be applied to all products you publish." },
      { q: "Can I set my own prices?", a: "Yes. After publishing a product to your Shopify store, you can edit the price directly in your Shopify admin. We recommend pricing 2-3x above the wholesale cost to maximize profit." },
      { q: "What happens if a product is out of stock?", a: "We'll notify you via email if a product becomes temporarily unavailable. Your Shopify listing will remain active and orders will be queued until stock is replenished." },
      { q: "Can I add my own product descriptions?", a: "Yes. After publishing, go to your Shopify admin and edit the product description, images, and details however you like." },
    ]
  },
  {
    category: "Orders & Fulfillment",
    icon: "📦",
    questions: [
      { q: "How does order fulfillment work?", a: "When a customer buys from your store, the order is automatically routed to us via webhook. We print your label, pack the product, and ship it directly to your customer — usually within 1-3 business days." },
      { q: "How do I track orders?", a: "Go to the Orders page in your Cucuma dashboard. All orders are listed with their fulfillment status. You can also view orders directly in your Shopify admin." },
      { q: "What shipping carriers do you use?", a: "We use a mix of local and international couriers depending on the destination, including J&T Express, LBC, and DHL for international orders." },
      { q: "What if a customer wants a refund?", a: "Handle refunds directly in your Shopify admin. For defective products, contact our support team and we'll replace the item at no cost." },
    ]
  },
  {
    category: "Custom Domain",
    icon: "🌐",
    questions: [
      { q: "Can I use a custom domain for my store?", a: "Yes! This is done through Shopify, not Cucuma. In your Shopify admin go to Settings → Domains → Buy new domain or Connect existing domain. Your domain will work seamlessly with all Cucuma-published products." },
      { q: "How do I connect my own domain to Shopify?", a: "1. Buy a domain (e.g. from GoDaddy or Namecheap)\n2. In Shopify admin → Settings → Domains → Connect existing domain\n3. Add your domain name\n4. Update your DNS records as instructed by Shopify\n5. Wait 24-48 hours for DNS to propagate\nYour store will then be live at your custom domain." },
      { q: "Does Cucuma work with custom Shopify themes?", a: "Yes! Cucuma publishes products directly to your Shopify store. It works with any Shopify theme — Dawn, Debut, or any custom theme you're using." },
    ]
  },
  {
    category: "Billing & Plans",
    icon: "💳",
    questions: [
      { q: "What's included in the free trial?", a: "The free trial gives you full access to all Starter plan features for 14 days. No credit card required. You can publish up to 5 products and process real orders during the trial." },
      { q: "Can I cancel anytime?", a: "Yes. You can cancel your subscription at any time from the Settings page. Your store will continue to work until the end of your billing period." },
      { q: "What happens to my products if I cancel?", a: "Your published products will remain in your Shopify store. However, new orders will not be fulfilled after cancellation. We recommend unpublishing products before cancelling." },
    ]
  },
];

export default function Help() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Getting Started");
  const [search, setSearch] = useState("");

  function toggle(key) {
    setOpenQuestion(openQuestion === key ? null : key);
  }

  // Filter by search
  const filtered = FAQS.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      search === "" ||
      q.q.toLowerCase().includes(search.toLowerCase()) ||
      q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => search === "" ? cat.category === activeCategory : cat.questions.length > 0);

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, overflow: "hidden", transition: "background 0.25s" }}>
      <style>{`
        input { outline: none; }
        @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 500px; } }
        .faq-answer { animation: slideDown 0.25s ease; }
        @media (max-width: 768px) {
          .hdr { padding: 10px 16px 10px 56px !important; flex-wrap: wrap; gap: 8px; }
          .main-pad { padding: 16px !important; padding-top: 60px !important; }
          .help-layout { grid-template-columns: 1fr !important; }
          .cat-sidebar { display: none !important; }
          .hide-sm { display: none !important; }
        }
      `}</style>

      <SideNav active="settings" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header className="hdr" style={{ padding: "14px 28px", background: theme.surface, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", color: theme.textMuted, cursor: "pointer", fontSize: 15 }}>☰</button>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: theme.text }}>Help Center</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>Find answers to common questions</div>
            </div>
          </div>
          <div style={{ position: "relative", width: 240 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: theme.textMuted, fontSize: 14 }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..."
              style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, padding: "8px 14px 8px 30px", color: theme.text, fontSize: 13 }} />
          </div>
        </header>

        <div className="main-pad" style={{ padding: "24px 28px" }}>
          {/* Hero */}
          <div style={{ background: `linear-gradient(135deg, ${theme.gold}, #a07828)`, borderRadius: 18, padding: "32px 36px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }}></div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "white", marginBottom: 8 }}>How can we help you? ✦</div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", maxWidth: 480, lineHeight: 1.6 }}>
              Browse our FAQ below or contact our support team at <strong style={{ color: "white" }}>support@cucuma.com</strong>
            </p>
          </div>

          <div className="help-layout" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
            {/* Category sidebar */}
            <div className="cat-sidebar" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {FAQS.map(cat => (
                <button key={cat.category} onClick={() => { setActiveCategory(cat.category); setSearch(""); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: activeCategory === cat.category && search === "" ? theme.goldBg : "transparent", border: activeCategory === cat.category && search === "" ? `1px solid ${theme.goldBorder}` : "1px solid transparent", color: activeCategory === cat.category && search === "" ? theme.goldText : theme.textSub, fontSize: 13, fontWeight: activeCategory === cat.category ? 700 : 500, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <span style={{ fontSize: 16 }}>{cat.icon}</span>
                  <span>{cat.category}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: theme.textMuted, background: theme.surfaceAlt, borderRadius: 100, padding: "1px 7px" }}>{cat.questions.length}</span>
                </button>
              ))}

              {/* Contact card */}
              <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 16, marginTop: 12, boxShadow: theme.shadow }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 8 }}>Still need help?</div>
                <p style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.5, marginBottom: 12 }}>Our support team responds within 24 hours.</p>
                <a href="mailto:support@cucuma.com" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: `linear-gradient(135deg, ${theme.gold}, #a07828)`, color: "white", borderRadius: 9, padding: "9px 14px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  ✉ Email Support
                </a>
              </div>
            </div>

            {/* FAQ Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(cat => (
                <div key={cat.category}>
                  {search !== "" && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, marginTop: 4 }}>
                      {cat.icon} {cat.category}
                    </div>
                  )}
                  {cat.questions.map((item, i) => {
                    const key = `${cat.category}-${i}`;
                    const isOpen = openQuestion === key;
                    return (
                      <div key={key} style={{ background: theme.surface, border: `1px solid ${isOpen ? theme.goldBorder : theme.border}`, borderRadius: 12, overflow: "hidden", boxShadow: theme.shadow, transition: "border-color 0.2s" }}>
                        <button onClick={() => toggle(key)}
                          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text, lineHeight: 1.4 }}>{item.q}</span>
                          <span style={{ fontSize: 18, color: theme.gold, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                        </button>
                        {isOpen && (
                          <div className="faq-answer" style={{ padding: "0 20px 18px", borderTop: `1px solid ${theme.border}` }}>
                            <p style={{ fontSize: 13, color: theme.textSub, lineHeight: 1.75, paddingTop: 14, whiteSpace: "pre-line" }}>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {filtered.every(c => c.questions.length === 0) && (
                <div style={{ textAlign: "center", padding: "48px 24px", background: theme.surface, borderRadius: 14, border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: theme.text, marginBottom: 6 }}>No results found</div>
                  <p style={{ fontSize: 13, color: theme.textMuted }}>Try a different search or contact support at support@cucuma.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}