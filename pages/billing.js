import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthly: "$17.99",
    yearly: "$172.70",
    monthlyId: "starter",
    yearlyId: "starter_yearly",
    period: "/month",
    desc: "Perfect for new beauty entrepreneurs",
    features: ["Up to 5 products published", "Basic label customization", "Order fulfillment", "Email support", "Shopify integration"],
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    monthly: "$44.99",
    yearly: "$431.90",
    monthlyId: "growth",
    yearlyId: "growth_yearly",
    period: "/month",
    desc: "For serious beauty brand builders",
    features: ["Unlimited products published", "Full brand customization", "Priority fulfillment", "Custom packaging inserts", "Analytics dashboard", "Priority support"],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: "Custom",
    yearly: "Custom",
    monthlyId: null,
    yearlyId: null,
    period: "",
    desc: "For established brands scaling fast",
    features: ["Everything in Growth", "Dedicated account manager", "Custom product formulations", "Bulk pricing discounts", "White-glove onboarding"],
    highlight: false,
  },
];

export default function Billing() {
  const router = useRouter();
  const { shop, billing } = router.query;
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(null);
  const [period, setPeriod] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [planStatus, setPlanStatus] = useState("trial");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!shop) return;
    // Load current plan
    supabase.from("merchants").select("plan, plan_status").eq("shop_domain", shop).single()
      .then(({ data }) => {
        if (data) { setCurrentPlan(data.plan || "free"); setPlanStatus(data.plan_status || "trial"); }
      });

    // Show toast based on billing callback
    if (billing === "success") setToast({ msg: "Subscription activated! Welcome to Cucuma®", type: "success" });
    if (billing === "cancelled") setToast({ msg: "Subscription cancelled.", type: "error" });
    if (billing === "error") setToast({ msg: "Something went wrong. Please try again.", type: "error" });
    if (billing) setTimeout(() => setToast(null), 5000);
  }, [shop, billing]);

  async function handleSubscribe(plan) {
    if (!shop) { setToast({ msg: "No store connected.", type: "error" }); return; }
    if (!plan.monthlyId && !plan.yearlyId) {
      window.location.href = "mailto:support@cucuma.com?subject=Enterprise Plan Inquiry";
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
        // Redirect to Shopify billing confirmation
        window.location.href = data.confirmationUrl;
      } else {
        setToast({ msg: data.error || "Failed to create subscription.", type: "error" });
      }
    } catch {
      setToast({ msg: "Network error. Please try again.", type: "error" });
    }
    setLoading(null);
  }

  const T = theme;

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bgBase, overflow: "hidden" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .plan-card { transition: transform 0.2s, box-shadow 0.2s; }
        .plan-card:hover { transform: translateY(-3px); box-shadow: ${T.shadowMd}; }
        .period-btn { padding: 7px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; font-family: 'DM Sans', sans-serif; }
        .sub-btn { width: 100%; border-radius: 9px; padding: 11px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .sub-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
        @media (max-width: 768px) { .hdr { padding: 10px 16px 10px 52px !important; } .main-pad { padding: 16px !important; } .plans-grid { grid-template-columns: 1fr !important; } .hide-sm { display: none !important; } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000, background: T.bgCard, border: `1px solid ${toast.type === "success" ? T.greenBorder : T.orangeBorder}`, borderRadius: 10, padding: "13px 16px", maxWidth: 340, boxShadow: T.shadowMd, display: "flex", alignItems: "center", gap: 10, animation: "toastIn 0.25s ease" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: toast.type === "success" ? T.green : T.orange, flexShrink: 0 }}></div>
          <span style={{ fontSize: 13, color: T.textPrimary, fontWeight: 500 }}>{toast.msg}</span>
        </div>
      )}

      <SideNav active="settings" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header className="hdr" style={{ padding: "12px 24px", background: T.bgCard, borderBottom: `1px solid ${T.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: T.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${T.borderSubtle}`, borderRadius: 7, padding: "6px 9px", color: T.textTertiary, cursor: "pointer", display: "flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary }}>Billing & Plans</div>
              <div style={{ fontSize: 12, color: T.textTertiary }}>Manage your Cucuma subscription</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.greenSubtle, border: `1px solid ${T.greenBorder}`, borderRadius: 8, padding: "6px 14px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }}></div>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.green }}>
              {planStatus === "active" ? `${currentPlan} Plan Active` : "Free Trial Active"}
            </span>
          </div>
        </header>

        <div className="main-pad" style={{ padding: "28px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>Choose Your Plan</div>
            <p style={{ fontSize: 14, color: T.textSecondary, maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.6 }}>All plans include Shopify integration, automatic fulfillment, and a 14-day free trial.</p>

            {/* Billing period toggle */}
            <div style={{ display: "inline-flex", background: T.bgSurface, border: `1px solid ${T.borderSubtle}`, borderRadius: 100, padding: 4, gap: 4 }}>
              <button className="period-btn" onClick={() => setPeriod("monthly")}
                style={{ background: period === "monthly" ? T.bgCard : "transparent", borderColor: period === "monthly" ? T.borderDefault : "transparent", color: period === "monthly" ? T.textPrimary : T.textTertiary }}>
                Monthly
              </button>
              <button className="period-btn" onClick={() => setPeriod("yearly")}
                style={{ background: period === "yearly" ? T.bgCard : "transparent", borderColor: period === "yearly" ? T.borderDefault : "transparent", color: period === "yearly" ? T.textPrimary : T.textTertiary, display: "flex", alignItems: "center", gap: 6 }}>
                Yearly
                <span style={{ fontSize: 10, fontWeight: 700, color: T.green, background: T.greenSubtle, padding: "2px 7px", borderRadius: 100 }}>Save 20%</span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, maxWidth: 920, margin: "0 auto 36px" }}>
            {PLANS.map(plan => {
              const isActive = currentPlan === plan.id && planStatus === "active";
              const price = period === "yearly" ? plan.yearly : plan.monthly;
              const suffix = price !== "Custom" ? (period === "yearly" ? "/year" : "/month") : "";

              return (
                <div key={plan.id} className="plan-card" style={{ background: plan.highlight ? T.olive : T.bgCard, border: `2px solid ${isActive ? T.greenBorder : plan.highlight ? T.olive : T.borderSubtle}`, borderRadius: 16, padding: "28px 24px", position: "relative", boxShadow: plan.highlight ? `0 8px 32px rgba(61,90,62,0.2)` : T.shadow }}>
                  {plan.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: T.gold, color: "white", fontSize: 10, fontWeight: 700, padding: "4px 14px", borderRadius: 100, whiteSpace: "nowrap", letterSpacing: "0.08em" }}>MOST POPULAR</div>}
                  {isActive && <div style={{ position: "absolute", top: -12, right: 16, background: T.greenSubtle, border: `1px solid ${T.greenBorder}`, color: T.green, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>CURRENT</div>}

                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: plan.highlight ? "rgba(255,255,255,0.7)" : T.gold, marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 700, color: plan.highlight ? "white" : T.textPrimary, lineHeight: 1 }}>{price}</span>
                    <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.6)" : T.textTertiary, marginBottom: 6 }}>{suffix}</span>
                  </div>
                  {period === "yearly" && price !== "Custom" && (
                    <div style={{ fontSize: 11, color: plan.highlight ? "rgba(255,255,255,0.55)" : T.textTertiary, marginBottom: 8 }}>Billed annually — save 20%</div>
                  )}
                  <p style={{ fontSize: 12, color: plan.highlight ? "rgba(255,255,255,0.65)" : T.textTertiary, marginBottom: 20, lineHeight: 1.5 }}>{plan.desc}</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.85)" : T.textSecondary, fontWeight: 500 }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: plan.highlight ? "rgba(255,255,255,0.15)" : T.greenSubtle, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "white" : T.green} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>

                  <button className="sub-btn" onClick={() => handleSubscribe(plan)} disabled={loading === plan.id || isActive}
                    style={{ background: plan.highlight ? "rgba(255,255,255,0.15)" : isActive ? T.greenSubtle : T.olive, border: plan.highlight ? "1px solid rgba(255,255,255,0.3)" : isActive ? `1px solid ${T.greenBorder}` : "none", color: plan.highlight ? "white" : isActive ? T.green : "white" }}>
                    {loading === plan.id
                      ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>Loading...</>
                      : isActive ? "Current Plan ✓"
                      : plan.monthlyId ? `Subscribe via Shopify →` : "Contact Us →"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Shopify Billing note */}
          <div style={{ maxWidth: 920, margin: "0 auto 28px", background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: T.greenSubtle, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, marginBottom: 2 }}>Secure billing via Shopify</div>
              <div style={{ fontSize: 12, color: T.textSecondary }}>All payments are processed securely through Shopify's billing system. Cancel anytime from your Shopify admin.</div>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 920, margin: "0 auto", background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 14, padding: "24px 28px", boxShadow: T.shadow }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: T.textPrimary, marginBottom: 18 }}>Billing FAQ</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { q: "How does the free trial work?", a: "All plans include a 14-day free trial. No credit card required. Your store won't be charged until the trial ends." },
                { q: "How do I cancel?", a: "Cancel anytime from your Shopify admin under Apps & Sales Channels → Cucuma → Cancel subscription." },
                { q: "What payment methods are accepted?", a: "All payments go through Shopify's secure billing system, which accepts all major credit and debit cards." },
                { q: "Can I switch plans?", a: "Yes. Upgrade or downgrade anytime. Changes take effect on your next billing cycle." },
              ].map(item => (
                <div key={item.q}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, marginBottom: 6 }}>{item.q}</div>
                  <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6 }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}