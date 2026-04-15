import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { PageHeader } from "../components/Layout";
import { useTheme } from "./_app";

const FAQS = [
  { cat: "Getting Started", items: [
    { q: "How do I install Cucuma on my Shopify store?", a: "Go to cucuma.vercel.app, enter your Shopify store URL, and click Install App. You'll be redirected to Shopify to approve permissions, then brought to your dashboard." },
    { q: "How long does it take to publish my first product?", a: "Most merchants publish their first product within 10 minutes of installing. Go to Catalogue, pick a product, and click Publish to Store." },
    { q: "Do I need any inventory upfront?", a: "No. We only print and ship when a customer places an order. Zero upfront cost, zero inventory risk." },
    { q: "What Shopify plan do I need?", a: "Any Shopify plan works with Cucuma, including the Basic plan." },
  ]},
  { cat: "Branding & Products", items: [
    { q: "Can I use my own logo on the products?", a: "Yes! Go to the Branding page, upload your logo, choose your colors, and pick a label style. Your branding will appear on all published products." },
    { q: "Can I set my own prices?", a: "Yes. After publishing, edit prices directly in your Shopify admin. We recommend pricing 2-3x above wholesale cost." },
    { q: "What happens if a product is out of stock?", a: "We'll notify you by email. Your listing stays active and orders are queued until stock returns." },
  ]},
  { cat: "Orders & Fulfillment", items: [
    { q: "How does order fulfillment work?", a: "When a customer buys, the order is automatically routed to us. We print your label, pack the product, and ship directly to your customer — usually within 1-3 business days." },
    { q: "How do I track orders?", a: "Go to the Orders page in your Cucuma dashboard. All orders show their fulfillment status in real time." },
    { q: "What if a customer wants a refund?", a: "Handle refunds in your Shopify admin. For defective products, contact us and we'll replace at no cost." },
  ]},
  { cat: "Billing & Plans", items: [
    { q: "How does the free trial work?", a: "All plans include 14 days free. Your Shopify account won't be charged until the trial ends." },
    { q: "How is billing handled?", a: "All payments go through Shopify's native billing system — the same secure system used by thousands of Shopify apps." },
    { q: "Can I cancel anytime?", a: "Yes. Cancel from your Shopify admin under Apps → Cucuma → Cancel subscription." },
  ]},
  { cat: "Custom Domain", items: [
    { q: "How do I connect a custom domain?", a: "Custom domains are managed through Shopify. Go to Shopify Admin → Settings → Domains → Connect existing domain. Update your DNS records and wait 24-48 hours." },
    { q: "Does Cucuma work with custom themes?", a: "Yes. Cucuma publishes products directly to Shopify and works with any theme — Dawn, Debut, or custom themes." },
  ]},
];

export default function Help() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme: T } = useTheme();
  const [open, setOpen] = useState(true);
  const [openQ, setOpenQ] = useState(null);
  const [activeCat, setActiveCat] = useState("Getting Started");
  const [search, setSearch] = useState("");

  const filtered = FAQS.map(cat => ({ ...cat, items: cat.items.filter(item => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())) })).filter(cat => search ? cat.items.length > 0 : cat.cat === activeCat);

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bgBase, overflow:"hidden" }}>
      <style>{`
        input{outline:none;}
        @keyframes expand{from{opacity:0;max-height:0;}to{opacity:1;max-height:400px;}}
        .faq-ans{animation:expand 0.22s ease;overflow:hidden;}
        .cat-btn{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;transition:all 0.15s;width:100%;text-align:left;border:none;font-family:'DM Sans',sans-serif;background:none;}
        .cat-btn:hover{background:${T.bgElevated};color:${T.textPrimary};}
        .cat-btn.active{background:${T.oliveSubtle};color:${T.olive};}
        .faq-btn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:15px 18px;background:none;border:none;cursor:pointer;text-align:left;gap:12px;font-family:'DM Sans',sans-serif;}
        .faq-item{background:${T.bgCard};border:1px solid ${T.borderSubtle};border-radius:10px;margin-bottom:8px;overflow:hidden;transition:border-color 0.15s;box-shadow:${T.shadow};}
        .faq-item.fopen{border-color:${T.oliveBorder};}
        @media(max-width:768px){.hdr{padding:10px 16px 10px 52px!important;}.mpad{padding:16px!important;}.hlayout{grid-template-columns:1fr!important;}.cat-list{display:none!important;}.hide-mobile{display:none!important;}}
      `}</style>

      <SideNav active="help" shop={shop} open={open} />
      <main style={{ flex:1, overflow:"auto" }}>
        <PageHeader
          title="Help Center"
          subtitle="Find answers to common questions"
          onMenuToggle={() => setOpen(!open)}
          actions={
            <div style={{ position:"relative" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..."
                style={{ background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"7px 12px 7px 30px", color:T.textPrimary, fontSize:13, width:220 }} />
            </div>
          }
        />

        <div className="mpad" style={{ padding:"18px 24px" }}>
          {/* Header */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:T.textPrimary, marginBottom:6 }}>How can we help you?</div>
            <p style={{ fontSize:14, color:T.textSecondary }}>Browse our FAQ or reach us at <a href="mailto:support@cucuma.com" style={{ color:T.olive, fontWeight:500 }}>support@cucuma.com</a></p>
          </div>

          <div className="hlayout" style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:20 }}>
            {/* Categories */}
            <div className="cat-list">
              {FAQS.map(cat => (
                <button key={cat.cat} className={`cat-btn${activeCat===cat.cat&&!search?" active":""}`}
                  onClick={() => { setActiveCat(cat.cat); setSearch(""); }}
                  style={{ color:activeCat===cat.cat&&!search?T.olive:T.textSecondary }}>
                  <span>{cat.cat}</span>
                  <span style={{ marginLeft:"auto", fontSize:11, color:T.textTertiary, background:T.bgSurface, borderRadius:100, padding:"1px 7px" }}>{cat.items.length}</span>
                </button>
              ))}
              <div style={{ height:1, background:T.borderSubtle, margin:"12px 0" }}></div>
              <a href="mailto:support@cucuma.com" style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:8, fontSize:13, color:T.textSecondary }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email Support
              </a>
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
                  {search && <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:10 }}>{cat.cat}</div>}
                  {cat.items.map((item, i) => {
                    const key = `${cat.cat}-${i}`;
                    const isOpen = openQ === key;
                    return (
                      <div key={key} className={`faq-item${isOpen?" fopen":""}`}>
                        <button className="faq-btn" onClick={() => setOpenQ(isOpen ? null : key)}>
                          <span style={{ fontSize:14, fontWeight:500, color:T.textPrimary, lineHeight:1.4 }}>{item.q}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" style={{ flexShrink:0, transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        {isOpen && (
                          <div className="faq-ans" style={{ padding:"0 18px 16px", borderTop:`1px solid ${T.borderSubtle}` }}>
                            <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.75, paddingTop:14 }}>{item.a}</p>
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