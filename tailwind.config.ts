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
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				light: '#5AC8FA',
  				dark: '#0051A8',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				light: '#FF3B30',
  				dark: '#C72C41',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			gray: {
  				'100': '#F7F7F7',
  				'200': '#E5E5EA',
  				'300': '#C7C7CC',
  				'400': '#8E8E93'
  			},
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: ['SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
  			serif: ['Georgia', 'serif']
  		},
  		fontSize: {
  			xs: '12px',
  			sm: '14px',
  			base: '16px',
  			lg: '20px',
  			xl: '24px',
  			'2xl': '30px',
  			'3xl': '36px',
  			'4xl': '48px'
  		},
  		borderRadius: {
  			none: '0',
  			sm: 'calc(var(--radius) - 4px)',
  			DEFAULT: '8px',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			full: '9999px'
  		},
  		boxShadow: {
  			sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  			DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.1)',
  			md: '0 4px 8px rgba(0, 0, 0, 0.1)',
  			lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
  			xl: '0 16px 32px rgba(0, 0, 0, 0.1)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
