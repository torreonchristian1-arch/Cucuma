import { useTheme } from "../pages/_app";
import SideNav from "./SideNav";

// ── Page Layout ───────────────────────────────────────────────────
export function PageLayout({ active, shop, sidebarOpen, children }) {
  const { theme: T } = useTheme();
  return (
    <div style={{ display: "flex", height: "100vh", background: T.bgBase, overflow: "hidden" }}>
      <SideNav active={active} shop={shop} open={sidebarOpen} />
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, onMenuToggle }) {
  const { theme: T } = useTheme();
  return (
    <header style={{ padding: "13px 24px", background: T.bgCard, borderBottom: `1px solid ${T.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: T.shadow, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onMenuToggle && (
          <button onClick={onMenuToggle} className="hide-mobile" style={{ background: "none", border: `1px solid ${T.borderSubtle}`, borderRadius: 7, padding: "6px 8px", color: T.textTertiary, cursor: "pointer", display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        )}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: T.textPrimary, lineHeight: 1.2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: T.textTertiary, marginTop: 1 }}>{subtitle}</div>}
        </div>
      </div>
      {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
    </header>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────
export function StatCard({ icon, label, value, delta, up }) {
  const { theme: T } = useTheme();
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 12, padding: "18px 20px", boxShadow: T.shadow, transition: "transform 0.2s, box-shadow 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: T.oliveSubtle, border: `1px solid ${T.oliveBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        {delta && <span style={{ fontSize: 11, fontWeight: 600, color: up ? T.olive : T.orange, background: up ? T.oliveSubtle : T.orangeSubtle, border: `1px solid ${up ? T.oliveBorder : T.orangeBorder}`, padding: "2px 8px", borderRadius: 100 }}>{up ? "↑" : "↓"} {delta}</span>}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: T.textPrimary, marginBottom: 4, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: T.textTertiary }}>{label}</div>
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", size = "md", disabled, style = {} }) {
  const { theme: T } = useTheme();
  const styles = {
    primary: { background: T.olive, color: "white", border: "none" },
    secondary: { background: "transparent", color: T.textSecondary, border: `1px solid ${T.borderDefault}` },
    gold: { background: T.gold, color: "white", border: "none" },
    ghost: { background: "transparent", color: T.olive, border: `1px solid ${T.oliveBorder}` },
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: 12 },
    md: { padding: "8px 16px", fontSize: 13 },
    lg: { padding: "11px 24px", fontSize: 14 },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...styles[variant], ...sizes[size], borderRadius: 8, fontWeight: 600, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif", ...style }}>
      {children}
    </button>
  );
}

// ── Badge ─────────────────────────────────────────────────────────
export function Badge({ children, variant = "gold" }) {
  const { theme: T } = useTheme();
  const styles = {
    gold: { bg: T.goldSubtle, color: T.gold, border: T.goldBorder },
    olive: { bg: T.oliveSubtle, color: T.olive, border: T.oliveBorder },
    orange: { bg: T.orangeSubtle, color: T.orange, border: T.orangeBorder },
    muted: { bg: T.bgSurface, color: T.textTertiary, border: T.borderSubtle },
  };
  const s = styles[variant] || styles.gold;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────
export function Card({ children, style = {}, onClick }) {
  const { theme: T } = useTheme();
  return (
    <div onClick={onClick} style={{ background: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: 12, boxShadow: T.shadow, overflow: "hidden", cursor: onClick ? "pointer" : "default", transition: "all 0.2s", ...style }}>
      {children}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────
export function EmptyState({ icon, title, description, cta, onCta }) {
  const { theme: T } = useTheme();
  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: T.bgSurface, border: `1px solid ${T.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>{icon}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>{title}</div>
      <p style={{ fontSize: 13, color: T.textTertiary, maxWidth: 320, margin: "0 auto 20px", lineHeight: 1.65 }}>{description}</p>
      {cta && <Btn onClick={onCta}>{cta}</Btn>}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────
export function Spinner({ size = 28 }) {
  const { theme: T } = useTheme();
  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      <div style={{ width: size, height: size, border: `2px solid ${T.borderDefault}`, borderTopColor: T.olive, borderRadius: "50%", animation: "spin 0.75s linear infinite" }}></div>
    </>
  );
}

// ── Toast ─────────────────────────────────────────────────────────
export function Toast({ message, type = "success", onClose }) {
  const { theme: T } = useTheme();
  const colors = {
    success: { border: T.oliveBorder, dot: T.olive },
    error: { border: T.orangeBorder, dot: T.orange },
    info: { border: T.goldBorder, dot: T.gold },
  };
  const c = colors[type] || colors.success;
  return (
    <>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}`}</style>
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000, background: T.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, padding: "13px 16px", maxWidth: 340, boxShadow: T.shadowMd, display: "flex", alignItems: "center", gap: 10, animation: "toastIn 0.25s ease" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0 }}></div>
        <span style={{ fontSize: 13, color: T.textPrimary, fontWeight: 500, flex: 1 }}>{message}</span>
        {onClose && <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textTertiary, fontSize: 18, flexShrink: 0 }}>×</button>}
      </div>
    </>
  );
}

// ── Status Badge ──────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const { theme: T } = useTheme();
  const map = {
    fulfilled: { bg: T.oliveSubtle, color: T.olive, border: T.oliveBorder, label: "Fulfilled" },
    unfulfilled: { bg: T.goldSubtle, color: T.gold, border: T.goldBorder, label: "Unfulfilled" },
    pending: { bg: T.goldSubtle, color: T.gold, border: T.goldBorder, label: "Pending" },
    processing: { bg: T.goldSubtle, color: T.gold, border: T.goldBorder, label: "Processing" },
    cancelled: { bg: T.orangeSubtle, color: T.orange, border: T.orangeBorder, label: "Cancelled" },
  };
  const s = map[status?.toLowerCase()] || map.pending;
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>{s.label}</span>;
}