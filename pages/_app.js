// pages/_app.js
import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

// ── Theme color tokens ────────────────────────────────────────────
export const THEMES = {
  light: {
    bg: "#faf9f7",
    surface: "#ffffff",
    surfaceAlt: "#faf9f7",
    border: "#f0ebe3",
    borderAlt: "#e8ddd0",
    text: "#1a0e04",
    textMuted: "#a09080",
    textSub: "#6b5a4e",
    gold: "#c9963a",
    goldLight: "#fef3e2",
    goldBorder: "#f3d098",
    navActive: "#fef3e2",
    navActiveBorder: "#f3d098",
    navActiveText: "#c9963a",
    navText: "#6b5a4e",
    shadow: "0 2px 12px rgba(0,0,0,0.06)",
    inputBg: "#faf9f7",
    tagBg: "#f0fdf4",
    tagText: "#16a34a",
    tagBorder: "#bbf7d0",
  },
  dark: {
    bg: "#0d0f12",
    surface: "#13151a",
    surfaceAlt: "#0d0f12",
    border: "#1e2128",
    borderAlt: "#252830",
    text: "#e8e0d4",
    textMuted: "#6b6560",
    textSub: "#a09080",
    gold: "#d4b68e",
    goldLight: "rgba(212,182,142,0.1)",
    goldBorder: "rgba(212,182,142,0.3)",
    navActive: "rgba(212,182,142,0.1)",
    navActiveBorder: "#d4b68e",
    navActiveText: "#d4b68e",
    navText: "#6b6560",
    shadow: "0 2px 12px rgba(0,0,0,0.3)",
    inputBg: "#0d0f12",
    tagBg: "#0d2b1a",
    tagText: "#4ade80",
    tagBorder: "#166534",
  }
};

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState("light");

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("cucuma-theme");
    if (saved) setMode(saved);
  }, []);

  function toggleTheme() {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    localStorage.setItem("cucuma-theme", next);
  }

  const theme = THEMES[mode];

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      <style global jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${theme.bg}; color: ${theme.text}; transition: background 0.2s, color 0.2s; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }
        input { outline: none; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
}