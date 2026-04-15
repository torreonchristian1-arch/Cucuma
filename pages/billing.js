import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { useTheme } from "./_app";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 17.99,
    period: "/month",
    desc: "Perfect for new beauty entrepreneurs",
    features: [
      "Up to 5 products published",
      "Basic label customization",
      "Order routing & fulfillment",
      "Email support",
      "Shopify integration",
    ],
    highlight: false,
    priceId: "price_starter", // Replace with real Stripe Price ID
  },
  {
    id: "growth",
    name: "Growth",
    price: 44.99,
    period: "/month",
    desc: "For serious beauty brand builders",
    features: [
      "Unlimited products published",
      "Full brand customization",
      "Priority fulfillment",
      "Custom packaging inserts",
      "Analytics dashboard",
      "Priority support",
    ],
    highlight: true,
    priceId: "price_growth", // Replace with real Stripe Price ID
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    period: "",
    desc: "For established brands scaling fast",
    features: [
      "Everything in Growth",
      "Dedicated account manager",
      "Custom product formulations",
      "Bulk pricing discounts",
      "White-glove onboarding",
      "SLA guarantee",
    ],
    highlight: false,
    priceId: null,
  },
];

export default function Billing() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme, mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(null);
  const [currentPlan] = useState("starter"); // In production, fetch from DB
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  async function handleSubscribe(plan) {
    if (!shop) { alert("No store connected."); return; }
    if (!plan.priceId) {
      // Enterprise — contact us
      window.location.href = "mailto:support@cucuma.com?subject=Enterprise Plan Inquiry";
      return;
    }

    setLoading(plan.id);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, planId: plan.id, priceId: plan.priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout session.");
      }
    } catch {
      alert("Network error. Please try again.");
    }
    setLoading(null);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bgBase, overflow: "hidden" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .plan-card-hover { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .plan-card-hover:hover { transform: translateY(-4px); box-shadow: ${theme.shadowMd}; }
        .period-btn { padding: 7px 16px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px solid; }
        @media (max-width: 768px) { .hdr { padding: 10px 16px 10px 52px !important; } .main-pad { padding: 16px !important; } .plans-grid { grid-template-columns: 1fr !important; max-width: 400px !important; } .hide-sm { display: none !important; } }
      `}</style>

      <SideNav active="settings" shop={shop} open={sidebarOpen} />

      <main style={{ flex: 1, overflow: "auto" }}>
        <header className="hdr" style={{ padding: "12px 24px", background: theme.bgCard, borderBottom: `1px solid ${theme.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hide-sm" style={{ background: "none", border: `1px solid ${theme.borderSubtle}`, borderRadius: 7, padding: "6px 9px", color: theme.textTertiary, cursor: "pointer", display: "flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary }}>Billing & Plans</div>
              <div style={{ fontSize: 12, color: theme.textTertiary }}>Manage your Cucuma subscription</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: theme.greenSubtle, border: `1px solid ${theme.greenBorder}`, borderRadius: 8, padding: "6px 14px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.green }}></div>
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.green }}>Free Trial Active</span>
          </div>
        </header>

        <div className="main-pad" style={{ padding: "24px 28px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>Choose Your Plan</div>
            <p style={{ fontSize: 14, color: theme.textSecondary, maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.6 }}>Start free, scale as you grow. All plans include Shopify integration and automatic fulfillment.</p>
            {/* Period toggle */}
            <div style={{ display: "inline-flex", background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, borderRadius: 100, padding: 4, gap: 4 }}>
              <button className="period-btn" onClick={() => setBillingPeriod("monthly")}
                style={{ background: billingPeriod === "monthly" ? theme.bgElevated : "transparent", borderColor: billingPeriod === "monthly" ? theme.borderDefault : "transparent", color: billingPeriod === "monthly" ? theme.textPrimary : theme.textTertiary }}>
                Monthly
              </button>
              <button className="period-btn" onClick={() => setBillingPeriod("yearly")}
                style={{ background: billingPeriod === "yearly" ? theme.bgElevated : "transparent", borderColor: billingPeriod === "yearly" ? theme.borderDefault : "transparent", color: billingPeriod === "yearly" ? theme.textPrimary : theme.textTertiary, display: "flex", alignItems: "center", gap: 6 }}>
                Yearly
                <span style={{ fontSize: 10, fontWeight: 700, color: theme.green, background: theme.greenSubtle, padding: "2px 6px", borderRadius: 100 }}>-20%</span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, maxWidth: 900, margin: "0 auto 36px" }}>
            {PLANS.map(plan => {
              const isCurrentPlan = currentPlan === plan.id;
              const displayPrice = plan.price
                ? billingPeriod === "yearly"
                  ? (plan.price * 0.8).toFixed(2)
                  : plan.price.toFixed(2)
                : null;

              return (
                <div key={plan.id} className="plan-card-hover" style={{ background: plan.highlight ? theme.gold : theme.bgCard, border: `2px solid ${plan.highlight ? theme.gold : isCurrentPlan ? theme.greenBorder : theme.borderSubtle}`, borderRadius: 16, padding: "28px 24px", position: "relative", boxShadow: plan.highlight ? `0 8px 32px rgba(196,151,90,0.25)` : theme.shadow }}>
                  {plan.highlight && (
                    <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: mode === "dark" ? "#1a1208" : "#fff8ed", border: `1px solid ${theme.goldBorder}`, color: theme.gold, fontSize: 10, fontWeight: 700, padding: "4px 14px", borderRadius: 100, whiteSpace: "nowrap", letterSpacing: "0.08em" }}>MOST POPULAR</div>
                  )}
                  {isCurrentPlan && (
                    <div style={{ position: "absolute", top: -12, right: 16, background: theme.greenSubtle, border: `1px solid ${theme.greenBorder}`, color: theme.green, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>CURRENT PLAN</div>
                  )}

                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: plan.highlight ? "rgba(255,255,255,0.7)" : theme.gold, marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ marginBottom: 8 }}>
                    {displayPrice ? (
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                        <span style={{ fontSize: 38, fontWeight: 700, color: plan.highlight ? "white" : theme.textPrimary, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>${displayPrice}</span>
                        <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.6)" : theme.textTertiary, marginBottom: 6 }}>{plan.period}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 38, fontWeight: 700, color: theme.textPrimary, lineHeight: 1 }}>Custom</div>
                    )}
                    {billingPeriod === "yearly" && displayPrice && (
                      <div style={{ fontSize: 11, color: plan.highlight ? "rgba(255,255,255,0.6)" : theme.textTertiary, marginTop: 4 }}>Billed ${(displayPrice * 12).toFixed(0)}/year</div>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: plan.highlight ? "rgba(255,255,255,0.65)" : theme.textTertiary, marginBottom: 20, lineHeight: 1.5 }}>{plan.desc}</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.85)" : theme.textSecondary, fontWeight: 500 }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: plan.highlight ? "rgba(255,255,255,0.15)" : theme.greenSubtle, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? "white" : theme.green} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>

                  <button onClick={() => handleSubscribe(plan)} disabled={loading === plan.id || isCurrentPlan}
                    style={{ width: "100%", borderRadius: 9, padding: "11px", background: plan.highlight ? "rgba(255,255,255,0.15)" : isCurrentPlan ? theme.greenSubtle : theme.gold, border: plan.highlight ? "1px solid rgba(255,255,255,0.25)" : isCurrentPlan ? `1px solid ${theme.greenBorder}` : "none", color: plan.highlight ? "white" : isCurrentPlan ? theme.green : "white", fontSize: 14, fontWeight: 700, cursor: isCurrentPlan ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.15s" }}>
                    {loading === plan.id ? (
                      <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>Loading...</>
                    ) : isCurrentPlan ? "Current Plan ✓"
                    : plan.priceId ? `Subscribe to ${plan.name} →` : "Contact Us →"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 14, padding: "24px 28px", maxWidth: 900, margin: "0 auto", boxShadow: theme.shadow }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, marginBottom: 18 }}>Billing FAQ</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { q: "Can I cancel anytime?", a: "Yes. Cancel from your Settings page. You keep access until the end of your billing period." },
                { q: "What payment methods are accepted?", a: "All major credit and debit cards via Stripe. No hidden fees." },
                { q: "Is there a free trial?", a: "Yes — 14 days free on the Starter plan. No credit card required to start." },
                { q: "Can I switch plans?", a: "Yes. Upgrade or downgrade anytime. Changes take effect immediately." },
              ].map(item => (
                <div key={item.q}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, marginBottom: 5 }}>{item.q}</div>
                  <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}