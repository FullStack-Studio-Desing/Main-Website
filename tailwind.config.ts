import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "var(--color-forest)",
        ink: "var(--color-ink)",
        moss: "var(--color-moss)",
        neon: {
          DEFAULT: "var(--color-neon)",
          active: "var(--color-neon-active)",
        },
        leaf: "var(--color-active-green)",
        mint: "var(--color-mint)",
        paper: "var(--color-paper)",
        body: "var(--color-body)",
        muted: "var(--color-muted)",
        sage: "var(--color-sage)",
        rule: "var(--color-rule)",
        fog: "var(--color-fog)",
        "input-edge": "var(--color-input-edge)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial", "sans-serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
      },
      borderRadius: {
        action: "28px",
        card: "8px",
        panel: "16px",
        shell: "24px",
        capsule: "40px",
        proof: "64px",
      },
      boxShadow: {
        "form-lift": "0px 4px 40px 0px rgba(0, 0, 0, 0.2)",
        "culture-card": "0px 1px 3px 0px rgba(0, 0, 0, 0.04)",
        "cinematic-glow": "0px 4px 40px 0px rgba(104, 239, 63, 0.4)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "chat-dot": {
          "0%, 100%": { opacity: "0.35", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(-2px)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "chat-dot": "chat-dot 1.1s ease-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
