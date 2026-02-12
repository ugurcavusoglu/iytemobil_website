import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#1a1a1a',
        'surface-light': '#2a2a2a',
        primary: {
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
          light: 'rgba(220, 38, 38, 0.15)',
        },
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        'text-muted': '#666666',
        accent: {
          purple: '#9333EA',
          orange: '#F97316',
          gold: '#EAB308',
          blue: '#3B82F6',
          green: '#22C55E',
        },
        border: '#1a1a1a',
        'border-light': '#2a2a2a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(220, 38, 38, 0.6)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(220, 38, 38, 0.08) 0%, #0a0a0a 70%)',
      },
    },
  },
  plugins: [],
};
export default config;
