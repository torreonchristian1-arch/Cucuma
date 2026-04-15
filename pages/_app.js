import { createContext, useContext, useState, useEffect } from "react";
import Head from "next/head";

export const ThemeContext = createContext();
export function useTheme() { return useContext(ThemeContext); }

export const THEMES = {
  dark: {
    bgBase: "#0C0C0C",
    bgCard: "#161616",
    bgElevated: "#1E1E1E",
    bgSurface: "#252525",
    borderSubtle: "#2A2A2A",
    borderDefault: "#333333",
    textPrimary: "#F5F0EB",
    textSecondary: "#9A9490",
    textTertiary: "#6B6560",
    gold: "#C4975A",
    goldHover: "#D4A76A",
    goldSubtle: "rgba(196,151,90,0.12)",
    goldBorder: "rgba(196,151,90,0.28)",
    green: "#4A9D6E",
    greenSubtle: "rgba(74,157,110,0.12)",
    greenBorder: "rgba(74,157,110,0.28)",
    shadow: "0 1px 3px rgba(0,0,0,0.4)",
    shadowMd: "0 4px 20px rgba(0,0,0,0.45)",
  },
  light: {
    bgBase: "#F8F5F1",
    bgCard: "#FFFFFF",
    bgElevated: "#F2EDE6",
    bgSurface: "#EDE8E1",
    borderSubtle: "#E5DDD4",
    borderDefault: "#D4C9BC",
    textPrimary: "#1A1208",
    textSecondary: "#6B5A4A",
    textTertiary: "#9A8A7A",
    gold: "#A07030",
    goldHover: "#B08040",
    goldSubtle: "rgba(160,112,48,0.1)",
    goldBorder: "rgba(160,112,48,0.25)",
    green: "#2E7D52",
    greenSubtle: "rgba(46,125,82,0.1)",
    greenBorder: "rgba(46,125,82,0.25)",
    shadow: "0 1px 3px rgba(0,0,0,0.07)",
    shadowMd: "0 4px 20px rgba(0,0,0,0.1)",
  }
};

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState("dark");
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
  const activeTheme = mounted ? theme : THEMES.dark;

  const theme = activeTheme;

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
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
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: ${theme.bgBase};
            color: ${theme.textPrimary};
            font-size: 14px;
            line-height: 1.6;
            overflow-x: hidden;
            transition: background 0.3s ease, color 0.3s ease;
          }

          /* Scrollbars */
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${theme.borderDefault}; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: ${theme.textTertiary}; }

          /* Focus styles */
          *:focus-visible {
            outline: 2px solid ${theme.gold};
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
            box-shadow: ${theme.shadowMd} !important;
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
          .text-gold { color: ${theme.gold} !important; }
          .text-green { color: ${theme.green} !important; }
          .text-muted { color: ${theme.textTertiary} !important; }

          /* Common badge */
          .badge-gold {
            background: ${theme.goldSubtle};
            color: ${theme.gold};
            border: 1px solid ${theme.goldBorder};
            font-size: 11px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 100px;
          }
          .badge-green {
            background: ${theme.greenSubtle};
            color: ${theme.green};
            border: 1px solid ${theme.greenBorder};
            font-size: 11px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 100px;
          }

          /* Primary button */
          .btn-primary {
            background: ${theme.gold};
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
            background: ${theme.goldHover};
            transform: translateY(-1px);
            box-shadow: 0 4px 14px rgba(196,151,90,0.35);
          }
          .btn-primary:active { transform: translateY(0); }

          /* Secondary button */
          .btn-secondary {
            background: transparent;
            color: ${theme.textSecondary};
            border: 1px solid ${theme.borderDefault};
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
            background: ${theme.bgElevated};
            color: ${theme.textPrimary};
            border-color: ${theme.borderDefault};
          }
        `}</style>
      </Head>
      <div className="page-enter">
        <Component {...pageProps} />
      </div>
    </ThemeContext.Provider>
  );
}