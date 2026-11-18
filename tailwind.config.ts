import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
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
        soft: "var(--color-muted)",
        sage: "var(--color-sage)",
        rule: "var(--color-rule)",
        fog: "var(--color-fog)",
        "input-edge": "var(--color-input-edge)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial", "sans-serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
