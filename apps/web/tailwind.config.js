/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--bg-primary-rgb) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--bg-surface-rgb) / <alpha-value>)",
          raised: "rgb(var(--bg-surface-raised-rgb) / <alpha-value>)",
          glass: "rgb(var(--bg-surface-glass-rgb) / <alpha-value>)",
        },
        border: {
          subtle: "var(--border-subtle)",
          prominent: "var(--border-prominent)",
        },
        primary: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          emerald: "rgb(var(--accent-emerald-rgb) / <alpha-value>)",
          indigo: "rgb(var(--accent-indigo-rgb) / <alpha-value>)",
          amber: "rgb(var(--accent-amber-rgb) / <alpha-value>)",
          rose: "rgb(var(--accent-rose-rgb) / <alpha-value>)",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
}
