/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #6366F1)',
          dark: '#4F46E5',
          light: '#818CF8',
          50: '#EEF2FF',
          100: '#E0E7FF',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #8B5CF6)',
          dark: '#7C3AED',
          light: '#A78BFA',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #06B6D4)',
          dark: '#0891B2',
          light: '#22D3EE',
        },
        dark: {
          DEFAULT: 'var(--color-background, #0F0F0F)',
          light: '#1A1A1A',
          lighter: '#262626',
          card: '#171717',
        },
        surface: {
          DEFAULT: '#FAFAFA',
          dark: '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        display: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'elegant-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
}
