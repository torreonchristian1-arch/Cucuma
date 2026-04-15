// SETTINGS PAGE
import { useState } from "react";
import { useRouter } from "next/router";
import SideNav from "../components/SideNav";
import { PageHeader, Toast } from "../components/Layout";
import { useTheme } from "./_app";

export default function Settings() {
  const router = useRouter();
  const { shop } = router.query;
  const { theme: T, mode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);

  function handleSave() { setSaved(true); setToast({ msg: "Settings saved!", type: "success" }); setTimeout(() => { setSaved(false); setToast(null); }, 3000); }
  function goTo(href) { router.push(`${href}?shop=${shop || ""}`); }

  const Card = ({ children, danger }) => (
    <div style={{ background:T.bgCard, border:`1px solid ${danger?"rgba(192,80,32,0.2)":T.borderSubtle}`, borderRadius:12, padding:"18px 20px", boxShadow:T.shadow, marginBottom:12 }}>{children}</div>
  );
  const SectionTitle = ({ children }) => (
    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:T.textPrimary, marginBottom:14 }}>{children}</div>
  );

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bgBase, overflow:"hidden" }}>
      <style>{`input{outline:none;} @media(max-width:768px){.hdr{padding:10px 16px 10px 52px!important;}.mpad{padding:16px!important;}.cgrid{grid-template-columns:1fr!important;}.hide-mobile{display:none!important;}}`}</style>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SideNav active="settings" shop={shop} open={open} />
      <main style={{ flex:1, overflow:"auto" }}>
        <PageHeader title="Settings" subtitle="Manage your app configuration" onMenuToggle={() => setOpen(!open)}
          actions={
            <button onClick={handleSave} style={{ background:saved?T.oliveSubtle:T.olive, border:saved?`1px solid ${T.oliveBorder}`:"none", borderRadius:8, padding:"8px 18px", color:saved?T.olive:"white", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif" }}>
              {saved?"Saved ✓":"Save Settings"}
            </button>
          }
        />
        <div className="mpad" style={{ padding:"18px 24px", maxWidth:700 }}>
          {/* Appearance */}
          <Card>
            <SectionTitle>Appearance</SectionTitle>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", background:T.bgSurface, borderRadius:8, border:`1px solid ${T.borderSubtle}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {mode==="dark"
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textSecondary} strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textSecondary} strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
                }
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:T.textPrimary }}>{mode==="dark"?"Dark Mode":"Light Mode"}</div>
                  <div style={{ fontSize:12, color:T.textTertiary }}>Switch between light and dark themes</div>
                </div>
              </div>
              <div onClick={toggleTheme} style={{ width:44, height:24, background:mode==="dark"?T.olive:T.borderDefault, borderRadius:100, position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                <div style={{ position:"absolute", top:3, left:mode==="dark"?22:3, width:18, height:18, background:"white", borderRadius:"50%", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}></div>
              </div>
            </div>
          </Card>

          {/* Store */}
          <Card>
            <SectionTitle>Store Information</SectionTitle>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 }}>Connected Store</label>
              <input defaultValue={shop||""} readOnly style={{ width:"100%", background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:8, padding:"9px 12px", color:T.textSecondary, fontSize:14, fontFamily:"monospace" }} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:8 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:T.olive }}></div>
              <span style={{ fontSize:13, fontWeight:600, color:T.olive }}>App installed and active</span>
            </div>
          </Card>

          {/* Custom Domain */}
          <Card>
            <SectionTitle>Custom Domain</SectionTitle>
            <p style={{ fontSize:13, color:T.textSecondary, lineHeight:1.7, marginBottom:14 }}>Connect your own domain through Shopify: <strong style={{ color:T.textPrimary }}>Shopify Admin → Settings → Domains</strong></p>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
              {["Buy a domain from any registrar (GoDaddy, Namecheap, etc.)", "In Shopify: Settings → Domains → Connect existing domain", "Update your DNS records as instructed by Shopify", "Wait 24-48 hours for DNS propagation"].map((s, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:T.olive, flexShrink:0, marginTop:1 }}>{i+1}</div>
                  <span style={{ fontSize:13, color:T.textSecondary, lineHeight:1.5 }}>{s}</span>
                </div>
              ))}
            </div>
            <a href="https://help.shopify.com/en/manual/domains" target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, background:T.bgSurface, border:`1px solid ${T.borderDefault}`, borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:600, color:T.textSecondary, textDecoration:"none" }}>
              Shopify Domain Guide →
            </a>
          </Card>

          {/* Webhooks */}
          <Card>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <SectionTitle>Webhook Status</SectionTitle>
              <span style={{ fontSize:10, fontWeight:700, color:T.olive, background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, borderRadius:100, padding:"3px 10px" }}>ALL ACTIVE</span>
            </div>
            {["orders/create", "orders/fulfilled", "orders/cancelled", "products/update"].map((w, i, arr) => (
              <div key={w} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.borderSubtle}`:"none" }}>
                <code style={{ fontSize:12, color:T.textSecondary }}>{w}</code>
                <div style={{ display:"flex", alignItems:"center", gap:5, background:T.oliveSubtle, padding:"3px 10px", borderRadius:100 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:T.olive }}></div>
                  <span style={{ fontSize:10, fontWeight:700, color:T.olive }}>Active</span>
                </div>
              </div>
            ))}
          </Card>

          {/* Config */}
          <Card>
            <SectionTitle>App Configuration</SectionTitle>
            <div className="cgrid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[["API Version","2024-01"],["App Version","1.0.0"],["Environment","Production"],["Region","Asia Pacific"]].map(([l,v]) => (
                <div key={l}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.textTertiary, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>{l}</div>
                  <div style={{ fontSize:13, fontWeight:500, color:T.textSecondary, background:T.bgSurface, border:`1px solid ${T.borderSubtle}`, borderRadius:7, padding:"8px 10px" }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Help link */}
          <div onClick={() => goTo("/help")} style={{ background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:12, padding:"14px 18px", boxShadow:T.shadow, cursor:"pointer", display:"flex", alignItems:"center", gap:14, marginBottom:12, transition:"all 0.15s" }}>
            <div style={{ width:38, height:38, borderRadius:9, background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.olive} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:T.textPrimary }}>Help Center & FAQ</div>
              <div style={{ fontSize:12, color:T.textTertiary, marginTop:1 }}>Find answers to common questions</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" style={{ marginLeft:"auto" }}><polyline points="9 18 15 12 9 6"/></svg>
          </div>

          {/* Billing link */}
          <div onClick={() => goTo("/billing")} style={{ background:T.bgCard, border:`1px solid ${T.borderSubtle}`, borderRadius:12, padding:"14px 18px", boxShadow:T.shadow, cursor:"pointer", display:"flex", alignItems:"center", gap:14, marginBottom:12, transition:"all 0.15s" }}>
            <div style={{ width:38, height:38, borderRadius:9, background:T.oliveSubtle, border:`1px solid ${T.oliveBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.olive} strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:T.textPrimary }}>Billing & Plans</div>
              <div style={{ fontSize:12, color:T.textTertiary, marginTop:1 }}>Manage your subscription</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" style={{ marginLeft:"auto" }}><polyline points="9 18 15 12 9 6"/></svg>
          </div>

          {/* Danger */}
          <Card danger>
            <div style={{ fontSize:14, fontWeight:700, color:T.orange, marginBottom:12 }}>Danger Zone</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:T.textPrimary }}>Uninstall App</div>
                <div style={{ fontSize:12, color:T.textTertiary, marginTop:2 }}>Permanently remove from your Shopify store</div>
              </div>
              <button style={{ background:"transparent", border:`1px solid ${T.orangeBorder}`, borderRadius:8, padding:"8px 16px", color:T.orange, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Uninstall</button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}