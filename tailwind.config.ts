import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#171716",
        vignette: "#0E0906",
        bloom: "#33251C",
        gold: {
          DEFAULT: "#D4A85C",
          primary: "#D4A85C",
          hover: "#B98A3F",
          muted: "#8C6D39",
          dark: "#3B2B16",
        },
        offwhite: "#F2EEE6",
        warmdark: "#14100D",
        cardbg: "#1E1814",
        bordergold: "rgba(212, 168, 92, 0.25)",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        dmsans: ["var(--font-dmsans)", "sans-serif"],
        script: ["var(--font-greatvibes)", "cursive"],
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at center, #33251C 0%, #171716 55%, #0E0906 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4A85C 0%, #B98A3F 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
