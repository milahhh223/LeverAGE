import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-elevated": "var(--background-elevated)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        "foreground-subtle": "var(--foreground-subtle)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          muted: "var(--primary-muted)",
          deep: "var(--primary-deep)",
          atmospheric: "var(--primary-atmospheric)",
        },
        positive: {
          DEFAULT: "var(--positive)",
          muted: "var(--positive-muted)",
        },
        negative: {
          DEFAULT: "var(--negative)",
          muted: "var(--negative-muted)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          muted: "var(--warning-muted)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 6vw, 6rem)", { lineHeight: "0.98", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg": ["clamp(2.25rem, 4vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.02em", fontWeight: "600" }],
        "heading-xl": ["2rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-md": ["1.125rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.55", fontWeight: "400" }],
        label: ["0.8125rem", { lineHeight: "1.2", fontWeight: "500", letterSpacing: "0.01em" }],
        caption: ["0.75rem", { lineHeight: "1.3", fontWeight: "400", letterSpacing: "0.01em" }],
        data: ["1rem", { lineHeight: "1.1", fontWeight: "600", letterSpacing: "-0.01em" }],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
        32: "128px",
      },
      maxWidth: {
        marketing: "1240px",
        app: "1440px",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "360ms",
      },
    },
  },
  plugins: [],
};

export default config;
