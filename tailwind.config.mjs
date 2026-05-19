/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./popup.tsx", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#090b12",
          900: "#0f1320",
          800: "#1a1f32"
        },
        accent: {
          500: "#2dd4bf",
          400: "#5eead4"
        },
        danger: {
          500: "#f43f5e",
          400: "#fb7185"
        },
        warn: {
          500: "#f59e0b"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(45, 212, 191, 0.2), 0 8px 24px rgba(0, 0, 0, 0.45)"
      },
      animation: {
        fadeIn: "fadeIn 250ms ease-out",
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" }
        }
      }
    }
  },
  plugins: []
}
