import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();
export function useTheme() { return useContext(ThemeContext); }

export const THEMES = {
  light: {
    bg: "#f8f7f5",
    surface: "#ffffff",
    surfaceAlt: "#f8f7f5",
    surfaceHover: "#f3f0eb",
    border: "#ebe6de",
    text: "#1a1208",
    textMuted: "#9a8878",
    textSub: "#5a4a3a",
    gold: "#b8862a",
    goldBg: "#fff8ed",
    goldBorder: "#f0d090",
    goldText: "#b8862a",
    navBg: "#ffffff",
    navActive: "#fff8ed",
    navActiveText: "#b8862a",
    navText: "#7a6a5a",
    inputBg: "#f8f7f5",
    shadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
    shadowMd: "0 4px 24px rgba(0,0,0,0.08)",
    green: "#16a34a",
    greenBg: "#f0fdf4",
    greenBorder: "#bbf7d0",
    orange: "#ea580c",
    orangeBg: "#fff7ed",
    orangeBorder: "#fed7aa",
    blue: "#2563eb",
    blueBg: "#eff6ff",
    blueBorder: "#bfdbfe",
  },
  dark: {
    bg: "#111010",
    surface: "#1a1917",
    surfaceAlt: "#111010",
    surfaceHover: "#222018",
    border: "#2a2720",
    text: "#f0e8d8",
    textMuted: "#7a6a5a",
    textSub: "#a09080",
    gold: "#d4a84e",
    goldBg: "rgba(212,168,78,0.1)",
    goldBorder: "rgba(212,168,78,0.25)",
    goldText: "#d4a84e",
    navBg: "#1a1917",
    navActive: "rgba(212,168,78,0.1)",
    navActiveText: "#d4a84e",
    navText: "#7a6a5a",
    inputBg: "#111010",
    shadow: "0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
    shadowMd: "0 4px 24px rgba(0,0,0,0.3)",
    green: "#4ade80",
    greenBg: "#0d2b1a",
    greenBorder: "#166534",
    orange: "#fb923c",
    orangeBg: "#1a0d00",
    orangeBorder: "#9a3412",
    blue: "#60a5fa",
    blueBg: "#0d1a2b",
    blueBorder: "#1e3a5f",
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
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    try { localStorage.setItem("cucuma-theme", next); } catch {}
  }

  const theme = THEMES[mode];

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Manrope:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-font-smoothing: antialiased; }
        body { background: ${theme.bg}; color: ${theme.text}; font-family: 'Manrope', sans-serif; transition: background 0.25s, color 0.25s; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
        input, button, textarea { font-family: 'Manrope', sans-serif; }
        input:focus, textarea:focus { outline: none; }
        a { text-decoration: none; }
      `}</style>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
}