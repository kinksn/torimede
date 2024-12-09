import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "max-sm": { max: "639px" },
      },
      fontFamily: {
        comfortaa: "var(--font-comfortaa)", // カスタムフォントを追加
      },
      fontSize: {
        "typography-md": [
          "16px", // フォントサイズ
          {
            lineHeight: "2.2", // 行の高さ (220%)
            letterSpacing: "0.08em", // 文字間隔 (8%)
            fontWeight: "400", // フォントの太さ
          },
        ],
        "typography-sm": [
          "12px", // フォントサイズ
          {
            lineHeight: "2.2", // 行の高さ (220%)
            letterSpacing: "0.08em", // 文字間隔 (8%)
            fontWeight: "400", // フォントの太さ
          },
        ],
        "typography-xs": [
          "10px", // フォントサイズ
          {
            lineHeight: "2.2", // 行の高さ (220%)
            letterSpacing: "0.04em", // 文字間隔 (4%)
            fontWeight: "400", // フォントの太さ
          },
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        tomato: "#ff6347",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          // DEFAULT: "hsl(var(--primary))",
          // foreground: "hsl(var(--primary-foreground))",
          700: "#4F5667",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        base: {
          bg: "#F7F7F7",
          content: "#FFFFFF",
        },
        text: {
          basic: "#2B2F3A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "20": "20px",
      },
    },
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1000px",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-animate")],
};
export default config;
