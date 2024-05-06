import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{ts,tsx}",
    "./src/containers/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "#AFB5D3",
        blue: {
          700: "#39447D",
          800: "#1D2757",
          900: "#050D35",
        },
        green: {
          600: "#3FAA55",
        },
        pink: {
          700: "#C00B62",
        },
        yellow: {
          700: "#F6BA5A",
        },
      },
      fontSize: {
        xs: "0.75rem",
      },
    },
  },
  plugins: [],
};
export default config;
