import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Montserrat", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#274DEA",
          hover: "#1B36A8",
          tint: "#EAF0FE",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F8FAFC",
        },
        ink: {
          DEFAULT: "#0F172A",
          secondary: "#64748B",
        },
        border: "#E2E8F0",
        success: "#16DB6B",
        danger: "#FF3B30",
        warning: "#FFB800",
      },
    },
  },
  plugins: [],
};

export default config;
