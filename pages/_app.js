import { createContext, useContext, useState, useEffect } from "react";
import Head from "next/head";

export const ThemeContext = createContext();
export function useTheme() { return useContext(ThemeContext); }

// Design tokens per brief
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
    goldBorder: "rgba(196,151,90,0.3)",
    green: "#4A9D6E",
    greenSubtle: "rgba(74,157,110,0.12)",
    greenBorder: "rgba(74,157,110,0.3)",
    shadow: "0 1px 3px rgba(0,0,0,0.4)",
    shadowMd: "0 4px 16px rgba(0,0,0,0.4)",
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
    shadow: "0 1px 3px rgba(0,0,0,0.08)",
    shadowMd: "0 4px 16px rgba(0,0,0,0.1)",
  }
};

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState("dark");

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: ${theme.bgBase};
            color: ${theme.textPrimary};
            transition: background 0.3s, color 0.3s;
            font-size: 14px;
            line-height: 1.6;
          }
          ::-webkit-scrollbar { width: 5px; height: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${theme.borderDefault}; border-radius: 10px; }
          input, button, textarea, select { font-family: inherit; }
          input:focus, textarea:focus, select:focus { outline: none; }
          a { text-decoration: none; color: inherit; }
          img { display: block; max-width: 100%; }
          * { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
}