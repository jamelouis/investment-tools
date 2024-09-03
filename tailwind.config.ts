import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#000000', // Blue
          light: '#5AC8FA', // Light Blue
          dark: '#0051A8', // Dark Blue
        },
        secondary: {
          DEFAULT: '#242424', // Red
          light: '#FF3B30', // Light Red
          dark: '#C72C41', // Dark Red
        },
        background: {
          DEFAULT: '#F6F7FA',
          light: '#FFFFFF', // White
          dark: '#000000', // Black
        },
        gray: {
          100: '#F7F7F7', // Light Gray
          200: '#E5E5EA', // Gray
          300: '#C7C7CC', // Medium Gray
          400: '#8E8E93', // Dark Gray
        },
      },
      fontFamily: {
        // Typography
        sans: ['SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      fontSize: {
        // Font Sizes
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '30px',
        '3xl': '36px',
        '4xl': '48px',
      },
      borderRadius: {
        // Border Radius
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        full: '9999px',
      },
      boxShadow: {
        // Shadows
        sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.1)',
        md: '0 4px 8px rgba(0, 0, 0, 0.1)',
        lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
        xl: '0 16px 32px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
