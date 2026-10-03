import type { Config } from "tailwindcss";

// Same palette as the mobile app (campus-connect-mobile/DESIGN.md): zinc surfaces, warm red primary.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#18181b',
        'surface-light': '#27272a',
        'surface-container': '#1c1c1f',
        primary: {
          DEFAULT: '#E63946',
          dark: '#c92a37',
          light: 'rgba(230, 57, 70, 0.14)',
        },
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
        'text-disabled': '#52525b',
        accent: {
          purple: '#8b5cf6',
          orange: '#f97316',
          gold: '#eab308',
          blue: '#3b82f6',
          green: '#22c55e',
        },
        border: 'rgba(255, 255, 255, 0.06)',
        'border-light': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'marquee': 'marquee 40s linear infinite',
        'aurora': 'aurora 18s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 24px rgba(230, 57, 70, 0.25)' },
          '50%': { boxShadow: '0 0 48px rgba(230, 57, 70, 0.5)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        aurora: {
          '0%': { transform: 'translate3d(-10%, -6%, 0) scale(1)' },
          '100%': { transform: 'translate3d(10%, 6%, 0) scale(1.15)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(230, 57, 70, 0.12) 0%, #09090b 70%)',
      },
    },
  },
  plugins: [],
};
export default config;
