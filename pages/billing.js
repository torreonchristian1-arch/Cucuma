import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { PageHeader, Toast, Btn } from "../components/Layout";
import { useTheme } from "./_app";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const PLANS = [
  {
    id: "starter", name: "Starter",
    monthly: 17.99, yearly: 172.70,
    monthlyId: "starter", yearlyId: "starter_yearly",
    desc: "Perfect for new beauty entrepreneurs",
    features: ["Up to 5 products published", "Basic label customization", "Order fulfillment", "Email support", "Shopify integration"],
    highlight: false,
  },
  {
    id: "growth", name: "Growth",
    monthly: 44.99, yearly: 431.90,
    monthlyId: "growth", yearlyId: "growth_yearly",
    desc: "For serious beauty brand builders",
    features: ["Unlimited products published", "Full brand customization", "Priority fulfillment", "Custom packaging inserts", "Analytics dashboard", "Priority support"],
    highlight: true,
  },
  {
    id: "enterprise", name: "Enterprise",
    monthly: null, yearly: null,
    monthlyId: null, yearlyId: null,
    desc: "For established brands scaling fast",
    features: ["Everything in Growth", "Dedicated account manager", "Custom product formulations", "Bulk pricing discounts", "White-glove onboarding"],
    highlight: false,
  },
];

export default function Billing() {
  const router = useRouter();
  const { shop, billing } = router.query;
  const { theme: T } = useTheme();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(null);
  const [period, setPeriod] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [planStatus, setPlanStatus] = useState("trial");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!shop) return;
    supabase.from("merchants").select("plan, plan_status").eq("shop_domain", shop).single()
      .then(({ data }) => { if (data) { setCurrentPlan(data.plan || "free"); setPlanStatus(data.plan_status || "trial"); } });
    if (billing === "success") setToast({ msg: "Subscription activated! Welcome to Cucuma®", type: "success" });
    if (billing === "cancelled") setToast({ msg: "Subscription cancelled.", type: "error" });
    if (billing) setTimeout(() => setToast(null), 5000);
  }, [shop, billing]);

  async function handleSubscribe(plan) {
    if (!shop) { setToast({ msg: "No store connected.", type: "error" }); return; }
    if (!plan.monthlyId) {
      window.location.href = "mailto:support@cucuma.com?subject=Enterprise Plan";
      return;
    }
    const planId = period === "yearly" ? plan.yearlyId : plan.monthlyId;
    setLoading(plan.id);
    try {
      const res = await fetch("/api/billing/shopify-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, planId }),
      });
      const data = await res.json();
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else {
        setToast({ msg: data.error || "Failed to create subscription.", type: "error" });
      }
    } catch {
      setToast({ msg: "Network error. Please try again.", type: "error" });
    }
    setLoading(null);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bgBase, overflow: "hidden" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        .plan-card{transition:transform 0.2s,box-shadow 0.2s;}
        .plan-card:hover{transform:translateY(-3px);box-shadow:${T.shadowMd};}
        .period-btn{padding:7px 18px;border-radius:100px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;border:1px solid transparent;font-family:'DM Sans',sans-serif;background:none;}
        .sub-btn{width:100%;border-radius:8px;padding:11px;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.2s;font-family:'DM Sans',sans-serif;border:none;}
        .sub-btn:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);}
        .sub-btn:disabled{opacity:0.7;cursor:default;}
        @media(max-width:768px){.hdr{padding:10px 16px 10px 52px!important;}.mpad{padding:16px!important;}.pgrid{grid-template-columns:1fr!important;}.fgrid{grid-template-columns:1fr!important;}.hide-mobile{display:none!important;}}
      `}</style>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SideNav active="billing" shop={shop} open={open} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <PageHeader
          title="Billing & Plans"
          subtitle="Manage your Cucuma subscription"
          onMenuToggle={() => setOpen(!open)}
          actions={
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.oliveSubtle, border: `1px solid ${T.oliveBorder}`, borderRadius: 8, padding: "6px 14px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.olive }}></div>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.olive }}>
                {planStatus === "active" ? `${currentPlan} Plan Active` : "14-Day Free Trial"}
              </span>
            </div>
          }
        />

        <div className="mpad" style={{ padding: "28px 24px" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>Choose Your Plan</div>
            <p style={{ fontSize: 14, color: T.textSecondary, maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.6 }}>All plans include a 14-day free trial. Billing is handled securely through Shopify.</p>
            {/* Period toggle */}
            <div style={{ display: "inline-flex", background: T.bgSurface, border: `1px solid ${T.borderSubtle}`, borderRadius: 100, padding: 4, gap: 4 }}>
              <button className="period-btn" onClick={() => setPeriod("monthly")}
                style={{ background: period === "monthly" ? T.bgCard : "transparent", borderColor: period === "monthly" ? T.borderDefault : "transparent", color: period === "monthly" ? T.textPrimary : T.textTertiary, fontFamily: "'DM Sans', sans-serif" }}>
                Monthly
              </button>
              <button className="period-btn" onClick={() => setPeriod("yearly")}
                style={{ background: period === "yearly" ? T.bgCard : "transparent", borderColor: period === "yearly" ? T.borderDefault : "transparent", color: period === "yearly" ? T.textPrimary : T.textTertiary, display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif" }}>
                Yearly
                <span style={{ fontSize: 10, fontWeight: 700, color: T.olive, background: T.oliveSubtle, padding: "2px 7px", borderRadius: 100, border: `1px solid ${T.oliveBorder}` }}>Save 20%</span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="pgrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, maxWidth: 920, margin: "0 auto 24px" }}>
            {PLANS.map(plan => {
              const isActive = currentPlan === plan.id && planStatus === "active";
              const price = plan.monthly ? (period === "yearly" ? plan.yearly : plan.monthly) : null;
              const suffix = price ? (period === "yearly" ? "/year" : "/month") : "";

              return (
                <div key={plan.id} className="plan-card" style={{ background: plan.highlight ? T.olive : T.bgCard, border: `2px solid ${isActive ? T.oliveBorder : plan.highlight ? T.olive : T.borderSubtle}`, borderRadius: 16, padding: "28px 24px", position: "relative", boxShadow: plan.highlight ? `0 8px 32px rgba(61,90,62,0.18)` : T.shadow }}>
                  {plan.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: T.gold, color: "white", fontSize: 10, fontWeight: 700, padding: "4px 14px", borderRadius: 100, whiteSpace: "nowrap", letterSpacing: "0.08em" }}>MOST POPULAR</div>}
                  {isActive && <div style={{ position: "absolute", top: -12, right: 16, background: T.oliveSubtle, border: `1px solid ${T.oliveBorder}`, color: T.olive, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>CURRENT</div>}

                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: plan.highlight ? "rgba(255,255,255,0.65)" : T.gold, marginBottom: 10 }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 600, color: plan.highlight ? "white" : T.textPrimary, lineHeight: 1 }}>
                      {price ? `$${price.toFixed(2)}` : "Custom"}
                    </span>
                    {price && <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.55)" : T.textTertiary, marginBottom: 7 }}>{suffix}</span>}
                  </div>
                  {period === "yearly" && price && <div style={{ fontSize: 11, color: plan.highlight ? "rgba(255,255,255,0.5)" : T.textTertiary, marginBottom: 10 }}>Billed annually · save 20%</div>}
                  <p style={{ fontSize: 12, color: plan.highlight ? "rgba(255,255,255,0.6)" : T.textTertiary, marginBottom: 20, lineHeight: 1.6 }}>{plan.desc}</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.85)" : T.textSecondary, fontWeight: 500 }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: plan.highlight ? "rgba(255,255,255,0.15)" : T.oliveSubtle, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "white" : T.olive} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>

                  <button className="sub-btn" onClick={() => handleSubscribe(plan)} disabled={loading === plan.id || isActive}
                    style={{ background: plan.highlight ? "rgba(255,255,255,0.15)" : isActive ? T.oliveSubtle : T.olive, border: plan.highlight ? "1px solid rgba(255,255,255,0.25)" : isActive ? `1px solid ${T.oliveBorder}` : "none", color: plan.highlight ? "white" : isActive ? T.olive : "white" }}>
                    {loading === plan.id
                      ? <><span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>Redirecting...</>
                      : isActive ? "Current Plan ✓"
                      : plan.monthlyId ? "Subscribe via Shopify →" : "Contact Us →"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Shopify billing note */}
          <div style={{ maxWidth: 920, margin: "0 auto 24px", background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: T.oliveSubtle, border: `1px solid ${T.oliveBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.olive} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 2 }}>Secure billing via Shopify</div>
              <div style={{ fontSize: 12, color: T.textSecondary }}>All subscription payments are processed securely through Shopify's native billing system. Cancel anytime from your Shopify admin.</div>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 920, margin: "0 auto", background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 12, padding: "22px 26px", boxShadow: T.shadow }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: T.textPrimary, marginBottom: 18 }}>Billing FAQ</div>
            <div className="fgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { q: "How does the free trial work?", a: "All plans include 14 days free. Your Shopify account won't be charged until the trial ends. Cancel anytime before then." },
                { q: "How do I cancel?", a: "Cancel anytime from your Shopify admin under Apps → Cucuma → Cancel subscription. No questions asked." },
                { q: "How is billing handled?", a: "All payments go through Shopify's native billing system — the same secure system used by thousands of Shopify apps." },
                { q: "Can I switch plans?", a: "Yes. Upgrade or downgrade anytime. Changes take effect on your next billing cycle." },
              ].map(item => (
                <div key={item.q}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{item.q}</div>
                  <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.65 }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}