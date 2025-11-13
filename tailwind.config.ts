import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // JainVerse Theme Colors
        saffron: {
          50: "#FFF8E7",
          100: "#FFE8B8",
          200: "#FFD699",
          300: "#FFC47A",
          400: "#FFB25B",
          500: "#F5B041", // Primary saffron
          600: "#E69C2E",
          700: "#D6891B",
          800: "#C67608",
          900: "#B66300",
        },
        gold: {
          50: "#FFFEF5",
          100: "#FFFCE6",
          200: "#FFF9D1",
          300: "#FFF6BC",
          400: "#FFF3A7",
          500: "#FFD700", // Primary gold
          600: "#E6C200",
          700: "#CCAD00",
          800: "#B39900",
          900: "#998500",
        },
        ivory: {
          50: "#FFFFFF",
          100: "#FFFEF9",
          200: "#FFFDF3",
          300: "#FFFCEB",
          400: "#FFFBE3",
          500: "#FFF8E7", // Primary ivory
          600: "#E6DFCF",
          700: "#CCC6B7",
          800: "#B3AD9F",
          900: "#999487",
        },
        jainGreen: {
          50: "#F0F9F0",
          100: "#D4EDD4",
          200: "#B8E1B8",
          300: "#9CD59C",
          400: "#80C980",
          500: "#4E944F", // Primary green
          600: "#458546",
          700: "#3C763D",
          800: "#336734",
          900: "#2A582B",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "#F5B041",
          foreground: "#1F2937",
        },
        secondary: {
          DEFAULT: "#4E944F",
          foreground: "#FFFFFF",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-saffron": "linear-gradient(135deg, #F5B041 0%, #FFD700 100%)",
        "gradient-spiritual": "linear-gradient(135deg, #FFF8E7 0%, #F5B041 50%, #4E944F 100%)",
        "gradient-gold": "linear-gradient(135deg, #FFD700 0%, #F5B041 100%)",
      },
      boxShadow: {
        "spiritual": "0 10px 40px rgba(245, 176, 65, 0.2)",
        "soft": "0 4px 20px rgba(0, 0, 0, 0.08)",
        "glow": "0 0 20px rgba(245, 176, 65, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 176, 65, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 176, 65, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

