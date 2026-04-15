import { createContext, useContext, useState, useEffect } from "react";
import Head from "next/head";

export const ThemeContext = createContext();
export function useTheme() { return useContext(ThemeContext); }

export const THEMES = {
  light: {
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
    goldText: "#7a5c00",
    olive: "#3D5A3E",
    oliveSubtle: "rgba(61,90,62,0.08)",
    oliveBorder: "rgba(61,90,62,0.2)",
    green: "#3D5A3E",
    greenSubtle: "rgba(61,90,62,0.08)",
    greenBorder: "rgba(61,90,62,0.2)",
    orange: "#C05020",
    orangeSubtle: "rgba(192,80,32,0.08)",
    orangeBorder: "rgba(192,80,32,0.2)",
    shadow: "0 1px 4px rgba(44,44,44,0.07)",
    shadowMd: "0 4px 20px rgba(44,44,44,0.1)",
  },
  dark: {
    bgBase: "#1C150D",
    bgCard: "#251D12",
    bgElevated: "#2E2418",
    bgSurface: "#372B1C",
    borderSubtle: "#3E3020",
    borderDefault: "#4A3A28",
    textPrimary: "#FAF7F2",
    textSecondary: "#C4B49A",
    textTertiary: "#8A7A66",
    gold: "#D4A84E",
    goldHover: "#E0B860",
    goldSubtle: "rgba(212,168,78,0.12)",
    goldBorder: "rgba(212,168,78,0.28)",
    goldText: "#D4A84E",
    olive: "#5AB87A",
    oliveSubtle: "rgba(90,184,122,0.12)",
    oliveBorder: "rgba(90,184,122,0.28)",
    green: "#5AB87A",
    greenSubtle: "rgba(90,184,122,0.12)",
    greenBorder: "rgba(90,184,122,0.28)",
    orange: "#E07050",
    orangeSubtle: "rgba(224,112,80,0.12)",
    orangeBorder: "rgba(224,112,80,0.28)",
    shadow: "0 1px 4px rgba(0,0,0,0.3)",
    shadowMd: "0 4px 20px rgba(0,0,0,0.4)",
  }
};

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cucuma-theme");
      if (saved === "dark" || saved === "light") setMode(saved);
    } catch {}
  }, []);

  function toggleTheme() {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    try { localStorage.setItem("cucuma-theme", next); } catch {}
  }

  const theme = THEMES[mode];

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
          body {
            font-family: 'DM Sans', sans-serif;
            background: ${theme.bgBase};
            color: ${theme.textPrimary};
            font-size: 14px;
            line-height: 1.6;
            overflow-x: hidden;
          }
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${theme.borderDefault}; border-radius: 10px; }
          input, button, textarea, select { font-family: 'DM Sans', sans-serif; }
          input:focus, textarea:focus, select:focus { outline: none; }
          a { text-decoration: none; color: inherit; }
          img { display: block; max-width: 100%; }
          button { cursor: pointer; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes shimmer { from { transform:translateX(-100%); } to { transform:translateX(100%); } }
          @keyframes toastIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
          @keyframes pageIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
          .page-enter { animation: pageIn 0.2s ease; }
          .mono { font-family: 'JetBrains Mono', monospace !important; }
          .serif { font-family: 'Cormorant Garamond', Georgia, serif !important; }
          @media (max-width: 768px) { .hide-mobile { display: none !important; } }
          @media (min-width: 769px) { .hide-desktop { display: none !important; } }
        `}</style>
      </Head>
      <div className="page-enter">
        <Component {...pageProps} />
      </div>
    </ThemeContext.Provider>
  );
}