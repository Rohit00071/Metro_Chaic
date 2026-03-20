/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        metro: {
          dark: "#0a0c10",
          card: "rgba(16, 20, 28, 0.7)",
          accent: "#00f5d4",
          secondary: "#7b2cbf",
          glow: "rgba(0, 245, 212, 0.3)"
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
