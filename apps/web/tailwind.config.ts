import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // "Architectural Silence" palette — see DESIGN.md in the Stitch export.
        background: "#fbf9f8",
        surface: "#fbf9f8",
        "surface-bright": "#fbf9f8",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3f3",
        "surface-container": "#efeded",
        "surface-container-high": "#eae8e7",
        "surface-container-highest": "#e4e2e2",
        "on-surface": "#1b1c1c",
        "on-surface-variant": "#444748",
        outline: "#747878",
        "outline-variant": "#c4c7c7",
        primary: "#000000",
        "on-primary": "#ffffff",
        "inverse-surface": "#303030",
        secondary: "#735a3a",
        "on-secondary": "#ffffff",
        "secondary-fixed-dim": "#e2c19b",
        // Darker than `secondary` — meets 4.5:1 text contrast on white/bone
        // backgrounds (WCAG 2.2 AA, verified via axe earlier in this build).
        // Use for small secondary-colored TEXT; use `secondary` for
        // borders/backgrounds/hover accents where contrast math doesn't apply.
        "secondary-text": "#6b5220",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["64px", { lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-lg-mobile": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "400" }],
        "headline-md": ["32px", { lineHeight: "40px", fontWeight: "400" }],
        "headline-sm": ["24px", { lineHeight: "32px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.15em", fontWeight: "400" }],
      },
      spacing: {
        "section-gap": "120px",
        gutter: "24px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
      },
      maxWidth: {
        "container-max": "1440px",
      },
      borderRadius: {
        DEFAULT: "0px",
        none: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
