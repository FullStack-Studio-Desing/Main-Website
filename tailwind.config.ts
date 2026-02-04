import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Minifolio brand palette */
        theme: "#bff747",
        "theme-accent": "#28e98c",
        "bg-body": "#060606",
        "bg-section": "#171914",
        "text-header": "#ffffff",
        "text-body": "#c1c1c1",
        "text-muted": "#bbbbbc",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        ui: ["var(--font-ui)", "sans-serif"],
      },
      borderRadius: {
        pill: "100px",
        "pill-alt": "60px",
      },
      boxShadow: {
        brand: "0px 4px 25px 0px rgba(0, 0, 0, 0.06)",
        input: "0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)",
      },
      borderWidth: {
        "1.5": "1.5px",
      },
      borderColor: {
        "brand-default": "rgba(193, 193, 193, 0.16)",
        "brand-accent": "#28e98c",
        "brand-subtle": "rgba(102, 102, 102, 0.16)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "meteor-effect": {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "beam-animation": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "10%": {
            opacity: "1",
          },
          "90%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateY(100vh)",
            opacity: "0",
          },
        },
        explosion: {
          "0%": {
            transform: "rotate(var(--rotation)) translateY(0)",
            opacity: "1",
          },
          "100%": {
            transform: "rotate(var(--rotation)) translateY(var(--explosion-distance, 60px))",
            opacity: "0",
          },
        },
        "cell-ripple": {
          "0%": {
            transform: "scale(1)",
            backgroundColor: "rgba(191, 247, 71, 0.02)",
          },
          "50%": {
            transform: "scale(1.05)",
            backgroundColor: "rgba(191, 247, 71, 0.15)",
          },
          "100%": {
            transform: "scale(1)",
            backgroundColor: "rgba(191, 247, 71, 0.02)",
          },
        },
      },
      animation: {
        spotlight: "spotlight 2s ease 0.75s 1 forwards",
        shimmer: "shimmer 2s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "meteor-effect": "meteor-effect 5s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "cell-ripple": "cell-ripple ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
