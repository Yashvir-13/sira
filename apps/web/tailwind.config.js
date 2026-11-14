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
        background: "var(--bg-primary)",
        surface: {
          DEFAULT: "var(--bg-surface)",
          raised: "var(--bg-surface-raised)",
          glass: "var(--bg-surface-glass)",
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
          emerald: "var(--accent-emerald)",
          indigo: "var(--accent-indigo)",
          amber: "var(--accent-amber)",
          rose: "var(--accent-rose)",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
}
