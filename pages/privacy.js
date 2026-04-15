import Head from "next/head";
import { useState, useEffect } from "react";

const LAST_UPDATED = "April 15, 2026";

const SECTIONS = [
  {
    title: "1. Introduction",
    content: `Cucuma® ("we", "our", or "us") operates as a private label beauty fulfillment platform accessible via the Shopify App Store and at cucuma.vercel.app. This Privacy Policy explains how we collect, use, disclose, and protect information when you use our services.

By installing the Cucuma app or using our website, you agree to the collection and use of information in accordance with this policy.`
  },
  {
    title: "2. Information We Collect",
    content: `We collect the following types of information:

**Store Information:** When you install Cucuma, we collect your Shopify store domain, store name, email address, and OAuth access tokens required to interact with the Shopify API on your behalf.

**Order Data:** We receive order information from your Shopify store including order numbers, customer names, shipping addresses, and product details. This is required to fulfill orders on your behalf.

**Branding Data:** Logo files, color preferences, and label customization settings you upload or configure within the app.

**Usage Data:** We may collect information on how the app is accessed and used, including pages visited, features used, and actions taken within the dashboard.`
  },
  {
    title: "3. How We Use Your Information",
    content: `We use the information we collect to:

- Provide, operate, and maintain the Cucuma platform
- Process and fulfill orders placed on your Shopify store
- Apply your branding to private label products
- Send transactional notifications related to orders and fulfillment
- Improve and personalize your experience
- Respond to support requests
- Comply with legal obligations`
  },
  {
    title: "4. Data Sharing",
    content: `We do not sell your personal information. We may share information with:

**Fulfillment Partners:** Shipping addresses and order details are shared with our fulfillment and logistics partners solely to process and ship orders.

**Shopify:** We interact with Shopify's API using your authorized access token. Shopify's own privacy policy governs their use of data.

**Service Providers:** We use third-party services including Supabase (database), Vercel (hosting), and Resend (email) to operate our platform. These providers process data only as necessary to provide their services.

**Legal Requirements:** We may disclose information if required by law or in response to valid legal requests.`
  },
  {
    title: "5. Data Retention",
    content: `We retain your store data for as long as you have the Cucuma app installed. Upon uninstallation, we will delete your store's data within 30 days in accordance with Shopify's GDPR requirements.

Order data may be retained for up to 7 years for accounting and legal compliance purposes.`
  },
  {
    title: "6. GDPR Compliance",
    content: `For merchants and customers in the European Economic Area, we comply with GDPR requirements including:

- **customers/data_request:** We respond to customer data requests within 30 days
- **customers/redact:** We delete customer personal data upon request
- **shop/redact:** We delete all store data within 30 days of app uninstallation

To submit a data request, contact us at support@cucuma.com.`
  },
  {
    title: "7. Security",
    content: `We implement industry-standard security measures to protect your data including:

- All data transmitted over HTTPS/TLS encryption
- OAuth tokens stored securely and never exposed publicly
- Database access restricted to authorized services only
- Regular security reviews

However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`
  },
  {
    title: "8. Cookies",
    content: `The Cucuma web dashboard may use session cookies for authentication purposes. We do not use cookies for advertising or tracking. You can configure your browser to refuse cookies, though this may affect functionality.`
  },
  {
    title: "9. Third-Party Links",
    content: `Our service may contain links to third-party websites including Shopify. We are not responsible for the privacy practices of these sites and encourage you to review their privacy policies.`
  },
  {
    title: "10. Children's Privacy",
    content: `Cucuma is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us immediately.`
  },
  {
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of the service after changes constitutes acceptance.`
  },
  {
    title: "12. Contact Us",
    content: `If you have questions about this Privacy Policy or wish to exercise your data rights, contact us at:

**Email:** support@cucuma.com
**Website:** https://cucuma.vercel.app
**Company:** Cucuma Private Label Beauty Platform`
  },
];

export default function PrivacyPolicy() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <Head>
        <title>Privacy Policy — Cucuma®</title>
        <meta name="description" content="Cucuma Privacy Policy — how we collect, use, and protect your data." />
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
          <a href="/terms" style={{ fontSize: 13, color: "#9A9490" }}>Terms of Service</a>
          <a href="/" style={{ fontSize: 13, color: "#9A9490" }}>← Back to Home</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: 120, paddingBottom: 60, textAlign: "center", borderBottom: "1px solid #2A2A2A", background: "linear-gradient(180deg, #161616 0%, #0C0C0C 100%)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#C4975A", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>Legal</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "#F5F0EB", marginBottom: 16, lineHeight: 1.1 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: "#6B6560" }}>Last updated: {LAST_UPDATED}</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 100px" }}>
        {/* Intro banner */}
        <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: 12, padding: "20px 24px", marginBottom: 48, borderLeft: "3px solid #C4975A" }}>
          <p style={{ fontSize: 14, color: "#9A9490", lineHeight: 1.7 }}>
            This Privacy Policy describes how Cucuma® collects, uses, and protects your information when you use our private label beauty platform. We take your privacy seriously and are committed to transparency.
          </p>
        </div>

        {/* Sections */}
        {SECTIONS.map((section, i) => (
          <div key={i} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F5F0EB", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #2A2A2A" }}>{section.title}</h2>
            <div style={{ fontSize: 14, color: "#9A9490", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {section.content.split("\n").map((line, j) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                  return <p key={j} style={{ color: "#F5F0EB", fontWeight: 600, marginTop: 16, marginBottom: 6 }}>{line.replace(/\*\*/g, "")}</p>;
                }
                if (line.startsWith("- ")) {
                  return <div key={j} style={{ display: "flex", gap: 10, marginBottom: 6 }}><span style={{ color: "#C4975A", flexShrink: 0 }}>·</span><span>{line.slice(2)}</span></div>;
                }
                if (line === "") return <br key={j} />;
                // Handle inline bold
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

        {/* Footer links */}
        <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: 32, display: "flex", gap: 24, flexWrap: "wrap" }}>
          <a href="/terms" style={{ fontSize: 13, color: "#C4975A" }}>Terms of Service →</a>
          <a href="mailto:support@cucuma.com" style={{ fontSize: 13, color: "#C4975A" }}>Contact Us →</a>
          <a href="/" style={{ fontSize: 13, color: "#6B6560" }}>← Back to Home</a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#161616", borderTop: "1px solid #2A2A2A", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: "#F5F0EB" }}>Cucuma<span style={{ color: "#C4975A" }}>®</span></span>
        <span style={{ fontSize: 12, color: "#6B6560" }}>© 2026 Cucuma®. All Rights Reserved.</span>
      </div>
    </>
  );
}