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
          primary: "rgb(var(--accent-primary-rgb) / <alpha-value>)",
          emerald: "rgb(var(--accent-emerald-rgb) / <alpha-value>)",
          indigo: "rgb(var(--accent-indigo-rgb) / <alpha-value>)",
          amber: "rgb(var(--accent-amber-rgb) / <alpha-value>)",
          rose: "rgb(var(--accent-rose-rgb) / <alpha-value>)",
        },
      },
      textColor: {
        "btn-fg": "var(--accent-primary-fg)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
