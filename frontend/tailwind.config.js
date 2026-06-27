/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd2ff",
          300: "#8eb4ff",
          400: "#598cff",
          500: "#3366ff",
          600: "#2348e6",
          700: "#1c39b8",
          800: "#1a3194",
          900: "#1b2f76",
        },
        accent: {
          400: "#ff7e5f",
          500: "#feb47b",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(15, 23, 42, 0.08)",
        glow: "0 10px 40px rgba(51, 102, 255, 0.25)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, rgba(51,102,255,0.95) 0%, rgba(255,126,95,0.9) 100%)",
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",
      },
    },
  },
  plugins: [],
};
