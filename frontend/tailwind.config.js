/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        btc: {
          orange: "#F7931A",
          "orange-dark": "#E07D0F",
          "orange-light": "#FFB347",
        },
        dark: {
          950: "#040B18",
          900: "#070E1C",
          800: "#0C1528",
          700: "#111D35",
          600: "#172442",
          500: "#1E2D50",
        },
        accent: {
          blue: "#3B82F6",
          cyan: "#06B6D4",
          purple: "#8B5CF6",
          green: "#10B981",
          red: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "btc-glow": "radial-gradient(ellipse at center, rgba(247,147,26,0.15) 0%, transparent 70%)",
        "hero-grid": "linear-gradient(rgba(247,147,26,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(247,147,26,0.05) 1px, transparent 1px)",
      },
      boxShadow: {
        "btc": "0 0 20px rgba(247,147,26,0.3), 0 0 40px rgba(247,147,26,0.1)",
        "btc-sm": "0 0 10px rgba(247,147,26,0.2)",
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card": "0 4px 24px rgba(0,0,0,0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "ticker": "ticker 20s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(247,147,26,0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(247,147,26,0.6)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
