import { maxMd, maxSm } from "./src/lib/constants/breakpoints";
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
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(24px)", opacity: "0.2" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-24px)", opacity: "0" },
        },
      },
      animation: {
        slideUp: "slideUp 0.2s ease-in",
        slideDown: "slideDown 0.2s ease-out",
      },
      screens: {
        "max-md": { max: maxMd },
        "max-sm": { max: maxSm },
      },
      fontFamily: {
        comfortaa: "var(--font-comfortaa)", // カスタムフォントを追加
        zenMaruGothic: "var(--font-zen-maru-gothic)",
        zenKakuGothic: "var(--font-zen-kaku-gothic-new)",
      },
      fontSize: {
        "typography-xxxl": [
          "36px", // フォントサイズ
          {
            lineHeight: "1.8", // 行の高さ (220%)
            letterSpacing: "0.12em", // 文字間隔 (8%)
            fontWeight: "400", // フォントの太さ
          },
        ],
        "typography-xxl": [
          "28px", // フォントサイズ
          {
            lineHeight: "2.2", // 行の高さ (220%)
            letterSpacing: "0.08em", // 文字間隔 (8%)
            fontWeight: "400", // フォントの太さ
          },
        ],
        "typography-xl": [
          "24px", // フォントサイズ
          {
            lineHeight: "2.2", // 行の高さ (220%)
            letterSpacing: "0.08em", // 文字間隔 (8%)
            fontWeight: "400", // フォントの太さ
          },
        ],
        "typography-lg": [
          "20px", // フォントサイズ
          {
            lineHeight: "2.2", // 行の高さ (220%)
            letterSpacing: "0.08em", // 文字間隔 (8%)
            fontWeight: "400", // フォントの太さ
          },
        ],
        "typography-md": [
          "16px", // フォントサイズ
          {
            lineHeight: "2.2", // 行の高さ (220%)
            letterSpacing: "0.08em", // 文字間隔 (8%)
            fontWeight: "400", // フォントの太さ
          },
        ],
        "typography-sm": [
          "14px", // フォントサイズ
          {
            lineHeight: "2.2", // 行の高さ (220%)
            letterSpacing: "0.08em", // 文字間隔 (8%)
            fontWeight: "400", // フォントの太さ
          },
        ],
        "typography-xs": [
          "12px", // フォントサイズ
          {
            lineHeight: "2.2", // 行の高さ (220%)
            letterSpacing: "0.08em", // 文字間隔 (8%)
            fontWeight: "400", // フォントの太さ
          },
        ],
        "typography-xxs": [
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
        overlay: {
          icon: "rgba(43, 47, 58, 0.3)",
          image: "rgba(43, 47, 58, 0.6)",
          modal: "rgba(43, 47, 58, 0.8)",
        },
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
          900: "#2B2F3A",
          800: "#3F4351",
          700: "#4F5667",
          600: "#60697E",
          500: "#6F778F",
          400: "#848B9F",
          300: "#99A0B1",
          200: "#B6BBC8",
          100: "#D2D6DF",
          50: "#EDEEF3",
        },
        secondary: {
          // DEFAULT: "hsl(var(--secondary))",
          // foreground: "hsl(var(--secondary-foreground))",
          900: "#CC5000",
          800: "#CC7000",
          700: "#CB8100",
          600: "#C99200",
          500: "#C79F00",
          400: "#CDAC00",
          300: "#D4BB24",
          200: "#E0CD67",
          100: "#EDE1A2",
          50: "#F8F3DA",
          medemojiFront: "#F0C505",
          medemojiBack: "#C8A404",
        },
        tertialy: {
          oceanblue: {
            900: "#031F54",
            800: "#162F67",
            700: "#1E3873",
            600: "#26417E",
            500: "#2D4886",
            400: "#4D6296",
            300: "#6C7DA7",
            200: "#94A1C0",
            100: "#BEC6DA",
            50: "#E5E8EF",
          },
          fleshTomato: {
            900: "#C70008",
            800: "#D70017",
            700: "#E40520",
            600: "#F61C25",
            500: "#ff2b23",
            400: "#FF4444",
            300: "#F46B6B",
            200: "#FB9695",
            100: "#FFCBD0",
            50: "#FFEAEE",
          },
          bloodOrange: {
            900: "#A5420F",
            800: "#BD4F17",
            700: "#CA5519",
            600: "#D85C1D",
            500: "#E26220",
            400: "#E67642",
            300: "#E98D63",
            200: "#EFAC8F",
            100: "#F5CCBB",
            50: "#F7E9E6",
          },
        },
        achromatic: {
          900: "#161616",
          800: "#363636",
          700: "#545454",
          600: "#676767",
          500: "#8F8F8F",
          400: "#AFAFAF",
          300: "#D4D4D4",
          200: "#E5E5E5",
          100: "#F0F0F0",
          50: "#F8F8F8",
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
        textColor: {
          basic: "#2B2F3A",
          weak: "#B6BBC8",
          faint: "#D4D4D4",
          white: "#FFFFFF",
          link: "#285FDC",
        },
        state: {
          delete: "#E40520",
          error: "#CC5000",
          success: "#00CA29",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        "20": "20px",
      },
      boxShadow: {
        transparent: "0px 2px 2px rgba(0, 0, 0, 0)",
        basic: "0px 2px 2px rgba(0, 0, 0, 0.16)",
        searchInput: "0px 2px 4px rgba(105, 51, 194, 0.24)",
        inputActive: "0px 2px 4px rgba(45, 72, 134, 0.36)",
        inputActiveError: "0px 2px 4px rgba(204, 80, 0, 0.36)",
        buttonPrimaryDefault:
          "0px 2px 2px rgba(0, 0, 0, 0.16), inset 0px -2px 2px rgba(255, 255, 255, 0.3)",
        buttonPrimaryHover:
          "0px 2px 4px rgba(0, 0, 0, 0.36), inset 0px -2px 4px rgba(255, 255, 255, 0.4)",
        buttonPrimaryActive:
          "0px 2px 2px rgba(0, 0, 0, 0), inset 0px -2px 2px rgba(255, 255, 255, 0.0)",
        buttonOutlineDefault:
          "0px 2px 2px rgba(0, 0, 0, 0.16), inset 0px -2px 4px rgba(79, 86, 103, 0.2)",
        buttonOutlineHover:
          "0px 2px 4px rgba(0, 0, 0, 0.36), inset 0px -2px 4px rgba(79, 86, 103, 0.4)",
        buttonOutlineActive:
          "0px 2px 2px rgba(0, 0, 0, 0), inset 0px -2px 4px rgba(79, 86, 103, 0)",
      },
    },
    container: {
      center: true,
      screens: {
        "2xl": "1600px", // 2xlの画面サイズでmax-widthを1560pxに設定
        DEFAULT: "100%", // 他の画面サイズで幅を100%に設定
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
