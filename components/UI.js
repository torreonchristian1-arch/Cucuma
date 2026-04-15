import { useTheme } from "../pages/_app";

// ── Skeleton Loader ───────────────────────────────────────────────
export function Skeleton({ width = "100%", height = 16, radius = 6, style = {} }) {
  const { theme } = useTheme();
  return (
    <div style={{ width, height, borderRadius: radius, background: theme.bgElevated, position: "relative", overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent 0%, ${theme.bgSurface} 50%, transparent 100%)`, animation: "shimmer 1.4s infinite" }}></div>
      <style>{`@keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }`}</style>
    </div>
  );
}

export function SkeletonCard({ rows = 3, style = {} }) {
  const { theme } = useTheme();
  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, padding: "18px 20px", boxShadow: theme.shadow, ...style }}>
      <Skeleton height={14} width="60%" style={{ marginBottom: 10 }} />
      <Skeleton height={28} width="40%" style={{ marginBottom: 14 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={10} width={`${70 + Math.random() * 30}%`} style={{ marginBottom: i < rows - 1 ? 8 : 0 }} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 4, cols = 5 }) {
  const { theme } = useTheme();
  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderSubtle}`, borderRadius: 10, overflow: "hidden", boxShadow: theme.shadow }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.borderSubtle}` }}>
        <Skeleton height={14} width="30%" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 16, padding: "13px 18px", borderBottom: i < rows - 1 ? `1px solid ${theme.borderSubtle}` : "none" }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} height={11} width={`${60 + Math.random() * 40}%`} style={{ flex: 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Toast Notification ────────────────────────────────────────────
export function Toast({ message, type = "success", onClose }) {
  const { theme } = useTheme();
  const colors = {
    success: { border: theme.greenBorder, dot: theme.green },
    error: { border: "rgba(192,80,80,0.35)", dot: "#C05050" },
    info: { border: theme.goldBorder, dot: theme.gold },
  };
  const c = colors[type] || colors.success;

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000, background: theme.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, padding: "13px 16px", maxWidth: 320, boxShadow: theme.shadowMd, display: "flex", alignItems: "center", gap: 10, animation: "toastIn 0.25s ease" }}>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0 }}></div>
      <span style={{ fontSize: 13, color: theme.textPrimary, fontWeight: 500, flex: 1 }}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textTertiary, fontSize: 16, padding: 0, lineHeight: 1, flexShrink: 0 }}>×</button>
      )}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────
export function EmptyState({ icon, title, description, cta, onCta }) {
  const { theme } = useTheme();
  return (
    <div style={{ textAlign: "center", padding: "56px 24px" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: theme.bgSurface, border: `1px solid ${theme.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>
        {icon}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>{title}</div>
      <p style={{ fontSize: 13, color: theme.textTertiary, maxWidth: 320, margin: "0 auto 20px", lineHeight: 1.65 }}>{description}</p>
      {cta && (
        <button onClick={onCta} style={{ background: theme.gold, border: "none", borderRadius: 8, padding: "10px 22px", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
          {cta}
        </button>
      )}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────
export function Spinner({ size = 28 }) {
  const { theme } = useTheme();
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: size, height: size, border: `2px solid ${theme.borderDefault}`, borderTopColor: theme.gold, borderRadius: "50%", animation: "spin 0.75s linear infinite" }}></div>
    </>
  );
}

// ── Status Badge ──────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const { theme } = useTheme();
  const styles = {
    fulfilled: { bg: theme.greenSubtle, color: theme.green, label: "Fulfilled" },
    unfulfilled: { bg: "rgba(196,151,90,0.12)", color: theme.gold, label: "Unfulfilled" },
    pending: { bg: "rgba(196,151,90,0.12)", color: theme.gold, label: "Pending" },
    processing: { bg: "rgba(196,151,90,0.12)", color: theme.gold, label: "Processing" },
    cancelled: { bg: "rgba(192,80,80,0.1)", color: "#C05050", label: "Cancelled" },
    active: { bg: theme.greenSubtle, color: theme.green, label: "Active" },
    trial: { bg: "rgba(196,151,90,0.12)", color: theme.gold, label: "Trial" },
  };
  const s = styles[status?.toLowerCase()] || styles.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>{s.label}</span>
  );
}

// ── Page Header ───────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, onMenuToggle }) {
  const { theme } = useTheme();
  return (
    <header style={{ padding: "12px 24px", background: theme.bgCard, borderBottom: `1px solid ${theme.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: theme.shadow, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onMenuToggle && (
          <button onClick={onMenuToggle} style={{ background: "none", border: `1px solid ${theme.borderSubtle}`, borderRadius: 7, padding: "6px 9px", color: theme.textTertiary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", flexShrink: 0 }}
            className="hide-sm-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        )}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary, lineHeight: 1.2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: theme.textTertiary, marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
      <style>{`.hide-sm-btn { } @media(max-width:768px){ .hide-sm-btn { display:none !important; } }`}</style>
    </header>
  );
}