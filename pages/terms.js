import Head from "next/head";
import { useState, useEffect } from "react";

const LAST_UPDATED = "April 15, 2026";

const SECTIONS = [
  { title: "1. Acceptance of Terms", content: `By installing the Cucuma app from the Shopify App Store or accessing cucuma.vercel.app, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.\n\nThese terms apply to all merchants, visitors, and users of the Cucuma platform.` },
  { title: "2. Description of Service", content: `Cucuma® is a private label beauty fulfillment platform that allows Shopify merchants to:\n\n- Browse and select from a catalogue of private label beauty products\n- Apply custom branding (logo, colors, label design) to products\n- Publish branded products directly to their Shopify store\n- Route customer orders to our fulfillment partners for printing and shipping` },
  { title: "3. Account Registration", content: `To use Cucuma, you must have an active Shopify store and install the app via OAuth authorization. You are responsible for maintaining the security of your store credentials and for all activities that occur under your account.\n\nYou must provide accurate and complete information and keep your account information updated.` },
  { title: "4. Subscription & Billing", content: `Cucuma offers paid subscription plans billed monthly or annually. Pricing is displayed on the billing page within the app.\n\n**Free Trial:** New merchants receive a 14-day free trial. No credit card is required to start.\n\n**Billing:** Subscriptions are billed through Shopify's billing system. All charges are in USD.\n\n**Cancellation:** You may cancel your subscription at any time. Access continues until the end of the current billing period. No refunds are provided for partial periods.\n\n**Price Changes:** We reserve the right to change pricing with 30 days notice.` },
  { title: "5. Fulfillment & Orders", content: `When a customer places an order on your Shopify store for a Cucuma product:\n\n- The order is automatically routed to our fulfillment partner\n- We print your custom label on the product\n- The product is packed and shipped directly to your customer\n\n**Processing Time:** Orders are typically processed within 1-3 business days.\n\n**Shipping:** Shipping times vary by destination. We are not responsible for delays caused by customs, weather, or carrier issues.\n\n**Quality:** We maintain quality standards for all products. Defective products will be replaced at no cost upon verification.` },
  { title: "6. Intellectual Property", content: `**Your Content:** You retain ownership of your logo, brand name, and any designs you upload. By uploading content, you grant us a license to use it solely for the purpose of producing your branded products.\n\n**Our Content:** The Cucuma platform, product formulations, and software are our intellectual property. You may not copy, modify, or distribute our platform without permission.\n\n**Product Formulations:** All product formulations in our catalogue are proprietary. You may not reverse engineer or replicate them.` },
  { title: "7. Prohibited Uses", content: `You agree not to use Cucuma to:\n\n- Sell products that make false health claims\n- Violate any applicable laws or regulations\n- Infringe on third-party intellectual property rights\n- Engage in fraudulent transactions\n- Resell access to the platform\n- Attempt to hack, disrupt, or damage the service` },
  { title: "8. Product Claims & Compliance", content: `You are solely responsible for ensuring that your product listings, descriptions, and marketing comply with all applicable laws and regulations in your jurisdiction, including cosmetics regulations, labeling requirements, and consumer protection laws.\n\nWe do not provide regulatory or legal advice. You should consult appropriate professionals regarding compliance in your market.` },
  { title: "9. Limitation of Liability", content: `To the maximum extent permitted by law, Cucuma shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.\n\nOur total liability for any claim arising from use of the service shall not exceed the amount you paid us in the 3 months preceding the claim.` },
  { title: "10. Disclaimers", content: `The service is provided "as is" without warranties of any kind. We do not warrant that the service will be uninterrupted, error-free, or meet your specific requirements.\n\nWe are not responsible for the actions of fulfillment partners, shipping carriers, or Shopify.` },
  { title: "11. Termination", content: `We reserve the right to suspend or terminate your account for violation of these terms, non-payment, or any conduct we deem harmful to the platform or other users.\n\nUpon termination, your access to the platform will cease. Published products will remain in your Shopify store but new orders will not be fulfilled.` },
  { title: "12. Governing Law", content: `These Terms shall be governed by the laws of the Republic of the Philippines. Any disputes shall be resolved in the courts of competent jurisdiction in the Philippines.` },
  { title: "13. Changes to Terms", content: `We may update these Terms at any time. We will notify you of material changes via email or in-app notification. Continued use of the service after changes constitutes acceptance of the new terms.` },
  { title: "14. Contact", content: `For questions about these Terms, contact us at:\n\n**Email:** support@cucuma.com\n**Website:** https://cucuma.vercel.app` },
];

export default function TermsOfService() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <Head>
        <title>Terms of Service — Cucuma®</title>
        <meta name="description" content="Cucuma Terms of Service — the rules and guidelines for using our platform." />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0C0C0C; color: #F5F0EB; line-height: 1.7; }
          a { color: #C4975A; text-decoration: none; }
          a:hover { text-decoration: underline; }
          strong { color: #F5F0EB; font-weight: 600; }
        `}</style>
      </Head>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: navScrolled ? "rgba(12,12,12,0.97)" : "transparent", backdropFilter: "blur(16px)", borderBottom: navScrolled ? "1px solid #2A2A2A" : "1px solid transparent", transition: "all 0.3s" }}>
        <a href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#F5F0EB" }}>
          Cucuma<span style={{ color: "#C4975A" }}>®</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/privacy" style={{ fontSize: 13, color: "#9A9490" }}>Privacy Policy</a>
          <a href="/" style={{ fontSize: 13, color: "#9A9490" }}>← Back to Home</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: 120, paddingBottom: 60, textAlign: "center", borderBottom: "1px solid #2A2A2A", background: "linear-gradient(180deg, #161616 0%, #0C0C0C 100%)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#C4975A", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>Legal</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "#F5F0EB", marginBottom: 16, lineHeight: 1.1 }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: "#6B6560" }}>Last updated: {LAST_UPDATED}</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 100px" }}>
        <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px", marginBottom: 48, borderLeft: "3px solid #C4975A" }}>
          <p style={{ fontSize: 14, color: "#9A9490", lineHeight: 1.7 }}>
            Please read these Terms of Service carefully before using the Cucuma platform. By using our service, you agree to be bound by these terms.
          </p>
        </div>

        {SECTIONS.map((section, i) => (
          <div key={i} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F5F0EB", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #2A2A2A" }}>{section.title}</h2>
            <div style={{ fontSize: 14, color: "#9A9490", lineHeight: 1.8 }}>
              {section.content.split("\n").map((line, j) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                  return <p key={j} style={{ color: "#F5F0EB", fontWeight: 600, marginTop: 16, marginBottom: 6 }}>{line.replace(/\*\*/g, "")}</p>;
                }
                if (line.startsWith("- ")) {
                  return <div key={j} style={{ display: "flex", gap: 10, marginBottom: 6 }}><span style={{ color: "#C4975A", flexShrink: 0 }}>·</span><span>{line.slice(2)}</span></div>;
                }
                if (line === "") return <br key={j} />;
                const parts = line.split(/\*\*(.*?)\*\*/g);
                return (
                  <p key={j} style={{ marginBottom: 8 }}>
                    {parts.map((part, k) => k % 2 === 1 ? <strong key={k}>{part}</strong> : part)}
                  </p>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: 32, display: "flex", gap: 24, flexWrap: "wrap" }}>
          <a href="/privacy" style={{ fontSize: 13, color: "#C4975A" }}>Privacy Policy →</a>
          <a href="mailto:support@cucuma.com" style={{ fontSize: 13, color: "#C4975A" }}>Contact Us →</a>
          <a href="/" style={{ fontSize: 13, color: "#6B6560" }}>← Back to Home</a>
        </div>
      </div>

      <div style={{ background: "#161616", borderTop: "1px solid #2A2A2A", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: "#F5F0EB" }}>Cucuma<span style={{ color: "#C4975A" }}>®</span></span>
        <span style={{ fontSize: 12, color: "#6B6560" }}>© 2026 Cucuma®. All Rights Reserved.</span>
      </div>
    </>
  );
}