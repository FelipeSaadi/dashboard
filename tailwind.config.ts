import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        asgard: ['AsgardTrial', 'sans-serif'],
        suisse: ['SuisseIntl', 'sans-serif'],
      },
      colors: {
        landing: {
          DEFAULT: 'hsl(var(--landing-background))',
          primary: 'hsl(var(--landing-primary))',
          secondary: 'hsl(var(--landing-secondary))',
          tertiary: 'hsl(var(--landing-tertiary))',
          border: 'hsl(var(--landing-border-color))',
          borderGradient: 'hsl(var(--landing-border-gradient))',
          title: 'hsl(var(--landing-title-color))',
          text: 'hsl(var(--landing-text-color))',
          highlight: 'hsl(var(--landing-highlight-color))',
        },
      },
      keyframes: {
        'slideUpIn': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        'slideUpIn': 'slideUpIn 0.5s ease-out forwards',
        marquee: 'marquee 24s linear infinite',
        marquee2: 'marquee2 24s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

