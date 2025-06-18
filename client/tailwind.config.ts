import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        disabled: {
          background: "hsl(var(--disabled-background))",
          foreground: "hsl(var(--disabled-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
          6: "hsl(var(--chart-6))",
          7: "hsl(var(--chart-7))",
          8: "hsl(var(--chart-8))",
          9: "hsl(var(--chart-9))",
          10: "hsl(var(--chart-10))",
          11: "hsl(var(--chart-11))",
          12: "hsl(var(--chart-12))",
        },
        map: {
          1: "hsl(var(--map-1))",
          2: "hsl(var(--map-2))",
          3: "hsl(var(--map-3))",
          4: "hsl(var(--map-4))",
          5: "hsl(var(--map-5))",
        },
        magenta: {
          "500": "#C00B62",
        },
        navy: {
          "200": "#C9DAF4",
          "300": "#A4C2EC",
          "700": "#3048B5",
          "800": "#2F409E",
          "900": "#1D2757",
          "950": "#050D35",
        },
        "bluish-gray": {
          "500": "#AFB5D3",
        },
      },
      fontSize: {
        "2xs": ["0.625rem", "0.875rem"],
        base: ["1rem", "1.25rem"],
        lg: ["2rem", "2.5rem"],
        xl: ["2.5rem", "3rem"],
        "2xl": ["3.5rem", "4rem"],
      },
      lineHeight: {
        "12": "3rem",
        "16": "4rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        logo: 'url("/images/4growth-logo.svg")',
      },
      keyframes: {
        fadeImages: {
          "0%": {
            backgroundImage: 'url("/images/coming-soon/hero_1.png")',
          },
          "33%": {
            backgroundImage: 'url("/images/coming-soon/hero_2.png")',
          },
          "66%": {
            backgroundImage: 'url("/images/coming-soon/hero_3.png")',
          },
          "100%": {
            backgroundImage: 'url("/images/coming-soon/hero_1.png")',
          },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        hero: "fadeImages 8s ease-in-out infinite",
        "collapsible-down": "collapsible-down 0.3s ease-out",
        "collapsible-up": "collapsible-up 0.3s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
