import { createContext, useContext, useState, useEffect } from "react";
import Head from "next/head";

export const ThemeContext = createContext();
export function useTheme() { return useContext(ThemeContext); }

export const THEMES = {
  light: {
    // Matches landing page exactly
    bgBase: "#FAF7F2",
    bgCard: "#FFFFFF",
    bgElevated: "#F2EDE4",
    bgSurface: "#EDE8DF",
    borderSubtle: "#E8E0D4",
    borderDefault: "#D4C9B8",
    textPrimary: "#2C2C2C",
    textSecondary: "#6B6355",
    textTertiary: "#9A9085",
    gold: "#B8860B",
    goldHover: "#A07828",
    goldSubtle: "rgba(184,134,11,0.08)",
    goldBorder: "rgba(184,134,11,0.22)",
    olive: "#3D5A3E",
    oliveSubtle: "rgba(61,90,62,0.08)",
    oliveBorder: "rgba(61,90,62,0.2)",
    green: "#3D5A3E",
    greenSubtle: "rgba(61,90,62,0.08)",
    greenBorder: "rgba(61,90,62,0.2)",
    shadow: "0 1px 4px rgba(44,44,44,0.07)",
    shadowMd: "0 4px 20px rgba(44,44,44,0.1)",
  },
  dark: {
    bgBase: "#1a1208",
    bgCard: "#221A0E",
    bgElevated: "#2C2214",
    bgSurface: "#352A18",
    borderSubtle: "#3D3020",
    borderDefault: "#4A3A28",
    textPrimary: "#FAF7F2",
    textSecondary: "#C4B49A",
    textTertiary: "#8A7A66",
    gold: "#D4A84E",
    goldHover: "#E0B860",
    goldSubtle: "rgba(212,168,78,0.12)",
    goldBorder: "rgba(212,168,78,0.28)",
    olive: "#4A9D6E",
    oliveSubtle: "rgba(74,157,110,0.12)",
    oliveBorder: "rgba(74,157,110,0.28)",
    green: "#4A9D6E",
    greenSubtle: "rgba(74,157,110,0.12)",
    greenBorder: "rgba(74,157,110,0.28)",
    shadow: "0 1px 4px rgba(0,0,0,0.3)",
    shadowMd: "0 4px 20px rgba(0,0,0,0.4)",
  }
};

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cucuma-theme");
      if (saved === "dark" || saved === "light") setMode(saved);
    } catch {}
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    try { localStorage.setItem("cucuma-theme", next); } catch {}
  }

  const theme = THEMES[mode];

  // Avoid flash of wrong theme - use default dark until mounted
  const activeTheme = mounted ? THEMES[mode] : THEMES.dark;

  return (
    <ThemeContext.Provider value={{ mode, theme: activeTheme, toggleTheme }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          html {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            scroll-behavior: smooth;
          }
          body {
            font-family: 'DM Sans', sans-serif;
            background: ${activeTheme.bgBase};
            color: ${activeTheme.textPrimary};
            font-size: 14px;
            line-height: 1.6;
            overflow-x: hidden;
            transition: background 0.3s ease, color 0.3s ease;
          }

          /* Scrollbars */
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${activeTheme.borderDefault}; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: ${activeTheme.textTertiary}; }

          /* Focus styles */
          *:focus-visible {
            outline: 2px solid ${activeTheme.gold};
            outline-offset: 2px;
            border-radius: 4px;
          }

          /* Form elements */
          input, button, textarea, select {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          input:focus, textarea:focus, select:focus { outline: none; }
          a { text-decoration: none; color: inherit; }
          img { display: block; max-width: 100%; }

          /* Smooth transitions on theme-affected properties */
          div, section, aside, nav, header, footer, main, button, input, span, p, h1, h2, h3, h4 {
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease;
          }

          /* Button reset */
          button { cursor: pointer; }

          /* Prevent text select on interactive items */
          button, [role="button"] { user-select: none; }

          /* Global hover lift for interactive cards */
          .hover-lift {
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
          }
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: ${activeTheme.shadowMd} !important;
          }

          /* Responsive utilities */
          @media (max-width: 768px) {
            .hide-mobile { display: none !important; }
          }
          @media (min-width: 769px) {
            .hide-desktop { display: none !important; }
          }

          /* Page transition */
          @keyframes pageIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .page-enter {
            animation: pageIn 0.25s ease;
          }

          /* Common animations */
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes shimmer { from { transform:translateX(-100%); } to { transform:translateX(100%); } }
          @keyframes toastIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

          /* Mono font for numbers/prices */
          .mono { font-family: 'JetBrains Mono', monospace !important; }

          /* Gold text */
          .text-gold { color: ${activeTheme.gold} !important; }
          .text-green { color: ${activeTheme.green} !important; }
          .text-muted { color: ${activeTheme.textTertiary} !important; }

          /* Common badge */
          .badge-gold {
            background: ${activeTheme.goldSubtle};
            color: ${activeTheme.gold};
            border: 1px solid ${activeTheme.goldBorder};
            font-size: 11px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 100px;
          }
          .badge-green {
            background: ${activeTheme.greenSubtle};
            color: ${activeTheme.green};
            border: 1px solid ${activeTheme.greenBorder};
            font-size: 11px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 100px;
          }

          /* Primary button */
          .btn-primary {
            background: ${activeTheme.gold};
            color: white;
            border: none;
            border-radius: 8px;
            padding: 9px 18px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .btn-primary:hover {
            background: ${activeTheme.goldHover};
            transform: translateY(-1px);
            box-shadow: 0 4px 14px rgba(196,151,90,0.35);
          }
          .btn-primary:active { transform: translateY(0); }

          /* Secondary button */
          .btn-secondary {
            background: transparent;
            color: ${activeTheme.textSecondary};
            border: 1px solid ${activeTheme.borderDefault};
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .btn-secondary:hover {
            background: ${activeTheme.bgElevated};
            color: ${activeTheme.textPrimary};
            border-color: ${activeTheme.borderDefault};
          }
        `}</style>
      </Head>
      <div className="page-enter">
        <Component {...pageProps} />
      </div>
    </ThemeContext.Provider>
  );
}