import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { PageHeader } from "../components/Layout";
import { useTheme } from "./_app";

const FAQS = [
  {
    cat: "Getting Started",
    items: [
      { q: "What exactly is Cucuma?", a: "Cucuma is a private label beauty app for Shopify merchants. You pick products from our catalogue, apply your own brand name and logo, set your own prices, and sell them in your Shopify store. When a customer orders, we print your label on the product and ship it directly to them. You never touch inventory." },
      { q: "Do I need to buy inventory upfront?", a: "No. This is print-on-demand. We only produce and ship a product after your customer places an order. You pay the wholesale cost, keep the rest as profit." },
      { q: "How fast can I launch my beauty brand?", a: "Most merchants launch within minutes. Install the app, upload your logo, pick your products, and publish to your Shopify store. That's it." },
      { q: "Do I need any beauty industry experience?", a: "No experience needed. Our products are already formulated and ready to sell. You focus on branding and marketing — we handle everything else." },
      { q: "Who manufactures the products?", a: "All Cucuma products are manufactured by our partner facilities with strict quality controls. Every formula is dermatologist-tested and cruelty-free." },
    ]
  },
  {
    cat: "Products & Pricing",
    items: [
      { q: "What products can I sell?", a: "Cucuma offers 18+ private label beauty products across Skincare, Cosmetics, and Haircare categories — including serums, moisturizers, lip kits, hair masks, and more. New products are added regularly." },
      { q: "How do I price my products?", a: "You set your own retail prices in Shopify. The prices shown in Cucuma are wholesale costs — what you pay per unit. We recommend pricing 2-3x above wholesale to maximize profit margins." },
      { q: "What is the minimum order quantity?", a: "There is no minimum order. Each product is printed and shipped individually as customers order — true print-on-demand with no MOQ requirements." },
      { q: "Can I sell the same products as other merchants?", a: "Yes, but your branding makes them unique. Since every merchant uses their own logo, colors, and label design, the same base product becomes an entirely different brand in your store." },
      { q: "Can I customize the product formulas?", a: "Standard plans use our existing formulas. Enterprise merchants can request custom formulations. Contact support@cucuma.com for details." },
    ]
  },
  {
    cat: "Branding & Labels",
    items: [
      { q: "How do I apply my brand to the products?", a: "Go to the Branding page in your dashboard. Upload your logo, choose your brand colors, enter your brand name, and select a label style. Your branding is applied to every product you publish." },
      { q: "What label styles are available?", a: "We offer 4 label styles: Modern, Classic, Minimal, and Bold. Each gives your products a different visual identity — from clean and minimalist to rich and editorial." },
      { q: "Will my customers know the products come from Cucuma?", a: "No. Products ship with your brand name and label. Cucuma works silently in the background — your customers only see your brand." },
      { q: "Can I use my own label design?", a: "Yes. Upload a custom label image in the Branding page. Your design will be applied directly to the product before shipping." },
    ]
  },
  {
    cat: "Orders & Fulfillment",
    items: [
      { q: "How does fulfillment work?", a: "When a customer places an order in your Shopify store, it's automatically routed to Cucuma. We print your label, pack the product, and ship it directly to your customer. You never touch the product." },
      { q: "How long does shipping take?", a: "Standard processing is 1-3 business days. Shipping time varies by destination — typically 3-7 days domestically. International shipping is available." },
      { q: "How do I track orders?", a: "All orders are visible in the Orders section of your Cucuma dashboard with real-time fulfillment status. Tracking information is also synced back to your Shopify store automatically." },
      { q: "What happens if a product arrives damaged?", a: "Contact us at support@cucuma.com with a photo of the damaged item. We'll send a replacement at no charge." },
      { q: "Can I offer refunds to my customers?", a: "Refund policies are yours to set in your Shopify store. For product defects or errors on our side, we cover the cost of replacement." },
    ]
  },
  {
    cat: "Billing & Plans",
    items: [
      { q: "How much does Cucuma cost?", a: "Cucuma has a Starter plan at $17.99/month and a Growth plan at $44.99/month. All plans include a 14-day free trial — no credit card required to start." },
      { q: "How is billing handled?", a: "All subscription payments are processed through Shopify's native billing system — the same secure system used across thousands of Shopify apps." },
      { q: "When do I pay for products?", a: "You pay the wholesale cost per product only when a customer places an order. There are no upfront product costs." },
      { q: "Can I cancel anytime?", a: "Yes. Cancel your subscription anytime from your Shopify admin under Apps → Cucuma. You keep access until the end of your billing period." },
    ]
  },
  {
    cat: "Technical & Shopify",
    items: [
      { q: "Does Cucuma work with my existing Shopify theme?", a: "Yes. Cucuma publishes products directly to your Shopify store and works with any theme — Dawn, Debut, Impulse, or custom themes." },
      { q: "Will published products appear in my Shopify admin?", a: "Yes. Once you publish a product from the Cucuma catalogue, it appears immediately in your Shopify admin under Products. You can edit the title, description, and price there." },
      { q: "Can I use Cucuma with multiple Shopify stores?", a: "Each Cucuma subscription covers one Shopify store. Contact us for multi-store pricing options." },
      { q: "What Shopify plan do I need?", a: "Cucuma works with all Shopify plans including Basic ($29/month). You just need an active Shopify store." },
    ]
  },
];

export default function Help() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme: T } = useTheme();
  const [open, setOpen] = useState(true);
  const [openQ, setOpenQ] = useState(null);
  const [activeCat, setActiveCat] = useState("Getting Started");
  const [search, setSearch] = useState("");

  const filtered = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase()))
  })).filter(cat => search ? cat.items.length > 0 : cat.cat === activeCat);

  const totalFAQs = FAQS.reduce((s, c) => s + c.items.length, 0);

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bgBase, overflow: "hidden" }}>
      <style>{`
        input { outline: none; }
        @keyframes expand { from { opacity:0; max-height:0; } to { opacity:1; max-height:600px; } }
        .faq-ans { animation: expand 0.22s ease; overflow: hidden; }
        .cat-btn { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:500; transition:all 0.15s; width:100%; text-align:left; border:none; font-family:'DM Sans',sans-serif; background:none; }
        .cat-btn:hover { background:${T.bgElevated}; color:${T.textPrimary}; }
        .cat-btn.active { background:${T.oliveSubtle}; color:${T.olive}; }
        .faq-btn { width:100%; display:flex; align-items:center; justify-content:space-between; padding:15px 18px; background:none; border:none; cursor:pointer; text-align:left; gap:12px; font-family:'DM Sans',sans-serif; }
        .faq-item { background:${T.bgCard}; border:1px solid ${T.borderSubtle}; border-radius:10px; margin-bottom:8px; overflow:hidden; transition:border-color 0.15s; box-shadow:${T.shadow}; }
        .faq-item.fopen { border-color:${T.oliveBorder}; }
        .faq-item:hover { border-color:${T.borderDefault}; }
        @media(max-width:768px) { .hdr { padding:10px 16px 10px 52px!important; } .mpad { padding:16px!important; } .hlayout { grid-template-columns:1fr!important; } .cat-list { display:none!important; } .hide-mobile { display:none!important; } }
      `}</style>

      <SideNav active="help" shop={shop} open={open} />
      <main style={{ flex: 1, overflow: "auto" }}>
        <PageHeader
          title="Help Center"
          subtitle={`${totalFAQs} answers to common questions`}
          onMenuToggle={() => setOpen(!open)}
          actions={
            <div style={{ position: "relative" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..."
                style={{ background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"7px 12px 7px 30px", color:T.textPrimary, fontSize:13, width:220 }} />
            </div>
          }
        />

        <div className="mpad" style={{ padding: "18px 24px" }}>
          {/* Header */}
          <div style={{ background:`linear-gradient(135deg, ${T.olive} 0%, #2a4a2b 100%)`, borderRadius:14, padding:"28px 32px", marginBottom:24, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-30, right:-30, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}></div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:"white", marginBottom:8 }}>How can we help you?</div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.6, marginBottom:16, maxWidth:500 }}>Find answers about publishing products, fulfillment, branding, and growing your beauty brand with Cucuma.</p>
            <a href="mailto:support@cucuma.com" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:600, color:"white", textDecoration:"none" }}>
              ✉ Email Support → support@cucuma.com
            </a>
          </div>

          <div className="hlayout" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
            {/* Categories */}
            <div className="cat-list">
              <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0 12px 8px" }}>Topics</div>
              {FAQS.map(cat => (
                <button key={cat.cat} className={`cat-btn${activeCat === cat.cat && !search ? " active" : ""}`}
                  onClick={() => { setActiveCat(cat.cat); setSearch(""); }}
                  style={{ color: activeCat === cat.cat && !search ? T.olive : T.textSecondary }}>
                  <span>{cat.cat}</span>
                  <span style={{ marginLeft:"auto", fontSize:11, color:T.textTertiary, background:T.bgSurface, borderRadius:100, padding:"1px 7px" }}>{cat.items.length}</span>
                </button>
              ))}
              <div style={{ height:1, background:T.borderSubtle, margin:"12px 0" }}></div>
              {/* Contact card */}
              <div style={{ background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:10, padding:14 }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.textPrimary, marginBottom:6 }}>Still need help?</div>
                <p style={{ fontSize:11, color:T.textTertiary, lineHeight:1.5, marginBottom:10 }}>Our team responds within 24 hours.</p>
                <a href="mailto:support@cucuma.com" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:T.olive, color:"white", borderRadius:8, padding:"8px 12px", fontSize:11, fontWeight:700, textDecoration:"none" }}>
                  ✉ Email Support
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div>
              {filtered.length === 0 || filtered.every(c => c.items.length === 0) ? (
                <div style={{ textAlign:"center", padding:"48px 24px", background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:10 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:T.textPrimary, marginBottom:6 }}>No results found</div>
                  <p style={{ fontSize:13, color:T.textTertiary }}>Try a different search or <a href="mailto:support@cucuma.com" style={{ color:T.olive }}>contact support</a></p>
                </div>
              ) : filtered.map(cat => (
                <div key={cat.cat}>
                  {search && <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:10, marginTop:4 }}>{cat.cat}</div>}
                  {cat.items.map((item, i) => {
                    const key = `${cat.cat}-${i}`;
                    const isOpen = openQ === key;
                    return (
                      <div key={key} className={`faq-item${isOpen ? " fopen" : ""}`}>
                        <button className="faq-btn" onClick={() => setOpenQ(isOpen ? null : key)}>
                          <span style={{ fontSize:14, fontWeight:500, color:T.textPrimary, lineHeight:1.4 }}>{item.q}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" style={{ flexShrink:0, transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        {isOpen && (
                          <div className="faq-ans" style={{ padding:"0 18px 16px", borderTop:`1px solid ${T.borderSubtle}` }}>
                            <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.8, paddingTop:14 }}>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}